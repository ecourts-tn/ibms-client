// const getEnvConfig = () => {
//     const env = process.env.REACT_APP_ENV || 'development';
    
//     const config = {
//       development: {
//         apiUrl: process.env.REACT_APP_DEV_API_URL,
//         featureFlag: process.env.REACT_APP_DEV_FEATURE_FLAG === 'true',
//       },
//       staging: {
//         apiUrl: process.env.REACT_APP_STAGING_API_URL,
//         featureFlag: process.env.REACT_APP_STAGING_FEATURE_FLAG === 'true',
//       },
//       production: {
//         apiUrl: process.env.REACT_APP_PROD_API_URL,
//         featureFlag: process.env.REACT_APP_PROD_FEATURE_FLAG === 'true',
//       },
//     };
  
//     return config[env];
//   };
  
//   export default getEnvConfig();
  

const config = {
  development: {
    apiUrl: "http://117.193.76.243:8088/api/",
    docUrl: "http://117.193.76.243:8088/",
    featureFlag: true,
  },
  staging: {
    apiUrl: "http://192.168.100.155:8000/api/",
    featureFlag: false,
  },
  production: {
    apiUrl: "http://117.193.76.243:8000/api/",
    featureFlag: false,
  },
};

const currentEnv = process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV || "development";

export default config[currentEnv];