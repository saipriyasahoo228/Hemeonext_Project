import { useState } from "react";
import { useCurrency } from "../context/currency-context";

export const useCountryCode = () => {
  const { selectedCurrency } = useCurrency();
  const [countryCode, setCountryCode] = useState("");
  const [manualCountryCode, setManualCountryCode] = useState("");
  const [isEmail, setIsEmail] = useState(false);
  const [validationError, setValidationError] = useState(""); 

  const countries = [
    { code: "IN", name: "India", phone: "91" },
    { code: "US", name: "United States", phone: "1" },
    { code: "CA", name: "Canada", phone: "1" },
    { code: "GB", name: "United Kingdom", phone: "44" },
    { code: "AE", name: "United Arab Emirates", phone: "971" },
    { code: "AU", name: "Australia", phone: "61" },
    { code: "JP", name: "Japan", phone: "81" },
    { code: "CN", name: "China", phone: "86" },
    { code: "CH", name: "Switzerland", phone: "41" },
    { code: "SE", name: "Sweden", phone: "46" },
    { code: "NZ", name: "New Zealand", phone: "64" },
    { code: "SG", name: "Singapore", phone: "65" },
    { code: "HK", name: "Hong Kong", phone: "852" },
    { code: "KR", name: "South Korea", phone: "82" },
    { code: "BR", name: "Brazil", phone: "55" },
    { code: "RU", name: "Russia", phone: "7" },
    { code: "ZA", name: "South Africa", phone: "27" },
    { code: "MX", name: "Mexico", phone: "52" },
    { code: "TR", name: "Turkey", phone: "90" },
    { code: "SA", name: "Saudi Arabia", phone: "966" },
    { code: "TH", name: "Thailand", phone: "66" },
    { code: "MY", name: "Malaysia", phone: "60" },
    { code: "ID", name: "Indonesia", phone: "62" },
    { code: "PH", name: "Philippines", phone: "63" },
    { code: "VN", name: "Vietnam", phone: "84" },
    { code: "NO", name: "Norway", phone: "47" },
    { code: "DK", name: "Denmark", phone: "45" },
  ];

  const countryToCurrencyMap = {
    IN: "INR", US: "USD", CA: "CAD", GB: "GBP", AE: "AED", AU: "AUD", JP: "JPY",
    CN: "CNY", CH: "CHF", SE: "SEK", NZ: "NZD", SG: "SGD", HK: "HKD", KR: "KRW",
    BR: "BRL", RU: "RUB", ZA: "ZAR", MX: "MXN", TR: "TRY", SA: "SAR", TH: "THB",
    MY: "MYR", ID: "IDR", PH: "PHP", VN: "VND", NO: "NOK", DK: "DKK",
  };

  const currencyToCountryMap = Object.fromEntries(
    Object.entries(countryToCurrencyMap).map(([country, currency]) => [currency, country])
  );

  const handleInputChange = (e, setFormData) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "emailOrMobile" || name === "credential" || name === "identifier") {
      // Clear previous error
      setValidationError("");

      if (value) {
        const firstChar = value[0];
        setIsEmail(value.includes("@"));

        // Validate email or mobile number
        if (value.includes("@")) {
          // Basic email validation (e.g., something@something.com)
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            setValidationError("Please enter a valid email address");
          }
        } else if (/^\d/.test(firstChar)) {
          const cleanedValue = value.replace(/\D/g, "");
          if (cleanedValue.length < 7 || cleanedValue.length > 13) {
            setValidationError("Please enter a valid mobile number");
          } else if (!manualCountryCode) {
            const country = currencyToCountryMap[selectedCurrency] || "IN";
            setCountryCode(`+${countries.find((c) => c.code === country)?.phone || "91"}`);
          }
        } else {
          setValidationError("Please enter a valid email or mobile number");
        }
      } else {
        setCountryCode("");
        setManualCountryCode("");
        setIsEmail(false);
        setValidationError("");
      }
    }
  };

  const handleCountryCodeChange = (e) => {
    const selectedCountry = e.target.value;
    const phoneCode = countries.find(c => c.code === selectedCountry)?.phone || "91";
    setManualCountryCode(selectedCountry);
    setCountryCode(`+${phoneCode}`);
  };

  const getFullIdentifier = (identifier) => {
    return isEmail || !countryCode ? identifier : `${countryCode}${identifier}`;
  };

  return {
    countries,
    countryCode,
    manualCountryCode,
    isEmail,
    handleInputChange,
    handleCountryCodeChange,
    getFullIdentifier,
    validationError,
  };
};