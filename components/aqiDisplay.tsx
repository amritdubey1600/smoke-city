import { Wind, AlertTriangle, Skull } from "lucide-react";
import { useState, useEffect } from "react";

type Props = {
  pm2_5: number; // use the value from OpenWeather `components.pm2_5`
};

export const AQIDisplay = ({ pm2_5 }: Props) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedAQI, setAnimatedAQI] = useState(0);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  // Step 1: Convert PM2.5 to EPA AQI
  const pm25ToEPA_AQI = (pm25: number): number => {
    const breakpoints = [
      { aqiLow: 0, aqiHigh: 50, pmLow: 0.0, pmHigh: 12.0 },
      { aqiLow: 51, aqiHigh: 100, pmLow: 12.1, pmHigh: 35.4 },
      { aqiLow: 101, aqiHigh: 150, pmLow: 35.5, pmHigh: 55.4 },
      { aqiLow: 151, aqiHigh: 200, pmLow: 55.5, pmHigh: 150.4 },
      { aqiLow: 201, aqiHigh: 300, pmLow: 150.5, pmHigh: 250.4 },
      { aqiLow: 301, aqiHigh: 400, pmLow: 250.5, pmHigh: 350.4 },
      { aqiLow: 401, aqiHigh: 500, pmLow: 350.5, pmHigh: 500.4 }
    ];

    for (const bp of breakpoints) {
      if (pm25 >= bp.pmLow && pm25 <= bp.pmHigh) {
        return Math.round(
          ((bp.aqiHigh - bp.aqiLow) / (bp.pmHigh - bp.pmLow)) * (pm25 - bp.pmLow) + bp.aqiLow
        );
      }
    }

    return -1;
  };

  const aqi = pm25ToEPA_AQI(pm2_5);
  const percentage = Math.min((aqi / 500) * 100, 100);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Animate AQI and percentage
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;
    
    const animate = () => {
      if (currentStep <= steps) {
        const progress = currentStep / steps;
        const easeOutQuart = 1 - Math.pow(1 - progress, 4); // Smooth easing
        
        setAnimatedAQI(aqi * easeOutQuart);
        setAnimatedPercentage(percentage * easeOutQuart);
        
        currentStep++;
        setTimeout(animate, stepDuration);
      }
    };
    
    const animationTimer = setTimeout(animate, 300); // Start after entrance animation
    
    return () => {
      clearTimeout(timer);
      clearTimeout(animationTimer);
    };
  }, [aqi, percentage]);

  // Step 2: Get EPA AQI Info
  const getAQIInfo = (aqi: number) => {
    if (aqi <= 50) return {
      color: "#10b981",
      text: "Good",
      description: "Air quality is satisfactory.",
      icon: <Wind className="w-6 h-6" />,
      bg: "from-green-500/10 to-emerald-600/5",
      glow: "shadow-green-500/20"
    };
    if (aqi <= 100) return {
      color: "#facc15",
      text: "Moderate",
      description: "Air quality is acceptable, but there may be risks for sensitive individuals.",
      icon: <Wind className="w-6 h-6" />,
      bg: "from-yellow-400/10 to-yellow-600/5",
      glow: "shadow-yellow-400/20"
    };
    if (aqi <= 150) return {
      color: "#f97316",
      text: "Unhealthy for Sensitive Groups",
      description: "Sensitive groups may experience health effects.",
      icon: <AlertTriangle className="w-6 h-6" />,
      bg: "from-orange-500/10 to-orange-600/5",
      glow: "shadow-orange-500/20"
    };
    if (aqi <= 200) return {
      color: "#ef4444",
      text: "Unhealthy",
      description: "Everyone may begin to experience health effects.",
      icon: <AlertTriangle className="w-6 h-6" />,
      bg: "from-red-500/10 to-red-600/5",
      glow: "shadow-red-500/30"
    };
    if (aqi <= 300) return {
      color: "#8b5cf6",
      text: "Very Unhealthy",
      description: "Health alert: everyone may experience serious effects.",
      icon: <AlertTriangle className="w-6 h-6" />,
      bg: "from-purple-500/10 to-purple-700/5",
      glow: "shadow-purple-500/30"
    };
    return {
      color: "#7c2d12",
      text: "Hazardous",
      description: "Serious health warnings of emergency conditions.",
      icon: <Skull className="w-6 h-6" />,
      bg: "from-red-800/10 to-red-900/5",
      glow: "shadow-red-700/40"
    };
  };

  const aqiInfo = getAQIInfo(aqi);

  // Step 3: UI
  return (
    <div className={`transition-all duration-1000 ease-out ${
      isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
    }`}>
      <div className={`backdrop-blur-xl bg-gradient-to-br ${aqiInfo.bg} border border-white/10 rounded-3xl p-8 shadow-2xl ${aqiInfo.glow} transition-all duration-500 hover:scale-105 h-full flex flex-col justify-center`}>
        <div className="text-center">
          {/* Icon */}
          <div className={`inline-flex p-4 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 mb-6 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90'
          }`}>
            <div style={{ color: aqiInfo.color }}>
              {aqiInfo.icon}
            </div>
          </div>

          {/* AQI Value */}
          <div className={`mb-6 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="text-5xl font-bold text-white mb-2">{Math.round(animatedAQI)}</div>
            <div
              className="text-lg font-semibold mb-1"
              style={{ color: aqiInfo.color }}
            >
              {aqiInfo.text}
            </div>
            <div className="text-sm text-white/60">{aqiInfo.description}</div>
          </div>

          {/* Progress bar */}
          <div className={`space-y-3 transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="flex justify-between text-sm text-white/60">
              <span>EPA AQI (based on PM2.5)</span>
              <span>{Math.round(animatedPercentage)}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-2000 ease-out delay-500"
                style={{
                  width: `${animatedPercentage}%`,
                  background: `linear-gradient(90deg, ${aqiInfo.color}80, ${aqiInfo.color})`
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};