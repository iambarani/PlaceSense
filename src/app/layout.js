import './globals.css';
import Navigation from '../components/Navigation';

export const metadata = {
  title: 'PlaceSense - AI Placement Predictor',
  description: 'AI-driven placement prediction and analysis for students',
};

export default function RootLayout({ children }) {
  // For now, we assume role='student' by default. 
  // In a real app, this could be fetched from a session or cookie.
  return (
    <html lang="en">
      <body>
        <Navigation role="student">
          {children}
        </Navigation>
      </body>
    </html>
  );
}
