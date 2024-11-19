import Page from './layouts/Page';
import Section from './layouts/Section';
import { Home } from './components/index';
// import '../styles/globals.css'; // Adjust the path if needed


export default function main(): JSX.Element {
  return (
    <Page title="Home">
      <Section>
        <Home />
      </Section>
    </Page>
  );
}
