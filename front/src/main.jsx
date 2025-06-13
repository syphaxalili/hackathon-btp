import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "jotai";


createRoot(document.getElementById("root")).render(
  <Provider > 
    <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
    </Provider>
);
