import React from 'react';
import { WebView } from 'react-native-webview';
import { GOOGLE_MAPS_API_KEY } from '../config'; 

export default function MapWebView({ latitude, longitude, webRefProp }) {
  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <title>Mapa</title>
      <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
      <style>
        html, body, #map { height: 100%; margin: 0; padding: 0; }
      </style>
      <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&callback=initMap" async defer></script>
    </head>
    <body>
      <div id="map"></div>
      <script>
        let map;
        let clienteMarker = null;
        let driverMarker = null;
        let mapReady = false;

        function initMap() {
          map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: ${latitude}, lng: ${longitude} },
            zoom: 14,
          });
          mapReady = true;
        }

        function fitBounds(bounds) {
          const mapBounds = new google.maps.LatLngBounds();
          bounds.forEach(([lat, lng]) => {
            mapBounds.extend(new google.maps.LatLng(lat, lng));
          });
          map.fitBounds(mapBounds);
        }

        function updateMarker(type, lat, lng) {
          const position = new google.maps.LatLng(lat, lng);
          if (type === 'cliente') {
            if (!clienteMarker) {
              clienteMarker = new google.maps.Marker({
                position,
                map,
                label: 'C',
                title: 'Tu ubicación',
              });
            } else {
              clienteMarker.setPosition(position);
            }
          } else if (type === 'move') {
            if (!driverMarker) {
              driverMarker = new google.maps.Marker({
                position,
                map,
                label: 'D',
                title: 'Repartidor',
                icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              });
            } else {
              driverMarker.setPosition(position);
            }
          }
        }

        document.addEventListener('message', (event) => {
          try {
            const data = JSON.parse(event.data);
            if (!mapReady) return;
            if (data.type === 'cliente' || data.type === 'move') {
              updateMarker(data.type, data.lat, data.lng);
            } else if (data.type === 'fit') {
              fitBounds(data.bounds);
            }
          } catch (e) {
            console.error('Error al procesar mensaje:', e);
          }
        });
      </script>
    </body>
  </html>
`;

  return (
    <WebView
      ref={webRefProp}
      originWhitelist={['*']}
      source={{ html: htmlContent }}
      javaScriptEnabled
      domStorageEnabled
      style={{ flex: 1 }}
    />
  );
}