import { ImageUpload } from '../components/index';
import Page from '../layouts/Page';
import Section from '../layouts/Section';

export default function Image(): JSX.Element {
  return (
    <Page title="Image">
      <Section className="flex items-center justify-center">
        <ImageUpload></ImageUpload>
      </Section>
    </Page>
  );
}
