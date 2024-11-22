import Page from '../components/common/layouts/Page';
import Section from '../components/common/layouts/Section';
import { Home } from '../components/index';


export default function main(): JSX.Element {
  return (
    <Page title="Home">
      <Section>
        <Home />
      </Section>
    </Page>
  );
}
