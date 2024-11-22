import { ImageUpload } from './index';
import TemperatureDisplay from './TemperatureDisplay';

/**
 * @fileoverview  Home component.
 * This component serves as the landing page and displays the temperature monitor
 * along with image upload functionality. Called in the index.js file
 
 */

/**
 * Home component that renders the main page of the application.
 * Displays the temperature monitor and image upload functionality
 * 
 * @returns {JSX.Element} The rendered Home component
 * 
 */
function Home(): JSX.Element {
  return (
    <>
    <div className="flex flex-col items-center justify-center gap-8 py-8"> 
    <TemperatureDisplay />
        <ImageUpload />
      </div>
    </>
  );
}

export default Home;
