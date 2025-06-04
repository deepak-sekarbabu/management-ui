import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// Import StagewiseToolbar for development mode
// import { StagewiseToolbar } from '@stagewise/toolbar-react';

import App from './app';

// Basic configuration object
// const stagewiseConfig = {
//     plugins: [],
// };

// ----------------------------------------------------------------------

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <HelmetProvider>
        <BrowserRouter
            future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
            }}
        >
            <Suspense>
                <App />
            </Suspense>
        </BrowserRouter>
    </HelmetProvider>
);

// Initialize StagewiseToolbar in development mode in a separate root

/* if (process.env.NODE_ENV === 'development') {
    const stagewiseRootElement = document.createElement('div');
    document.body.appendChild(stagewiseRootElement); // Append to body or another appropriate container

    const stagewiseRoot = ReactDOM.createRoot(stagewiseRootElement);
    stagewiseRoot.render(<StagewiseToolbar config={stagewiseConfig} />);
} */
