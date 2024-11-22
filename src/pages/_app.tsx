import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { TemperatureProvider } from '../contexts/TemperatureContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <TemperatureProvider>
  <Component {...pageProps} />
  </TemperatureProvider>)
}
