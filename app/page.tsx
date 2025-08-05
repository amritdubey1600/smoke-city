"use client";

import { useState } from "react";
import { MapPin, Wind, Navigation, ChevronDown } from "lucide-react";
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

async function getDataByCoords(lat: number, lon: number): Promise<pollutionType> {
  const pollution = await fetch(`api/pollution?lat=${lat}&lon=${lon}`)
    .then(res => res.json())
    .catch(error => console.log(error));

  return pollution;
}

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<string>("Dubai");
  const [activeCity, setActiveCity] = useState<string>("Dubai"); // City used for API calls
  const [pollution, setPollution] = useState<pollutionType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);

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

  const handleLocationClick = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setLocationLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const pollution = await getDataByCoords(latitude, longitude);
          
          const latDir = latitude >= 0 ? 'N' : 'S';
          const lonDir = longitude >= 0 ? 'E' : 'W';
          
          setPollution(pollution);
          setActiveCity(`your location: ${Math.abs(latitude).toFixed(2)}° ${latDir}, ${Math.abs(longitude).toFixed(2)}° ${lonDir}`);

          setTimeout(() => {
            const resultsElement = document.getElementById('results');
            if (resultsElement) {
              resultsElement.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            }
          }, 300);
        } catch (error) {
          console.error("Error fetching location data:", error);
          alert('Failed to get air quality data for your location.');
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        let errorMessage = 'Unable to get your location. ';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage += 'Please allow location access and try again.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage += 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage += 'Location request timed out.';
            break;
          default:
            errorMessage += 'An unknown error occurred.';
            break;
        }
        
        alert(errorMessage);
        setLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
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

          <div className="max-w-md mx-auto mb-16 space-y-6">
            {/* Use Current Location Button */}
            <button 
              onClick={handleLocationClick}
              disabled={locationLoading}
              className="group w-full flex items-center cursor-pointer gap-3 px-6 py-4 bg-gradient-to-r from-red-500 to-orange-600 hover:from-orange-700 hover:to-red-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 border border-white/10"
            >
              {locationLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              ) : (
                <Navigation className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
              )}
              <div className="text-left flex-1">
                <div className="text-base font-medium">
                  {locationLoading ? 'Detecting Your Location...' : 'Use My Current Location'}
                </div>
                <div className="text-xs text-white/80 font-normal">
                  {locationLoading ? 'Please wait while we get your coordinates' : 'Get AQI data for where you\'re right now'}
                </div>
              </div>
            </button>

            {/* OR Divider */}
            <div className="flex items-center justify-center">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <span className="px-4 text-white/60 font-medium text-sm">OR</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            {/* Clean City Selection */}
            <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-orange-400" />
                <span className="text-white font-medium">Select City</span>
              </div>
              
              <div className="space-y-4">
                <div className="relative">
                  <select 
                    value={selectedCity} 
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-lg font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 appearance-none cursor-pointer transition-all duration-300"
                  >
                    {cities.map((city) => (
                      <option key={city.value} value={city.value} className="bg-slate-800 text-white py-2">
                        {city.flag} {city.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60 pointer-events-none" />
                </div>
                
                <button 
                  onClick={handleClick}
                  disabled={loading}
                  className="w-full px-6 py-4 cursor-pointer bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl active:scale-95"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  ) : (
                    <Wind className="w-5 h-5" />
                  )}
                  <span>
                    {loading ? 'Checking Air Quality...' : 'Check Air Quality'}
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