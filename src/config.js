import Constants from 'expo-constants';

// Get the "extra" object defined in app.config.js
const extra = Constants.expoConfig?.extra || {};

// Export them exactly how your screens expect them
export const API_URL = extra.apiUrl || 'http://192.168.1.10:3000/api'; // Your local fallback
export const GOOGLE_MAPS_API_KEY = extra.googleMapsApiKey || '';

if (!extra.apiUrl) {
  console.warn('⚠️ API_URL is missing. Check app.config.js or your EAS secrets.');
}