import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Eye, EyeOff, MapPin } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Helper function for reverse geocoding using OpenStreetMap Nominatim API
async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
    );
    const data = await res.json();
    // Try to build a more precise address
    const address = data.address || {};
    const parts = [
      address.house_number,
      address.road,
      address.neighbourhood,
      address.suburb,
      address.city,
      address.town,
      address.village,
      address.state,
      address.country,
      address.postcode,
    ].filter(Boolean);
    return parts.length > 0
      ? parts.join(', ')
      : data.display_name ||
        address.city ||
        address.state ||
        address.country ||
        `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  } catch {
    return `${lat.toFixed(5)}, ${lon.toFixed(5)}`;
  }
}

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState('');
  const [locating, setLocating] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in to AgriTech",
      });
      navigate('/dashboard');
    }, 2000);
  };

  // Handler for "Select My Location" button
  const handleSelectMyLocation = () => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const place = await reverseGeocode(lat, lon);
          setLocation(place);
          setLocating(false);
          toast({
            title: "Location detected!",
            description: place,
          });
        },
        () => {
          toast({
            title: "Location permission denied",
            description: "Unable to access your location.",
            variant: "destructive",
          });
          setLocating(false);
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation.",
        variant: "destructive",
      });
      setLocating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-slate-900 to-emerald-950 p-4 relative">
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234ade80' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <Card className="w-full max-w-md bg-gray-900/95 backdrop-blur-lg border-gray-800 shadow-2xl animate-scale-in">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center pulse-green">
            <Leaf className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-100">Welcome Back</CardTitle>
          <CardDescription className="text-gray-400">
            Sign in to your AgriTech account to continue managing your farm
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-100">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="farmer@agritech.com"
                required
                className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-100">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:border-primary pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {/* Location Input */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-gray-100">Location</Label>
              <div className="flex gap-2">
                <Input
                  id="location"
                  type="text"
                  placeholder="Enter your location"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400 focus:border-primary"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="text-primary border-primary flex items-center gap-1"
                  onClick={handleSelectMyLocation}
                  disabled={locating}
                >
                  <MapPin className="w-4 h-4" />
                  {locating ? "Locating..." : "Select My Location"}
                </Button>
              </div>
              <span className="text-xs text-gray-400">You can type your location or use your device location.</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="remember" className="rounded border-gray-700 bg-gray-800" />
                <Label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer">
                  Remember me
                </Label>
              </div>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </Button>
            
            <p className="text-center text-sm text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/dashboard"
                className="text-primary hover:underline font-medium"
              >
                Sign up for free
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Register;