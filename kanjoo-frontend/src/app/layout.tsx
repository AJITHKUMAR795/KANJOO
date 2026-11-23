import '@/styles/globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KANJOO | Global AI Personal Finance Intelligence System',
  description: 'Your Money. Your Needs. Your Smarter Decisions.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-navy-900 text-slate-100 min-h-screen antialiased selection:bg-brand-cyan/20 selection:text-brand-cyan">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
