import ImagePreview from '@/components/ImagePreview';
import Page from '../components/common/layouts/Page';
import Section from '../components/common/layouts/Section';
import TemperatureGraph from '../components/TemperatureGraph';

export default function Insights(): JSX.Element {
  return (
    <Page title="Insights">
      <Section className="max-w-6xl mx-auto px-4 py-8">
        <Section className="space-y-8">
          <Section className=" backdrop-blur-sm rounded-lg shadow-lg p-6">
            <TemperatureGraph />
          </Section>
          <Section className=" backdrop-blur-sm rounded-lg shadow-lg p-6">
            <ImagePreview />
          </Section>
        </Section>
      </Section>
    </Page>
  );
}