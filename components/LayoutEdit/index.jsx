import Card from '@components/Card';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';

export default function LayoutEdit({ children }) {
  const router = useRouter();

  return (
    <div className="grid gap-3 h-auto items-start lg:grid-cols-12">
      <div className="grid grid-cols-2 lg:grid-cols-none lg:grid-rows-2 lg:gap-y-2 border-b lg:border lg:rounded-lg border-ev-gray lg:col-span-4 lg:py-3 lg:shadow-lg">
        <Link href="/profile/edit">
          <a className={`text-center lg:text-left px-4 py-2 rounded-t-lg lg:rounded-none ${router.pathname === '/profile/edit' ? 'bg-ev-gray' : ''}`}>Profile</a>
        </Link>
        <Link href="/profile/edit/password">
          <a className={`text-center lg:text-left px-4 py-2 rounded-t-lg lg:rounded-none ${router.pathname === '/profile/edit/password' ? 'bg-ev-gray' : ''}`}>Password</a>
        </Link>
      </div>

      <div className="lg:col-span-8">
        <Card padding="px-5 py-10">
          {children}
        </Card>
      </div>
    </div>
  );
}
