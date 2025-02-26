const config = {
  development: {
    apiUrl: process.env.REACT_APP_API_URL,
    docUrl: process.env.REACT_APP_DOC_URL,
    featureFlag: true,
  },
  staging: {
    apiUrl: "http://192.168.100.155:81/api/v1/",
    featureFlag: false,
  },
  production: {
    apiUrl: "http://192.168.100.155:81/api/v1/",
    featureFlag: false,
  },
};

const currentEnv = process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV || "development";

export default config[currentEnv];