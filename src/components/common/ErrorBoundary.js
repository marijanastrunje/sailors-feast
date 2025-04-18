import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state da pokažemo fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Možeš logirati grešku u neki servis
    console.error("Caught error:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="container text-center py-5"
          style={{
            marginTop: '50px',
            padding: '30px',
            maxWidth: '600px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            backgroundColor: '#FDFBF7'
          }}
        >
          <div className="py-3">
            <img 
              src="/img/logo/gray-color-logo-horizontal-sailors-feast.svg" 
              alt="Sailor's Feast Logo" 
              style={{ maxWidth: '250px', marginBottom: '20px' }}
            />
          </div>
          <h2 className="mb-4" style={{ color: '#333333', fontFamily: 'Lexend, sans-serif' }}>
            Oops! Something went wrong.
          </h2>
          <p className="mb-4" style={{ color: '#495057', fontFamily: 'Inter, sans-serif' }}>
            We're sorry for the inconvenience. Please try refreshing the page or come back later.
          </p>
          <button 
            onClick={this.handleReload}
            className="btn btn-prim px-4"
            style={{
              fontFamily: 'Lexend, sans-serif',
              backgroundColor: '#CC4425',
              color: '#FFFFFF',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.15)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;