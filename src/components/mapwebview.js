// src/components/MapWebView.js
import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const html = (lat = -12.0464, lng = -77.0428) => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<style>html,body,#map{height:100%;margin:0;padding:0}</style>
</head>
<body>
<div id="map"></div>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<script>
  const map = L.map('map').setView([${lat}, ${lng}], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '' }).addTo(map);
  const marker = L.marker([${lat}, ${lng}]).addTo(map);
  // listen to messages from RN
  document.addEventListener('message', e => {
    try {
      const m = JSON.parse(e.data);
      if (m.type === 'move') {
        marker.setLatLng([m.lat, m.lng]);
        map.panTo([m.lat, m.lng]);
      }
    } catch(err){}
  });
</script>
</body>
</html>
`;

export default function MapWebView({ latitude = -12.0464, longitude = -77.0428, onRef }) {
  const webRef = useRef(null);

  useEffect(() => {
    if (onRef) onRef(webRef);
  }, [onRef]);

  return (
    <View style={styles.container}>
      <WebView
        ref={webRef}
        originWhitelist={['*']}
        source={{ html: html(latitude, longitude) }}
        javaScriptEnabled
        style={styles.web}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, overflow: 'hidden' },
  web: { flex: 1, backgroundColor: 'transparent' },
});
