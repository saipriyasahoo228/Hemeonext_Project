// import { Outlet } from "react-router-dom";
// import ShoppingHeader from "./header";

// function ShoppingLayout() {
//   return (
//     <div className="flex flex-col bg-white overflow-hidden">
//       {/* common header */}
//       <ShoppingHeader />
      
//       <main className="flex flex-col w-full">
//         <Outlet />
//       </main>
//     </div>
//   );
// }

// export default ShoppingLayout;



import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import MenuComponent from "./menu-component";
import { useState, useEffect } from "react";
import { fetchCategories } from "../../api/productApi";

function ShoppingLayout() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoryData = await fetchCategories();
        setCategories(categoryData);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  return (
    <div className="flex flex-col bg-white overflow-hidden min-h-screen">
      {/* Header - Fixed at top */}
      <ShoppingHeader />
      
      {/* Spacer for fixed header */}
      <div className="h-20"></div> {/* Adjust this height based on your header height */}
      
      {/* Horizontal Categories Navigation Bar */}
      <div className="w-full bg-white shadow-sm border-b border-gray-200 ">
        <MenuComponent categories={categories} />
      </div >
      
      {/* Page Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default ShoppingLayout;