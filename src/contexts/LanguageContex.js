import React, { createContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

// Create the context
export const LanguageContext = createContext();

// Create a provider component
export const LanguageProvider = ({ children }) => {

    const { t, i18n } = useTranslation();
  
    const [language, setLanguage] = useState('ta'); // Default to English

    const toggleLanguage = () => {
        setLanguage(language === 'ta' ? i18n.changeLanguage('en') : i18n.changeLanguage('ta')); // Toggle between English and Tamil
    };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
