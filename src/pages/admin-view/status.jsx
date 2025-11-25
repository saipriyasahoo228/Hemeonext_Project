


// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { ShoppingCart, Package, DollarSign, TrendingUp, RotateCcw } from "lucide-react";

// const countryData = {
//   daily: [
//     { country: "India", sales: 500, orders: 50, revenue: 2000, profit: 500, returns: 5 },
//     { country: "USA", sales: 400, orders: 40, revenue: 1800, profit: 450, returns: 4 },
//     { country: "UK", sales: 300, orders: 30, revenue: 1200, profit: 300, returns: 3 },
//     { country: "Germany", sales: 350, orders: 35, revenue: 1500, profit: 400, returns: 3 },
//     { country: "Canada", sales: 250, orders: 25, revenue: 1000, profit: 250, returns: 2 },
//   ],
//   weekly: [
//     { country: "India", sales: 3500, orders: 350, revenue: 14000, profit: 3500, returns: 30 },
//     { country: "USA", sales: 2800, orders: 280, revenue: 12600, profit: 3200, returns: 25 },
//     { country: "UK", sales: 2100, orders: 210, revenue: 8400, profit: 2100, returns: 20 },
//     { country: "Germany", sales: 2450, orders: 245, revenue: 10500, profit: 2800, returns: 18 },
//     { country: "Canada", sales: 1750, orders: 175, revenue: 7000, profit: 1750, returns: 15 },
//   ],
//   monthly: [
//     { country: "India", sales: 15000, orders: 1500, revenue: 60000, profit: 15000, returns: 120 },
//     { country: "USA", sales: 12000, orders: 1200, revenue: 54000, profit: 13800, returns: 100 },
//     { country: "UK", sales: 9000, orders: 900, revenue: 36000, profit: 9000, returns: 80 },
//     { country: "Germany", sales: 10500, orders: 1050, revenue: 45000, profit: 11500, returns: 75 },
//     { country: "Canada", sales: 7500, orders: 750, revenue: 30000, profit: 7500, returns: 60 },
//   ],
// };

// const Status = () => {
//   const [selectedView, setSelectedView] = useState("daily");

//   return (
//     <div className="p-6 bg-white border-2 border-[#FFF8DC] rounded-3xl shadow-xl">
//       <h3 className="text-xl font-semibold mb-4 text-gray-800">📊 Country-wise Sales Status</h3>

//       <Tabs value={selectedView} onValueChange={setSelectedView}>
//         <TabsList className="flex gap-4 mb-4">
//           <TabsTrigger value="daily">Daily</TabsTrigger>
//           <TabsTrigger value="weekly">Weekly</TabsTrigger>
//           <TabsTrigger value="monthly">Monthly</TabsTrigger>
//         </TabsList>
//       </Tabs>

//       <div className="flex gap-2 overflow-x-auto pb-4">
//         {countryData[selectedView].map((data, index) => (
//           <Card key={index} className="p-3 bg-[#FFF8DC] shadow-md text-xs rounded-lg w-56 flex-shrink-0">
//             <CardContent>
//               <h4 className="text-sm font-semibold text-gray-700 mb-2">{data.country}</h4>
//               <div className="flex items-center gap-1 text-xs text-gray-500">
//                 <ShoppingCart className="w-3 h-3 text-blue-500" /> Sales: {data.sales}
//               </div>
//               <div className="flex items-center gap-1 text-xs text-gray-500">
//                 <Package className="w-3 h-3 text-green-500" /> Orders: {data.orders}
//               </div>
//               <div className="flex items-center gap-1 text-xs text-gray-500">
//                 <DollarSign className="w-3 h-3 text-yellow-500" /> Revenue: ${data.revenue}
//               </div>
//               <div className="flex items-center gap-1 text-xs text-gray-500">
//                 <TrendingUp className="w-3 h-3 text-purple-500" /> Profit: ${data.profit}
//               </div>
//               <div className="flex items-center gap-1 text-xs text-gray-500">
//                 <RotateCcw className="w-3 h-3 text-red-500" /> Returns: {data.returns}
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Status;











import { useState, useEffect } from "react";
import { fetchOrderAnalytics } from "@/api/dashboardApi"; // Make sure fetchOrderAnalytics is correctly imported
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, Package, DollarSign, TrendingUp, RotateCcw } from "lucide-react";

const Status = () => {
  const [selectedView, setSelectedView] = useState("daily");
  const [countryData, setCountryData] = useState([]); // Holds the data for country wise status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const params = { time_period: selectedView };  // selectedView is "daily", "weekly", or "monthly"
        const response = await fetchOrderAnalytics(params);
        setCountryData(response.country_wise_status);  // Set the country data from the response
      } catch (err) {
        setError("Failed to fetch order analytics.");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedView]);  // Triggered when selectedView changes (i.e., switching tabs)

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="p-6 bg-white border-2 border-[#FFF8DC] rounded-3xl shadow-xl">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">📊 Country-wise Sales Status</h3>

      <Tabs value={selectedView} onValueChange={setSelectedView}>
        <TabsList className="flex gap-4 mb-4">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex gap-2 overflow-x-auto pb-4">
        {countryData.map((data, index) => (
          <Card key={index} className="p-3 bg-[#FFF8DC] shadow-md text-xs rounded-lg w-56 flex-shrink-0">
            <CardContent>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">{data.country}</h4>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <ShoppingCart className="w-3 h-3 text-blue-500" /> Sales: {data.sales}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Package className="w-3 h-3 text-green-500" /> Orders: {data.orders}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <DollarSign className="w-3 h-3 text-yellow-500" /> Revenue: {data.revenue}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <TrendingUp className="w-3 h-3 text-purple-500" /> Profit: {data.profit}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <RotateCcw className="w-3 h-3 text-red-500" /> Returns: {data.returns}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Status;
