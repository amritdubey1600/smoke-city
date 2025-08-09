import { Cigarette } from "lucide-react";
import { pollutionType } from "@/app/page";
import { useState, useEffect } from "react";

export const CigaretteCounter = ({ count, maxCount = 20, city, pollution }: { count: number; maxCount?: number; city: string; pollution: pollutionType | null }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedCount, setAnimatedCount] = useState(0);
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  const percentage = Math.min((count / maxCount) * 100, 100);
  const circumference = 2 * Math.PI * 60;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;
  
  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Animate count and percentage
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;
    
    const animate = () => {
      if (currentStep <= steps) {
        const progress = currentStep / steps;
        const easeOutQuart = 1 - Math.pow(1 - progress, 4); // Smooth easing
        
        setAnimatedCount(count * easeOutQuart);
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
  }, [count, percentage]);
  
  const getColorScheme = () => {
    if (count <= 2) return { 
      stroke: "#10b981", 
      glow: "shadow-green-500/20",
      bg: "from-green-500/10 to-green-600/5"
    };
    if (count <= 5) return { 
      stroke: "#f59e0b", 
      glow: "shadow-amber-500/20",
      bg: "from-amber-500/10 to-orange-600/5"
    };
    if (count <= 10) return { 
      stroke: "#f97316", 
      glow: "shadow-orange-500/20",
      bg: "from-orange-500/10 to-red-600/5"
    };
    return { 
      stroke: "#ef4444", 
      glow: "shadow-red-500/30",
      bg: "from-red-500/10 to-red-700/5"
    };
  };

  const colors = getColorScheme();

  return (
    <div className={`relative group transition-all duration-1000 ease-out ${
      isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
    }`}>
      {/* Subtle smoke effect */}
      <div className={`absolute -inset-4 bg-gradient-to-r from-gray-600/10 via-transparent to-gray-600/10 rounded-full blur-xl transition-opacity duration-1500 ${
        isVisible ? 'opacity-60' : 'opacity-0'
      }`}></div>
      
      <div className={`relative backdrop-blur-xl bg-gradient-to-br ${colors.bg} border border-white/10 rounded-3xl p-8 shadow-2xl ${colors.glow} transition-all duration-500 hover:scale-105`}>
        {/* Circular progress */}
        <div className="relative w-48 h-48 mx-auto mb-6">
          <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 128 128">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r="60"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="3"
              fill="transparent"
              className={`transition-all duration-1000 delay-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r="60"
              stroke={colors.stroke}
              strokeWidth="3"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-2000 ease-out drop-shadow-lg"
              style={{
                filter: `drop-shadow(0 0 8px ${colors.stroke}40)`,
                transitionDelay: '500ms'
              }}
            />
          </svg>
          
          {/* Center content */}
          <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <Cigarette className="w-6 h-6 text-white/60 mb-3 transition-all duration-500" />
            <div className="text-5xl font-bold text-white mb-2">{animatedCount.toFixed(1)}</div>
            <div className="text-sm text-white/60 font-medium">cigarettes/day</div>
          </div>
        </div>
        
        {/* Elegant progress indicator */}
        <div className={`space-y-4 transition-all duration-1000 delay-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-20 translate-y-4'
        }`}>
          {/* Health impact message */}
          {count > 0 ? (
            <div className="text-center mb-4">
              <p className="text-white/80 text-lg mb-2">
                Breathing air in <span className="font-semibold text-white">{city}</span> today equals smoking <span className="font-bold" style={{color: colors.stroke}}>{animatedCount.toFixed(1)}</span> cigarette{animatedCount !== 1 ? 's' : ''}
              </p>
              <div className="text-sm text-white/50">PM2.5: {pollution?.pm2_5} μg/m³</div>
            </div>
          ) : (
            <div className="text-center mb-4">
              <p className="text-green-400 text-lg">Clean air in {city} today! 🌿</p>
            </div>
          )}
          
          <div className="flex justify-between text-sm text-white/60">
            <span title={`Percentage based on max ${maxCount} cigarettes`}>
              Pollution vs. Daily Limit
            </span>
            <span>{animatedPercentage.toFixed(1)}%</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-2000 ease-out delay-500"
              style={{ 
                width: `${animatedPercentage}%`,
                background: `linear-gradient(90deg, ${colors.stroke}80, ${colors.stroke})`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};