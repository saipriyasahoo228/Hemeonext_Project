// import React, { useState, useEffect } from "react";
// import { ComposableMap, Geographies, Geography } from "react-simple-maps";
// import { geoNaturalEarth1 } from "d3-geo";
// import { feature } from "topojson-client";
// import { Card, CardContent } from "@/components/ui/card";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { fetchCountrySalesAnalytics } from "@/api/dashboardApi"; 
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import countryData from "@/data/countryData.json";



// //const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// const highlightedCountries = {
//   "840": { name: "USA", color: "#FF5733" },
//   "356": { name: "India", color: "#33FF57" },
//   "036": { name: "Australia", color: "#FFD700" },
//   "826": { name: "UK", color: "#800080" },
//   "784": { name: " United Arab Emirates", color:"#16A085"}
  
// };

// export default function WorldMap() {
//   const [data, setData] = useState(null);
//   const [selectedCountry, setSelectedCountry] = useState(null);
//   const [countrySalesData, setCountrySalesData] = useState(null);
//   const [noDataMessage, setNoDataMessage] = useState("");

  

//   useEffect(() => {
//     try {
//       const geoData = feature(countryData, countryData.objects.countries);
//       setData(geoData);
//     } catch (error) {
//       console.error("Error loading map data:", error);
//     }
//   }, []);
  
//   //PDF 
//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.setFontSize(16);
//     doc.text(`Sales Details for ${selectedCountry}`, 14, 20);
  
//     autoTable(doc, {
//       startY: 30,
//       head: [["Category", "Sub-Category", "Quantity Ordered", "Total Price"]],
//       body: countrySalesData?.categories?.map((row) => [
//         row.category,
//         row.subcategory,
//         row.quantity_ordered,
//         `₹${row.total_price.toFixed(2)}`,
//       ]) || [],
//     });
  
//     doc.save(`sales_${selectedCountry}.pdf`);
//   };
  

//   const handleCountryClick = async (countryName) => {
//     setSelectedCountry(countryName);
//     setNoDataMessage(""); // Optional: clear previous message
//     setCountrySalesData(null);
  
//     try {
//       const salesData = await fetchCountrySalesAnalytics({ country: countryName });
//       const countryData = salesData.country_product_analytics.find(
//         (item) => item.country === countryName
//       );
  
//       if (countryData && countryData.categories.length > 0) {
//         setCountrySalesData(countryData);
//       } else {
//         alert(`No sales data found for ${countryName}`);
//       }
//     } catch (error) {
//       console.error("Error fetching country sales analytics:", error);
//     }
//   };
  
  

//   return (
//     <div
//       style={{
//         width: "1140px",
//         height: "550px",
//         backgroundColor: "#fff8dc",
//         boxShadow: "0px 4px 15px rgba(0,0,0,0.2)",
//         borderRadius: "12px",
//         padding: "25px",
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         transition: "all 0.3s ease-in-out",
//       }}
//     >
//       <h2 style={{ marginBottom: "15px", fontSize: "26px", fontWeight: "bold" }}>
//         📊 Overall Sales Details
//       </h2>
  
//       {/* Map and Legend Side by Side */}
//       <div style={{ display: "flex", width: "100%" }}>
//         {/* Map Section */}
//         <div style={{ flex: "1" }}>
//           <ComposableMap
//             projection={geoNaturalEarth1()}
//             projectionConfig={{ scale: 180 }}
//             width={900}
//             height={380}
//             style={{ width: "100%", height: "auto" }}
//           >
//             {data && (
//               <Geographies geography={data}>
//                 {({ geographies }) =>
//                   geographies.map((geo) => {
//                     const country = highlightedCountries[geo.id];
//                     const isHighlighted = Boolean(country);
  
//                     return (
//                       <Geography
//                         key={geo.rsmKey}
//                         geography={geo}
//                         fill={isHighlighted ? country.color : "#ccc"}
//                         stroke="#fff"
//                         strokeWidth={isHighlighted ? 3 : 1}
//                         onClick={() => isHighlighted && handleCountryClick(country.name)}
//                         style={{
//                           default: { outline: "none" },
//                           hover: {
//                             fill: isHighlighted ? country.color : "#2a9df4",
//                             cursor: "pointer",
//                           },
//                           pressed: { fill: "#e63946" },
//                         }}
//                       />
//                     );
//                   })
//                 }
//               </Geographies>
//             )}
  
//             {/* Add Markers */}
//             {Object.entries(highlightedCountries).map(([code, { coordinates, color, name }]) => (
//               coordinates && (
//                 <Marker key={code} coordinates={coordinates}>
//                   <circle r={5} fill={color} stroke="#000" strokeWidth={1} />
//                 </Marker>
//               )
//             ))}
//           </ComposableMap>
//         </div>
  
//         {/* Legend Section */}
//         <div style={{ marginLeft: "30px", minWidth: "200px", display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
//           <h4 style={{ fontSize: "18px", marginBottom: "10px" }}>🗺 Country Legend</h4>
//           {Object.entries(highlightedCountries).map(([code, { name, color }]) => (
//             <div key={code} style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
//               <div style={{ width: "18px", height: "18px", backgroundColor: color, borderRadius: "4px", border: "1px solid #000" }} />
//               <span style={{ fontSize: "14px" }}>{name.trim()}</span>
//             </div>
//           ))}
//         </div>
//       </div>
  
//       {/* Dialog Section remains unchanged */}
//       {selectedCountry && countrySalesData && (
//         <Dialog open={!!selectedCountry} onOpenChange={() => setSelectedCountry(null)}>
//           <DialogContent style={{ width: "600px", backgroundColor: "#fff8dc", padding: "20px" }}>
//             <DialogHeader>
//               <DialogTitle>Sales Details for {selectedCountry}</DialogTitle>
//             </DialogHeader>
  
//             <button
//               onClick={exportToPDF}
//               style={{
//                 marginBottom: "10px",
//                 padding: "8px 12px",
//                 backgroundColor: "#d2691e",
//                 color: "#fff",
//                 border: "none",
//                 borderRadius: "4px",
//                 cursor: "pointer",
//               }}
//             >
//               Download PDF
//             </button>
  
//             <Card>
//               <CardContent>
//                 <div style={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #ddd" }}>
//                   <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
//                     <thead style={{ backgroundColor: "#f4e1b6", position: "sticky", top: 0, zIndex: 1 }}>
//                       <tr>
//                         <th style={{ border: "1px solid #ccc", padding: "10px" }}>Category</th>
//                         <th style={{ border: "1px solid #ccc", padding: "10px" }}>Sub-Category</th>
//                         <th style={{ border: "1px solid #ccc", padding: "10px" }}>Quantity Ordered</th>
//                         <th style={{ border: "1px solid #ccc", padding: "10px" }}>Total Price</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {countrySalesData?.categories?.map((row, index) => (
//                         <tr key={index} style={{ textAlign: "center", border: "1px solid #ddd" }}>
//                           <td style={{ border: "1px solid #ccc", padding: "10px" }}>{row.category}</td>
//                           <td style={{ border: "1px solid #ccc", padding: "10px" }}>{row.subcategory}</td>
//                           <td style={{ border: "1px solid #ccc", padding: "10px" }}>{row.quantity_ordered}</td>
//                           <td style={{ border: "1px solid #ccc", padding: "10px" }}>₹{row.total_price.toFixed(2)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               </CardContent>
//             </Card>
//           </DialogContent>
//         </Dialog>
//       )}
//     </div>
//   );
  
  
// }




import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography, Marker } from "react-simple-maps";
import { geoNaturalEarth1 } from "d3-geo";
import { feature } from "topojson-client";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchCountrySalesAnalytics } from "@/api/dashboardApi"; 
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import countryData from "@/data/countryData.json";

// Highlighted Countries with coordinates for markers
const highlightedCountries = {
  "840": { name: "USA", color: "#FF5733", coordinates: [-95.7129, 37.0902] },
  //"356": { name: "India", color: "#33FF57", coordinates: [78.9629, 20.5937] },
  "036": { name: "Australia", color: "#FFD700", coordinates: [133.7751, -25.2744] },
  "826": { name: "UK", color: "#800080", coordinates: [-3.435974, 55.378051] },
  "784": { name: "United Arab Emirates", color: "#16A085", coordinates: [76.37, 22.47] },
};

export default function WorldMap() {
  const [data, setData] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countrySalesData, setCountrySalesData] = useState(null);
  const [noDataMessage, setNoDataMessage] = useState("");

  useEffect(() => {
    try {
      const geoData = feature(countryData, countryData.objects.countries);
      setData(geoData);
    } catch (error) {
      console.error("Error loading map data:", error);
    }
  }, []);

  // PDF Export
  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Sales Details for ${selectedCountry}`, 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [["Category", "Sub-Category", "Quantity Ordered", "Total Price"]],
      body:
        countrySalesData?.categories?.map((row) => [
          row.category,
          row.subcategory,
          row.quantity_ordered,
          `₹${row.total_price.toFixed(2)}`,
        ]) || [],
    });

    doc.save(`sales_${selectedCountry}.pdf`);
  };

  const handleCountryClick = async (countryName) => {
    setSelectedCountry(countryName);
    setNoDataMessage(""); // Optional: clear previous message
    setCountrySalesData(null);

    try {
      const salesData = await fetchCountrySalesAnalytics({ country: countryName });
      const countryData = salesData.country_product_analytics.find(
        (item) => item.country === countryName
      );

      if (countryData && countryData.categories.length > 0) {
        setCountrySalesData(countryData);
      } else {
        alert(`No sales data found for ${countryName}`);
      }
    } catch (error) {
      console.error("Error fetching country sales analytics:", error);
    }
  };

  return (
    <div
      className="w-full max-w-[1140px] h-auto bg-[#fff8dc] shadow-md rounded-lg p-0 md:p-6 flex flex-col items-center transition-all duration-300 ease-in-out"
    >
      <h2 className="mb-4 text-2xl font-bold p-2 md:p-0">
        📊 Overall Sales Details
      </h2>

      {/* Map and Legend Side by Side */}
      <div  className="flex flex-col md:flex-row w-full">
        {/* Map Section */}
        <div className="flex-1">
          <ComposableMap
            projection={geoNaturalEarth1()}
            projectionConfig={{ scale: window.innerWidth < 768 ? 120 : 180 }}
            width={window.innerWidth < 768 ? 910 : 900}
            height={window.innerWidth < 768 ? 500 : 500}
            // style={{ width: "100%", height: "auto" }}
            className="w-full h-full"
          >
            {data && (
              <Geographies geography={data}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const country = highlightedCountries[geo.id];
                    const isHighlighted = Boolean(country);

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={isHighlighted ? country.color : "#ccc"}
                        stroke="#fff"
                        strokeWidth={isHighlighted ? 3 : 1}
                        onClick={() => isHighlighted && handleCountryClick(country.name)}
                        style={{
                          default: { outline: "none" },
                          hover: {
                            fill: isHighlighted ? country.color : "#2a9df4",
                            cursor: "pointer",
                          },
                          pressed: { fill: "#e63946" },
                        }}
                      />
                    );
                  })
                }
              </Geographies>
            )}

            {/* Add Markers with Location Icon */}
            {Object.entries(highlightedCountries).map(([code, { coordinates, color, name }]) => (
              coordinates && (
                <Marker key={code} coordinates={coordinates}>
                  <text
                    textAnchor="middle"
                    y={-10}
                    style={{ fontSize: "12px", fontWeight: "bold", fill: "#000" }}
                  >
                    📍 {name}
                  </text>
                </Marker>
              )
            ))}
          </ComposableMap>
        </div>

        {/* Legend Section */}
        <div
          style={{
            marginLeft: "30px",
            minWidth: "200px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <h4 className="mb-3 md:mt-0 mt-6">🗺 Country Legend</h4>
          {Object.entries(highlightedCountries).map(([code, { name, color }]) => (
            <div
              key={code}
              style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}
            >
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  backgroundColor: color,
                  borderRadius: "4px",
                  border: "1px solid #000",
                }}
              />
              <span style={{ fontSize: "14px" }}>📍 {name.trim()}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog Section remains unchanged */}
      {selectedCountry && countrySalesData && (
        <Dialog open={!!selectedCountry} onOpenChange={() => setSelectedCountry(null)}>
          <DialogContent className="w-full bg-[#fff8dc] p-0 pt-4 md:p-5">
            <DialogHeader>
              <DialogTitle>Sales Details for {selectedCountry}</DialogTitle>
            </DialogHeader>

            <button
              onClick={exportToPDF}
              // style={{
              //   marginBottom: "10px",
              //   padding: "8px 12px",
              //   backgroundColor: "#d2691e",
              //   color: "#fff",
              //   border: "none",
              //   borderRadius: "4px",
              //   cursor: "pointer",
              // }}
              className="mb-2 px-2 py-2 bg-[#d2691e] text-white border-none rounded cursor-pointer"
            >
              Download PDF
            </button>

            <Card>
              <CardContent>
                <div style={{ maxHeight: "400px", overflowY: "auto", border: "1px solid #ddd" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
                    <thead
                      style={{
                        backgroundColor: "#f4e1b6",
                        position: "sticky",
                        top: 0,
                        zIndex: 1,
                      }}
                    >
                      <tr>
                        <th style={{ border: "1px solid #ccc", padding: "10px" }}>Category</th>
                        <th style={{ border: "1px solid #ccc", padding: "10px" }}>Sub-Category</th>
                        <th style={{ border: "1px solid #ccc", padding: "10px" }}>Quantity Ordered</th>
                        <th style={{ border: "1px solid #ccc", padding: "10px" }}>Total Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {countrySalesData?.categories?.map((row, index) => (
                        <tr key={index} style={{ textAlign: "center", border: "1px solid #ddd" }}>
                          <td style={{ border: "1px solid #ccc", padding: "10px" }}>{row.category}</td>
                          <td style={{ border: "1px solid #ccc", padding: "10px" }}>{row.subcategory}</td>
                          <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                            {row.quantity_ordered}
                          </td>
                          <td style={{ border: "1px solid #ccc", padding: "10px" }}>
                            ₹{row.total_price.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </DialogContent>
        </Dialog>
      )}

      {noDataMessage && <p>{noDataMessage}</p>}
    </div>
  );
}
