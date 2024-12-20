const config = {
  development: {
    apiUrl: "http://192.168.100.135:8000/api/",
    docUrl: "http://192.168.100.135:8000/",
    featureFlag: true,
  },
  staging: {
    apiUrl: "http://192.168.100.135:8000/api/",
    featureFlag: false,
  },
  production: {
    apiUrl: "http://192.168.100.135:8000/api/",
    featureFlag: false,
  },
};

const currentEnv = process.env.REACT_APP_ENVIRONMENT || process.env.NODE_ENV || "development";

export default config[currentEnv];