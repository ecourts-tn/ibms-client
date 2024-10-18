import React, { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageContext = createContext();
    
export const LanguageProvider = ({ children }) => {

  const { t, i18n } = useTranslation();
  
  const [language, setLanguage] = useState('en'); 

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ta' : 'en'; 
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage); 
  };


  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
  }, [language]);


  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
