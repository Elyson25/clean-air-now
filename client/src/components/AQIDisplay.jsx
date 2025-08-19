// client/src/components/AQIDisplay.jsx
import React from 'react';

const aqiLevels = {
  1: { text: 'Good', color: '#28a745' },
  2: { text: 'Fair', color: '#a3c853' },
  3: { text: 'Moderate', color: '#ffc107' },
  4: { text: 'Poor', color: '#fd7e14' },
  5: { text: 'Very Poor', color: '#dc3545' },
};

const AQIDisplay = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="border border-gray-300 p-5 rounded-lg max-w-lg mx-auto mb-6 bg-white text-center">
        <p>Fetching Air Quality Data...</p>
      </div>
    );
  }

  if (!data || !data.list || data.list.length === 0) {
    return (
        <div className="border border-gray-300 p-5 rounded-lg max-w-lg mx-auto mb-6 bg-white text-center">
          <p>Click the map to check the Air Quality Index for any location.</p>
        </div>
      );
  }

  const aqiData = data.list[0];
  const aqiValue = aqiData.main.aqi;
  const level = aqiLevels[aqiValue] || { text: 'Unknown', color: '#ccc' };
  const components = aqiData.components;

  return (
    <div className="border-2 rounded-lg max-w-lg mx-auto mb-6 bg-white shadow" style={{ borderColor: level.color }}>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-center">Current Air Quality</h3>
        <div className="flex items-center justify-center gap-4 my-3">
          <div className="text-5xl font-bold" style={{ color: level.color }}>
            {aqiValue}
          </div>
          <div className="text-xl">
            <div className="font-bold" style={{ color: level.color }}>{level.text}</div>
            <div>Air Quality Index</div>
          </div>
        </div>
        <hr className="my-2" />
        <h4 className="font-semibold text-center">Main Pollutants (μg/m³)</h4>
        <ul className="list-none p-0 mt-2">
          {Object.entries(components).map(([key, value]) => (
            <li key={key} className="flex justify-between py-1 px-2 odd:bg-gray-50">
              <span>{key.replace('_', '.').toUpperCase()}</span>
              <strong>{value}</strong>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AQIDisplay;