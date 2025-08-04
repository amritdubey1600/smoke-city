"use client";

import { useState } from "react";
import { MapPin, Wind } from "lucide-react";
import { CigaretteCounter } from "@/components/cigaretteCounter";
import { AQIDisplay } from "@/components/aqiDisplay";
import { pm25ToCigarettes } from "@/lib/converter";
import Header from "@/components/header";
import Footer from "@/components/footer";

export interface pollutionType {
  pm2_5: number;
  aqi: number;
}

async function getData(city: string): Promise<pollutionType>{
  const location = await fetch(`/api/location?city=${city}`)
  .then(res => res.json())
  .catch(error => console.log(error));

  const pollution = await fetch(`api/pollution?lat=${location.lat}&lon=${location.lon}`)
  .then(res => res.json())
  .catch(error => console.log(error));

  return pollution;
}

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<string>("Dubai");
  const [activeCity, setActiveCity] = useState<string>("Dubai"); // City used for API calls
  const [pollution, setPollution] = useState<pollutionType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const cities = [
    { value: "Kolkata", label: "Kolkata, India", flag: "🇮🇳" },
    { value: "Mumbai", label: "Mumbai, India", flag: "🇮🇳" },
    { value: "Bangalore", label: "Bangalore, India", flag: "🇮🇳" },
    { value: "Chennai", label: "Chennai, India", flag: "🇮🇳" },
    { value: "London", label: "London, UK", flag: "🇬🇧" },
    { value: "Paris", label: "Paris, France", flag: "🇫🇷" },
    { value: "Tokyo", label: "Tokyo, Japan", flag: "🇯🇵" },
    { value: "New York", label: "New York, USA", flag: "🇺🇸" },
    { value: "Sydney", label: "Sydney, Australia", flag: "🇦🇺" },
    { value: "Singapore", label: "Singapore", flag: "🇸🇬" },
    { value: "Dubai", label: "Dubai, UAE", flag: "🇦🇪" }
  ];

  const handleClick = async () => {
    setLoading(true);
    try {
      const res = await getData(selectedCity);
      setPollution(res);
      setActiveCity(selectedCity); // Update active city only when button is clicked

      setTimeout(() => {
        const resultsElement = document.getElementById('results');
        if (resultsElement) {
          resultsElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 300); // Small delay to ensure the results have rendered
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const cigaretteCount = pollution ? pm25ToCigarettes(pollution.pm2_5) : 0;

  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900">
      {/* Subtle animated background pattern */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 animate-pulse" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="relative z-10">
        <div className="container mx-auto px-4 pb-12">
          <Header />

          {/* Enhanced city selection */}
          <div className="max-w-md mx-auto mb-16">
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-2 shadow-2xl">
              <div className="flex gap-3">
                {/* Custom styled select */}
                <div className="flex-1 relative">
                  <select 
                    value={selectedCity} 
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full p-3 sm:p-4 bg-transparent text-white text-base sm:text-lg font-medium focus:outline-none appearance-none sm:appearance-none cursor-pointer"
                  >
                    {cities.map((city) => (
                      <option key={city.value} value={city.value} className="text-sm sm:text-base bg-slate-800 text-white">
                        {city.flag} {city.label}
                      </option>
                    ))}
                  </select>
                  <MapPin className="hidden sm:block absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/60 pointer-events-none" />
                </div>
                
                {/* Enhanced button */}
                <button 
                  onClick={handleClick}
                  disabled={loading}
                  className="px-4 py-2 sm:px-7 sm:py-4 cursor-pointer bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-2xl active:scale-95"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Wind className="w-5 h-5" />
                  )}
                  <span className="whitespace-nowrap">
                    {loading ? 'Checking...' : 'Check Air'}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {pollution && (
            <div id='results' className="max-w-6xl mx-auto animate-in fade-in duration-500">
              {/* Main stats */}
              <div className="grid lg:grid-cols-2 auto-cols-fr gap-8">
                <CigaretteCounter count={cigaretteCount} city={activeCity} pollution={pollution} />
                <AQIDisplay pm2_5={pollution.pm2_5} />
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}