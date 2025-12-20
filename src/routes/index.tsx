import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "../pages/Layout";
import DevToysHome from "../pages/DevToysHome";
import SettingsPage from "../pages/SettingsPage";
import Test from "@/pages/Test/index";
import Bruno from "@/pages/Bruno";

export default () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DevToysHome />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/test" element={<Test />} />
          <Route path="/bruno" element={<Bruno />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
