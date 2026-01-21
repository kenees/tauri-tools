import { useState, useEffect } from "react";
import { ChevronDownIcon, ChevronUpIcon, InformationCircleIcon, LightBulbIcon, CogIcon, LockClosedIcon, ClockIcon } from "@heroicons/react/24/outline";
import { Switch, TextArea, ToolPageHeader, ToolBar, PasteButton, ClearButton, CloseButton, SaveButton, CopyButton, EditButton, MoreOptionsButton, IconButton, Dropdown } from "../components/UIControls";
import { useFavorites } from "../hooks/useFavorites";
import { invoke } from "@tauri-apps/api/core";

interface DecodingConfig {
  tokenValidation: boolean;
  signatureKey: boolean;
  signatureFormat: boolean;
  issuer: boolean;
  audience: boolean;
  lifetime: boolean;
  participant: boolean;
}

interface EncodingConfig {
  settings: boolean;
  algorithm: boolean;
  hasIssuer: boolean;
  hasAudience: boolean;
  hasExpiration: boolean;
  hasDefaultTime: boolean;
}

interface ValidationData {
  issuer: string;
  audience: string;
  signatureKey: string;
}

interface EncodingData {
  algorithm: string;
  issuer: string;
  audience: string;
  expirationYear: number;
  expirationMonth: number;
  expirationDay: number;
  expirationHour: number;
  expirationMinute: number;
  signature: string;
  signatureFormat: "plain" | "base64";
}

export default function JwtEncoderPage() {
  const [isDecoding, setIsDecoding] = useState(false);
  const [token, setToken] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["tokenValidation", "signatureKey", "issuer", "audience", "settings"]));

  const [decodingConfig, setDecodingConfig] = useState<DecodingConfig>({
    tokenValidation: true,
    signatureKey: true,
    signatureFormat: false,
    issuer: false,
    audience: true,
    lifetime: true,
    participant: false,
  });

  const [encodingConfig, setEncodingConfig] = useState<EncodingConfig>({
    settings: true,
    algorithm: true,
    hasIssuer: false,
    hasAudience: false,
    hasExpiration: false,
    hasDefaultTime: false,
  });

  const [validationData, setValidationData] = useState<ValidationData>({
    issuer: "",
    audience: "",
    signatureKey: "",
  });

  const [encodingData, setEncodingData] = useState<EncodingData>({
    algorithm: "RS512",
    issuer: "",
    audience: "",
    expirationYear: new Date().getFullYear(),
    expirationMonth: new Date().getMonth() + 1,
    expirationDay: new Date().getDate(),
    expirationHour: new Date().getHours(),
    expirationMinute: new Date().getMinutes(),
    signature: "",
    signatureFormat: "plain",
  });

  const { isFavorite, toggleFavorite } = useFavorites();

  const algorithmOptions = [
    { value: "HS256", label: "HS256" },
    { value: "HS384", label: "HS384" },
    { value: "HS512", label: "HS512" },
    { value: "RS256", label: "RS256" },
    { value: "RS384", label: "RS384" },
    { value: "RS512", label: "RS512" },
    { value: "PS256", label: "PS256" },
    { value: "PS512", label: "PS512" },
    { value: "PS384", label: "PS384" },
    { value: "ES256", label: "ES256" },
    { value: "ES512", label: "ES512" },
    { value: "ES384", label: "ES384" },
  ];

  useEffect(() => {
    if (token && isDecoding) {
      decodeToken();
    }
  }, [token, isDecoding]);

  useEffect(() => {
    // 根据选择的算法更新标头
    if (!isDecoding && encodingConfig.algorithm) {
      const headerObj = { alg: encodingData.algorithm, typ: "JWT" };
      setHeader(JSON.stringify(headerObj, null, 2));
    }
  }, [encodingData.algorithm, encodingConfig.algorithm, isDecoding]);

  const decodeToken = () => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
      }

      const decodedHeader = JSON.parse(atob(parts[0]));
      const decodedPayload = JSON.parse(atob(parts[1]));

      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));
    } catch (error) {
      setHeader("解码失败：无效的JWT令牌");
      setPayload("解码失败：无效的JWT令牌");
    }
  };

const encodeToken = async () => {
    try {
      const headerObj = header ? JSON.parse(header) : { alg: encodingData.algorithm, typ: "JWT" };
      let payloadObj = payload ? JSON.parse(payload) : { sub: "user", name: "John Doe" };

      // 添加发行者
      if (encodingConfig.hasIssuer && encodingData.issuer) {
        const issuers = encodingData.issuer.split(',').map(s => s.trim());
        payloadObj.iss = issuers.length === 1 ? issuers[0] : issuers;
      }

      // 添加受众
      if (encodingConfig.hasAudience && encodingData.audience) {
        const audiences = encodingData.audience.split(',').map(s => s.trim());
        payloadObj.aud = audiences.length === 1 ? audiences[0] : audiences;
      }

      // 添加过期时间
      if (encodingConfig.hasExpiration) {
        const expDate = new Date(
          encodingData.expirationYear,
          encodingData.expirationMonth - 1,
          encodingData.expirationDay,
          encodingData.expirationHour,
          encodingData.expirationMinute
        );
        payloadObj.exp = Math.floor(expDate.getTime() / 1000);
      }

      // 添加签发时间（iat）
      payloadObj.iat = Math.floor(Date.now() / 1000);

      // 根据格式处理签名
      let signature = encodingData.signature || "your-secret-key";
      if (encodingData.signatureFormat === "base64" && encodingData.signature) {
        try {
          // 如果是Base64格式，验证是否为有效的Base64
          signature = atob(encodingData.signature);
        } catch (error) {
          // 如果解码失败，使用原始值作为纯文本
          console.warn("Invalid Base64 signature format, using as plain text");
        }
      }

      let jwtToken;
      
      // 根据算法选择不同的后端函数
      if (encodingData.algorithm === "HS256") {
        // 对于HS256，使用专门的函数确保兼容性
        jwtToken = await invoke<string>('encode_hs256_token', {
          header: header,
          payload: JSON.stringify(payloadObj),
          secret: signature
        });
      } else {
        // 对于其他算法，使用通用函数
        jwtToken = await invoke<string>('encode_jwt_token', {
          header: JSON.stringify(headerObj),
          payload: JSON.stringify(payloadObj),
          secret: signature
        });
      }
      
      setToken(jwtToken);
    } catch (error) {
      console.error("JWT编码失败:", error);
      setToken("编码失败：请检查JSON格式");
    }
  };

  const handlePaste = async (setter: (value: string) => void) => {
    try {
      const text = await navigator.clipboard.readText();
      setter(text);
    } catch (error) {
      console.error("粘贴失败:", error);
    }
  };

  const handleClear = (setter: (value: string) => void) => {
    setter("");
  };

  const handleFormat = (text: string, setter: (value: string) => void) => {
    try {
      const parsed = JSON.parse(text);
      setter(JSON.stringify(parsed, null, 2));
    } catch (error) {
      // 如果不是JSON，保持原样
    }
  };

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const toggleDecodingConfig = (key: keyof DecodingConfig) => {
    setDecodingConfig((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleEncodingConfig = (key: keyof EncodingConfig) => {
    setEncodingConfig((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAddToFavorites = () => {
    toggleFavorite("jwt-encoder");
  };

  const handleRefresh = () => {
    setToken("");
    setHeader("");
    setPayload("");
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl overflow-y-auto h-[100vh]">
      <ToolPageHeader title="JWT编码器/解码器" onAddToFavorites={handleAddToFavorites} onRefresh={handleRefresh} isFavorited={isFavorite("jwt-encoder")} />

      {/* 配置区域 */}
      <div className="space-y-3 mb-6">
        {/* 工具模式 */}
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg py-4 mb-0">
          <div className="flex items-center justify-between border-0 border-b-1 pb-4 border-b-gray-300 dark:border-b-gray-600">
            <div className="flex items-center gap-3">
              <span className="font-medium text-gray-900 dark:text-white">工具模式</span>
              <span className="text-sm text-gray-600 dark:text-gray-400">选择要使用的模式</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-900 dark:text-white">{isDecoding ? "解码" : "编码"}</span>
              <Switch checked={isDecoding} onChange={setIsDecoding} />
            </div>
          </div>
        </div>

        {/* 解码模式配置 */}
        {isDecoding && (
          <>
            {/* 令牌验证设置 */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("tokenValidation")}>
                <div className="flex items-center gap-3">
                  <CogIcon className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-900 dark:text-white">令牌验证设置</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">开启</span>
                  <Switch checked={decodingConfig.tokenValidation} onChange={() => toggleDecodingConfig("tokenValidation")} />
                  {expandedSections.has("tokenValidation") ? <ChevronUpIcon className="w-4 h-4 text-gray-500" /> : <ChevronDownIcon className="w-4 h-4 text-gray-500" />}
                </div>
              </div>

              {expandedSections.has("tokenValidation") && (
                <div className="mt-4 space-y-3">
                  {/* 验证签发者签名密钥 */}
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("signatureKey")}>
                      <div className="flex items-center gap-3">
                        <LockClosedIcon className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900 dark:text-white">验证签发者签名密钥</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">否</span>
                        <Switch checked={decodingConfig.signatureKey} onChange={() => toggleDecodingConfig("signatureKey")} />
                        {expandedSections.has("signatureKey") ? <ChevronUpIcon className="w-4 h-4 text-gray-500" /> : <ChevronDownIcon className="w-4 h-4 text-gray-500" />}
                      </div>
                    </div>

                    {expandedSections.has("signatureKey") && (
                      <div className="mt-3 space-y-3">
                        {/* 签名格式切换 */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">签名格式</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">纯文本</span>
                            <Switch checked={decodingConfig.signatureFormat} onChange={() => toggleDecodingConfig("signatureFormat")} />
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Base64</span>
                          </div>
                        </div>
                        {/* <TextArea value={validationData.signatureKey} onChange={(value) => setValidationData((prev) => ({ ...prev, signatureKey: value }))} placeholder="输入签名密钥..." rows={3} /> */}
                      </div>
                    )}
                  </div>

                  {/* 验证签发者 */}
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("issuer")}>
                      <div className="flex items-center gap-3">
                        <CogIcon className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900 dark:text-white">验证签发者</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{decodingConfig.issuer ? "是" : "否"}</span>
                        <Switch checked={decodingConfig.issuer} onChange={() => toggleDecodingConfig("issuer")} />
                        {expandedSections.has("issuer") ? <ChevronUpIcon className="w-4 h-4 text-gray-500" /> : <ChevronDownIcon className="w-4 h-4 text-gray-500" />}
                      </div>
                    </div>

                    {expandedSections.has("issuer") && (
                      <div className="mt-3">
                        <div className="flex gap-2 mb-2">
                          <PasteButton disabled={!decodingConfig.issuer} onClick={() => handlePaste((value) => setValidationData((prev) => ({ ...prev, issuer: value })))} />
                          <ClearButton disabled={!decodingConfig.issuer} onClick={() => handleClear((value) => setValidationData((prev) => ({ ...prev, issuer: "" })))} />
                          <CloseButton disabled={!decodingConfig.issuer} onClick={() => handleClear((value) => setValidationData((prev) => ({ ...prev, issuer: "" })))} />
                        </div>
                        <TextArea disabled={!decodingConfig.issuer} value={validationData.issuer} onChange={(value) => setValidationData((prev) => ({ ...prev, issuer: value }))} placeholder="令牌发行者（用逗号分隔）" rows={2} />
                      </div>
                    )}
                  </div>

                  {/* 验证目标受众 */}
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("audience")}>
                      <div className="flex items-center gap-3">
                        <CogIcon className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900 dark:text-white">验证目标受众</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{decodingConfig.audience ? "是" : "否"}</span>
                        <Switch checked={decodingConfig.audience} onChange={() => toggleDecodingConfig("audience")} />
                        {expandedSections.has("audience") ? <ChevronUpIcon className="w-4 h-4 text-gray-500" /> : <ChevronDownIcon className="w-4 h-4 text-gray-500" />}
                      </div>
                    </div>

                    {expandedSections.has("audience") && (
                      <div className="mt-3">
                        <div className="flex gap-2 mb-2">
                          <PasteButton disabled={!decodingConfig.audience} onClick={() => handlePaste((value) => setValidationData((prev) => ({ ...prev, audience: value })))} />
                          <ClearButton disabled={!decodingConfig.audience} onClick={() => handleClear((value) => setValidationData((prev) => ({ ...prev, audience: "" })))} />
                          <CloseButton disabled={!decodingConfig.audience} onClick={() => handleClear((value) => setValidationData((prev) => ({ ...prev, audience: "" })))} />
                        </div>
                        <TextArea disabled={!decodingConfig.audience} value={validationData.audience} onChange={(value) => setValidationData((prev) => ({ ...prev, audience: value }))} placeholder="令牌目标受众（用逗号分隔）" rows={2} />
                      </div>
                    )}
                  </div>

                  {/* 验证生存期 */}
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ClockIcon className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900 dark:text-white">验证生存期</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">是</span>
                        <Switch checked={decodingConfig.lifetime} onChange={() => toggleDecodingConfig("lifetime")} />
                      </div>
                    </div>
                  </div>

                  {/* 验证参与者 */}
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CogIcon className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900 dark:text-white">验证参与者</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">否</span>
                        <Switch checked={decodingConfig.participant} onChange={() => toggleDecodingConfig("participant")} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* 编码模式配置 */}
        {!isDecoding && (
          <>
            {/* 设置 */}
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("settings")}>
                <div className="flex items-center gap-3">
                  <CogIcon className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-900 dark:text-white">设置</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">开启</span>
                  <Switch checked={encodingConfig.settings} onChange={() => toggleEncodingConfig("settings")} />
                  {expandedSections.has("settings") ? <ChevronUpIcon className="w-4 h-4 text-gray-500" /> : <ChevronDownIcon className="w-4 h-4 text-gray-500" />}
                </div>
              </div>

              {expandedSections.has("settings") && (
                <div className="mt-4 space-y-3">
                  {/* 令牌哈希算法 */}
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CogIcon className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900 dark:text-white">令牌哈希算法</span>
                      </div>
                      <div className="mt-3">
                        <Dropdown value={encodingData.algorithm} options={algorithmOptions} onChange={(value) => setEncodingData((prev) => ({ ...prev, algorithm: value }))} />
                      </div>
                    </div>
                  </div>

                  {/* 令牌有发行者 */}
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("hasIssuer")}>
                      <div className="flex items-center gap-3">
                        <CogIcon className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900 dark:text-white">令牌有发行者</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{encodingConfig.hasIssuer ? "是" : "否"}</span>
                        <Switch checked={encodingConfig.hasIssuer} onChange={() => toggleEncodingConfig("hasIssuer")} />
                        {expandedSections.has("hasIssuer") ? <ChevronUpIcon className="w-4 h-4 text-gray-500" /> : <ChevronDownIcon className="w-4 h-4 text-gray-500" />}
                      </div>
                    </div>

                    {expandedSections.has("hasIssuer") && (
                      <div className="mt-3">
                        <div className="flex gap-2 mb-2">
                          <PasteButton disabled={!encodingConfig.hasIssuer} onClick={() => handlePaste((value) => setEncodingData((prev) => ({ ...prev, issuer: value })))} />
                          <ClearButton disabled={!encodingConfig.hasIssuer} onClick={() => handleClear((value) => setEncodingData((prev) => ({ ...prev, issuer: "" })))} />
                          <CloseButton disabled={!encodingConfig.hasIssuer} onClick={() => handleClear((value) => setEncodingData((prev) => ({ ...prev, issuer: "" })))} />
                        </div>
                        <TextArea disabled={!encodingConfig.hasIssuer} value={encodingData.issuer} onChange={(value) => setEncodingData((prev) => ({ ...prev, issuer: value }))} placeholder="令牌发行者（用逗号分隔）" rows={2} />
                      </div>
                    )}
                  </div>

                  {/* 令牌有目标受众 */}
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("hasAudience")}>
                      <div className="flex items-center gap-3">
                        <CogIcon className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900 dark:text-white">令牌有目标受众</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{encodingConfig.hasAudience ? "是" : "否"}</span>
                        <Switch checked={encodingConfig.hasAudience} onChange={() => toggleEncodingConfig("hasAudience")} />
                        {expandedSections.has("hasAudience") ? <ChevronUpIcon className="w-4 h-4 text-gray-500" /> : <ChevronDownIcon className="w-4 h-4 text-gray-500" />}
                      </div>
                    </div>

                    {expandedSections.has("hasAudience") && (
                      <div className="mt-3">
                        <div className="flex gap-2 mb-2">
                          <PasteButton disabled={!encodingConfig.hasAudience} onClick={() => handlePaste((value) => setEncodingData((prev) => ({ ...prev, audience: value })))} />
                          <ClearButton disabled={!encodingConfig.hasAudience} onClick={() => handleClear((value) => setEncodingData((prev) => ({ ...prev, audience: "" })))} />
                          <CloseButton disabled={!encodingConfig.hasAudience} onClick={() => handleClear((value) => setEncodingData((prev) => ({ ...prev, audience: "" })))} />
                        </div>
                        <TextArea disabled={!encodingConfig.hasAudience} value={encodingData.audience} onChange={(value) => setEncodingData((prev) => ({ ...prev, audience: value }))} placeholder="令牌目标受众（用逗号分隔）" rows={2} />
                      </div>
                    )}
                  </div>

                  {/* 令牌有过期时间 */}
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("hasExpiration")}>
                      <div className="flex items-center gap-3">
                        <ClockIcon className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900 dark:text-white">令牌有过期时间</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{encodingConfig.hasExpiration ? "是" : "否"}</span>
                        <Switch checked={encodingConfig.hasExpiration} onChange={() => toggleEncodingConfig("hasExpiration")} />
                        {expandedSections.has("hasExpiration") ? <ChevronUpIcon className="w-4 h-4 text-gray-500" /> : <ChevronDownIcon className="w-4 h-4 text-gray-500" />}
                      </div>
                    </div>

                    {expandedSections.has("hasExpiration") && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">过期前剩余</p>
                        <div className="grid grid-cols-5 gap-2">
                          <div>
                            <label className="text-xs text-gray-500">年</label>
                            <input
                              disabled={!encodingConfig.hasExpiration}
                              type="number"
                              value={encodingData.expirationYear}
                              onChange={(e) => setEncodingData((prev) => ({ ...prev, expirationYear: parseInt(e.target.value) || 0 }))}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">月</label>
                            <input
                              disabled={!encodingConfig.hasExpiration}
                              type="number"
                              min="1"
                              max="12"
                              value={encodingData.expirationMonth}
                              onChange={(e) => setEncodingData((prev) => ({ ...prev, expirationMonth: parseInt(e.target.value) || 1 }))}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">天</label>
                            <input
                              disabled={!encodingConfig.hasExpiration}
                              type="number"
                              min="1"
                              max="31"
                              value={encodingData.expirationDay}
                              onChange={(e) => setEncodingData((prev) => ({ ...prev, expirationDay: parseInt(e.target.value) || 1 }))}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">时</label>
                            <input
                              disabled={!encodingConfig.hasExpiration}
                              type="number"
                              min="0"
                              max="23"
                              value={encodingData.expirationHour}
                              onChange={(e) => setEncodingData((prev) => ({ ...prev, expirationHour: parseInt(e.target.value) || 0 }))}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-500">分</label>
                            <input
                              disabled={!encodingConfig.hasExpiration}
                              type="number"
                              min="0"
                              max="59"
                              value={encodingData.expirationMinute}
                              onChange={(e) => setEncodingData((prev) => ({ ...prev, expirationMinute: parseInt(e.target.value) || 0 }))}
                              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 令牌有默认时间 */}
                  <div className="bg-white dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <ClockIcon className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-900 dark:text-white">令牌有默认时间</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">否</span>
                        <Switch checked={encodingConfig.hasDefaultTime} onChange={() => toggleEncodingConfig("hasDefaultTime")} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* 令牌区域 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">令牌</label>
          <ToolBar>
            <PasteButton onClick={() => handlePaste(setToken)} />
            <ClearButton onClick={() => handleClear(setToken)} />
            <CloseButton onClick={() => handleClear(setToken)} />
          </ToolBar>
        </div>
        <TextArea value={token} onChange={setToken} placeholder={isDecoding ? "输入JWT令牌..." : "生成的令牌将显示在这里..."} rows={6} />
        {!isDecoding && (
          <div className="mt-2">
            <button onClick={encodeToken} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              生成令牌
            </button>
          </div>
        )}
      </div>

      {/* 底部双栏输入区 */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 标头 */}

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">标头</label>

            <ToolBar>
              <PasteButton onClick={() => handlePaste(setHeader)} />

              <ClearButton onClick={() => handleClear(setHeader)} />

              <IconButton icon={<LightBulbIcon className="w-4 h-4" />} label="格式化" onClick={() => handleFormat(header, setHeader)} />
            </ToolBar>
          </div>

          <TextArea value={header} onChange={setHeader} placeholder={isDecoding ? "解码后的标头将显示在这里..." : "输入JSON格式的标头..."} rows={10} />
        </div>

        {/* 载荷 */}

        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">载荷</label>

              <InformationCircleIcon className="w-4 h-4 text-gray-400" />
            </div>

            <ToolBar>
              <PasteButton onClick={() => handlePaste(setPayload)} />

              <ClearButton onClick={() => handleClear(setPayload)} />

              <CopyButton onClick={() => navigator.clipboard.writeText(payload)} disabled={!payload} />

              <SaveButton
                onClick={() => {
                  const blob = new Blob([payload], { type: "application/json" });

                  const url = URL.createObjectURL(blob);

                  const a = document.createElement("a");

                  a.href = url;

                  a.download = "payload.json";

                  document.body.appendChild(a);

                  a.click();

                  document.body.removeChild(a);

                  URL.revokeObjectURL(url);
                }}
                disabled={!payload}
              />

              <IconButton icon={<LightBulbIcon className="w-4 h-4" />} label="格式化" onClick={() => handleFormat(payload, setPayload)} />
            </ToolBar>
          </div>

          <TextArea value={payload} onChange={setPayload} placeholder={isDecoding ? "解码后的载荷将显示在这里..." : "输入JSON格式的载荷..."} rows={10} />
        </div>
      </div>

      {/* 签名输入区域（仅在编码模式下显示） */}

      {!isDecoding && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">签名</label>

              <LockClosedIcon className="w-4 h-4 text-gray-400" />
            </div>

            <ToolBar>
              <PasteButton onClick={() => handlePaste((value) => setEncodingData((prev) => ({ ...prev, signature: value })))} />

              <ClearButton onClick={() => handleClear((value) => setEncodingData((prev) => ({ ...prev, signature: "" })))} />

              <CopyButton onClick={() => navigator.clipboard.writeText(encodingData.signature)} disabled={!encodingData.signature} />
            </ToolBar>
          </div>

          <TextArea value={encodingData.signature} onChange={(value) => setEncodingData((prev) => ({ ...prev, signature: value }))} placeholder="输入签名密钥或签名值..." rows={4} />

          {/* 签名格式切换 */}

          <div className="flex items-center justify-between mt-3">
            <span className="text-sm text-gray-600 dark:text-gray-400">签名格式</span>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-900 dark:text-white">纯文本</span>

              <Switch
                checked={encodingData.signatureFormat === "base64"}
                onChange={(checked) =>
                  setEncodingData((prev) => ({
                    ...prev,

                    signatureFormat: checked ? "base64" : "plain",
                  }))
                }
              />

              <span className="text-sm font-medium text-gray-900 dark:text-white">Base64</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            签名将用于JWT令牌的第三部分。如果为空，将使用默认值。
            {encodingData.signatureFormat === "base64" ? " Base64格式将自动解码为纯文本。" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
