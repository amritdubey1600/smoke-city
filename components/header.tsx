import { Cigarette } from "lucide-react";

export default function Header(){
    return (
        <header className="text-center pt-16 pb-20">
            <div className="max-w-2xl mx-auto">
              {/* Icon with glow effect */}
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-red-500 rounded-full blur-3xl opacity-20 scale-150"></div>
                <div className="relative inline-flex p-6 bg-gradient-to-r from-red-500 to-orange-500 rounded-full shadow-2xl">
                  <Cigarette className="w-12 h-12 text-white" />
                </div>
              </div>
              
              {/* Title with gradient text */}
              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-red-500 bg-clip-text text-transparent mb-4 tracking-tight leading-tight pb-2">
                SmokeCity
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-white/70 font-light mb-6 leading-relaxed">
                Visualize air pollution as cigarette equivalents
              </p>
              
              {/* Description */}
              <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
                See how many cigarettes you are effectively smoking just by breathing the air in your city
              </p>
            </div>
          </header>
    );
}