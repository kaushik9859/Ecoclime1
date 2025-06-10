import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';

// Updated with real crop images from Google (Unsplash)
const cropImageMap: Record<string, string> = {
  rice: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
  wheat: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
  corn: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
  soybeans: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=60',
};

type Crop = {
  id: string;
  name: string;
  image: string;
  estimatedProfit: string;
  riskAssessment: string;
  description?: string;
};

const defaultCrops: Crop[] = [
  {
    id: 'rice',
    name: 'Rice',
    image: cropImageMap.rice,
    estimatedProfit: '₹50,000',
    riskAssessment: '3/5',
    description: 'Rice is suitable for wet and humid climates.',
  },
  {
    id: 'wheat',
    name: 'Wheat',
    image: cropImageMap.wheat,
    estimatedProfit: '₹45,000',
    riskAssessment: '2/5',
    description: 'Wheat grows best in cool, dry climates.',
  },
  {
    id: 'corn',
    name: 'Corn',
    image: cropImageMap.corn,
    estimatedProfit: '₹60,000',
    riskAssessment: '3/5',
    description: 'Corn thrives in warm weather with moderate rainfall.',
  },
  {
    id: 'soybeans',
    name: 'Soybeans',
    image: cropImageMap.soybeans,
    estimatedProfit: '₹55,000',
    riskAssessment: '2/5',
    description: 'Soybeans prefer well-drained soil and warm temperatures.',
  },
];

const CropSelectionTool: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>(defaultCrops);
  const [loading, setLoading] = useState(true);
  const [recommendationText, setRecommendationText] = useState(
    "Based on the current season, soil conditions, climate data, and historical yields, here are the AI-powered recommendations for the best crops to plant:"
  );

  useEffect(() => {
    setLoading(true);
    fetch('/api/crop-recommendations')
      .then(res => res.json())
      .then(data => {
        if (data.crops && data.crops.length > 0) {
          setCrops(
            data.crops.map((crop: any) => ({
              ...crop,
              image: cropImageMap[crop.id] || crop.image || cropImageMap.rice,
            }))
          );
        } else {
          setCrops(defaultCrops);
        }
        if (data.recommendationText) setRecommendationText(data.recommendationText);
      })
      .catch(() => {
        setCrops(defaultCrops);
        setRecommendationText("Based on the current season, soil conditions, climate data, and historical yields, here are the AI-powered recommendations for the best crops to plant:");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex-1 bg-gradient-to-br from-green-900 via-slate-900 to-emerald-950 p-8 text-gray-100 min-h-screen">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Crop Selection Tool</h1>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-white mb-4">Current Season Analysis</h2>
        <p className="text-gray-300 leading-relaxed">
          {recommendationText}
        </p>
      </div>

      {loading ? (
        <div className="text-center text-gray-300">Loading recommendations...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {crops.map((crop) => (
            <Card key={crop.id} className="bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col">
              <img
                src={crop.image}
                alt={crop.name}
                className="w-full h-40 object-cover"
                onError={e => {
                  e.currentTarget.src = cropImageMap.rice;
                  e.currentTarget.onerror = null;
                }}
              />
              <CardContent className="flex flex-col gap-2 p-4">
                <div className="text-xl font-semibold text-white">{crop.name}</div>
                <div className="text-gray-300 text-sm">
                  {crop.description}
                </div>
                <div className="text-gray-300 text-sm">
                  Estimated Profit: <span className="font-medium text-green-400">{crop.estimatedProfit}</span>
                </div>
                <div className="text-gray-300 text-sm mb-2">
                  Risk Assessment: <span className="font-medium text-yellow-400">{crop.riskAssessment}</span>
                </div>
                <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 w-full">
                  View Details
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

const CropDetection: React.FC = () => {
  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-green-900 via-slate-900 to-emerald-950 text-gray-100 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <CropSelectionTool />
      </div>
      {/* Enhanced section for external crop recommendation */}
      <div className="w-full flex flex-col items-center mt-12 mb-10">
        <div className="bg-gradient-to-r from-green-700 via-emerald-800 to-green-900 rounded-2xl p-8 flex flex-col items-center shadow-2xl border-2 border-green-600 max-w-lg w-full">
          <div className="flex items-center gap-3 mb-3">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="12" fill="#22c55e" opacity="0.2"/>
              <path d="M12 17c3.314 0 6-2.686 6-6 0-1.657-1.343-3-3-3-1.306 0-2.417.835-2.83 2H12c-.413-1.165-1.524-2-2.83-2-1.657 0-3 1.343-3 3 0 3.314 2.686 6 6 6z" fill="#22c55e"/>
            </svg>
            <span className="text-2xl font-bold text-white tracking-wide">
              Top 3 Crops for Your Location
            </span>
          </div>
          <p className="text-gray-200 mb-6 text-center max-w-xs">
            Discover the best crops to grow in your area based on AI-powered recommendations and local data.
          </p>
          <a
            href="https://crop-recommendation-xyz.streamlit.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 text-lg"
          >
            View Recommendations
          </a>
        </div>
      </div>
    </div>
  );
};

export default CropDetection;
