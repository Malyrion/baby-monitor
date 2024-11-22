import Head from 'next/head';
import BottomNav from '../BottomNav';
import HeaderNav from '../HeaderNav';

/**
 * Interface for Page component props
 */
interface PageProps {
  title: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Provides layout and title for the page
 * 
 * @component
 * @param {PageProps} props - The component props
 * @returns {JSX.Element} The page layout structure
 * 
 */
const Page: React.FC<PageProps> = ({ 
  title, 
  className, 
  children, 
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