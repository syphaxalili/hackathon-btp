// App.jsx
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import NotFound from "./components/Atom/NotFound";
import Unauthorized from "./components/Atom/Unauthorized";

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
