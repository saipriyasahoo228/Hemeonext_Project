// import { Outlet, useNavigate } from "react-router-dom";
// import { Home } from "lucide-react"; // Import Lucid React Home icon
// import logo from "../../assets/YourrKartLogo.avif";

// function AuthLayout() {
//   const navigate = useNavigate();

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen w-full">
//       <div className="flex flex-col bg-gray-900 md:w-1/2 px-12 py-6">
//         <button
//           onClick={() => navigate("/shop/home")}
//           className="self-end md:self-start flex items-center gap-2 px-4 py-2 bg-primary text-black font-semibold rounded-lg shadow-md hover:bg-primary/90 transition-colors duration-200"
//         >
//           <Home className="w-5 h-5" />
//           {/* Go To Shop */}
//         </button>
//         <div className="flex-1 flex items-center justify-center">
//           <div className="max-w-md space-y-2 md:space-y-6 flex flex-col text-center items-center justify-center text-primary">
//             <img
//               src={logo}
//               alt="YourrKart Logo"
//               className="md:w-28 w-20 md:h-28 h-20 object-cover rounded-xl shadow-xl shadow-black border-b-4 border-gray-500"
//             />
//             <h1 className="text-2xl md:text-6xl font-semibold tracking-tight">
//               Welcome to HemeoNext
//             </h1>
//           </div>
//         </div>
//       </div>
//       <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
//         <Outlet />
//       </div>
//     </div>
//   );
// }

// export default AuthLayout;










import { Outlet, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

// Transparent logo in public folder
const logo = "/leaflogo.png";

function AuthLayout() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full">
      {/* LEFT SIDE WITH BACKGROUND IMAGE + PASTEL GRADIENT */}
      <div
        className="flex flex-col md:w-1/2 px-12 py-6 relative"
        style={{
          backgroundImage: `
            linear-gradient(
              135deg,
              rgba(193, 255, 209, 0.55),  /* light pastel green */
              rgba(255, 210, 230, 0.55)   /* baby pink */
            ),
            url('/background.webp')
          `,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* HOME ICON */}
        <button
          onClick={() => navigate("/shop/home")}
          className="self-end md:self-start flex items-center gap-2 px-3 py-2 
          bg-white/80 text-black font-semibold rounded-lg shadow-md 
          hover:bg-white transition-all duration-200"
        >
          <Home className="w-5 h-5" />
        </button>

        {/* LOGO + TEXT */}
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md space-y-4 md:space-y-6 flex flex-col text-center items-center justify-center text-gray-900">
            <img
              src={logo}
              alt="HemeoNext Logo"
              className="md:w-28 w-20 md:h-28 h-20 object-contain drop-shadow-xl"
            />

            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight drop-shadow-lg">
              Welcome to HomeoNext
            </h1>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
