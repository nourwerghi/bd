import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import HomeNavbar from '../components/Navbar/HomeNavbar';
import './Home.css';

const Home = ({ user, setUser }) => {
  const featuresRef = useRef([]);

  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.1,
      rootMargin: '50px',
    });

    featuresRef.current.forEach((feature) => {
      if (feature) observer.observe(feature);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative min-h-screen">
      <HomeNavbar user={user} setUser={setUser} />
      
      {/* Hero Section */}
      <div 
        className="relative min-h-screen bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80')`
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-4xl px-4">
            <h1 className="text-6xl md:text-7xl font-bold mb-6 hero-title">
              Welcome to <span className="gradient-text">Mayamarket</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 hero-subtitle">
              Discover a world of exceptional products and unbeatable deals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/user/shop"
                className="shop-button px-8 py-4 rounded-full text-lg font-semibold relative overflow-hidden group"
              >
                <span className="relative z-10">Start Shopping</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 transform group-hover:scale-105 transition-transform duration-300"></div>
              </Link>
              <Link
                to="/about"
                className="learn-more-button px-8 py-4 rounded-full text-lg font-semibold border-2 border-white hover:bg-white hover:text-gray-900 transition-all duration-300"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce">
          <span className="text-white text-sm mb-2">Scroll Down</span>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Mayamarket?</h2>
            <p className="text-xl text-gray-300">Experience shopping like never before</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div 
              className="feature-card p-8 rounded-2xl bg-gradient-to-br from-purple-600/10 to-blue-500/10 backdrop-blur-sm border border-white/10"
              ref={(el) => (featuresRef.current[0] = el)}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Premium Quality</h3>
              <p className="text-gray-300">Curated selection of high-quality products from trusted sellers worldwide</p>
            </div>

            <div 
              className="feature-card p-8 rounded-2xl bg-gradient-to-br from-purple-600/10 to-blue-500/10 backdrop-blur-sm border border-white/10"
              ref={(el) => (featuresRef.current[1] = el)}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Best Prices</h3>
              <p className="text-gray-300">Competitive prices and regular deals to ensure you get the best value</p>
            </div>

            <div 
              className="feature-card p-8 rounded-2xl bg-gradient-to-br from-purple-600/10 to-blue-500/10 backdrop-blur-sm border border-white/10"
              ref={(el) => (featuresRef.current[2] = el)}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Fast Delivery</h3>
              <p className="text-gray-300">Swift and reliable shipping to get your products to you as quickly as possible</p>
            </div>
          </div>
        </div>

        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-black/50 to-transparent"></div>
          <div className="absolute -top-24 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-gray-900"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;