# Management UI

A comprehensive React-based management interface built with Material-UI, designed to provide a modern and responsive dashboard experience.

## Features

- 🎨 Modern and responsive Material Design interface
- 📊 Interactive data visualization with ApexCharts
- 🔐 Authentication and authorization system
- 🌙 Light/Dark theme support
- 📱 Mobile-first responsive design
- 🔄 Real-time data updates
- 📋 Data table management
- 🎯 Role-based access control

## Tech Stack

### Core

- React 18 - Frontend library
- Material-UI (MUI) v5 - UI component library
- Vite - Build tool and development server
- Emotion - CSS-in-JS styling solution

### Data Visualization & Management

- ApexCharts - Interactive charts and graphs
- Axios - HTTP client for API requests
- date-fns & dayjs - Date manipulation utilities

### State Management & Routing

- Redux Toolkit - State management
- React Router v6 - Navigation and routing

### Development Tools

- TypeScript - Type checking and code quality
- ESLint - Code linting
- Prettier - Code formatting
- Husky - Git hooks
- Jest - Unit testing
- React Testing Library - Component testing

## Environment Variables

This project uses environment variables for configuration. Copy `.env.example` to `.env` and update the values as needed:

```bash
cp .env.example .env
```

### Available Environment Variables

#### API Configuration
- `VITE_API_BASE_URL`: Base URL for API requests (e.g., `http://localhost:8080`)
- `VITE_API_AUTH_PATH`: Path for authentication endpoints (default: `/auth`)
- `VITE_API_VALIDATE_PATH`: Path for token validation (default: `/auth/validate`)
- `VITE_API_LOGIN_PATH`: Path for login endpoint (default: `/auth/login`)

#### Application Settings
- `VITE_APP_NAME`: Application name (default: "Management UI")
- `VITE_APP_ENV`: Application environment (e.g., `development`, `production`)
- `VITE_APP_VERSION`: Application version

#### Feature Flags
- `VITE_ENABLE_ANALYTICS`: Enable/disable analytics (default: `false`)
- `VITE_ENABLE_LOGGING`: Enable/disable logging (default: `true`)

#### Pagination
- `VITE_DEFAULT_PAGE_SIZE`: Default number of items per page (default: `10`)
- `VITE_MAX_PAGE_SIZE`: Maximum number of items per page (default: `100`)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher) or yarn (v1.22 or higher)
- Git

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/management-ui.git
cd management-ui


Install dependencies

yarn install
# or
npm install


bash
Set up environment variables

cp .env.example .env


```

Edit the .env file with your configuration

Available Scripts

```
# Development
yarn dev          # Start development server
yarn dev:host     # Start development server with host access

# Building
yarn build        # Build for production
yarn preview      # Preview production build

# Code Quality
yarn lint         # Run ESLint
yarn lint:fix     # Fix ESLint errors
yarn prettier     # Format code
yarn type-check   # Run TypeScript type checking

# Testing
yarn test         # Run tests
yarn test:watch   # Run tests in watch mode
yarn test:coverage # Run tests with coverage report
```

```
Project Structure
src/
├── assets/        # Static assets (images, fonts, etc.)
├── components/    # Reusable UI components
├── config/        # Configuration files
├── hooks/         # Custom React hooks
├── layouts/       # Page layouts
├── pages/         # Page components
├── services/      # API services
├── store/         # Redux store configuration
├── theme/         # MUI theme customization
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

```
Environment Variables
VITE_API_BASE_URL=your_api_base_url
VITE_AUTH_TOKEN_KEY=your_auth_token_key
VITE_ENV=development
```

```
Browser Support

Chrome (latest)

Firefox (latest)

Safari (latest)

Edge (latest)
```

Deployment
Build for Production
yarn build

```
The build artifacts will be stored in the dist/ directory.

Deploy to Production
Configure your deployment platform (e.g., AWS, Vercel, Netlify)

Set up environment variables

Deploy the contents of the dist/ directory

Contributing
Fork the repository

Create your feature branch ( git checkout -b feature/amazing-feature)

Commit your changes ( git commit -m 'Add some amazing feature')

Push to the branch ( git push origin feature/amazing-feature)

Open a Pull Request
```

## Coding Standards

Follow the ESLint configuration

Write meaningful commit messages

Update documentation for significant changes

Add tests for new features

Testing

# Run all tests

yarn test

# Run tests with coverage

yarn test:coverage

# Run tests in watch mode

yarn test:watch

bash
Performance Optimization
Use React.memo() for expensive computations

Implement code splitting with React.lazy()

Optimize images and assets

Use windowing for long lists

Troubleshooting
Common issues and their solutions:

Build fails

Clear node_modules and package-lock.json

Run yarn install again

Check for Node.js version compatibility

Development server issues

Clear browser cache

Check for port conflicts

Verify environment variables

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

Material-UI team for the excellent component library

React team for the amazing framework

All contributors who have helped with the project

## Support

For support, email <support@yourproject.com> or create an issue in the repository.
