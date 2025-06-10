import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Search, 
  MapPin, 
  Cloud,
  Droplets,
  Wind,
  Thermometer,
  Leaf,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface LocationData {
  lat: number;
  lng: number;
  name: string;
  weather: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    rainfall: number;
    description: string;
  };
  vegetationHealth: {
    score: number;
    status: string;
    recommendation: string;
  };
}

const Maps = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [apiKey] = useState('89405827033362524c66fdfdf402b015');
  const [showApiKeyInput] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([20.5937, 78.9629]); // Centered at India

  const MapClickHandler = () => {
    const map = useMapEvents({
      click: async (e) => {
        const { lat, lng } = e.latlng;
        await handleLocationSelect(lat, lng);
      },
    });
    return null;
  };

  const handleLocationSelect = async (lat: number, lng: number) => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your OpenWeatherMap API key to get location data.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Get location name using reverse geocoding
      const geocodeResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${apiKey}`
      );
      const geocodeData = await geocodeResponse.json();
      
      if (!geocodeData || geocodeData.length === 0) {
        throw new Error('Location not found');
      }

      const locationName = `${geocodeData[0].name}, ${geocodeData[0].country}`;

      // Get weather data
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`
      );
      const weatherData = await weatherResponse.json();

      if (weatherData.cod !== 200) {
        throw new Error('Weather data not available');
      }

      // Simulate vegetation health analysis (in real app, this would call your AI backend)
      const vegetationHealth = await simulateVegetationAnalysis(lat, lng, weatherData);

      const locationData: LocationData = {
        lat,
        lng,
        name: locationName,
        weather: {
          temperature: Math.round(weatherData.main.temp),
          humidity: weatherData.main.humidity,
          windSpeed: Math.round(weatherData.wind?.speed * 3.6 || 0), // Convert m/s to km/h
          rainfall: weatherData.rain?.['1h'] || 0,
          description: weatherData.weather[0].description
        },
        vegetationHealth
      };

      setSelectedLocation(locationData);
      toast({
        title: "Location Selected",
        description: `Data loaded for ${locationName}`,
      });

    } catch (error) {
      console.error('Error fetching location data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch location data. Please check your API key.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const simulateVegetationAnalysis = async (lat: number, lng: number, weatherData: any) => {
    // Simulate AI vegetation health analysis based on weather conditions
    const temp = weatherData.main.temp;
    const humidity = weatherData.main.humidity;
    const rainfall = weatherData.rain?.['1h'] || 0;

    let score = 75; // Base score
    let status = 'Good';
    let recommendation = 'Continue current practices';

    // Adjust score based on conditions
    if (temp > 30 || temp < 5) score -= 20;
    if (humidity < 30 || humidity > 90) score -= 15;
    if (rainfall > 50) score -= 10;
    if (rainfall === 0 && humidity < 40) score -= 25;

    // Determine status and recommendation
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
  };

  const getVegetationColor = (score: number) => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-yellow-500';
    if (score >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-slate-900 to-emerald-950 text-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Interactive Farm Map</h1>
            <p className="text-gray-400">Click anywhere on the map to get location data and vegetation analysis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="fade-in bg-gray-900 border-gray-800 text-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <span>Interactive Map</span>
                </CardTitle>
                <CardDescription className="text-gray-400">Click anywhere to analyze location and vegetation health</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 rounded-lg overflow-hidden border border-gray-800">
                  <MapContainer 
                    center={mapCenter} 
                    zoom={10} 
                    style={{ height: '100%', width: '100%' }}
                    key="map-container"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapClickHandler />
                    {selectedLocation && (
                      <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-semibold">{selectedLocation.name}</h3>
                            <p className="text-sm text-gray-400">
                              {selectedLocation.weather.description}
                            </p>
                          </div>
                        </Popup>
                      </Marker>
                    )}
                  </MapContainer>
                </div>
                {loading && (
                  <div className="flex items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    <span className="ml-2 text-sm text-gray-400">Analyzing location...</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Location Data */}
          <div className="space-y-6">
            {selectedLocation ? (
              <>
                {/* Location Info */}
                <Card className="fade-in bg-gray-900 border-gray-800 text-gray-100">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      <span>Selected Location</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="font-medium text-gray-100">{selectedLocation.name}</p>
                    <p className="text-sm text-gray-400">
                      {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                    </p>
                  </CardContent>
                </Card>

                {/* Weather Data */}
                <Card className="fade-in bg-gray-900 border-gray-800 text-gray-100" style={{ animationDelay: '0.1s' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Cloud className="w-5 h-5 text-blue-500" />
                      <span>Weather Conditions</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Thermometer className="w-4 h-4 text-red-500" />
                        <div>
                          <p className="text-sm text-gray-400">Temperature</p>
                          <p className="font-medium">{selectedLocation.weather.temperature}°C</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-sm text-gray-400">Humidity</p>
                          <p className="font-medium">{selectedLocation.weather.humidity}%</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Wind className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-400">Wind Speed</p>
                          <p className="font-medium">{selectedLocation.weather.windSpeed} km/h</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Cloud className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="text-sm text-gray-400">Rainfall</p>
                          <p className="font-medium">{selectedLocation.weather.rainfall} mm</p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-gray-800">
                      <p className="text-sm text-gray-400">Condition</p>
                      <p className="font-medium capitalize">{selectedLocation.weather.description}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Vegetation Health */}
                <Card className="fade-in bg-gray-900 border-gray-800 text-gray-100" style={{ animationDelay: '0.2s' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Leaf className="w-5 h-5 text-green-500" />
                      <span>Vegetation Health</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Health Score</span>
                      <Badge 
                        variant="outline" 
                        className={`${getVegetationColor(selectedLocation.vegetationHealth.score)}`}
                      >
                        {selectedLocation.vegetationHealth.score}/100
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${selectedLocation.vegetationHealth.score}%` }}
                      ></div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Status</p>
                      <p className={`font-medium ${getVegetationColor(selectedLocation.vegetationHealth.score)}`}>
                        {selectedLocation.vegetationHealth.status}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <AlertCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">AI Recommendation</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {selectedLocation.vegetationHealth.recommendation}
                          </p>
                          <a
                            href="https://vegetationhealthpredictor.streamlit.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block mt-3"
                          >
                            <Button className="bg-green-700 hover:bg-green-800 text-white rounded-lg shadow text-xs px-4 py-1">
                              Know More
                            </Button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="fade-in bg-gray-900 border-gray-800 text-gray-100">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                  <MapPin className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-100 mb-2">Select a Location</h3>
                  <p className="text-sm text-gray-400">
                    Click anywhere on the map to get detailed weather data and AI-powered vegetation health analysis
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maps;
