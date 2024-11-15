import React, { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();

  // Retrieve the language from session storage or default to 'en'
  const [language, setLanguage] = useState(() => {
    const storedLanguage = sessionStorage.getItem('language');
    return storedLanguage || 'en';
  });

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ta' : 'en';
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    sessionStorage.setItem('language', newLanguage);
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    sessionStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

