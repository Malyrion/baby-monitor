import Page from './layouts/Page';
import Section from './layouts/Section';


export default function image(): JSX.Element {
  return (
    <Page title="image">
      <Section className="flex items-center justify-center">
        <p>Upload your image here</p>
      </Section>
    </Page>
  );
}
