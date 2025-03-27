const config = {
  development: {
    apiUrl: "http://192.168.100.155:81/api/v1/",
    docUrl: "http://192.168.100.155:81/",
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