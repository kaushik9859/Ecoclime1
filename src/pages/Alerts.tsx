// import React, { useState, useRef, useEffect } from 'react';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Cloud, 
  Droplets, 
  Bug, 
  AlertTriangle,
  ChevronRight,
  Clock,
  Send,
  Bot,
  User,
  MessageCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

const Alerts = () => {
  const [activeTab, setActiveTab] = useState('alerts');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m your AI farming assistant. I can help you with crop management, disease identification, irrigation planning, and answer any agricultural questions you might have. How can I assist you today?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch the Gemini API key from backend on mount
  const [apiKey, setApiKey] = useState('');
  useEffect(() => {
    // Replace with your backend endpoint
    fetch('/api/get-gemini-key')
      .then(res => res.json())
      .then(data => setApiKey(data.apiKey || ''))
      .catch(() => setApiKey(''));
  }, []);

  // Fetch recent alerts from backend
  const [todayAlerts, setTodayAlerts] = useState([]);
  const [yesterdayAlerts, setYesterdayAlerts] = useState([]);

  useEffect(() => {
    fetch('/api/alerts/recent')
      .then(res => res.json())
      .then(data => {
        // Expecting data = { today: [...], yesterday: [...] }
        setTodayAlerts(data.today || []);
        setYesterdayAlerts(data.yesterday || []);
      })
      .catch(() => {
        setTodayAlerts([]);
        setYesterdayAlerts([]);
        toast({
          title: "Error",
          description: "Failed to fetch alerts from backend.",
          variant: "destructive"
        });
      });
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="destructive">Active</Badge>;
      case 'resolved': return <Badge variant="secondary">Resolved</Badge>;
      case 'monitoring': return <Badge variant="outline">Monitoring</Badge>;
      default: return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const iconMap: Record<string, React.ElementType> = {
    weather: Cloud,
    irrigation: Droplets,
    disease: Bug,
    pest: Bug,
    // Add more mappings as needed
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    if (!apiKey) {
      toast({
        title: "API Key Error",
        description: "AI assistant is not available. Please try again later.",
        variant: "destructive"
      });
      return;
    }

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: message,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are an expert agricultural AI assistant. Please provide helpful, accurate advice about farming, crop management, pest control, irrigation, disease identification, and other agricultural topics. User question: ${message}`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Gemini API');
      }

      const data = await response.json();
      const botResponse = data.candidates[0]?.content?.parts[0]?.text || 'Sorry, I couldn\'t generate a response.';

      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: botResponse,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      toast({
        title: "Error",
        description: "Failed to get response from AI assistant. Please try again later.",
        variant: "destructive"
      });

      const errorMessage = {
        id: messages.length + 2,
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const AlertCard = ({ alert, index }: { alert: any, index: number }) => {
    const Icon = iconMap[alert.type] || AlertTriangle;
    return (
      <Card 
        key={alert.id} 
        className="agri-card-hover fade-in" 
        style={{ animationDelay: `${index * 0.1}s` }}
      >
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className={`w-12 h-12 ${getSeverityColor(alert.severity)} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-foreground truncate">
                  {alert.title}
                </h3>
                {getStatusBadge(alert.status)}
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                {alert.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  <span>{alert.time}</span>
                </div>
                
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  View Details
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-green-900 via-slate-900 to-emerald-950 text-gray-100">
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
            <h1 className="text-3xl font-bold text-gray-100">Farm Assistant</h1>
            <p className="text-gray-400">Stay informed with alerts and get AI-powered farming guidance</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8">
          <Button
            variant={activeTab === 'alerts' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('alerts')}
            className="flex items-center space-x-2"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Alerts</span>
          </Button>
          <Button
            variant={activeTab === 'chatbot' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('chatbot')}
            className="flex items-center space-x-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>AI Assistant</span>
          </Button>
        </div>

        {activeTab === 'alerts' && (
          <div className="space-y-8">
            {/* Today's Alerts */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-100">Today</h2>
                <Badge variant="outline" className="text-xs">
                  {todayAlerts.length} alerts
                </Badge>
              </div>
              
              <div className="space-y-4">
                {todayAlerts.map((alert, index) => (
                  <AlertCard key={alert.id} alert={alert} index={index} />
                ))}
              </div>
            </div>

            {/* Yesterday's Alerts */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-100">Yesterday</h2>
                <Badge variant="outline" className="text-xs">
                  {yesterdayAlerts.length} alerts
                </Badge>
              </div>
              
              <div className="space-y-4">
                {yesterdayAlerts.map((alert, index) => (
                  <AlertCard key={alert.id} alert={alert} index={index + todayAlerts.length} />
                ))}
              </div>
            </div>

            {/* Alert Settings */}
            <Card className="fade-in bg-gray-900 border-gray-800 text-gray-100" style={{ animationDelay: '0.6s' }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  <span>Alert Preferences</span>
                </CardTitle>
                <CardDescription>
                  Customize when and how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start">
                    Weather Alerts
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Disease Detection
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Irrigation Reminders
                  </Button>
                  <Button variant="outline" className="justify-start">
                    Pest Warnings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'chatbot' && (
          <div className="space-y-6">
            {/* Chat Interface */}
            <Card className="fade-in bg-gray-900 border-gray-800 text-gray-100" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-primary" />
                  <span>AI Farming Assistant</span>
                </CardTitle>
                <CardDescription>
                  Ask questions about crop management, pest control, irrigation, and more
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Messages */}
                <div className="h-96 overflow-y-auto border border-gray-800 rounded-lg p-4 mb-4 space-y-4 bg-gray-800/50">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                          msg.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-gray-800 text-gray-100'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {msg.type === 'bot' && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                          {msg.type === 'user' && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                          <div>
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                            <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-800 text-gray-100 max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Bot className="w-4 h-4" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="flex space-x-2">
                  <Textarea
                    placeholder="Ask me about farming, crop diseases, irrigation, pest control..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 min-h-[60px] resize-none bg-gray-800 border-gray-700 text-gray-100"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !message.trim()}
                    size="lg"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alerts;
