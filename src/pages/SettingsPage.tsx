import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  Wallet,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  User,
  Shield,
  Key,
  Smartphone,
  Mail,
  Monitor,
  Volume2,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Trash2,
  Download,
  Lock,
  HelpCircle,
  FileText,
  Database
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { toast } from 'sonner';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import Sidebar from '../components/layout/Sidebar';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface ApiKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  createdAt: Date;
  lastUsed: Date;
  isActive: boolean;
}

interface NotificationPreference {
  id: string;
  name: string;
  description: string;
  email: boolean;
  push: boolean;
  sms: boolean;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'markets', label: 'Markets', icon: TrendingUp },
  { id: 'portfolio', label: 'Portfolio', icon: Wallet },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const mockApiKeys: ApiKey[] = [
  {
    id: '1',
    name: 'Trading Bot API',
    key: 'sk_live_4242424242424242',
    permissions: ['read', 'trade'],
    createdAt: new Date('2024-01-15'),
    lastUsed: new Date('2024-03-10'),
    isActive: true
  },
  {
    id: '2',
    name: 'Portfolio Tracker',
    key: 'sk_live_1818181818181818',
    permissions: ['read'],
    createdAt: new Date('2024-02-20'),
    lastUsed: new Date('2024-03-14'),
    isActive: true
  }
];

const mockNotifications: NotificationPreference[] = [
  {
    id: 'price_alerts',
    name: 'Price Alerts',
    description: 'Get notified when assets hit your target prices',
    email: true,
    push: true,
    sms: false
  },
  {
    id: 'trade_executed',
    name: 'Trade Executed',
    description: 'Notifications when your orders are filled',
    email: true,
    push: true,
    sms: true
  },
  {
    id: 'market_news',
    name: 'Market News',
    description: 'Daily market updates and news digest',
    email: true,
    push: false,
    sms: false
  },
  {
    id: 'security_alerts',
    name: 'Security Alerts',
    description: 'Important security notifications and login attempts',
    email: true,
    push: true,
    sms: true
  }
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [activeTab, setActiveTab] = useState('settings');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Profile Settings
  const [profileData, setProfileData] = useState({
    firstName: user?.name?.split(' ')[0] || 'John',
    lastName: user?.name?.split(' ')[1] || 'Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    timezone: 'UTC-5',
    language: 'English'
  });

  // Trading Preferences
  const [tradingPreferences, setTradingPreferences] = useState({
    defaultOrderType: 'market',
    slippageTolerance: 0.5,
    confirmOrders: true,
    showAdvancedChart: true,
    autoRefreshPrices: true,
    refreshInterval: 5
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailVerification: true,
    smsVerification: false,
    sessionTimeout: 30,
    loginNotifications: true
  });

  // Display Settings
  const [displaySettings, setDisplaySettings] = useState({
    theme: 'dark',
    language: 'English',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    numberFormat: '1,234.56',
    animationsEnabled: true
  });

  // Notification Settings
  const [notifications, setNotifications] = useState(mockNotifications);

  // API Keys
  const [apiKeys, setApiKeys] = useState(mockApiKeys);
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({});

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const saveProfile = () => {
    toast.success('Profile updated successfully');
  };

  const saveTradingPreferences = () => {
    toast.success('Trading preferences saved');
  };

  const saveSecuritySettings = () => {
    toast.success('Security settings updated');
  };

  const saveDisplaySettings = () => {
    toast.success('Display settings saved');
  };

  const updateNotification = (id: string, type: 'email' | 'push' | 'sms', value: boolean) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === id ? { ...notif, [type]: value } : notif
    ));
    toast.success('Notification preferences updated');
  };

  const generateApiKey = () => {
    const newKey: ApiKey = {
      id: Date.now().toString(),
      name: `New API Key ${apiKeys.length + 1}`,
      key: `sk_live_${Math.random().toString(36).substr(2, 16)}`,
      permissions: ['read'],
      createdAt: new Date(),
      lastUsed: new Date(),
      isActive: true
    };
    setApiKeys(prev => [...prev, newKey]);
    toast.success('New API key generated');
  };

  const revokeApiKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
    toast.success('API key revoked');
  };

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast.success('API key copied to clipboard');
  };

  const toggleApiKeyVisibility = (id: string) => {
    setShowApiKey(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex h-screen bg-deep-black text-white">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        pageIcon={Settings}
        pageTitle="TradeHub"
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Header */}
        <header className="bg-deep-black/50 backdrop-blur-xl border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-white/10 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-bold">Settings</h2>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-white/10 rounded-lg"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-white"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Settings Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="bg-white/5 border-white/10 grid grid-cols-2 lg:grid-cols-5">
                <TabsTrigger value="profile" className="data-[state=active]:bg-blue-500/20">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="trading" className="data-[state=active]:bg-blue-500/20">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trading
                </TabsTrigger>
                <TabsTrigger value="security" className="data-[state=active]:bg-blue-500/20">
                  <Shield className="w-4 h-4 mr-2" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="notifications" className="data-[state=active]:bg-blue-500/20">
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications
                </TabsTrigger>
                <TabsTrigger value="api" className="data-[state=active]:bg-blue-500/20">
                  <Key className="w-4 h-4 mr-2" />
                  API
                </TabsTrigger>
              </TabsList>

              {/* Profile Settings */}
              <TabsContent value="profile" className="space-y-8">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                          className="bg-white/5 border-white/10 h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                          className="bg-white/5 border-white/10 h-10"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className="bg-white/5 border-white/10 h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="bg-white/5 border-white/10 h-10"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Timezone</Label>
                        <Select value={profileData.timezone} onValueChange={(value) => setProfileData(prev => ({ ...prev, timezone: value }))}>
                          <SelectTrigger className="bg-white/5 border-white/10 h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-deep-black border-white/10">
                            <SelectItem value="UTC-8">UTC-8 (PST)</SelectItem>
                            <SelectItem value="UTC-5">UTC-5 (EST)</SelectItem>
                            <SelectItem value="UTC+0">UTC+0 (GMT)</SelectItem>
                            <SelectItem value="UTC+1">UTC+1 (CET)</SelectItem>
                            <SelectItem value="UTC+8">UTC+8 (CST)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select value={profileData.language} onValueChange={(value) => setProfileData(prev => ({ ...prev, language: value }))}>
                          <SelectTrigger className="bg-white/5 border-white/10 h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-deep-black border-white/10">
                            <SelectItem value="English">English</SelectItem>
                            <SelectItem value="Spanish">Spanish</SelectItem>
                            <SelectItem value="French">French</SelectItem>
                            <SelectItem value="German">German</SelectItem>
                            <SelectItem value="Japanese">Japanese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button onClick={saveProfile} className="w-full md:w-auto h-10">
                        Save Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-2">
                      <Monitor className="w-5 h-5" />
                      Display Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="theme">Theme</Label>
                        <Select value={displaySettings.theme} onValueChange={(value) => setDisplaySettings(prev => ({ ...prev, theme: value }))}>
                          <SelectTrigger className="bg-white/5 border-white/10 h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-deep-black border-white/10">
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="auto">Auto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <Select value={displaySettings.currency} onValueChange={(value) => setDisplaySettings(prev => ({ ...prev, currency: value }))}>
                          <SelectTrigger className="bg-white/5 border-white/10 h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-deep-black border-white/10">
                            <SelectItem value="USD">USD ($)</SelectItem>
                            <SelectItem value="EUR">EUR (€)</SelectItem>
                            <SelectItem value="GBP">GBP (£)</SelectItem>
                            <SelectItem value="JPY">JPY (¥)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <Label htmlFor="animations" className="text-base">Animations</Label>
                        <p className="text-sm text-gray-400 mt-1">Enable UI animations and transitions</p>
                      </div>
                      <Switch
                        id="animations"
                        checked={displaySettings.animationsEnabled}
                        onCheckedChange={(checked) => setDisplaySettings(prev => ({ ...prev, animationsEnabled: checked }))}
                      />
                    </div>
                    <div className="pt-4">
                      <Button onClick={saveDisplaySettings} className="w-full md:w-auto h-10">
                        Save Display Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Trading Settings */}
              <TabsContent value="trading" className="space-y-8">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Trading Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-6">
                    <div className="space-y-2">
                      <Label htmlFor="orderType">Default Order Type</Label>
                      <Select value={tradingPreferences.defaultOrderType} onValueChange={(value) => setTradingPreferences(prev => ({ ...prev, defaultOrderType: value }))}>
                        <SelectTrigger className="bg-white/5 border-white/10 h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-deep-black border-white/10">
                          <SelectItem value="market">Market Order</SelectItem>
                          <SelectItem value="limit">Limit Order</SelectItem>
                          <SelectItem value="stop">Stop Order</SelectItem>
                          <SelectItem value="stop_limit">Stop Limit</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="slippage">Slippage Tolerance (%)</Label>
                      <Input
                        id="slippage"
                        type="number"
                        step="0.1"
                        value={tradingPreferences.slippageTolerance}
                        onChange={(e) => setTradingPreferences(prev => ({ ...prev, slippageTolerance: parseFloat(e.target.value) }))}
                        className="bg-white/5 border-white/10 h-10"
                      />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <Label htmlFor="confirmOrders" className="text-base">Order Confirmation</Label>
                        <p className="text-sm text-gray-400 mt-1">Show confirmation dialog before placing orders</p>
                      </div>
                      <Switch
                        id="confirmOrders"
                        checked={tradingPreferences.confirmOrders}
                        onCheckedChange={(checked) => setTradingPreferences(prev => ({ ...prev, confirmOrders: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <Label htmlFor="advancedChart" className="text-base">Advanced Chart</Label>
                        <p className="text-sm text-gray-400 mt-1">Show advanced charting tools by default</p>
                      </div>
                      <Switch
                        id="advancedChart"
                        checked={tradingPreferences.showAdvancedChart}
                        onCheckedChange={(checked) => setTradingPreferences(prev => ({ ...prev, showAdvancedChart: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <Label htmlFor="autoRefresh" className="text-base">Auto Refresh Prices</Label>
                        <p className="text-sm text-gray-400 mt-1">Automatically refresh market prices</p>
                      </div>
                      <Switch
                        id="autoRefresh"
                        checked={tradingPreferences.autoRefreshPrices}
                        onCheckedChange={(checked) => setTradingPreferences(prev => ({ ...prev, autoRefreshPrices: checked }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="refreshInterval">Refresh Interval (seconds)</Label>
                      <Select value={tradingPreferences.refreshInterval.toString()} onValueChange={(value) => setTradingPreferences(prev => ({ ...prev, refreshInterval: parseInt(value) }))}>
                        <SelectTrigger className="bg-white/5 border-white/10 h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-deep-black border-white/10">
                          <SelectItem value="1">1 second</SelectItem>
                          <SelectItem value="5">5 seconds</SelectItem>
                          <SelectItem value="10">10 seconds</SelectItem>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="60">1 minute</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="pt-4">
                      <Button onClick={saveTradingPreferences} className="w-full md:w-auto h-10">
                        Save Trading Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Settings */}
              <TabsContent value="security" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="2fa">Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-400">Add an extra layer of security to your account</p>
                      </div>
                      <Switch
                        id="2fa"
                        checked={securitySettings.twoFactorEnabled}
                        onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, twoFactorEnabled: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="emailVerification">Email Verification</Label>
                        <p className="text-sm text-gray-400">Require email verification for sensitive actions</p>
                      </div>
                      <Switch
                        id="emailVerification"
                        checked={securitySettings.emailVerification}
                        onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, emailVerification: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="smsVerification">SMS Verification</Label>
                        <p className="text-sm text-gray-400">Require SMS verification for login</p>
                      </div>
                      <Switch
                        id="smsVerification"
                        checked={securitySettings.smsVerification}
                        onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, smsVerification: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="loginNotifications">Login Notifications</Label>
                        <p className="text-sm text-gray-400">Get notified when someone logs into your account</p>
                      </div>
                      <Switch
                        id="loginNotifications"
                        checked={securitySettings.loginNotifications}
                        onCheckedChange={(checked) => setSecuritySettings(prev => ({ ...prev, loginNotifications: checked }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Select value={securitySettings.sessionTimeout.toString()} onValueChange={(value) => setSecuritySettings(prev => ({ ...prev, sessionTimeout: parseInt(value) }))}>
                        <SelectTrigger className="bg-white/5 border-white/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-deep-black border-white/10">
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">1 hour</SelectItem>
                          <SelectItem value="240">4 hours</SelectItem>
                          <SelectItem value="1440">24 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Separator className="bg-white/10" />
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <Lock className="w-4 h-4 mr-2" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Smartphone className="w-4 h-4 mr-2" />
                        Manage Devices
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Download Account Data
                      </Button>
                    </div>
                    <Button onClick={saveSecuritySettings} className="w-full md:w-auto">
                      Save Security Settings
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notification Settings */}
              <TabsContent value="notifications" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notification Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {notifications.map((notification) => (
                      <div key={notification.id} className="space-y-3">
                        <div>
                          <h4 className="font-medium">{notification.name}</h4>
                          <p className="text-sm text-gray-400">{notification.description}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <Label htmlFor={`${notification.id}-email`} className="text-sm">Email</Label>
                            <Switch
                              id={`${notification.id}-email`}
                              checked={notification.email}
                              onCheckedChange={(checked) => updateNotification(notification.id, 'email', checked)}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Smartphone className="w-4 h-4 text-gray-400" />
                            <Label htmlFor={`${notification.id}-push`} className="text-sm">Push</Label>
                            <Switch
                              id={`${notification.id}-push`}
                              checked={notification.push}
                              onCheckedChange={(checked) => updateNotification(notification.id, 'push', checked)}
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Volume2 className="w-4 h-4 text-gray-400" />
                            <Label htmlFor={`${notification.id}-sms`} className="text-sm">SMS</Label>
                            <Switch
                              id={`${notification.id}-sms`}
                              checked={notification.sms}
                              onCheckedChange={(checked) => updateNotification(notification.id, 'sms', checked)}
                            />
                          </div>
                        </div>
                        <Separator className="bg-white/10" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* API Settings */}
              <TabsContent value="api" className="space-y-6">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Key className="w-5 h-5" />
                        API Keys
                      </span>
                      <Button onClick={generateApiKey} size="sm">
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Generate New Key
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {apiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="p-4 bg-white/5 rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{apiKey.name}</h4>
                            <p className="text-sm text-gray-400">
                              Created {apiKey.createdAt.toLocaleDateString()} •
                              Last used {apiKey.lastUsed.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={apiKey.isActive ? 'default' : 'secondary'}>
                              {apiKey.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => revokeApiKey(apiKey.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            value={showApiKey[apiKey.id] ? apiKey.key : apiKey.key.slice(0, 8) + '...'}
                            readOnly
                            className="bg-white/5 border-white/10 font-mono text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleApiKeyVisibility(apiKey.id)}
                          >
                            {showApiKey[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyApiKey(apiKey.key)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          {apiKey.permissions.map((permission) => (
                            <Badge key={permission} variant="outline" className="border-white/20">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                    {apiKeys.length === 0 && (
                      <div className="text-center py-8 text-gray-400">
                        <Key className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No API keys generated yet</p>
                        <p className="text-sm">Create an API key to integrate with our services</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      API Documentation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-400">
                      Access our comprehensive API documentation to integrate your applications with TradeHub.
                    </p>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <FileText className="w-4 h-4 mr-2" />
                        API Documentation
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <HelpCircle className="w-4 h-4 mr-2" />
                        API Support
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="w-64 bg-deep-black h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Settings className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold">TradeHub</h1>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                          if (item.id === 'dashboard') navigate('/dashboard');
                          if (item.id === 'markets') navigate('/markets');
                          if (item.id === 'portfolio') navigate('/portfolio');
                          if (item.id === 'settings') navigate('/settings');
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          activeTab === item.id
                            ? 'bg-blue-500/20 text-blue-400'
                            : 'hover:bg-white/5 text-gray-400'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </nav>

                {/* User & Logout */}
                <div className="p-4 border-t border-white/10 mt-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">{user?.name || 'John'}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email || 'demo@trade.com'}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
