
import { useState, useEffect } from "react";
import { Users, IndianRupee, Package, X, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import Status from "./status";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable"; 



import { motion } from "framer-motion";


import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from "react-select";
import WorldMap from "./worldmap";
import { fetchOrderAnalytics, fetchYearlyOrderAnalytics, fetchCountrySalesAnalytics   } from "@/api/dashboardApi";

const apiResponse = [
  { key: "total_sellers", value: 150, pastRecords: [{ year: 2023, value: 120 }, { year: 2022, value: 100 }] },
  { key: "total_amount", value: 75000, pastRecords: [{ year: 2023, value: 68000 }, { year: 2022, value: 59000 }] },
  { key: "total_orders", value: 420, pastRecords: [{ year: 2023, value: 380 }, { year: 2022, value: 300 }] },
];



const predefinedStats = {
  total_sellers: { title: "Total Sellers", icon: <Users size={48} />, color: "from-[#4A00E0] to-[#8E2DE2]" },
  total_revenue: { title: "Total Amount", icon: <IndianRupee size={48} />, color: "from-[#11998E] to-[#38EF7D]" },
  total_orders: { title: "Total Orders", icon: <Package size={48} />, color: "from-[#2980B9] to-[#6DD5FA]" },
};

const stats = apiResponse.map((item) => ({
  ...predefinedStats[item.key],
  value: item.key === "total_amount" ? `₹${item.value.toLocaleString()}` : item.value,
  pastRecords: item.pastRecords,
}));


const COLORS = ["#4CAF50", "#FF9800", "#2196F3", "#E91E63"];

const AdminStats = () => {
  const [selectedStat, setSelectedStat] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [countryDistribution, setCountryDistribution] = useState([]);
  const [countryOptions, setCountryOptions] = useState([]);
  const [yearlyStats, setYearlyStats] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [filteredData, setFilteredData] = useState(yearlyData);
  const [selectedYear, setSelectedYear] = useState('');
  const [countryCategoryDetails, setCountryCategoryDetails] = useState([]);


  //For pie-chart pop up table

  const fetchCountryDetails = async (countryName) => {
    try {
      const params = {}; // no country parameter needed here
  
      if (startDate) {
        params.start_date = startDate.toISOString().split("T")[0];
      }
      if (endDate) {
        params.end_date = endDate.toISOString().split("T")[0];
      }
  
      const data = await fetchCountrySalesAnalytics(params);
  
      // Filter country data from the response
      const countryMatch = data.country_product_analytics?.find(
        (country) => country.country === countryName
      );
  
      if (countryMatch) {
        setCountryCategoryDetails(countryMatch.categories || []);
      } else {
        console.error("Country not found in analytics data.");
      }
    } catch (error) {
      console.error("Error loading country sales details:", error);
    }
  };
  

  //PDF DOWNLOAD
  const exportSalesDetailsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Sales Details for ${selectedData?.name}`, 14, 20);
  
    autoTable(doc, {
      startY: 30,
      head: [["Category", "Sub-Category", "Quantity", "Sell Price"]],
      body: countryCategoryDetails.map((item) => [
        item.category,
        item.subcategory,
        item.quantity_ordered,
        `₹${item.total_price.toFixed(2)}`
      ]),
    });
  
    doc.save(`sales_details_${selectedData?.name}.pdf`);
  };
  
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchOrderAnalytics({
          start_date: startDate ? startDate.toISOString().split("T")[0] : null,
          end_date: endDate ? endDate.toISOString().split("T")[0] : null,
        });
  
        const distribution = response?.country_wise_distribution || [];
  
        setCountryDistribution(distribution);
  
        const options = distribution.map((country) => ({
          label: country.country,
          value: country.country,
        }));
        setCountryOptions(options);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };
  
    fetchData();
  }, [startDate, endDate]);
  

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await fetchYearlyOrderAnalytics();
        setYearlyStats(data?.yearly_stats || []);
      } catch (error) {
        console.error("Failed to load yearly stats", error);
      }
    };
  
    fetchStats();
  }, []);
  
  const currentYear = new Date().getFullYear(); // Ensure currentYear is defined
  
  const stats = Object.keys(predefinedStats).map((key) => {
    const currentYearData = yearlyStats.find((stat) => stat.year === currentYear);
    const pastRecords = yearlyStats
      .filter((stat) => stat.year !== currentYear)
      .map((stat) => ({ year: stat.year, value: stat[key] }));
  
    return {
      ...predefinedStats[key],
      value:
        key === "total_revenue"
          ? `₹${(currentYearData?.[key] || 0).toLocaleString()}`
          : currentYearData?.[key] || 0,
      pastRecords,
    };
  });
  

 
  

  // Filtered data based on selected countries
  const filteredCountryData =
    selectedCountries.length > 0
      ? countryDistribution.filter((item) =>
          selectedCountries.includes(item.country)
        ).map(item => ({
          name: item.country,
          value: item.percentage
        }))
      : countryDistribution.map(item => ({
          name: item.country,
          value: item.percentage
        }));



     // Create an array of unique years
  const years = Array.from(new Set(yearlyData.map(item => item.year)));

  // Handle year selection
  const handleYearChange = (event) => {
    const year = event.target.value;
    setSelectedYear(year);

    // Filter the data based on selected year
    if (year) {
      const yearData = yearlyData.filter(item => item.year === parseInt(year));
      setFilteredData(yearData);
      
      // Set selected year details
      setSelectedYearDetails(yearData[0]);
    } else {
      setFilteredData(yearlyData); // Show all data if no year selected
      setSelectedYearDetails({});
    }
  };

  // For bar graph

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await fetchYearlyOrderAnalytics();
        const stats = data?.yearly_stats || [];

        // Sort by year ascending
        stats.sort((a, b) => a.year - b.year);

        setYearlyData(stats);
      } catch (error) {
        console.error("Error fetching yearly stats", error);
      }
    };

    fetchStats();
  }, []);



  const downloadPDF = (stat) => {
    const doc = new jsPDF();
    doc.text(`${stat.title} - Past Records`, 20, 20);
  
    autoTable(doc, {
      head: [["Year", "Value"]],
      body: stat.pastRecords.map((record) => [record.year, record.value]),
      startY: 30,
    });
  
    doc.save(`${stat.title.replace(/\s+/g, "_")}_Past_Records.pdf`);
  };
  

  return (
       <div className="p-8 space-y-10  " >
      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className={`p-6 h-44 rounded-3xl shadow-xl text-white flex items-center gap-6 transition-all bg-gradient-to-r ${stat.color} relative overflow-hidden cursor-pointer`}
            onClick={() => setSelectedStat(stat)}
          >
            <div className="absolute -top-10 -right-10 bg-white/10 w-24 h-24 rounded-full blur-2xl"></div>
            <div className="p-5 rounded-full shadow-md bg-white/40 backdrop-blur-lg">{stat.icon}</div>
            <div>
              <h3 className="text-lg font-semibold">{stat.title}</h3>
              <p className="text-4xl font-bold">{stat.value}</p>
            </div>
             {/* Golden Button - Appears on Hover */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity">
        <button className="px-3 py-1 bg-yellow-500 text-black font-semibold rounded-md shadow-md">
          View More Details
        </button>
      </div>
          </motion.div>
        ))}
      </div>
      <Status />

      
      


<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
      <motion.div className="bg-[#FFF8DC] backdrop-blur-lg p-6 rounded-3xl shadow-xl">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">📊 Sales Overview</h3>

        {/* Year Selector */}
        <div className="mb-4">
          <select
            value={selectedYear}
            onChange={handleYearChange}
            className="p-2 border rounded-md"
          >
            <option value="">Select Year</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

         
         

         {/* Bar Chart */}
         <ResponsiveContainer width="100%" height={320}>
          <BarChart data={filteredData}>
            <XAxis dataKey="year" stroke="#555" />
            <YAxis />
            <Tooltip formatter={(value) => `${value.toLocaleString()}`} />
            <Legend />
            <defs>
              <linearGradient id="returnsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#2563eb" stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
              </linearGradient>
            </defs>

            {/* Bar for Total Revenue */}
            <Bar
              dataKey="total_returns"
              name="Total Return"
              fill="url(#returnsGradient)"
              radius={[8, 8, 0, 0]}
            />
            
            {/* Bar for Total Profit */}
            <Bar
              dataKey="total_orders"
              name="Total Orders"
              fill="url(#orderGradient)"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

       
        
<motion.div className="bg-[#FFF8DC] backdrop-blur-lg p-6 rounded-3xl shadow-xl">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        🌍 Country-wise Sales Distribution
      </h3>

      <div className="mb-4 flex gap-4 flex-wrap">
        {/* Start Date Picker */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg shadow-md border">
          <Calendar size={18} className="text-gray-600" />
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            placeholderText="Start Date"
            className="p-1 border-none outline-none text-sm"
          />
        </div>

        {/* End Date Picker */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg shadow-md border">
          <Calendar size={18} className="text-gray-600" />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            placeholderText="End Date"
            className="p-1 border-none outline-none text-sm"
          />
        </div>
      </div>

      {/* Country Multi-select */}
      <Select
        isMulti
        options={countryOptions}
        onChange={(selectedOptions) =>
          setSelectedCountries(selectedOptions.map((option) => option.value))
        }
        className="mb-4 w-full sm:w-96"
        placeholder="Select Countries"
      />

      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={filteredCountryData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ percent }) => `${(percent * 100).toFixed(1)}%`}
            onClick={(data) => {
              fetchCountryDetails(data.payload.name); // 👈 pass country name
              setSelectedData(data.payload); // to show in Dialog title
              setIsOpen(true);
            }}
            
            
            
          >
            {filteredCountryData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                style={{ cursor: "pointer" }}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value, name) => [`${value.toFixed(2)}%`, `${name}`]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      {/* Modal Pop-up for Pie Click */}
   
{selectedData && (
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
    <DialogContent style={{ maxHeight: '80vh' }}>
      <DialogHeader>
        <DialogTitle>Sales Details for {selectedData?.name}</DialogTitle>
      </DialogHeader>

      {/* PDF Download Button */}
      <button
        onClick={exportSalesDetailsPDF}
        style={{
          marginBottom: "12px",
          padding: "8px 14px",
          backgroundColor: "#d2691e",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Download PDF
      </button>

      {/* Static Table Header */}
      <Table>
        <TableHeader style={{ backgroundColor: "#f9f9f9" }}>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Sub Category</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Sell Price</TableHead>
          </TableRow>
        </TableHeader>
      </Table>

      {/* Scrollable Table Body only */}
      <div style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Table>
          <TableBody>
            {countryCategoryDetails.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.subcategory}</TableCell>
                <TableCell>{item.quantity_ordered}</TableCell>
                <TableCell>₹{item.total_price.toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DialogContent>
  </Dialog>
)}

    
    </motion.div>
        {/* <WorldMap/> */}
        
               {/* Popup for Past Records */}
      {selectedStat && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={() => setSelectedStat(null)}>
              <X size={24} />
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">{selectedStat.title} - Past Records</h3>
            
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Year</th>
                  <th className="p-2 border">Value</th>
                </tr>
              </thead>
              <tbody>
                {selectedStat.pastRecords.map((record, i) => (
                  <tr key={i} className="text-center border">
                    <td className="p-2 border">{record.year}</td>
                    <td className="p-2 border">{record.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex justify-between">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700"
                onClick={() => setSelectedStat(null)}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
                onClick={() => downloadPDF(selectedStat)}
              >
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    <WorldMap/>


      </div>
    
  );
};

export default AdminStats;









