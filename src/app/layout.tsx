import type { Metadata } from 'next';
import Link from 'next/link';

import './globals.css';

export const metadata: Metadata = {
  title: 'GreenField Agriculture Catalog',
  description: 'Browse agriculture products and contact us by phone or email to place orders.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <header className="siteHeader">
          <div className="container navBar">
            <Link href="/" className="brand">
              GreenField Agriculture
            </Link>
            <nav>
              <Link href="/">Catalog</Link>
              <Link href="/admin">Admin Panel</Link>
            </nav>
          </div>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
