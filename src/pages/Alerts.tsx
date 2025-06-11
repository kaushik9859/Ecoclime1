import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  MessageCircle,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { toast } from '@/hooks/use-toast';

const Alerts = () => {
  const [activeTab, setActiveTab] = useState('alerts');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    {
      id: 1,
      type: 'answer',
      content: "Hello! I'm your AI farming assistant. I can help you with crop management, disease identification, irrigation planning, and answer any agricultural questions you might have. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const messagesEndRef = useRef(null);
  const [apiKey, setApiKey] = useState('');
  const [nextMessageId, setNextMessageId] = useState(2);

  // Mock alerts data - replace with actual data source
  const mockAlerts = [
    {
      id: 1,
      type: 'weather',
      severity: 'high',
      title: 'Heavy Rain Warning',
      description: 'Expected heavy rainfall in the next 24 hours. Protect sensitive crops.',
      timestamp: '2 hours ago',
      icon: Cloud
    },
    {
      id: 2,
      type: 'pest',
      severity: 'medium',
      title: 'Aphid Detection',
      description: 'Increased aphid activity detected in sector 3. Consider organic treatment.',
      timestamp: '5 hours ago',
      icon: Bug
    },
    {
      id: 3,
      type: 'irrigation',
      severity: 'low',
      title: 'Irrigation Schedule',
      description: 'Next irrigation cycle scheduled for tomorrow morning.',
      timestamp: '1 day ago',
      icon: Droplets
    }
  ];

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Fetch API key from environment variables or backend
  useEffect(() => {
    const envKey = import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT;
    if (envKey) {
      setApiKey(envKey);
      return;
    }

    const fetchApiKey = async () => {
      try {
        const res = await fetch('/api/get-gemini-key');
        if (!res.ok) throw new Error('Failed to fetch API key');
        const data = await res.json();
        setApiKey(data.apiKey || '');
      } catch (error) {
        console.error('API key fetch error:', error);
        toast({
          title: "Warning",
          description: "Could not load API key. Some features may not work.",
          variant: "destructive"
        });
      }
    };

    fetchApiKey();
  }, []);

  const generateAnswer = useCallback(async (e) => {
    e?.preventDefault();
    if (!message.trim() || generatingAnswer) return;
    
    setGeneratingAnswer(true);
    const currentQuestion = message.trim();
    setMessage("");
    
    // Add user question to chat
    const userMessage = {
      id: nextMessageId,
      type: 'question',
      content: currentQuestion,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setNextMessageId(prev => prev + 1);
    
    try {
      if (!apiKey) {
        throw new Error("API key not configured. Please check your settings.");
      }

      let response;
      
      // Try direct API first
      try {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `You are an expert farming assistant. Provide detailed, accurate answers to farming-related questions. Keep responses concise but informative. Current question: ${currentQuestion}`
                }]
              }],
              generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
              }
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        
        if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          throw new Error("Unexpected API response format");
        }

        const aiResponse = data.candidates[0].content.parts[0].text;
        
        const botMessage = {
          id: nextMessageId + 1,
          type: 'answer',
          content: aiResponse,
          timestamp: new Date()
        };
        
        setChatHistory(prev => [...prev, botMessage]);
        setNextMessageId(prev => prev + 2);
        return;
        
      } catch (directApiError) {
        console.log("Direct API failed, trying backend:", directApiError);
        
        // Fallback to backend API
        response = await fetch('https://ecoclime-api1.onrender.com/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ message: currentQuestion }),
          // Add timeout for better UX
          signal: AbortSignal.timeout(30000) // 30 second timeout
        });

        if (!response.ok) {
          throw new Error(`Backend API failed with status ${response.status}`);
        }

        const data = await response.json();
        const botResponse = data.response || 'Sorry, I couldn\'t generate a response.';
        
        const botMessage = {
          id: nextMessageId + 1,
          type: 'answer',
          content: botResponse,
          timestamp: new Date()
        };
        
        setChatHistory(prev => [...prev, botMessage]);
        setNextMessageId(prev => prev + 2);
      }
    } catch (error) {
      console.error("Chat error:", error);
      
      let errorMessage = "I apologize, but I'm having trouble accessing farming information right now. ";
      
      if (error.name === 'AbortError') {
        errorMessage += "The request timed out. Please try again.";
      } else if (error.message.includes('API key')) {
        errorMessage += "The service is not properly configured.";
      } else {
        errorMessage += "Please try again later.";
      }
      
      const errorBotMessage = {
        id: nextMessageId + 1,
        type: 'answer',
        content: errorMessage,
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, errorBotMessage]);
      setNextMessageId(prev => prev + 2);
      
      toast({
        title: "Error",
        description: error.message || "Failed to get response from AI assistant",
        variant: "destructive"
      });
    } finally {
      setGeneratingAnswer(false);
    }
  }, [message, generatingAnswer, apiKey, nextMessageId]);

  const handleKeyPress = useCallback((e) => {
    // Allow Shift+Enter for new lines
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default new line behavior
      
      // Only submit if there's a message and not currently generating
      if (message.trim() && !generatingAnswer) {
        generateAnswer(e);
      }
    }
  }, [message, generatingAnswer, generateAnswer]);

  const clearChat = useCallback(() => {
    setChatHistory([
      {
        id: 1,
        type: 'answer',
        content: "Hello! I'm your AI farming assistant. I can help you with crop management, disease identification, irrigation planning, and answer any agricultural questions you might have. How can I assist you today?",
        timestamp: new Date()
      }
    ]);
    setNextMessageId(2);
    setMessage('');
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-600';
      case 'medium': return 'bg-yellow-600';
      case 'low': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (typeof timestamp === 'string') return timestamp;
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen font-sans bg-gradient-to-br from-green-900 via-slate-900 to-emerald-950 text-gray-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Farm Alerts & Assistant</h1>
            <p className="text-gray-400 mt-1">Monitor your farm and get AI-powered assistance</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800 border-gray-700">
            <TabsTrigger value="alerts" className="data-[state=active]:bg-primary">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Alerts
            </TabsTrigger>
            <TabsTrigger value="assistant" className="data-[state=active]:bg-primary">
              <MessageCircle className="w-4 h-4 mr-2" />
              AI Assistant
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-6 mt-6">
            <div className="grid gap-4">
              {mockAlerts.map((alert) => {
                const IconComponent = alert.icon;
                return (
                  <Card key={alert.id} className="bg-gray-900 border-gray-800 text-gray-100 hover:bg-gray-800/50 transition-colors">
                    <CardContent className="flex items-center space-x-4 p-4">
                      <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white">{alert.title}</h3>
                          <div className="flex items-center space-x-2">
                            <Badge variant={alert.severity === 'high' ? 'destructive' : alert.severity === 'medium' ? 'default' : 'secondary'}>
                              {alert.severity}
                            </Badge>
                            <span className="text-sm text-gray-400 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {alert.timestamp}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm mt-1">{alert.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="assistant" className="space-y-6 mt-6">
            <Card className="bg-gray-900 border-gray-800 text-gray-100">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-primary" />
                    <span>AI Farming Assistant</span>
                  </CardTitle>
                  <CardDescription>
                    Ask questions about crop management, pest control, irrigation, and more
                  </CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearChat}
                  className="border-gray-700 hover:bg-gray-800"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Clear Chat
                </Button>
              </CardHeader>
              <CardContent>
                <div className="h-96 overflow-y-auto border border-gray-800 rounded-lg p-4 mb-4 space-y-4 bg-gray-800/50 scroll-smooth">
                  {chatHistory.map((chat) => (
                    <div
                      key={chat.id}
                      className={`flex ${chat.type === 'question' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                          chat.type === 'question'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-gray-800 text-gray-100 border border-gray-700'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {chat.type === 'answer' && <Bot className="w-4 h-4 mt-1 flex-shrink-0 text-primary" />}
                          {chat.type === 'question' && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                          <div className="flex-1">
                            <p className="text-sm whitespace-pre-wrap break-words">{chat.content}</p>
                            <p className="text-xs opacity-70 mt-1">{formatTimestamp(chat.timestamp)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {generatingAnswer && (
                    <div className="flex justify-start">
                      <div className="bg-gray-800 text-gray-100 max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg border border-gray-700">
                        <div className="flex items-center space-x-2">
                          <Bot className="w-4 h-4 text-primary" />
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs text-gray-400">Thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={generateAnswer} className="flex space-x-2">
                  <Textarea
                    placeholder="Ask me about farming, crop diseases, irrigation, pest control..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 min-h-[60px] max-h-32 resize-none bg-gray-800 border-gray-700 text-gray-100 focus:border-primary"
                    disabled={generatingAnswer}
                  />
                  <Button
                    type="submit"
                    disabled={generatingAnswer || !message.trim()}
                    size="lg"
                    className="self-end"
                  >
                    {generatingAnswer ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Alerts;