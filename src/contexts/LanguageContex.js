import React, { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Create the context
export const LanguageContext = createContext();

// Create a provider component
export const LanguageProvider = ({ children }) => {

  const { t, i18n } = useTranslation();
  
  const [language, setLanguage] = useState('en'); // Default to English

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ta' : 'en'; // Toggle between 'en' and 'ta'
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage); // Change the language with i18n
  };

  // Set the `lang` attribute on the HTML element when language changes
  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  console.log(language); // 

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
