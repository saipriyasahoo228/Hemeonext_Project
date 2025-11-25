import { useState, useEffect } from "react";
import { Mail, Phone, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { fetchCategories } from "@/api/productApi";
import { submitSellerApplication } from "@/api/sellerApi";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    vendorName: "",
    businessName: "",
    productType: "",
    country: "",
    contactNumber: "",
    email: "",
    businessAddress: "",
    countryCode: "+1", // Default country code
  });
  const [productTypes, setProductTypes] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Comprehensive list of countries
  const countryTypes = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia",
    "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus",
    "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil",
    "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde",
    "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Brazzaville)",
    "Congo (Kinshasa)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti",
    "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea",
    "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany",
    "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras",
    "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica",
    "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia",
    "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar",
    "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius",
    "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique",
    "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria",
    "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama",
    "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania",
    "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa",
    "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
    "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
    "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan",
    "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia",
    "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
    "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen",
    "Zambia", "Zimbabwe"
  ].sort();

  // Country codes mapped to countries
  const countryCodes = {
    "Afghanistan": "+93", "Albania": "+355", "Algeria": "+213", "Andorra": "+376", "Angola": "+244",
    "Antigua and Barbuda": "+1-268", "Argentina": "+54", "Armenia": "+374", "Australia": "+61",
    "Austria": "+43", "Azerbaijan": "+994", "Bahamas": "+1-242", "Bahrain": "+973", "Bangladesh": "+880",
    "Barbados": "+1-246", "Belarus": "+375", "Belgium": "+32", "Belize": "+501", "Benin": "+229",
    "Bhutan": "+975", "Bolivia": "+591", "Bosnia and Herzegovina": "+387", "Botswana": "+267",
    "Brazil": "+55", "Brunei": "+673", "Bulgaria": "+359", "Burkina Faso": "+226", "Burundi": "+257",
    "Cambodia": "+855", "Cameroon": "+237", "Canada": "+1", "Cape Verde": "+238", "Central African Republic": "+236",
    "Chad": "+235", "Chile": "+56", "China": "+86", "Colombia": "+57", "Comoros": "+269", "Congo (Brazzaville)": "+242",
    "Congo (Kinshasa)": "+243", "Costa Rica": "+506", "Croatia": "+385", "Cuba": "+53", "Cyprus": "+357",
    "Czech Republic": "+420", "Denmark": "+45", "Djibouti": "+253", "Dominica": "+1-767", "Dominican Republic": "+1-809",
    "Ecuador": "+593", "Egypt": "+20", "El Salvador": "+503", "Equatorial Guinea": "+240", "Eritrea": "+291",
    "Estonia": "+372", "Eswatini": "+268", "Ethiopia": "+251", "Fiji": "+679", "Finland": "+358", "France": "+33",
    "Gabon": "+241", "Gambia": "+220", "Georgia": "+995", "Germany": "+49", "Ghana": "+233", "Greece": "+30",
    "Grenada": "+1-473", "Guatemala": "+502", "Guinea": "+224", "Guinea-Bissau": "+245", "Guyana": "+592",
    "Haiti": "+509", "Honduras": "+504", "Hungary": "+36", "Iceland": "+354", "India": "+91", "Indonesia": "+62",
    "Iran": "+98", "Iraq": "+964", "Ireland": "+353", "Israel": "+972", "Italy": "+39", "Jamaica": "+1-876",
    "Japan": "+81", "Jordan": "+962", "Kazakhstan": "+7", "Kenya": "+254", "Kiribati": "+686", "Kuwait": "+965",
    "Kyrgyzstan": "+996", "Laos": "+856", "Latvia": "+371", "Lebanon": "+961", "Lesotho": "+266", "Liberia": "+231",
    "Libya": "+218", "Liechtenstein": "+423", "Lithuania": "+370", "Luxembourg": "+352", "Madagascar": "+261",
    "Malawi": "+265", "Malaysia": "+60", "Maldives": "+960", "Mali": "+223", "Malta": "+356", "Marshall Islands": "+692",
    "Mauritania": "+222", "Mauritius": "+230", "Mexico": "+52", "Micronesia": "+691", "Moldova": "+373",
    "Monaco": "+377", "Mongolia": "+976", "Montenegro": "+382", "Morocco": "+212", "Mozambique": "+258",
    "Myanmar": "+95", "Namibia": "+264", "Nauru": "+674", "Nepal": "+977", "Netherlands": "+31", "New Zealand": "+64",
    "Nicaragua": "+505", "Niger": "+227", "Nigeria": "+234", "North Korea": "+850", "North Macedonia": "+389",
    "Norway": "+47", "Oman": "+968", "Pakistan": "+92", "Palau": "+680", "Palestine": "+970", "Panama": "+507",
    "Papua New Guinea": "+675", "Paraguay": "+595", "Peru": "+51", "Philippines": "+63", "Poland": "+48",
    "Portugal": "+351", "Qatar": "+974", "Romania": "+40", "Russia": "+7", "Rwanda": "+250", "Saint Kitts and Nevis": "+1-869",
    "Saint Lucia": "+1-758", "Saint Vincent and the Grenadines": "+1-784", "Samoa": "+685", "San Marino": "+378",
    "Sao Tome and Principe": "+239", "Saudi Arabia": "+966", "Senegal": "+221", "Serbia": "+381", "Seychelles": "+248",
    "Sierra Leone": "+232", "Singapore": "+65", "Slovakia": "+421", "Slovenia": "+386", "Solomon Islands": "+677",
    "Somalia": "+252", "South Africa": "+27", "South Korea": "+82", "South Sudan": "+211", "Spain": "+34",
    "Sri Lanka": "+94", "Sudan": "+249", "Suriname": "+597", "Sweden": "+46", "Switzerland": "+41", "Syria": "+963",
    "Taiwan": "+886", "Tajikistan": "+992", "Tanzania": "+255", "Thailand": "+66", "Timor-Leste": "+670",
    "Togo": "+228", "Tonga": "+676", "Trinidad and Tobago": "+1-868", "Tunisia": "+216", "Turkey": "+90",
    "Turkmenistan": "+993", "Tuvalu": "+688", "Uganda": "+256", "Ukraine": "+380", "United Arab Emirates": "+971",
    "United Kingdom": "+44", "United States": "+1", "Uruguay": "+598", "Uzbekistan": "+998", "Vanuatu": "+678",
    "Vatican City": "+39", "Venezuela": "+58", "Vietnam": "+84", "Yemen": "+967", "Zambia": "+260", "Zimbabwe": "+263"
  };

  // Fetch product categories (product types) from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const categories = await fetchCategories();
        setProductTypes(categories.map((cat) => cat.name));
      } catch (error) {
        console.error("Failed to load product categories:", error);
        setProductTypes(["Clothing", "Electronics", "Home", "Beauty"]);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "vendorName") {
      setFormData((prev) => ({
        ...prev,
        vendorName: value,
        businessName: prev.businessName === "" || prev.businessName === prev.vendorName ? value : prev.businessName,
      }));
    } else if (name === "country") {
      setFormData((prev) => ({
        ...prev,
        country: value,
        countryCode: countryCodes[value] || "+91",
      }));
    } else if (name === "countryCode") {
      setFormData((prev) => ({
        ...prev,
        countryCode: value,
        country: Object.keys(countryCodes).find((key) => countryCodes[key] === value) || prev.country,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submission with API integration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const applicationData = {
      vendor_name: formData.vendorName,
      business_name: formData.businessName,
      product_type: formData.productType,
      country: formData.country,
      contact_number: formData.contactNumber,
      email: formData.email,
      business_address: formData.businessAddress,
      country_code: formData.countryCode,
    };

    try {
      const response = await submitSellerApplication(applicationData);
      toast({ title: response.message });
      setFormData({
        vendorName: "",
        businessName: "",
        productType: "",
        country: "",
        contactNumber: "",
        email: "",
        businessAddress: "",
        countryCode: "+1",
      });
    } catch (error) {
      toast({
        title: error.error || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#f2ede6] to-[#e6d9c2] dark:from-gray-900 dark:to-gray-800 flex flex-col md:flex-row justify-center items-center p-6 md:p-12">
      {/* Left Side - Seller Info */}
      <motion.div
        className="w-full md:w-1/3 p-8 flex flex-col justify-center items-start text-left bg-white dark:bg-gray-800 rounded-lg shadow-md md:shadow-lg"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold text-gray-900 dark:text-violet-300 mb-4 tracking-tight">
          Become a Seller
        </h2>
        <p className="mb-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Partner with us to reach a global audience. Sell your unique products on our platform and grow your business effortlessly.
        </p>
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Mail size={24} className="text-primary dark:text-violet-400" />
            <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
              sellersupport@yourrkart.com
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone size={24} className="text-primary dark:text-violet-400" />
            <span className="text-lg font-medium text-gray-800 dark:text-gray-200">
              +91 98765 43210
            </span>
          </div>
        </div>
      </motion.div>

      {/* Right Side - Seller Application Form */}
      <motion.div
        className="w-full md:w-2/3 max-w-[750px] mt-10 p-12 md:ml-6 bg-white dark:bg-gray-800 rounded-lg shadow-md md:shadow-lg border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-3xl font-semibold mb-8 text-center text-gray-900 dark:text-violet-300 tracking-tight">
          Apply to Sell
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Vendor Name & Business Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block font-medium text-gray-700 dark:text-gray-200 mb-2">
                Vendor Name <span className="text-red-500">*</span>
              </Label>
              <input
                type="text"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-violet-500 transition-all shadow-sm"
                placeholder="Your Full Name"
                required
              />
            </div>
            <div>
              <Label className="block font-medium text-gray-700 dark:text-gray-200 mb-2">
                Business Name <span className="text-red-500">*</span>
              </Label>
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-violet-500 transition-all shadow-sm"
                placeholder="Your Business Name"
                required
              />
            </div>
          </div>

          {/* Email & Country */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block font-medium text-gray-700 dark:text-gray-200 mb-2">
                Email <span className="text-red-500">*</span>
              </Label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-violet-500 transition-all shadow-sm"
                placeholder="your.email@yourrkart.com"
                required
              />
            </div>
            <div>
              <Label className="block font-medium text-gray-700 dark:text-gray-200 mb-2">
                Country <span className="text-red-500">*</span>
              </Label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-７00 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-violet-500 transition-all shadow-sm"
                required
              >
                <option value="">Select Country</option>
                {countryTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Contact Number & Product Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label className="block font-medium text-gray-700 dark:text-gray-200 mb-2">
                Contact Number <span className="text-red-500">*</span>
              </Label>
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden shadow-sm">
                <select
                  name="countryCode"
                  value={formData.countryCode}
                  onChange={handleChange}
                  className="bg-white dark:bg-gray-700 border-r border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 focus:outline-none"
                >
                  {Object.entries(countryCodes).map(([country, code]) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full p-3 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-violet-500"
                  placeholder="9876543210"
                  required
                />
              </div>
            </div>
            <div>
              <Label className="block font-medium text-gray-700 dark:text-gray-200 mb-2">
                Product Type <span className="text-red-500">*</span>
              </Label>
              <select
                name="productType"
                value={formData.productType}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-violet-500 transition-all shadow-sm"
                required
                disabled={loadingCategories}
              >
                <option value="">{loadingCategories ? "Loading..." : "Select Product Type"}</option>
                {productTypes.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Business Address */}
          <div>
            <Label className="block font-medium text-gray-700 dark:text-gray-200 mb-2">
              Business Address <span className="text-red-500">*</span>
            </Label>
            <textarea
              name="businessAddress"
              value={formData.businessAddress}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-violet-500 transition-all shadow-sm"
              rows="4"
              placeholder="Enter your business address"
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary-dark dark:bg-violet-600 dark:hover:bg-violet-700 transition-all flex items-center justify-center shadow-md"
            disabled={loadingCategories || isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : loadingCategories ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Submit Application"
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;