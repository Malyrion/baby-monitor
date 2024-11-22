import Page from '../components/common/layouts/Page';
import Section from '../components/common/layouts/Section';
import TemperatureGraph from '../components/TemperatureGraph';

/**
 * Insights Page Component
 * Displays temperature data visualization and analytics
 * 
 * @component
 * @page /insights
 * 
 * @description
 * This page provides visual insights into temperature data through graph
 * 
 * @returns {JSX.Element} Rendered insights page
 */
export default function Insights(): JSX.Element {
  return (
    <Page title="Insights">
      {/* Main container with maximum width and padding */}
      <Section className="max-w-6xl mx-auto px-4 py-8">
        {/* Content section with vertical spacing */}
        <Section className="space-y-8">
          {/* Temperature graph card with blur effect */}
          <Section className="backdrop-blur-sm rounded-lg shadow-lg p-6">
            <TemperatureGraph />
          </Section>
        </Section>
      </Section>
    </Page>
  );
}