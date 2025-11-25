// import { createContext, useContext, useState, useEffect } from "react";

// const CurrencyContext = createContext();

// const currencySymbols = {
//   INR: "₹ ",
//   USD: "$ ",
//   EUR: "€ ",
//   GBP: "£ ",
//   CAD: "C$ ",
//   AED: "د.إ ",
//   AUD: "A$ ",
//   JPY: "¥ ",
//   CNY: "¥ ",
//   CHF: "CHF ",
//   SEK: "kr ",
//   NZD: "NZ$ ",
//   SGD: "S$ ",
//   HKD: "HK$ ",
//   KRW: "₩ ",
//   BRL: "R$ ",
//   RUB: "₽ ",
//   ZAR: "R ",
//   MXN: "$ ",
//   TRY: "₺ ",
//   SAR: "ر.س ",
//   THB: "฿ ",
//   MYR: "RM ",
//   IDR: "Rp ",
//   PHP: "₱ ",
//   VND: "₫ ",
//   NOK: "kr ",
//   DKK: "kr ",
// };

// const fallbackExchangeRates = {
//   INR: 1,
//   USD: 0.012,
//   EUR: 0.011,
//   GBP: 0.0095,
//   CAD: 0.016,
//   AED: 0.044,
//   AUD: 0.018,
//   JPY: 1.82,
//   CNY: 0.085,
//   CHF: 0.0105,
//   SEK: 0.126,
//   NZD: 0.0195,
//   SGD: 0.016,
//   HKD: 0.093,
//   KRW: 16.5,
//   BRL: 0.068,
//   RUB: 1.15,
//   ZAR: 0.21,
//   MXN: 0.24,
//   TRY: 0.41,
//   SAR: 0.045,
//   THB: 0.41,
//   MYR: 0.052,
//   IDR: 188.0,
//   PHP: 0.69,
//   VND: 300.0,
//   NOK: 0.13,
//   DKK: 0.082,
// };

// const countryToCurrencyMap = {
//   IN: "INR",
//   US: "USD",
//   CA: "CAD",
//   GB: "GBP",
//   AE: "AED",
//   AU: "AUD",
//   JP: "JPY",
//   CN: "CNY",
//   CH: "CHF",
//   SE: "SEK",
//   NZ: "NZD",
//   SG: "SGD",
//   HK: "HKD",
//   KR: "KRW",
//   BR: "BRL",
//   RU: "RUB",
//   ZA: "ZAR",
//   MX: "MXN",
//   TR: "TRY",
//   SA: "SAR",
//   TH: "THB",
//   MY: "MYR",
//   ID: "IDR",
//   PH: "PHP",
//   VN: "VND",
//   NO: "NOK",
//   DK: "DKK",
// };

// const euroCountries = [
//   "AT", "BE", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT",
//   "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES",
// ];

// const DEFAULT_CURRENCY = "USD";

// // Expiration period: 30 days (in milliseconds)
// const CURRENCY_EXPIRATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
// // const CURRENCY_EXPIRATION_MS = 20 * 1000; // 20 seconds

// export function CurrencyProvider({ children }) {
//   const [selectedCurrency, setSelectedCurrency] = useState(() => {
//     const savedCurrencyData = localStorage.getItem("selectedCurrencyData");
//     if (savedCurrencyData) {
//       const { currency, timestamp } = JSON.parse(savedCurrencyData);
//       const currentTime = Date.now();
//       if (currentTime - timestamp < CURRENCY_EXPIRATION_MS) {
//         return currency;
//       } else {
//         localStorage.removeItem("selectedCurrencyData");
//       }
//     }
//     return "INR";
//   });
//   const [exchangeRates, setExchangeRates] = useState(fallbackExchangeRates);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const API_KEY = "1126b2c3decea28b04cc73561afdc87d";
//   const BASE_URL = `https://api.exchangeratesapi.io/v1/latest?access_key=${API_KEY}`;

//   useEffect(() => {
//     const fetchExchangeRates = async () => {
//       try {
//         setLoading(true);
//         console.log("Fetching exchange rates from:", BASE_URL);
//         const response = await fetch(BASE_URL);
//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         const data = await response.json();

//         console.log("API Response:", data);

//         if (data.success) {
//           const eurToInrRate = data.rates["INR"];
//           const inrBasedRates = {};
//           for (const [currency, rate] of Object.entries(data.rates)) {
//             inrBasedRates[currency] = rate / eurToInrRate;
//           }
//           setExchangeRates(inrBasedRates);
//           setError(null);
//         } else {
//           throw new Error("Failed to fetch exchange rates");
//         }
//       } catch (err) {
//         setError(err.message);
//         console.error("Error fetching exchange rates:", err);
//         setExchangeRates(fallbackExchangeRates);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExchangeRates();
//   }, [BASE_URL]);

//   useEffect(() => {
//     const setCurrencyFromIP = async () => {
//       const savedCurrencyData = localStorage.getItem("selectedCurrencyData");
//       if (savedCurrencyData) {
//         const { currency, timestamp } = JSON.parse(savedCurrencyData);
//         const currentTime = Date.now();
//         if (currentTime - timestamp < CURRENCY_EXPIRATION_MS) {
//           setSelectedCurrency(currency);
//           return;
//         }
//       }

//       try {
//         const response = await fetch("https://ipapi.co/json/");
//         console.log("IP geolocation response:", response);
//         if (!response.ok) {
//           throw new Error("Failed to fetch IP geolocation data");
//         }
//         const data = await response.json();
//         const countryCode = data.country;
//         console.log("Visitor's country:", countryCode);

//         const currencyFromCountry = euroCountries.includes(countryCode)
//           ? "EUR"
//           : countryToCurrencyMap[countryCode] || DEFAULT_CURRENCY;
//         setSelectedCurrency(currencyFromCountry);
//         // Store the currency with a timestamp
//         const currencyData = {
//           currency: currencyFromCountry,
//           timestamp: Date.now(),
//         };
//         // localStorage.setItem("selectedCurrencyData", JSON.stringify(currencyData));
//       } catch (err) {
//         console.error("Error fetching IP geolocation:", err);
//         setSelectedCurrency(DEFAULT_CURRENCY);
//         const currencyData = {
//           currency: DEFAULT_CURRENCY,
//           timestamp: Date.now(),
//         };
//         // localStorage.setItem("selectedCurrencyData", JSON.stringify(currencyData));
//       }
//     };

//     setCurrencyFromIP();
//   }, []);

//   // Update localStorage with the new currency and timestamp whenever the currency changes
//   useEffect(() => {
//     const currencyData = {
//       currency: selectedCurrency,
//       timestamp: Date.now(),
//     };
//     // localStorage.setItem("selectedCurrencyData", JSON.stringify(currencyData));
//   }, [selectedCurrency]);

//   const convertPrice = (priceInINR, returnNumeric = false) => {
//     if (loading || !exchangeRates[selectedCurrency]) {
//       const fallbackValue = priceInINR;
//       return returnNumeric ? parseFloat(fallbackValue) : `${currencySymbols["INR"]}${fallbackValue}`;
//     }

//     const rate = exchangeRates[selectedCurrency];
//     const convertedPrice = priceInINR * rate;
//     const formattedPrice = convertedPrice.toFixed(2);
//     return returnNumeric ? parseFloat(formattedPrice) : `${currencySymbols[selectedCurrency]}${formattedPrice}`;
//   };

//   return (
//     <CurrencyContext.Provider
//       value={{ selectedCurrency, setSelectedCurrency, convertPrice, loading, error }}
//     >
//       {children}
//     </CurrencyContext.Provider>
//   );
// }

// export function useCurrency() {
//   return useContext(CurrencyContext);
// }


import { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

const currencySymbols = {
  INR: "₹ ",
  USD: "$ ",
  EUR: "€ ",
  GBP: "£ ",
  CAD: "C$ ",
  AED: "د.إ ",
  AUD: "A$ ",
  JPY: "¥ ",
  CNY: "¥ ",
  CHF: "CHF ",
  SEK: "kr ",
  NZD: "NZ$ ",
  SGD: "S$ ",
  HKD: "HK$ ",
  KRW: "₩ ",
  BRL: "R$ ",
  RUB: "₽ ",
  ZAR: "R ",
  MXN: "$ ",
  TRY: "₺ ",
  SAR: "ر.س ",
  THB: "฿ ",
  MYR: "RM ",
  IDR: "Rp ",
  PHP: "₱ ",
  VND: "₫ ",
  NOK: "kr ",
  DKK: "kr ",
};

const fallbackExchangeRates = {
  INR: 1,
  USD: 0.0119, // ~₹84.03 (update before deployment)
  EUR: 0.0108, // ~₹92.59
  GBP: 0.0091, // ~₹109.89
  CAD: 0.0162, // ~₹61.73
  AED: 0.0437, // ~₹22.88
  AUD: 0.0178, // ~₹56.18
  JPY: 1.78,   // ~₹0.56
  CNY: 0.0841, // ~₹11.89
  CHF: 0.0102, // ~₹98.04
  SEK: 0.124,  // ~₹8.06
  NZD: 0.0193, // ~₹51.81
  SGD: 0.0157, // ~₹63.69
  HKD: 0.0923, // ~₹10.83
  KRW: 16.2,   // ~₹0.062
  BRL: 0.066,  // ~₹15.15
  RUB: 1.14,   // ~₹0.88
  ZAR: 0.208,  // ~₹4.81
  MXN: 0.238,  // ~₹4.20
  TRY: 0.405,  // ~₹2.47
  SAR: 0.0446, // ~₹22.42
  THB: 0.398,  // ~₹2.51
  MYR: 0.051,  // ~₹19.61
  IDR: 185.0,  // ~₹0.0054
  PHP: 0.681,  // ~₹1.47
  VND: 298.0,  // ~₹0.0034
  NOK: 0.128,  // ~₹7.81
  DKK: 0.0806, // ~₹12.41
};

const countryToCurrencyMap = {
  IN: "INR",
  US: "USD",
  CA: "CAD",
  GB: "GBP",
  AE: "AED",
  AU: "AUD",
  JP: "JPY",
  CN: "CNY",
  CH: "CHF",
  SE: "SEK",
  NZ: "NZD",
  SG: "SGD",
  HK: "HKD",
  KR: "KRW",
  BR: "BRL",
  RU: "RUB",
  ZA: "ZAR",
  MX: "MXN",
  TR: "TRY",
  SA: "SAR",
  TH: "THB",
  MY: "MYR",
  ID: "IDR",
  PH: "PHP",
  VN: "VND",
  NO: "NOK",
  DK: "DKK",
};

const euroCountries = [
  "AT", "BE", "CY", "EE", "FI", "FR", "DE", "GR", "IE", "IT",
  "LV", "LT", "LU", "MT", "NL", "PT", "SK", "SI", "ES",
];

const DEFAULT_CURRENCY = "USD";
const CURRENCY_EXPIRATION_MS = 24 * 60 * 60 * 1000; // 1 day
const RAZORPAY_CURRENCIES = ["INR", "USD", "EUR", "GBP", "CAD", "AUD", "SGD", "AED", "SAR", "NZD", "HKD", "JPY", "MYR", "THB", "DKK", "NOK", "SEK", "CHF"];

export function CurrencyProvider({ children }) {
  const [selectedCurrency, setSelectedCurrency] = useState(() => {
    const savedCurrencyData = localStorage.getItem("selectedCurrencyData");
    if (savedCurrencyData) {
      const { currency, timestamp } = JSON.parse(savedCurrencyData);
      if (Date.now() - timestamp < CURRENCY_EXPIRATION_MS) {
        return currency;
      }
      localStorage.removeItem("selectedCurrencyData");
    }
    return DEFAULT_CURRENCY;
  });
  const [exchangeRates, setExchangeRates] = useState(() => {
    const savedRatesData = localStorage.getItem("exchangeRatesData");
    if (savedRatesData) {
      const { rates, timestamp } = JSON.parse(savedRatesData);
      if (Date.now() - timestamp < CURRENCY_EXPIRATION_MS) {
        return rates;
      }
    }
    return fallbackExchangeRates;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_KEY = "dac6803b55bf3222fcbac617"; // Replace with your key from exchangerate-api.com
  const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/INR`;

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        setLoading(true);
        const savedRatesData = localStorage.getItem("exchangeRatesData");
        if (savedRatesData) {
          const { timestamp } = JSON.parse(savedRatesData);
          if (Date.now() - timestamp < CURRENCY_EXPIRATION_MS) {
            setLoading(false);
            return;
          }
        }

        const response = await fetch(BASE_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (data.result !== "success") {
          throw new Error(data["error-type"] || "Failed to fetch exchange rates");
        }

        const inrBasedRates = {};
        Object.keys(currencySymbols).forEach((currency) => {
          inrBasedRates[currency] = data.conversion_rates[currency] || fallbackExchangeRates[currency];
        });

        setExchangeRates(inrBasedRates);
        localStorage.setItem(
          "exchangeRatesData",
          JSON.stringify({ rates: inrBasedRates, timestamp: Date.now() })
        );
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching exchange rates:", err);
        setExchangeRates(fallbackExchangeRates);
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
    const interval = setInterval(fetchExchangeRates, 24 * 60 * 60 * 1000); // Daily
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const setCurrencyFromIP = async () => {
      const savedCurrencyData = localStorage.getItem("selectedCurrencyData");
      if (savedCurrencyData) {
        const { currency, timestamp } = JSON.parse(savedCurrencyData);
        if (Date.now() - timestamp < CURRENCY_EXPIRATION_MS) {
          setSelectedCurrency(currency);
          return;
        }
      }

      try {
        const response = await fetch("https://ipapi.co/json/");
        if (!response.ok) {
          throw new Error("Failed to fetch IP geolocation data");
        }
        const data = await response.json();
        const countryCode = data.country;

        const currencyFromCountry = euroCountries.includes(countryCode)
          ? "EUR"
          : countryToCurrencyMap[countryCode] || DEFAULT_CURRENCY;
        setSelectedCurrency(currencyFromCountry);
        // localStorage.setItem(
        //   "selectedCurrencyData",
        //   JSON.stringify({ currency: currencyFromCountry, timestamp: Date.now() })
        // );
      } catch (err) {
        console.error("Error fetching IP geolocation:", err);
        setSelectedCurrency(DEFAULT_CURRENCY);
        // localStorage.setItem(
        //   "selectedCurrencyData",
        //   JSON.stringify({ currency: DEFAULT_CURRENCY, timestamp: Date.now() })
        // );
      }
    };

    setCurrencyFromIP();
  }, []);

  useEffect(() => {
    // localStorage.setItem(
    //   "selectedCurrencyData",
    //   JSON.stringify({ currency: selectedCurrency, timestamp: Date.now() })
    // );
  }, [selectedCurrency]);

  const convertPrice = (priceInINR, returnNumeric = false) => {
    if (loading || !exchangeRates[selectedCurrency]) {
      const fallbackValue = priceInINR;
      return returnNumeric ? parseFloat(fallbackValue) : `${currencySymbols["INR"]}${fallbackValue}`;
    }

    const rate = exchangeRates[selectedCurrency];
    const convertedPrice = priceInINR * rate;
    const formattedPrice = convertedPrice.toFixed(2);
    return returnNumeric ? parseFloat(formattedPrice) : `${currencySymbols[selectedCurrency]}${formattedPrice}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        selectedCurrency,
        setSelectedCurrency,
        convertPrice,
        loading,
        error,
        razorpayCurrencies: RAZORPAY_CURRENCIES,
        currencySymbols: currencySymbols,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  return useContext(CurrencyContext);
}