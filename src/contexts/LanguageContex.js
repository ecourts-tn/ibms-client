// import React, { createContext, useState, useEffect } from 'react';
// import { useTranslation } from 'react-i18next';

// export const LanguageContext = createContext();
    
// export const LanguageProvider = ({ children }) => {

//   const { t, i18n } = useTranslation();
  
//   const [language, setLanguage] = useState('en'); 

//   const toggleLanguage = () => {
//     const newLanguage = language === 'en' ? 'ta' : 'en'; 
//     setLanguage(newLanguage);
//     i18n.changeLanguage(newLanguage); 
//   };


//   useEffect(() => {
//     document.documentElement.setAttribute('lang', language);
//   }, [language]);


//   return (
//     <LanguageContext.Provider value={{ language, toggleLanguage }}>
//       {children}
//     </LanguageContext.Provider>
//   );
// };


import React, { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation();

  // Retrieve the language from session storage or default to 'en'
  const [language, setLanguage] = useState(() => {
    const storedLanguage = sessionStorage.getItem('language');
    return storedLanguage ? storedLanguage : 'ta';
  });

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ta' : 'en';
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
    sessionStorage.setItem('language', newLanguage); // Store the language in session storage
  };

  useEffect(() => {
    document.documentElement.setAttribute('lang', language);
    // Save the current language in session storage when it changes
    sessionStorage.setItem('language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

