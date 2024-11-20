import { ToastContainer } from "react-toastify";
import "./App.css";
import Home from "./pages/Home";
import RoutePath from "./routers/RoutePath";
import Frontend from "./pages/Frontend";

function App() {
  return (
    <div className="flex flex-col">
      <ToastContainer />
      <RoutePath />
    </div>
  );
}

export default App;
