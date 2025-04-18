# Sailor's Feast

A React.js web application for a food delivery service specializing in providing fresh groceries and pre-made meal boxes for sailors and charter customers in Croatia.

## Features

- Browse and order from our selection of groceries
- Choose from pre-configured food boxes for different occasions and group sizes
- Explore and share recipes
- Read blog posts about sailing and food
- User account management and order tracking
- Responsive design for all device sizes

## Technologies Used

- React.js 19
- React Router v7
- Bootstrap 5
- FontAwesome Icons
- React Slick for carousels
- Google Maps integration for delivery zones
- WooCommerce backend integration
- ReCAPTCHA for form security

## Development Setup

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:
npm install
3. Create a `.env` file in the root directory with these variables:
REACT_APP_BACKEND_URL=your_backend_url
REACT_APP_WC_KEY=your_woocommerce_key
REACT_APP_WC_SECRET=your_woocommerce_secret
REACT_APP_SITE_KEY=your_recaptcha_site_key
4. Start the development server:
npm start
## Deployment

Build the production version:
npm run build
The build files will be in the `build` directory, ready to be deployed to your hosting service.

## Project Structure

- `src/components` - Reusable UI components
- `src/pages` - Page components for each route
- `src/utils` - Utility functions
- `public` - Static assets and HTML template

## License

This project is proprietary software.

## Contact

For any inquiries, please contact [info@sailorsfeast.com](mailto:info@sailorsfeast.com)
