import 'dotenv/config'; // Loads .env file variables for local development

export default ({ config }) => {
  return {
    ...config, // Inherits basic config (name, slug, version) from app.json if it exists
    android: {
      ...config.android,
      config: {
        ...config.android?.config,
        googleMaps: {
          // Injects key into AndroidManifest.xml for native map rendering
          apiKey: process.env.GOOGLE_MAPS_API_KEY, 
        },
      },
    },
    ios: {
      ...config.ios,
      config: {
        ...config.ios?.config,
        // Injects key into Info.plist for native map rendering
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY, 
      },
    },
    extra: {
      ...config.extra,
      // Exposes these variables to your JS code (Constants.expoConfig.extra)
      apiUrl: process.env.API_URL,
      googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY,
      // specific to EAS
      eas: {
        projectId: config.extra?.eas?.projectId || "a441c0e1-8ed7-4675-95c5-71209314e12f",
      },
    },
  };
};