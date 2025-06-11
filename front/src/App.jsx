// App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./Componant/Home/Home";
import NotFound from "./Componant/Atom/NotFound";
import Unauthorized from "./Componant/Atom/Unauthorized";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/a" element={<Unauthorized />} />
    </Routes>
  );
}

export default App;
