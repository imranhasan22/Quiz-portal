import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found. Did you forget <div id='root'></div> in index.html?");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
   <App />
  </React.StrictMode>
);
