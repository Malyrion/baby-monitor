import Link from 'next/link';
// import { DOCS_URL } from '@constants/index';
import styles from '../../styles/Home.module.css';
import { ImageUpload } from './index';

import TemperatureDisplay from './TemperatureDisplay';

function Home(): JSX.Element {
  /* eslint-disable no-console */


  return (
    <>
       <div className="flex flex-col items-center justify-center min-h-screen">
     
      <TemperatureDisplay/>
      <ImageUpload/>
      </div>
      </>
  );
}

export default Home;
