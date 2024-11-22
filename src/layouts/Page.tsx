import Head from 'next/head';
import { BottomNav, HeaderNav } from '../components/index';

/**
 * Interface for Page component props
 */
interface PageProps {
  /** Page title - will be prefixed with 'ButtonTech |' except for Home page */
  title: string;
  /** Optional className for the main content article */
  className?: string;
  /** Page content */
  children: React.ReactNode;
}

/**
 * Page component that provides consistent layout structure across the application.
 * Automatically handles page titles and includes common navigation elements.
 * 
 * @component
 * @param {PageProps} props - The component props
 * @returns {JSX.Element} The page layout structure
 * 
 * @example
 * return (
 *   <Page title="Dashboard" className="dashboard-content">
 *     <DashboardContent />
 *   </Page>
 * )
 */
const Page: React.FC<PageProps> = ({ 
  title, 
  className, 
  children 
}): JSX.Element => {
  // Generate page title - special case for home page
  const pageTitle = title === 'Home' ? 'ButtonTech' : `ButtonTech | ${title}`;

  return (
    <>
      {/* Head section for page metadata */}
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <HeaderNav />

      {/* Main content area */}
      <main>
        <article className={className}>
          {children}
        </article>
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </>
  );
};

export default Page;