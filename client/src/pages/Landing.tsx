import { useState } from 'react';
import { Link } from 'react-router-dom';
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
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const [email, setEmail] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                <Factory className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">INDUS-SYS</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Features</a>
              <a href="#about" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">About</a>
              <a href="#contact" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Contact</a>
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-medium shadow-lg shadow-blue-500/30 transition-all"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              Industrial Production & Inventory Management
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">
              Streamline Your
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {' '}Industrial Operations
              </span>
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
              Comprehensive production tracking, inventory management, and quality control system designed for modern manufacturing facilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium shadow-xl shadow-blue-500/30 transition-all"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-medium shadow-md transition-all"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
            {[
              { label: 'Active Users', value: '500+', icon: Users },
              { label: 'Production Orders', value: '10K+', icon: Package },
              { label: 'Efficiency Gain', value: '40%', icon: TrendingUp },
              { label: 'Uptime', value: '99.9%', icon: ShieldCheck },
            ].map((stat, index) => (
              <div key={index} className="bg-white rounded-xl p-6 border border-slate-200 shadow-lg text-center">
                <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50/50 via-white to-cyan-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to manage your industrial production and inventory operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: 'Real-time Dashboard',
                description: 'Monitor production metrics, inventory levels, and quality statistics in real-time with interactive charts.',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Package,
                title: 'Inventory Management',
                description: 'Track raw materials, components, and finished goods with batch numbers, QR codes, and location tracking.',
                color: 'from-emerald-500 to-green-500',
              },
              {
                icon: Settings,
                title: 'Production Tracking',
                description: 'Manage production orders from scheduling to completion with status tracking and priority management.',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: ShieldCheck,
                title: 'Quality Control',
                description: 'Record inspection results, track defect rates, and manage quality certifications with detailed reports.',
                color: 'from-amber-500 to-orange-500',
              },
              {
                icon: Clock,
                title: 'Maintenance Scheduling',
                description: 'Schedule and track equipment maintenance to minimize downtime and maximize productivity.',
                color: 'from-rose-500 to-red-500',
              },
              {
                icon: AlertTriangle,
                title: 'Alert System',
                description: 'Get notified about low stock, maintenance due dates, and quality issues before they become problems.',
                color: 'from-indigo-500 to-violet-500',
              },
            ].map((feature, index) => (
              <div key={index} className="group p-6 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all bg-gradient-to-br from-slate-50 to-white">
                <div className={`h-12 w-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-slate-900 mb-6">Built for Modern Manufacturing</h2>
              <p className="text-lg text-slate-600 mb-8">
                INDUS-SYS is designed to meet the complex needs of industrial production facilities. 
                From raw material procurement to finished goods dispatch, our system provides end-to-end visibility and control.
              </p>
              <div className="space-y-4">
                {[
                  'Real-time production monitoring and analytics',
                  'Comprehensive inventory tracking with QR codes',
                  'Quality assurance and inspection management',
                  'Equipment maintenance scheduling',
                  'Role-based access control for security',
                  'Export reports in multiple formats',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl p-8 shadow-2xl">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Factory className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Production Line A</div>
                    <div className="text-sm text-slate-600">Status: Operational</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Progress</span>
                    <span className="font-medium text-slate-900">75%</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" style={{ width: '75%' }} />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Quality Rate</span>
                    <span className="font-medium text-emerald-600">98.5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Ready to Transform Your Operations?</h2>
          <p className="text-xl text-slate-600 mb-10">
            Join hundreds of manufacturing facilities already using INDUS-SYS to streamline their production and inventory management.
          </p>
          <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl p-8 border border-slate-200">
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <button
                type="button"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-medium shadow-lg shadow-blue-500/30 transition-all"
              >
                Get Started
              </button>
            </form>
            <p className="text-sm text-slate-500 mt-4">
              Free trial available. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
                  <Factory className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">INDUS-SYS</span>
              </div>
              <p className="text-sm">
                Industrial production and inventory management system for modern manufacturing facilities.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2024 INDUS-SYS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
