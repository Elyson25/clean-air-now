import React from 'react';
import { WMSTileLayer } from 'react-leaflet';

const NasaLayer = () => {
  // This is the specific layer name for Aerosol Optical Depth from the MODIS Terra satellite.
  // It is a good visual indicator of particulates ike smoke and dust in the atmosphere.
  const layerName = 'MODIS_Terra_Aerosol';
  
  // NASA's GIBS service URL for WMS (Web Map Service) layers.
  const nasaGIBsUrl = 'https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi';

  // We get the current date to show the most recent satellite imagery.
  // GIBS data is often for the previous day.
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const formattedDate = yesterday.toISOString().split('T')[0]; // Format as YYYY-MM-DD

  return (
    <WMSTileLayer
      url={nasaGIBsUrl}
      params={{
        layers: layerName,
        format: 'image/png',
        transparent: true,
        time: formattedDate, // Request the imagery for this specific date
      }}
      opacity={0.75} // Make the layer semi-transparent to see the map underneath
      attribution='&copy; NASA GIBS'
    />
  );
};

export default NasaLayer;