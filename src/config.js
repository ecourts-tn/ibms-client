const config = {
  development: {
    apiUrl: process.env.REACT_APP_API_URL,
    docUrl: process.env.REACT_APP_DOC_URL,
    featureFlag: true,
  },
  staging: {
    apiUrl: process.env.REACT_APP_API_URL,
    featureFlag: false,
  },
  production: {
    apiUrl: process.env.REACT_APP_API_URL,
    featureFlag: false,
  },
};

const currentEnv = process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV || "development";

export default config[currentEnv];