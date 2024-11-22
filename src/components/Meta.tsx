/**
 * Meta component that sets up all necessary meta tags for the application.
 * Includes basic SEO, PWA capabilities, and theme configurations.
 * 
 * @returns {JSX.Element} Collection of meta tags for the application
 */
const Meta: React.FC = () => {
  return (
    <>
      {/* Basic Meta Tags */}
      <title>ButtonTech</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content="Demo for Button Tech" />
      
      {/* Theme Configuration */}
      <meta name="color-scheme" content="dark light" />
      <meta 
        name="theme-color" 
        content="#F3EFE0" 
        media="(prefers-color-scheme: light)" 
      />
      <meta 
        name="theme-color" 
        content="#18181b" 
        media="(prefers-color-scheme: dark)" 
      />

      {/* PWA Configuration */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-title" content="ButtonTech" />
      <meta name="application-name" content="ButtonTech" />
      
      {/* App Icons */}
      <link 
        rel="apple-touch-icon" 
        sizes="180x180" 
        href="/icons/apple-touch-icon.png" 
      />
      <link 
        rel="icon" 
        type="image/png" 
        sizes="32x32" 
        href="/icons/favicon-32x32.png" 
      />
      <link 
        rel="icon" 
        type="image/png" 
        sizes="16x16" 
        href="/icons/favicon-16x16.png" 
      />
      <link rel="manifest" href="/manifest.json" />

      {/* Open Graph Tags */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="ButtonTech" />
      <meta 
        property="og:description" 
        content="Demo for Button Tech" 
      />
    </>
  );
};

export default Meta;