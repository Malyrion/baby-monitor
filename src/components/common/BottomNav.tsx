import Link from 'next/link';
import { useRouter } from 'next/router';
import { bottomNavigation } from './navigation';

/**
 * Bottom navigation bar component for mobile devices
 * Includes home and insights page navigation with icons
 * 
 * @returns {JSX.Element} Bottom navigation component
 */
function BottomNav(): JSX.Element {
  const router = useRouter();

  return (
    <div className="sm:hidden"> {/* Mobile only */}
      <nav className="fixed bottom-0 w-full rounded-t-2xl bg-[#f4f4f5] border-t dark:bg-[#18181b] dark:border-[#393941]">
        <div className="mx-auto h-16 max-w-md flex items-center justify-around px-6">
          {bottomNavigation.map((links) => (
            <Link
              key={links.id}
              href={links.href}
              className={`
                flex h-full w-full flex-col items-center justify-center space-y-1
                ${router.pathname === links.href 
              ? 'dark:text-[#fff9d9] text-[#0099FF]' // active link
              : 'dark:text-[#99A8B2] dark:hover:text-[#FEFBF6] text-[#3C4048] hover:text-[#F2DF3A]' // inactive link
            }
              `}
            >
              {links.icon}
              <span className="text-xs text-[#000] dark:text-[#FEFBF6]">
                {links.label}
              </span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default BottomNav;
