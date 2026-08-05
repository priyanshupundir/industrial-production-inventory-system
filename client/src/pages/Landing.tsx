import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Factory,
  BarChart3,
  ShieldCheck,
  Zap,
  Users,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Package,
  Settings,
  Clock,
  AlertTriangle,
  X,
  Mail,
  Lock,
  Menu,
} from 'lucide-react';
import { authAPI } from '../api/services';
import type { User } from '../types';

interface LandingPageProps {
  onLoginSuccess?: (user: User, token: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const data = await authAPI.login(loginEmail, loginPassword);
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (onLoginSuccess) {
        onLoginSuccess(data.user, data.accessToken);
      }
      navigate('/');
    } catch (err: unknown) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : (err as any).response?.data?.error || 'Login failed. Please try again.';
      
      // If it's a network error, offer demo mode
      if (errorMessage.includes('Network') || errorMessage.includes('timeout') || errorMessage.includes('connect')) {
        setErrorMsg('Server is currently unavailable. Try using the demo accounts below for offline access.');
      } else {
        setErrorMsg(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { email: 'admin@industrial.com', role: 'admin', title: 'Admin' },
    { email: 'manager@industrial.com', role: 'manager', title: 'Manager' },
    { email: 'officer@industrial.com', role: 'officer', title: 'Store Officer' },
    { email: 'inspector@industrial.com', role: 'inspector', title: 'Inspector' },
  ];

  const handleQuickLogin = (email: string) => {
    setLoginEmail(email);
    setLoginPassword('password123');
    setIsLoginModalOpen(true);
  };

  const handleDemoLogin = (email: string, role: string) => {
    // Demo mode - bypass backend entirely
    const demoUser: User = {
      id: 'demo-' + Date.now(),
      email,
      name: role.charAt(0).toUpperCase() + role.slice(1),
      role: role.toUpperCase() as any,
    };
    const demoToken = 'demo-token-' + Date.now();
    localStorage.setItem('token', demoToken);
    localStorage.setItem('user', JSON.stringify(demoUser));
    if (onLoginSuccess) {
      onLoginSuccess(demoUser, demoToken);
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-[var(--popover)]/80 backdrop-blur-md border-b border-[var(--border)] sticky top-0 z-50 panel-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[var(--primary)] flex items-center justify-center glow-effect">
                <Factory className="h-5 w-5 text-[var(--primary-foreground)]" />
              </div>
              <span className="text-xl font-bold text-[var(--foreground)]">INDUS-SYS</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Features</a>
              <a href="#about" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">About</a>
              <a href="#contact" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">Contact</a>
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] text-sm font-medium glow-effect transition-all glow-ring"
              >
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg bg-[var(--secondary)] text-[var(--foreground)]"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 space-y-3 border-t border-[var(--border)]">
              <a href="#features" className="block text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors py-2">Features</a>
              <a href="#about" className="block text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors py-2">About</a>
              <a href="#contact" className="block text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors py-2">Contact</a>
              <button
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] text-sm font-medium glow-effect transition-all"
              >
                Login
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--muted)] border border-[var(--border)] text-[var(--primary)] text-xs sm:text-sm font-medium mb-4 sm:mb-6 panel-effect">
              <Zap className="h-3 w-3 sm:h-4 sm:w-4" />
              Industrial Production & Inventory Management
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[var(--foreground)] tracking-tight mb-4 sm:mb-6">
              Streamline Your
              <span className="text-[var(--primary)]">
                {' '}Industrial Operations
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-[var(--muted-foreground)] mb-6 sm:mb-10 max-w-2xl mx-auto">
              Comprehensive production tracking, inventory management, and quality control system designed for modern manufacturing facilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] font-medium glow-effect transition-all glow-ring text-sm sm:text-base"
              >
                Get Started
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-xl bg-[var(--secondary)] border border-[var(--border)] hover:border-[var(--primary)] text-[var(--secondary-foreground)] font-medium panel-effect transition-all text-sm sm:text-base"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mt-12 sm:mt-20">
            {[
              { label: 'Active Users', value: '500+', icon: Users },
              { label: 'Production Orders', value: '10K+', icon: Package },
              { label: 'Efficiency Gain', value: '40%', icon: TrendingUp },
              { label: 'Uptime', value: '99.9%', icon: ShieldCheck },
            ].map((stat, index) => (
              <div key={index} className="bg-[var(--card)] rounded-xl p-4 sm:p-6 border border-[var(--border)] panel-effect text-center">
                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-[var(--primary)] mx-auto mb-2 sm:mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">{stat.value}</div>
                <div className="text-xs sm:text-sm text-[var(--muted-foreground)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">Powerful Features</h2>
            <p className="text-base sm:text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto">
              Everything you need to manage your industrial production and inventory operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {[
              {
                icon: BarChart3,
                title: 'Real-time Dashboard',
                description: 'Monitor production metrics, inventory levels, and quality statistics in real-time with interactive charts.',
              },
              {
                icon: Package,
                title: 'Inventory Management',
                description: 'Track raw materials, components, and finished goods with batch numbers, QR codes, and location tracking.',
              },
              {
                icon: Settings,
                title: 'Production Tracking',
                description: 'Manage production orders from scheduling to completion with status tracking and priority management.',
              },
              {
                icon: ShieldCheck,
                title: 'Quality Control',
                description: 'Record inspection results, track defect rates, and manage quality certifications with detailed reports.',
              },
              {
                icon: Clock,
                title: 'Maintenance Scheduling',
                description: 'Schedule and track equipment maintenance to minimize downtime and maximize productivity.',
              },
              {
                icon: AlertTriangle,
                title: 'Alert System',
                description: 'Get notified about low stock, maintenance due dates, and quality issues before they become problems.',
              },
            ].map((feature, index) => (
              <div key={index} className="group p-4 sm:p-6 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] transition-all bg-[var(--card)] panel-effect">
                <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-[var(--primary)] flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform glow-effect">
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--primary-foreground)]" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-[var(--foreground)] mb-2">{feature.title}</h3>
                <p className="text-sm sm:text-base text-[var(--muted-foreground)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-6">Built for Modern Manufacturing</h2>
              <p className="text-base sm:text-lg text-[var(--muted-foreground)] mb-6 sm:mb-8">
                INDUS-SYS is designed to meet the complex needs of industrial production facilities. 
                From raw material procurement to finished goods dispatch, our system provides end-to-end visibility and control.
              </p>
              <div className="space-y-3 sm:space-y-4">
                {[
                  'Real-time production monitoring and analytics',
                  'Comprehensive inventory tracking with QR codes',
                  'Quality assurance and inspection management',
                  'Equipment maintenance scheduling',
                  'Role-based access control for security',
                  'Export reports in multiple formats',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--success)]" />
                    <span className="text-sm sm:text-base text-[var(--foreground)]">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[var(--primary)] rounded-2xl p-6 sm:p-8 shadow-2xl glow-effect">
              <div className="bg-[var(--card)] rounded-xl p-4 sm:p-6 panel-effect">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-[var(--primary)] flex items-center justify-center">
                    <Factory className="h-5 w-5 sm:h-6 sm:w-6 text-[var(--primary-foreground)]" />
                  </div>
                  <div>
                    <div className="font-bold text-sm sm:text-base text-[var(--foreground)]">Production Line A</div>
                    <div className="text-xs sm:text-sm text-[var(--muted-foreground)]">Status: Operational</div>
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-[var(--muted-foreground)]">Progress</span>
                    <span className="font-medium text-[var(--foreground)]">75%</span>
                  </div>
                  <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: '75%' }} />
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-[var(--muted-foreground)]">Quality Rate</span>
                    <span className="font-medium text-[var(--success)]">98.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)] mb-4">Ready to Transform Your Operations?</h2>
          <p className="text-base sm:text-xl text-[var(--muted-foreground)] mb-8 sm:mb-10">
            Join hundreds of manufacturing facilities already using INDUS-SYS to streamline their production and inventory management.
          </p>
          <div className="bg-[var(--card)] rounded-2xl p-6 sm:p-8 border border-[var(--border)] panel-effect">
            <form className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 text-sm"
              />
              <button
                type="button"
                className="px-6 py-3 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] font-medium glow-effect transition-all glow-ring text-sm"
              >
                Get Started
              </button>
            </form>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-4">
              Free trial available. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--popover)] text-[var(--muted-foreground)] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6 sm:gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div className="h-8 w-8 rounded-lg bg-[var(--primary)] flex items-center justify-center glow-effect">
                  <Factory className="h-5 w-5 text-[var(--primary-foreground)]" />
                </div>
                <span className="text-lg sm:text-xl font-bold text-[var(--foreground)]">INDUS-SYS</span>
              </div>
              <p className="text-xs sm:text-sm">
                Industrial production and inventory management system for modern manufacturing facilities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--foreground)] mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--foreground)] mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">About</a></li>
                <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[var(--foreground)] mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-[var(--foreground)] transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[var(--border)] mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-xs sm:text-sm">
            <p>&copy; 2024 INDUS-SYS. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl w-full max-w-md p-4 sm:p-6 shadow-2xl space-y-4 panel-effect max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--foreground)]">Login to INDUS-SYS</h3>
                <p className="text-xs text-[var(--muted-foreground)]">Industrial Production & Inventory Management</p>
              </div>
              <button onClick={() => setIsLoginModalOpen(false)} className="text-[var(--muted-foreground)] hover:text-[var(--foreground)]">
                <X className="h-5 w-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-[var(--destructive)]/10 border border-[var(--destructive)]/30 rounded-lg text-xs text-[var(--destructive-foreground)] flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* Demo Quick Selector */}
            <div className="bg-[var(--muted)] border border-[var(--border)] rounded-xl p-3 sm:p-4 space-y-3 panel-effect">
              <span className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider block text-center">
                Quick Demo Login (Offline Mode)
              </span>
              <div className="grid grid-cols-2 gap-2">
                {demoAccounts.map((acc) => (
                  <button
                    key={acc.email}
                    disabled={isLoading}
                    onClick={() => handleDemoLogin(acc.email, acc.role)}
                    className="p-2 sm:p-3 rounded-lg bg-[var(--primary)] border border-[var(--primary)] text-left transition-all group cursor-pointer disabled:opacity-50 glow-effect"
                  >
                    <div className="text-xs font-bold text-[var(--primary-foreground)] flex items-center justify-between">
                      {acc.title}
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                    <span className="text-[10px] text-[var(--primary-foreground)]/80 font-mono block mt-0.5">{acc.email}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form Login */}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="h-4 w-4 text-[var(--muted-foreground)] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--foreground)] block mb-1">Password</label>
                <div className="relative">
                  <Lock className="h-4 w-4 text-[var(--muted-foreground)] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-[var(--foreground)] text-sm focus:outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-lg bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-[var(--primary-foreground)] font-medium text-sm glow-effect transition-all glow-ring flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-[var(--primary-foreground)]/30 border-t-[var(--primary-foreground)] rounded-full animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Login
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
