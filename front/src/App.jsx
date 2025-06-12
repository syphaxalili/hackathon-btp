// App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import NotFound from "./components/Atom/NotFound";
import Unauthorized from "./components/Atom/Unauthorized";
import MainLayout from "./components/SideNavbar/MainLayout";
import Page1 from "./components/Pages/Page1";
import Page2 from "./components/Pages/Pages2";
import { PrivateRoute } from "./components/Atom/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      
      {/* Private Routes */}
        <Route
          path="/dashbord/acceuil1"
          element={
            <PrivateRoute
              conditionsEvery={[{ field: "user_type", allowedValues: ["AD"] }]}
              component={Page1}
            />
          }
        />
      <Route
          path="/dashbord/acceuil2"
          element={
            <PrivateRoute
              conditionsEvery={[{ field: "user_type", allowedValues: ["AD"] }]}
              component={Page2}
            />
          }
        />
      <Route path="/dashbord" element={<MainLayout />}>
        
        <Route index element={<Page1 />} />
        {/* <Route path="/dashbord/acceuil2" element={<Page2 />} /> */}
        
      </Route>
    </Routes>
  );
}

export default App;
