import { BrowserRouter, Routes, Route } from "react-router";
import Layout from "../pages/Layout";
import DevToysHome from "../pages/DevToysHome";
import SettingsPage from "../pages/SettingsPage";
import Test from "@/pages/Test/index";
import Bruno from "@/pages/Bruno";
import Base64TextPage from "../pages/Base64TextPage";
import Base64ImagePage from "../pages/Base64ImagePage";
import HtmlEncoderPage from "../pages/HtmlEncoderPage";
import JwtEncoderPage from "../pages/JwtEncoderPage";
import QrCodePage from "../pages/QrCodePage";
import NumberBaseConverterPage from "../pages/NumberBaseConverterPage";
import JsonYamlConverterPage from "../pages/JsonYamlConverterPage";

export default () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DevToysHome />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/test" element={<Test />} />
          <Route path="/bruno" element={<Bruno />} />
          <Route path="/tools/base64-text" element={<Base64TextPage />} />
          <Route path="/tools/base64-image" element={<Base64ImagePage />} />
          <Route path="/tools/html-encoder" element={<HtmlEncoderPage />} />
          <Route path="/tools/jwt" element={<JwtEncoderPage />} />
          <Route path="/tools/qrcode" element={<QrCodePage />} />
          <Route path="/tools/number-base-converter" element={<NumberBaseConverterPage />} />
          <Route path="/tools/json-yaml-converter" element={<JsonYamlConverterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
