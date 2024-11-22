import Link from 'next/link';

/**
 * Custom 404 page component
 * Displays a 404 error message with a link to return home
 * Includes responsive design and dark mode support
 *
 * @returns {JSX.Element} 404 error page
 */
export default function FourOFour(): JSX.Element {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="w-7/12 md:w-4/12 lg:w-3/12"></div>

      <div className="text-5xl font-bold">404</div>

      {/* Content Section */}
      <div className="flex flex-col items-center justify-center">
        {/* Error Message */}
        <p className="text-3xl md:text-4xl lg:text-5xl text-gray-800 dark:text-[#f2f2f2] mt-8">
          Page Not Found
        </p>

        {/* Description */}
        <p className="md:text-lg lg:text-xl text-gray-600 dark:text-[#cccccc] mt-8">
          Sorry, the page you are looking for doesn&lsquo;t exist.
        </p>

        {/* Return Home Button */}
        <Link
          href="/"
          title="Return Home"
          className="
            flex items-center space-x-2 
            bg-[#0099ff] hover:bg-[#0087ff] 
            text-gray-100 
            px-4 py-2 mt-12 
            rounded 
            transition duration-150
          "
        >
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
