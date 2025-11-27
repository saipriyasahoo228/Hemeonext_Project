// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { ChevronDown } from "lucide-react";

// export default function MenuComponent({ categories }) {
//   const [activeDropdown, setActiveDropdown] = useState(null);

//   return (
//     <div className="w-full bg-white shadow-sm border-b border-green-100">
//       {/* Main Categories Bar */}
//       <div className="flex items-center justify-center px-6 py-4">
//         {/* Main Categories - Centered */}
//         <div className="flex items-center space-x-10">
//           {categories.length > 0 ? (
//             categories.map((category) => (
//               <div
//                 key={category.id}
//                 className="relative group"
//                 onMouseEnter={() => setActiveDropdown(category.slug)}
//                 onMouseLeave={() => setActiveDropdown(null)}
//               >
//                 <button className="flex items-center text-gray-800 hover:text-gray-900 font-medium text-sm transition-colors duration-200 py-2">
//                   {category.name}
//                   <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
//                 </button>

//                 {/* Dropdown Menu */}
//                 {activeDropdown === category.slug && (
//                   <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
//                     <div className="p-6">
//                       {/* Subcategories */}
//                       <div>
//                         <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide border-b border-gray-100 pb-2">
//                           {category.name}
//                         </h4>
//                         <div className="space-y-3">
//                           {category.subcategories?.map((subcat) => (
//                             <Link
//                               key={subcat.id}
//                               to={`/shop/listing?category=${category.slug}&subcategory=${subcat.slug}`}
//                               className="block text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200 hover:bg-gray-50 px-3 py-2 rounded-md"
//                               onClick={() => setActiveDropdown(null)}
//                             >
//                               {subcat.name}
//                             </Link>
//                           ))}
//                         </div>
//                       </div>

//                       {/* Bottom Section */}
//                       <div className="mt-4 pt-4 border-t border-gray-100">
//                         <Link
//                           to={`/shop/listing?category=${category.slug}`}
//                           className="text-gray-700 font-medium text-sm hover:text-gray-900 transition-colors duration-200"
//                           onClick={() => setActiveDropdown(null)}
//                         >
//                           View all {category.name} products
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             // Fallback categories if no data
//             <div className="flex space-x-10">
//               {['Homeopathy', 'Ayurveda', 'Nutrition', 'Personal Care', 'Baby Care', 'Fitness'].map((cat) => (
//                 <div key={cat} className="relative group">
//                   <button className="flex items-center text-gray-800 hover:text-gray-900 font-medium text-sm transition-colors duration-200 py-2">
//                     {cat}
//                     <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* All Categories Link */}
//         <div className="ml-10">
//           <Link
//             to="/shop/listing"
//             className="text-gray-700 font-medium text-sm hover:text-gray-900 transition-colors duration-200"
//           >
//             All Categories
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }







// import { useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import { ChevronDown } from "lucide-react";

// const SCROLLBAR_HIDDEN_CLASS = `
//   overflow-x-auto whitespace-nowrap scrollbar-hide 
//   [-ms-overflow-style:none] 
//   [scrollbar-width:none] 
//   [&::-webkit-scrollbar]:hidden
// `;

// export default function MenuComponent({ categories }) {
//   // State to hold all necessary data for the currently active dropdown
//   const [activeDropdownData, setActiveDropdownData] = useState(null);
  
//   // Ref for the main menu container to calculate positions
//   const menuBarRef = useRef(null);

//   // Use ALL categories for the scrolling bar
//   // NOTE: Ensure your backend data provides an empty array or null for categories without subcategories.
//   const menuItems = categories.length > 0 ? categories : 
//     [ /* ... dummy data ... */ ]; 

//   // --- HANDLERS TO CAPTURE POSITION AND DATA ---
//   const handleMouseEnter = (category, event) => {
//     // Dropdown should show even if subcategories are empty, to display the "No sub-categories" message
//     if (!category.subcategories && category.subcategories !== null) return; // Only prevent if the property is completely missing

//     const buttonRect = event.currentTarget.getBoundingClientRect();
    
//     if (!menuBarRef.current) return;
    
//     const menuBarRect = menuBarRef.current.getBoundingClientRect();

//     const relativeLeft = buttonRect.left - menuBarRect.left + (buttonRect.width / 2);

//     setActiveDropdownData({
//       category: category,
//       position: {
//         top: buttonRect.bottom - menuBarRect.top, 
//         left: relativeLeft,
//         isFirst: menuItems.findIndex(item => item.slug === category.slug) === 0,
//       }
//     });
//   };

//   const handleMouseLeave = () => {
//     setActiveDropdownData(null);
//   };
//   // ---------------------------------------------


//   return (
//     <div 
//       className="w-full bg-white shadow-md border-b border-green-100 relative z-30"
//       ref={menuBarRef} 
//       onMouseLeave={handleMouseLeave} 
//     >
//       {/* Main Categories Bar Container */}
//       <div className="flex items-center justify-between px-6 py-3">
        
//         {/* Scrollable Categories Container */}
//         <div 
//             className={`flex items-center space-x-6 w-full ${SCROLLBAR_HIDDEN_CLASS}`}
//         >
//           {menuItems.map((category, index) => (
//             <div
//               key={category.id}
//               className="relative group flex-shrink-0"
//               onMouseEnter={(e) => handleMouseEnter(category, e)} 
//             >
//               <button 
//                 className="flex items-center text-gray-800 hover:text-green-600 font-semibold text-sm transition-colors duration-300 py-3 px-2 rounded-lg relative"
//               >
//                 {category.name}
//                 <span className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 rounded-lg pointer-events-none" style={{boxShadow: '0 0 8px #90EE90, 0 0 12px #90EE90, 0 0 16px #90EE90'}}></span>
//                 {/* Only show Chevron if the subcategories property exists, regardless of count */}
//                 {category.subcategories && <ChevronDown className="ml-2 h-4 w-4 text-green-500 transition-transform duration-300 group-hover:rotate-180" />}
//               </button>
//             </div>
//           ))}
//         </div>

//         {/* All Categories Link */}
//         <div className="ml-10 flex-shrink-0">
//           <Link
//             to="/shop/listing"
//             className="text-gray-700 font-bold text-sm hover:text-green-600 transition-colors duration-200 relative p-2 rounded-md hover:shadow-lg hover:shadow-green-500/50"
//           >
//             All Categories
//           </Link>
//         </div>
//       </div>
      
//       {/* --- RENDER DROPDOWN OUTSIDE THE SCROLLABLE AREA --- */}
//       {/* We check if the category property exists, as we handle the subcategories check inside */}
//       {activeDropdownData && activeDropdownData.category && (
//         <div
//           className="fixed z-50 animate-fade-in"
//           style={{
//             top: activeDropdownData.position.top + menuBarRef.current.offsetTop, 
//             left: activeDropdownData.position.left,
//           }}
//         >
//           {/* Dropdown Content Container */}
//           <div
//             className={`mt-1 w-80 bg-white border border-green-300 rounded-xl shadow-2xl 
//               ${activeDropdownData.position.isFirst 
//                 ? 'translate-x-0'
//                 : '-translate-x-1/2'
//               }
//             `}
//             style={{boxShadow: '0 0 15px rgba(144, 238, 144, 0.4)'}} 
//           >
//             <div className="p-6">
//               {/* --- Dropdown Header --- */}
//               <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider border-b border-green-200 pb-2 relative">
//                 {activeDropdownData.category.name}
//                 <span className="absolute bottom-0 left-0 w-full h-px bg-green-400 opacity-50 blur-sm"></span>
//               </h4>
              
//               {/* --- Conditional Content Rendering --- */}
//               {activeDropdownData.category.subcategories?.length > 0 ? (
//                 // ✅ RENDER SUBCATEGORY LINKS
//                 <>
//                   <div className="space-y-2">
//                     {activeDropdownData.category.subcategories.map((subcat) => (
//                       <Link
//                         key={subcat.id}
//                         to={`/shop/listing?category=${activeDropdownData.category.slug}&subcategory=${subcat.slug}`}
//                         className="block text-gray-700 hover:text-gray-900 text-sm transition-all duration-200 hover:bg-green-50 px-3 py-2 rounded-lg"
//                         onClick={() => setActiveDropdownData(null)}
//                       >
//                         {subcat.name}
//                       </Link>
//                     ))}
//                   </div>

//                   <div className="mt-4 pt-4 border-t border-green-200">
//                     <Link
//                       to={`/shop/listing?category=${activeDropdownData.category.slug}`}
//                       className="text-green-600 font-semibold text-sm hover:text-green-800 transition-colors duration-200 block text-center pt-2"
//                       onClick={() => setActiveDropdownData(null)}
//                     >
//                       View all {activeDropdownData.category.name} products
//                     </Link>
//                   </div>
//                 </>
//               ) : (
//                 // ❌ RENDER NO SUBCATEGORIES MESSAGE
//                 <div className="py-6 text-center text-gray-500 text-sm italic">
//                   No sub-categories available.
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }








import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const SCROLLBAR_HIDDEN_CLASS = `
  overflow-x-auto whitespace-nowrap scrollbar-hide 
  [-ms-overflow-style:none] 
  [scrollbar-width:none] 
  [&::-webkit-scrollbar]:hidden
`;

export default function MenuComponent({ categories }) {
  const [activeDropdownData, setActiveDropdownData] = useState(null);
  const menuBarRef = useRef(null);

  const menuItems = categories.length > 0 ? categories : 
    [ /* ... dummy data ... */ ]; 

  // --- HANDLERS TO CAPTURE POSITION AND DATA ---
  const handleMouseEnter = (category, event) => {
    if (!category.subcategories && category.subcategories !== null) return;

    const buttonRect = event.currentTarget.getBoundingClientRect();
    
    if (!menuBarRef.current) return;
    
    const menuBarRect = menuBarRef.current.getBoundingClientRect();

    const relativeLeft = buttonRect.left - menuBarRect.left + (buttonRect.width / 2);

    setActiveDropdownData({
      category: category,
      position: {
        top: buttonRect.bottom - menuBarRect.top, 
        left: relativeLeft,
        isFirst: menuItems.findIndex(item => item.slug === category.slug) === 0,
      }
    });
  };

  const handleMouseLeave = () => {
    setActiveDropdownData(null);
  };
  // ---------------------------------------------


  return (
    <div 
      className="w-full bg-white shadow-md border-b border-green-100 relative z-30"
      ref={menuBarRef} 
      onMouseLeave={handleMouseLeave} 
    >
      {/* Main Categories Bar Container */}
      <div className="flex items-center justify-between px-6 py-3">
        
        {/* Scrollable Categories Container */}
        <div 
            className={`flex items-center space-x-6 w-full ${SCROLLBAR_HIDDEN_CLASS}`}
        >
          {menuItems.map((category, index) => (
            <div
              key={category.id}
              className="relative group flex-shrink-0"
              onMouseEnter={(e) => handleMouseEnter(category, e)} 
            >
              <button 
                className="flex items-center text-gray-800 hover:text-green-600 font-semibold text-sm transition-colors duration-300 py-3 px-2 rounded-lg relative"
              >
                {category.name}
                {/* 🚨 FIX: Changed inset-0 to -inset-2 to allow the glow to render fully */}
                <span className="block text-gray-700 hover:text-gray-900 text-sm transition-all duration-200 hover:bg-green-50 px-3 py-2 rounded-lg"></span>
                
                {category.subcategories && <ChevronDown className="ml-2 h-4 w-4 text-green-500 transition-transform duration-300 group-hover:rotate-180" />}
              </button>
            </div>
          ))}
        </div>

        {/* All Categories Link */}
        <div className="ml-10 flex-shrink-0">
          <Link
            to="/shop/listing"
            className="text-gray-700 font-bold text-sm hover:text-green-600 transition-colors duration-200 relative p-2 rounded-md hover:shadow-lg hover:shadow-green-500/50"
          >
            All Categories
          </Link>
        </div>
      </div>
      
      {/* --- RENDER DROPDOWN OUTSIDE THE SCROLLABLE AREA --- */}
      {activeDropdownData && activeDropdownData.category && (
        <div
          className="fixed z-50 animate-fade-in"
          style={{
            top: activeDropdownData.position.top + menuBarRef.current.offsetTop, 
            left: activeDropdownData.position.left,
          }}
        >
          {/* Dropdown Content Container */}
          <div
            className={`mt-1 w-80 bg-white border border-green-300 rounded-xl shadow-2xl 
              ${activeDropdownData.position.isFirst 
                ? 'translate-x-0'
                : '-translate-x-1/2'
              }
            `}
            style={{boxShadow: '0 0 15px rgba(144, 238, 144, 0.4)'}} 
          >
            <div className="p-6">
              {/* --- Dropdown Header --- */}
              <h4 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wider border-b border-green-200 pb-2 relative">
                {activeDropdownData.category.name}
                <span className="absolute bottom-0 left-0 w-full h-px bg-green-400 opacity-50 blur-sm"></span>
              </h4>
              
              {/* --- Conditional Content Rendering --- */}
              {activeDropdownData.category.subcategories?.length > 0 ? (
                // ✅ RENDER SUBCATEGORY LINKS
                <>
                  <div className="space-y-2">
                    {activeDropdownData.category.subcategories.map((subcat) => (
                      <Link
                        key={subcat.id}
                        to={`/shop/listing?category=${activeDropdownData.category.slug}&subcategory=${subcat.slug}`}
                        className="block text-gray-700 hover:text-gray-900 text-sm transition-all duration-200 hover:bg-green-50 px-3 py-2 rounded-lg"
                        onClick={() => setActiveDropdownData(null)}
                      >
                        {subcat.name}
                      </Link>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-green-200">
                    <Link
                      to={`/shop/listing?category=${activeDropdownData.category.slug}`}
                      className="text-green-600 font-semibold text-sm hover:text-green-800 transition-colors duration-200 block text-center pt-2"
                      onClick={() => setActiveDropdownData(null)}
                    >
                      View all {activeDropdownData.category.name} products
                    </Link>
                  </div>
                </>
              ) : (
                // ❌ RENDER NO SUBCATEGORIES MESSAGE
                <div className="py-6 text-center text-gray-500 text-sm italic">
                  No sub-categories available.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}