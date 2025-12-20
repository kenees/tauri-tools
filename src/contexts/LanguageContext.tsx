import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LanguageKey, languages, Translation } from "../locales";

interface LanguageContextType {
  language: LanguageKey;
  setLanguage: (lang: LanguageKey) => void;
  t: Translation;
  availableLanguages: Record<LanguageKey, { name: string; translation: Translation }>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguageState] = useState<LanguageKey>(() => {
    // 从 localStorage 获取保存的语言设置，默认使用中文
    const savedLanguage = localStorage.getItem("devtoys-language") as LanguageKey;
    return savedLanguage && languages[savedLanguage] ? savedLanguage : "zh-CN";
  });

  const setLanguage = (lang: LanguageKey) => {
    setLanguageState(lang);
    localStorage.setItem("devtoys-language", lang);
  };

  const t = languages[language].translation;

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        availableLanguages: languages,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
