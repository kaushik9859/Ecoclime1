import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { MapPin, Cloud, Droplets, Thermometer, Wind, Leaf, AlertCircle, Search } from 'lucide-react';
import Navbar from '@/components/Navbar';

const API_KEY = '89405827033362524c66fdfdf402b015';

const vegetationImages: Record<string, string> = {
  Excellent: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  Good: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  Fair: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Wheat_field_with_some_dry_patches.jpg",
  Poor: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80",
};

function getVegetationStatus(temp: number, humidity: number, rainfall: number) {
  let score = 75;
  let status = 'Good';
  let recommendation = 'Continue current practices';

  if (temp > 30 || temp < 5) score -= 20;
  if (humidity < 30 || humidity > 90) score -= 15;
  if (rainfall > 50) score -= 10;
  if (rainfall === 0 && humidity < 40) score -= 25;

  if (score >= 80) {
    status = 'Excellent';
    recommendation = 'Optimal growing conditions detected';
  } else if (score >= 60) {
    status = 'Good';
    recommendation = 'Monitor weather conditions';
  } else if (score >= 40) {
    status = 'Fair';
    recommendation = 'Consider irrigation or protective measures';
  } else {
    status = 'Poor';
    recommendation = 'Immediate intervention required';
  }

  return { score: Math.max(0, Math.min(100, score)), status, recommendation };
}

const cropImageMap: Record<string, string> = {
  wheat: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
  rice: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80",
  maize: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  corn: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
  barley: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
  soybean: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
  potato: "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=400&q=80",
  sugarcane: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=400&q=80",
  cotton: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80",
  // Add more as needed
};

type CropDetail = {
  name: string;
  description: string;
  image: string;
};

const fetchCropDetails = (text: string): CropDetail[] => {
  // Try to parse Gemini's response as a list of crops with details
  // Fallback: parse as comma-separated names
  let crops: CropDetail[] = [];
  try {
    // Try to parse as markdown or numbered list
    const lines = text
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)
      .filter(l => /^[0-9\-\*\.]/.test(l) || /^[A-Za-z]/.test(l));
    lines.forEach(line => {
      // e.g. "1. Wheat: Wheat is a staple crop..."
      const match = line.match(/^\d*\.?\s*([A-Za-z\s\-]+)\:?\s*(.*)$/);
      if (match) {
        const name = match[1].trim();
        const desc = match[2]?.trim() || '';
        const img = cropImageMap[name.toLowerCase()] || cropImageMap[name.split(' ')[0].toLowerCase()] || cropImageMap['wheat'];
        crops.push({ name, description: desc, image: img });
      }
    });
    // If nothing parsed, fallback to comma-separated
    if (crops.length === 0) {
      const names = text.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3);
      crops = names.map(name => ({
        name,
        description: '',
        image: cropImageMap[name.toLowerCase()] || cropImageMap[name.split(' ')[0].toLowerCase()] || cropImageMap['wheat'],
      }));
    }
  } catch {
    // fallback
    const names = text.split(',').map(s => s.trim()).filter(Boolean).slice(0, 3);
    crops = names.map(name => ({
      name,
      description: '',
      image: cropImageMap[name.toLowerCase()] || cropImageMap[name.split(' ')[0].toLowerCase()] || cropImageMap['wheat'],
    }));
  }
  return crops;
};

const Dashboard = () => {
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState<any>(null);
  const [vegHealth, setVegHealth] = useState<any>(null);
  const [alert, setAlert] = useState<string | null>(null);
  const [alertReasons, setAlertReasons] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [cropSuggestions, setCropSuggestions] = useState<CropDetail[] | null>(null);
  const [cropLoading, setCropLoading] = useState(false);
  const [cropError, setCropError] = useState<string | null>(null);

  const fetchWeather = async (place: string) => {
    setLoading(true);
    setAlert(null);
    setAlertReasons([]);
    try {
      // Geocode place name to lat/lon
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(place)}&limit=1&appid=${API_KEY}`
      );
      const geoData = await geoRes.json();
      if (!geoData[0]) throw new Error('Location not found');
      const { lat, lon, name, country } = geoData[0];

      // Fetch weather
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const weatherData = await weatherRes.json();
      if (weatherData.cod !== 200) throw new Error('Weather data not available');

      setWeather({
        name: `${name}, ${country}`,
        temperature: Math.round(weatherData.main.temp),
        humidity: weatherData.main.humidity,
        windSpeed: Math.round(weatherData.wind?.speed * 3.6 || 0),
        rainfall: weatherData.rain?.['1h'] || 0,
        description: weatherData.weather[0].description,
      });

      // Vegetation analysis
      const veg = getVegetationStatus(
        weatherData.main.temp,
        weatherData.main.humidity,
        weatherData.rain?.['1h'] || 0
      );
      setVegHealth(veg);

      // Alert logic with reasons
      const reasons: string[] = [];
      if (weatherData.main.temp > 35) reasons.push('Temperature is too high (>35°C)');
      if (weatherData.main.temp < 5) reasons.push('Temperature is too low (<5°C)');
      if (weatherData.main.humidity < 30) reasons.push('Humidity is too low (<30%)');
      if (weatherData.main.humidity > 90) reasons.push('Humidity is too high (>90%)');
      if ((weatherData.rain?.['1h'] || 0) > 50) reasons.push('Heavy rainfall (>50mm/hr)');
      if (veg.status === 'Poor') reasons.push('Vegetation health is poor');

      if (reasons.length > 0) {
        setAlert('⚠️ Hazardous weather or vegetation conditions detected for agriculture!');
        setAlertReasons(reasons);
      } else {
        setAlert('No major alert for your place');
        setAlertReasons([]);
      }
    } catch (err: any) {
      setWeather(null);
      setVegHealth(null);
      setAlert(err.message || 'Failed to fetch data');
      setAlertReasons([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch crop suggestions from your backend API
  const fetchCropsFromBackend = async (location: string) => {
    setCropSuggestions(null);
    setCropError(null);
    setCropLoading(true);
    try {
      const response = await fetch('https://ecoclime-api1.onrender.com/api/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location })
      });
      const data = await response.json();
      console.log('Crop API response:', data); // <-- Add this line
      if (Array.isArray(data.crops)) {
        setCropSuggestions(
          data.crops.map((name: string) => ({
            name,
            description: '',
            image: cropImageMap[name.toLowerCase()] || cropImageMap[name.split(' ')[0].toLowerCase()] || cropImageMap['wheat'],
          }))
        );
      } else {
        setCropSuggestions([]);
      }
    } catch (err) {
      setCropError("Could not fetch crop suggestions.");
    } finally {
      setCropLoading(false);
    }
  };

  // Call fetchCropsFromBackend when weather changes (i.e., when location changes)
  useEffect(() => {
    if (weather && weather.name) {
      fetchCropsFromBackend(weather.name);
    }
    // eslint-disable-next-line
  }, [weather]);

  // POST /api/vegetation (updated to new backend and response structure)
  const postVegetationData = async (location: string) => {
    try {
      const response = await fetch('https://ecoclime-api1.onrender.com/api/vegetation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ location })
      });

      const data = await response.json();
      if (data) {
        setVegHealth({
          score: data.score,
          status: data.status,
          recommendation: data.recommendations // backend returns 'recommendations'
        });
      }
    } catch (err) {
      console.error('Error posting vegetation data:', err);
    }
  };

  // Call postVegetationData when location is fetched
  useEffect(() => {
    if (weather) {
      postVegetationData(weather.name);
    }
  }, [weather]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-gray-100">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card className="mb-6 shadow-xl border-2 border-gray-700 bg-gray-900/90 rounded-2xl">
          <CardHeader>
            <CardTitle className="text-blue-300 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              Choose Location
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter place name (e.g. Mumbai)"
                value={location}
                onChange={e => setLocation(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchWeather(location)}
                className="bg-gray-800 border-gray-700 text-gray-100 rounded-lg placeholder-gray-400"
              />
              <Button onClick={() => fetchWeather(location)} disabled={!location || loading} className="bg-blue-700 hover:bg-blue-800 text-white rounded-lg shadow">
                <Search className="w-4 h-4 mr-1" /> Search
              </Button>
            </div>
            <div className="text-center text-gray-400">or</div>
            <Link to="/maps">
              <Button variant="outline" className="border-green-600 text-green-400 hover:bg-green-900/20 rounded-lg">
                <MapPin className="w-4 h-4 mr-1" /> Select on Map (AI)
              </Button>
            </Link>
          </CardContent>
        </Card>

        {loading && (
          <div className="text-center py-8 text-blue-300 font-semibold animate-pulse">Loading weather data...</div>
        )}

        {weather && (
          <Card className="mb-6 shadow-lg border-green-700 bg-gradient-to-r from-gray-800 via-gray-900 to-green-900/80 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-300">
                <Cloud className="w-5 h-5 text-blue-400" />
                Weather for {weather.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Thermometer className="w-4 h-4 text-red-400" />
                <span>Temperature:</span>
                <span className="font-medium">{weather.temperature}°C</span>
              </div>
              <div className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span>Humidity:</span>
                <span className="font-medium">{weather.humidity}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Wind className="w-4 h-4 text-gray-400" />
                <span>Wind Speed:</span>
                <span className="font-medium">{weather.windSpeed} km/h</span>
              </div>
              <div className="flex items-center space-x-2">
                <Cloud className="w-4 h-4 text-blue-500" />
                <span>Rainfall:</span>
                <span className="font-medium">{weather.rainfall} mm</span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-400">Condition:</span>
                <span className="font-medium capitalize ml-2">{weather.description}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {vegHealth && (
          <Card className="mb-6 shadow-lg border-l-8 border-green-700 bg-gray-900/90 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-300">
                <Leaf className="w-5 h-5 text-green-400" />
                Vegetation Health Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-2">
              <img
                src={vegetationImages[vegHealth.status] || vegetationImages['Good']}
                alt={vegHealth.status}
                className="w-28 h-28 mb-2 rounded-full border-4 border-green-700 shadow-lg object-cover"
                onError={e => (e.currentTarget.src = vegetationImages['Good'])}
              />
              <div className={`font-extrabold text-2xl tracking-wide uppercase ${vegHealth.status === 'Poor' ? 'text-red-400' : vegHealth.status === 'Excellent' ? 'text-green-300' : 'text-yellow-300'}`}>
                {vegHealth.status}
              </div>
              {/* Vegetation Health Score Line */}
              <div className="w-full mt-2">
                <div className="flex items-center justify-between mb-1 text-xs text-gray-400">
                  <span>Score</span>
                  <span>{vegHealth.score}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${vegHealth.score >= 80
                      ? 'bg-green-400'
                      : vegHealth.score >= 60
                        ? 'bg-yellow-400'
                        : vegHealth.score >= 40
                          ? 'bg-orange-400'
                          : 'bg-red-500'
                      }`}
                    style={{ width: `${vegHealth.score}%` }}
                  />
                </div>
              </div>
              <h1>Recommendation from AI:</h1>
              {/* Show recommendations from API */}
              <div className="text-gray-400 mt-2 text-center w-full">
                {Array.isArray(vegHealth.recommendation)
                  ? (
                    <ul className="list-disc list-inside space-y-1">
                      {vegHealth.recommendation.map((rec: string, idx: number) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  )
                  : vegHealth.recommendation
                }
              </div>
              {/* Know More Button */}
              <a
                href="https://vegetationhealthpredictor.streamlit.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4"
              >
                <Button className="bg-green-700 hover:bg-green-800 text-white rounded-lg shadow">
                  Know More
                </Button>
              </a>
            </CardContent>
          </Card>
        )}

        {/* Crop Selection Section (moved above Alerts) */}
        {/*
        {weather && (
          <Card className="mb-6 shadow-lg border-blue-700 bg-gradient-to-r from-gray-800 via-gray-900 to-blue-900/80 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-300">
                <Leaf className="w-5 h-5 text-blue-400" />
                Crop Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 text-gray-400">
                Top 3 crops recommended for current climate and soil:
              </div>
              {cropLoading && (
                <div className="text-blue-300 animate-pulse">Loading crop suggestions...</div>
              )}
              {cropError && (
                <div className="text-red-400">{cropError}</div>
              )}
              {cropSuggestions && cropSuggestions.length > 0 && (
                <ul className="list-disc list-inside space-y-2 text-lg text-blue-200 font-semibold">
                  {cropSuggestions.map((crop, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <img
                        src={crop.image}
                        alt={crop.name}
                        className="w-10 h-10 rounded-lg object-cover border border-blue-700 shadow"
                        onError={e => (e.currentTarget.src = cropImageMap['wheat'])}
                      />
                      <span className="font-bold text-blue-100">{crop.name}</span>
                    </li>
                  ))}
                </ul>
              )}
              {!cropLoading && !cropError && (!cropSuggestions || cropSuggestions.length === 0) && (
                <div className="text-gray-400">No suggestions available.</div>
              )}
            </CardContent>
          </Card>
        )}
        */}

        {/* Alerts Section (now below crop selection) */}
        {alert && (
          <Card className={`shadow-lg ${alert.startsWith('⚠️') ? 'border-red-700 bg-red-900/80' : 'border-green-700 bg-green-900/80'} rounded-2xl`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className={`w-5 h-5 ${alert.startsWith('⚠️') ? 'text-red-400' : 'text-green-400'}`} />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={alert.startsWith('⚠️') ? 'text-red-300 font-semibold whitespace-pre-line' : 'text-green-300'}>
                {alert}
                {alertReasons.length > 0 && (
                  <ul className="mt-2 text-sm text-red-300 list-disc list-inside">
                    {alertReasons.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
