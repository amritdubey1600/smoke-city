function Footer(){
  return (
    <footer className="relative z-10 mt-8">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="space-y-3">
            <p className="text-white/80 text-sm sm:text-base font-medium">
              Created by <span className="text-white font-semibold">Amrit Dubey</span>
            </p>
            <p className="text-white/60 text-xs sm:text-sm">
              Data based on OpenWeather API estimates
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;