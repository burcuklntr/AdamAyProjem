import { Route, Routes } from "react-router-dom";
import { Home } from "../pages/Home";
import Tabloscreen from "../pages/Tabloscreen";
import Frontend from "../pages/Frontend";
// import TableFullScreen from "../pages/TableFullScreen";

const RoutePath = () => {
  return (
    <Routes>
      <Route path="/" element={<Frontend />} />
      <Route path="/table" element={<Tabloscreen />} />
      {/* <Route path="/table" element={<TableFullScreen />} /> */}
    </Routes>
  );
};

export default RoutePath;
