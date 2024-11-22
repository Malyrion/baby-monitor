import Page from '../components/common/layouts/Page';
import Section from '../components/common/layouts/Section';
import Home from '../components/Home';

/**
 * Home Page Component
 * Displays temperature and area to load image
 * 
 * @component
 * @page /
 * 
 * @description
 * This page provides visual temperature data through websocket connection
 * 
 * @returns {JSX.Element} Home page
 */
export default function main(): JSX.Element {
  return (
    <Page title="Home">
      <Section>
        <Home />
      </Section>
    </Page>
  );
}
