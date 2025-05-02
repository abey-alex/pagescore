# PageScore

A React application that tracks and visualizes page performance scores with various metrics and events.

## Features

- Real-time page score tracking
- Multiple event types (Performance, Anti-patterns, Ownership, Trends, Accessibility)
- Detailed history view with event details
- Color-coded score indicators
- Web Worker for state management

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/abeyalex/pagescore.git
cd pagescore
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Deployment

This application is configured for deployment to GitHub Pages. The deployment is automated using GitHub Actions.

### Manual Deployment

To deploy manually:

1. Build the application:
```bash
npm run build
```

2. Deploy to GitHub Pages:
```bash
npm run deploy
```

### Automated Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. The deployment process:

1. Builds the application
2. Deploys to GitHub Pages
3. Updates the site at `https://abeyalex.github.io/pagescore`

## Project Structure

- `src/components/` - React components
- `src/workers/` - Web Worker implementation
- `src/types/` - TypeScript type definitions
- `public/` - Static assets and HTML template

## Technologies Used

- React
- TypeScript
- Web Workers
- GitHub Pages
- GitHub Actions 