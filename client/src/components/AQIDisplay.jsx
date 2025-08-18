import React from 'react';

const aqiLevels = {
  1: { text: 'Good', color: 'text-green-500', borderColor: 'border-green-500' },
  2: { text: 'Fair', color: 'text-yellow-500', borderColor: 'border-yellow-500' },
  3: { text: 'Moderate', color: 'text-orange-500', borderColor: 'border-orange-500' },
  4: { text: 'Poor', color: 'text-red-500', borderColor: 'border-red-500' },
  5: { text: 'Very Poor', color: 'text-purple-700', borderColor: 'border-purple-700' },
};

const AQIDisplay = ({ data }) => {
  if (!data || !data.list || data.list.length === 0) {
    return null; // Don't render if no data
  }

  const aqiData = data.list[0];
  const aqiValue = aqiData.main.aqi;
  const level = aqiLevels[aqiValue] || { text: 'Unknown', color: 'text-gray-500' };
  const components = aqiData.components;

  return (
    <div className={`bg-white p-6 rounded-lg shadow-md border-2 ${level.borderColor}`}>
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Current Air Quality</h3>
      <div className="flex items-center justify-center gap-4">
        <div className={`text-6xl font-bold ${level.color}`}>
          {aqiValue}
        </div>
        <div className="text-lg">
          <div className={`font-bold ${level.color}`}>{level.text}</div>
          <div className="text-gray-500">Air Quality Index</div>
        </div>
      </div>
      <hr className="my-4" />
      <h4 className="font-bold text-gray-700 mb-2">Main Pollutants (μg/m³)</h4>
      <ul className="space-y-2">
        {Object.entries(components).map(([key, value]) => (
          <li key={key} className="flex justify-between items-center text-gray-600">
            <span className="font-mono text-sm">{key.replace('_', '.').toUpperCase()}</span>
            <strong className="text-gray-800">{value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AQIDisplay;