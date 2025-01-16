import type { Metadata } from 'next';
import './globals.css';
import { Poppins, Fira_Code } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'], // Add weights as needed
  variable: '--font-fira-code', // Define the CSS variable for the font
});

export const metadata: Metadata = {
  title: 'StashBox',
  description: 'StashBox - The only storage solution you need',
};

export default function RootLayout({
  children,
}: Readonly<{
  // eslint-disable-next-line no-undef
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${firaCode.variable}  antialiased`}>{children}</body>
    </html>
  );
}
