import { useState } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useTheme } from "../contexts/ThemeContext";
import { Switch, Dropdown } from "../components/UIControls";
import { LanguageIcon, PaintBrushIcon, ArrowsPointingInIcon, ArrowDownTrayIcon, WrenchScrewdriverIcon, LightBulbIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";

export default function SettingsPage() {
  const { language, setLanguage, t, availableLanguages } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [smartDetectionExpanded, setSmartDetectionExpanded] = useState(true);

  // 设置状态
  const [compactSpacing, setCompactSpacing] = useState(false);
  const [checkUpdates, setCheckUpdates] = useState(false);
  const [showRecentTools, setShowRecentTools] = useState(true);
  const [smartDetection, setSmartDetection] = useState(true);
  const [autoPasteClipboard, setAutoPasteClipboard] = useState(true);

  // 语言选项
  const languageOptions = Object.entries(availableLanguages).map(([key, value]) => ({
    value: key,
    label: value.name,
  }));

  // 主题选项
  const themeOptions = [
    { value: "dark", label: language === "zh-CN" ? "深色" : "Dark" },
    { value: "light", label: language === "zh-CN" ? "浅色" : "Light" },
  ];

  const handleHelpTranslate = () => {
    // 打开翻译帮助页面
    console.log("Open translation help page");
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-6">
      {/* 标题 */}
      <h1 className="text-2xl font-bold mb-8">{t.settings.title}</h1>

      {/* 外观设置 */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">{t.settings.appearance}</h2>

        {/* 界面语言 */}

        <div className="flex items-center justify-between py-3 border-b border-gray-300 dark:border-gray-700">
          <div className="flex items-center gap-3 flex-1">
            <LanguageIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />

            <div>
              <h3 className="font-medium">{t.settings.interfaceLanguage.title}</h3>

              <p className="text-sm text-gray-600 dark:text-gray-400">{t.settings.interfaceLanguage.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleHelpTranslate} className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-500 dark:hover:text-blue-400 transition-colors">
              {t.settings.interfaceLanguage.helpTranslate}
            </button>

            <Dropdown value={language} options={languageOptions} onChange={(value) => setLanguage(value as "zh-CN" | "en-US")} />
          </div>
        </div>

        {/* 应用主题 */}

        <div className="flex items-center justify-between py-3 border-b border-gray-300 dark:border-gray-700">
          <div className="flex items-center gap-3 flex-1">
            <PaintBrushIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />

            <div>
              <h3 className="font-medium">{t.settings.appTheme.title}</h3>

              <p className="text-sm text-gray-600 dark:text-gray-400">{t.settings.appTheme.description}</p>
            </div>
          </div>

          <Dropdown
            value={theme}
            options={themeOptions}
            onChange={(value) => {
              console.log("Theme changed to:", value);
              setTheme(value as "dark" | "light");
              console.log("Current theme:", theme);
            }}
          />
        </div>

        {/* 紧凑间距 */}

        <div className="flex items-center justify-between py-3 border-b border-gray-300 dark:border-gray-700">
          <div className="flex items-center gap-3 flex-1">
            <ArrowsPointingInIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />

            <div>
              <h3 className="font-medium">{t.settings.compactSpacing.title}</h3>

              <p className="text-sm text-gray-600 dark:text-gray-400">{t.settings.compactSpacing.description}</p>
            </div>
          </div>

          <Switch checked={compactSpacing} onChange={setCompactSpacing} />
        </div>
      </section>

      {/* 行为设置 */}

      <section>
        <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">{t.settings.behavior}</h2>

        {/* 检查更新 */}
        <div className="flex items-center justify-between py-3 border-b border-gray-300 dark:border-gray-700">
          <div className="flex items-center gap-3 flex-1">
            <ArrowDownTrayIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <h3 className="font-medium">{t.settings.checkUpdates.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.settings.checkUpdates.description}</p>
            </div>
          </div>
          <Switch checked={checkUpdates} onChange={setCheckUpdates} />
        </div>

        {/* 显示最近使用的工具 */}
        <div className="flex items-center justify-between py-3 border-b border-gray-300 dark:border-gray-700">
          <div className="flex items-center gap-3 flex-1">
            <WrenchScrewdriverIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <h3 className="font-medium">{t.settings.showRecentTools.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{t.settings.showRecentTools.description}</p>
            </div>
          </div>
          <Switch
            checked={showRecentTools}
            // onChange={setRecentTools}
            onChange={(e) => console.log("aaa")}
          />
        </div>

        {/* 智能检测 */}
        <div className="border-b border-gray-300 dark:border-gray-700">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3 flex-1">
              <LightBulbIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div>
                <h3 className="font-medium">{t.settings.smartDetection.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t.settings.smartDetection.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setSmartDetectionExpanded(!smartDetectionExpanded)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${smartDetectionExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <Switch checked={smartDetection} onChange={setSmartDetection} />
            </div>
          </div>

          {/* 智能检测子选项 */}
          {smartDetectionExpanded && (
            <div className="pl-8 pb-3">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3 flex-1">
                  <ClipboardDocumentCheckIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <div>
                    <h4 className="text-sm font-medium">{t.settings.autoPasteClipboard.title}</h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{t.settings.autoPasteClipboard.description}</p>
                  </div>
                </div>
                <Switch checked={autoPasteClipboard} onChange={setAutoPasteClipboard} />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
