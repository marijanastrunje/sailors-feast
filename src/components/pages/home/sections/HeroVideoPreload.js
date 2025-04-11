import React from 'react';

// Jednostavna preload komponenta koja se brzo prikazuje
// dok se učitava prava HeroVideo komponenta
const HeroVideoPreload = () => {
  return (
    <div className="hero-video-container position-relative" style={{ minHeight: '80vh' }}>
      {/* Zamjenski background - može biti jednostavna boja ili blur-verzija pozadinske slike */}
      <div 
        className="position-absolute top-0 start-0 w-100 h-100" 
        style={{ 
          backgroundColor: '#004a99', 
          backgroundSize: 'cover',
          backgroundPosition: 'center center'
        }}
      ></div>
      
      {/* Placeholder za sadržaj */}
      <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
        <div className="container text-center text-white py-5">
          <div className="mx-auto" style={{ maxWidth: '800px' }}>
            <div className="placeholder-glow mb-4">
              <span className="placeholder col-8 bg-secondary"></span>
            </div>
            <div className="placeholder-glow mb-5">
              <span className="placeholder col-10 bg-secondary"></span>
              <span className="placeholder col-8 bg-secondary mx-2"></span>
              <span className="placeholder col-6 bg-secondary"></span>
            </div>
            <div className="d-flex justify-content-center">
              <div className="placeholder-glow">
                <span className="placeholder col-8 bg-primary rounded-pill p-3 mx-2"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroVideoPreload;