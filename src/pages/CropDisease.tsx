import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Camera, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';

const CropDisease = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = () => {
    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        disease: 'Late Blight',
        confidence: 89,
        severity: 'Moderate',
        treatment: 'Apply copper-based fungicide immediately. Remove affected leaves and improve air circulation.',
        prevention: 'Ensure proper spacing between plants, avoid overhead watering, and monitor humidity levels.'
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-green-900 via-slate-900 to-emerald-950 text-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-100">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Crop Disease Detection</h1>
            <p className="text-gray-400">Capture or upload an image of your crop to detect potential diseases</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <Card className="fade-in bg-gray-900 border-gray-800 text-gray-100">
            <CardHeader>
              <CardTitle>Upload Crop Image</CardTitle>
              <CardDescription>
                Capture or upload an image of your crop to detect potential diseases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {!uploadedImage ? (
                  <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-primary transition-colors">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-100">Drag and drop or browse</h3>
                        <p className="text-sm text-gray-400">Upload an image of your crop</p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload">
                        <Button variant="secondary" className="cursor-pointer">
                          Upload Image
                        </Button>
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="relative">
                      <img
                        src={uploadedImage}
                        alt="Uploaded crop"
                        className="w-full h-64 object-cover rounded-lg border border-gray-700"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setUploadedImage(null);
                          setAnalysisResult(null);
                        }}
                      >
                        Remove
                      </Button>
                    </div>

                    {!analysisResult && !isAnalyzing && (
                      <Button
                        onClick={analyzeImage}
                        className="w-full bg-primary hover:bg-primary/90"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Analyze Image
                      </Button>
                    )}

                    {isAnalyzing && (
                      <div className="flex items-center justify-center py-8">
                        <div className="flex flex-col items-center space-y-4">
                          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-sm text-gray-400">Analyzing image...</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="fade-in bg-gray-900 border-gray-800 text-gray-100" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                AI-powered disease detection and treatment recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!analysisResult ? (
                <div className="flex items-center justify-center py-12 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto">
                      <AlertCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-100">No Analysis Yet</h3>
                      <p className="text-sm text-gray-400">
                        Upload an image to get started with disease detection
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Disease Detection */}
                  <div className="p-4 border border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-100">Disease Detected</h3>
                        <p className="text-sm text-gray-400">
                          {analysisResult.confidence}% confidence
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-lg font-medium text-gray-100">{analysisResult.disease}</p>
                      <p className="text-sm text-orange-400">
                        Severity: <span className="font-medium">{analysisResult.severity}</span>
                      </p>
                    </div>
                  </div>

                  {/* Treatment */}
                  <div className="p-4 border border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-100">Recommended Treatment</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {analysisResult.treatment}
                    </p>
                  </div>

                  {/* Prevention */}
                  <div className="p-4 border border-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-100">Prevention Tips</h3>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {analysisResult.prevention}
                    </p>
                  </div>

                  <Button className="w-full" variant="outline">
                    Save Analysis Report
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CropDisease;
