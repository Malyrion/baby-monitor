import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { TemperatureProvider } from '../contexts/TemperatureContext'
import { Nunito } from '@next/font/google';
import { AlertProvider } from '../contexts/AlertContext';
import { AlertContainer } from '../components/common/Alert';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-nunito',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AlertProvider>
      <TemperatureProvider>
        <main className={`${nunito.variable} font-sans`}>
          <AlertContainer />
          <Component {...pageProps} />
        </main>
      </TemperatureProvider>
    </AlertProvider>
  )
}
