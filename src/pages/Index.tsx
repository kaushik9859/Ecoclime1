import React from 'react';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Leaf,
  Tractor,
  BarChart3,
  Shield,
  Droplets,
  Zap,
  Users,
  Star,
  ArrowRight,
  CheckCircle,
  MapPin,
  Camera,
  Bell
} from 'lucide-react';

// For a modern dark look, use a deep blue/green/gray gradient, soft highlights, and a clean sans-serif font.

const Index = () => {
  const features = [
    {
      icon: Tractor,
      title: 'Precision Agriculture',
      description: 'Leverage real-time data and AI for optimized resource management and enhanced crop vitality.',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      icon: Shield,
      title: 'Optimize Resources',
      description: 'Minimize waste and cut costs by applying inputs precisely when and where they are needed most.',
      image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    },
    {
      icon: BarChart3,
      title: 'Increase Yields',
      description: 'Make data-driven decisions to elevate productivity and harvest quality sustainably.',
      image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
    }
  ];

  const platformFeatures = [
    {
      icon: Zap,
      title: 'Smart Sensing',
      description: 'Real-time soil moisture, nutrient levels, and temperature data'
    },
    {
      icon: Camera,
      title: 'AI Crop Monitoring',
      description: 'Advanced health diagnostics with satellite and drone imagery'
    },
    {
      icon: MapPin,
      title: 'Hyperlocal Weather',
      description: 'Personalized, field-specific 7-day forecasts and alerts'
    },
    {
      icon: Droplets,
      title: 'Automated Irrigation',
      description: 'Intelligent scheduling for optimal water usage'
    }
  ];

  const testimonials = [
    {
      name: 'Maria Rodriguez',
      role: 'Organic Farmer, Spain',
      content: 'EcoClime has truly transformed my farming. The data is invaluable, and I\'ve seen a remarkable increase in my crop yields.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'David Chen',
      role: 'Vineyard Owner, Australia',
      content: 'The precision irrigation feature is a game-changer. Saved me countless hours and significantly reduced water costs. Highly recommended!',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    },
    {
      name: 'Aisha Kone',
      role: 'Agricultural Consultant, Mali',
      content: 'Predictive analytics and powerful analytics. EcoClime is indispensable for any forward-thinking agricultural professional.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80'
    }
  ];

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-green-900 via-slate-900 to-emerald-950 text-gray-100">
      {/* Navigation */}
      
      <Navbar />
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="space-y-8 fade-in">
            <Badge variant="outline" className="text-sm px-4 py-2 border-gray-700 text-gray-200 bg-gray-800">
              🌱 AI-Powered Precision Agriculture
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-100 leading-tight">
              Empowering Your Farm,<br />
              <span className="text-primary">Nurturing Our Earth</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              EcoClime delivers AI-powered precision agriculture tools for sustainable farming.
              Optimize resources, boost yields, and cultivate a healthier planet.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link to="/login">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg">
                  Start Your Green Revolution
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/70">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              The EcoClime Advantage
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Transform your agricultural practices with cutting-edge technology and sustainable insights
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="agri-card-hover slide-up bg-gray-900 border-gray-800 text-gray-100" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <Badge variant="outline" className="mb-4 border-gray-700 text-gray-200 bg-gray-800">Holistic Farm Management Platform</Badge>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-6">
                  Holistic Farm Management Platform
                </h2>
                <p className="text-lg text-gray-400 leading-relaxed">
                  EcoClime offers a comprehensive suite of intelligent tools. From soil analysis to automated
                  irrigation and pest prediction, we empower you with actionable insights for superior farm performance.
                </p>
              </div>
              <div className="space-y-6">
                {platformFeatures.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4 fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-100 mb-2">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button
                asChild
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Link to="/dashboard">
                  Explore Features
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary/20 to-gray-800 rounded-2xl p-8 relative overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Farm management dashboard"
                  className="w-full rounded-lg shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full"></div>
                <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/5 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-800/70">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-100 mb-4">
              Voices From the Field
            </h2>
            <p className="text-xl text-gray-400">
              Hear from farmers who are transforming their operations with EcoClime
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="agri-card-hover slide-up bg-gray-900 border-gray-800 text-gray-100" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-400 mb-6 italic">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-3">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-100">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/40 via-gray-800 to-primary/10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Cultivate Success?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join a growing community of farmers embracing smart agriculture with EcoClime.
            Enhance efficiency, promote sustainability, and unlock your farm's full potential. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Link to="/login">
              <Button
                size="lg"
                variant="secondary"
                className="px-8 py-3 text-lg bg-green-600 hover:bg-green-700 text-white border-none"
              >
                Begin Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-gray-100">EcoClime</span>
              </div>
              <p className="text-gray-400">
                Cultivating a Greener Future.
              </p>
              <p className="text-sm text-gray-400">
                © 2024 EcoClime. Cultivating a Greener Future.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-100 mb-4">Solutions</h3>
              <div className="space-y-2">
                <Link to="#" className="block text-gray-400 hover:text-gray-100 transition-colors">Precision Farming</Link>
                <Link to="#" className="block text-gray-400 hover:text-gray-100 transition-colors">Crop Management</Link>
                <Link to="#" className="block text-gray-400 hover:text-gray-100 transition-colors">Data Analytics</Link>
                <Link to="#" className="block text-gray-400 hover:text-gray-100 transition-colors">Sustainability Tools</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-100 mb-4">Support</h3>
              <div className="space-y-2">
                <Link to="#" className="block text-gray-400 hover:text-gray-100 transition-colors">Pricing Plans</Link>
                <Link to="#" className="block text-gray-400 hover:text-gray-100 transition-colors">Documentation</Link>
                <Link to="#" className="block text-gray-400 hover:text-gray-100 transition-colors">Tutorials & Guides</Link>
                <Link to="#" className="block text-gray-400 hover:text-gray-100 transition-colors">API Status</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-100 mb-4">Company</h3>
              <div className="space-y-2">
                <Link to="#" className="block text-gray-400 hover:text-gray-100 transition-colors">About Us</Link>
                <Link to="#" className="block text-gray-400 hover:text-gray-100 transition-colors">Our Blog</Link>
                <Link to="#" className="block text-gray-400 hover:text-gray-100 transition-colors">Careers</Link>
                <Link to="#" className="block text-gray-400 hover:text-gray-100 transition-colors">Media Stories</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
