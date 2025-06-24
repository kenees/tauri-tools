import { BrowserRouter, Routes, Route } from "react-router";
import Home from "../pages/Home";
import Setting from "../pages/Setting";
import Layout from "../pages/Layout";
import Jwt from "@/pages/Jwt";
import Logcat from "@/pages/Logcat";
import Terminal from  "@/pages/Terminal"

export default () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/jwt" element={<Jwt />} />
          <Route path="/logcat" element={<Logcat />} />
          <Route path="/terminal" element={<Terminal />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
