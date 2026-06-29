import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL('https://triageai.vercel.app'),
  title: {
    default: 'TriageAI — Smart Support Ticket Triage',
    template: '%s · TriageAI',
  },
  description:
    'AI support ticket triage that auto-resolves the easy tickets, smart-escalates the rest to humans, and scores every ticket for sentiment, priority and confidence — in a clean, modern dashboard.',
  applicationName: 'TriageAI',
  keywords: [
    'AI support',
    'support ticket triage',
    'auto-resolution',
    'customer support automation',
    'helpdesk AI',
    'smart escalation',
    'sentiment analysis',
    'Gemini',
    'Supabase',
    'Next.js',
  ],
  authors: [{ name: 'TriageAI' }],
  creator: 'TriageAI',
  category: 'technology',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: 'TriageAI',
    url: '/',
    locale: 'en_US',
    title: 'TriageAI — Smart Support Ticket Triage',
    description:
      'Auto-resolve, auto-reply and smart-escalate support tickets with AI. Sentiment, priority and confidence scoring in one clean dashboard.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TriageAI — Smart Support Ticket Triage',
    description:
      'AI that triages, auto-resolves and escalates your support tickets — wrapped in a clean, modern dashboard.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export const viewport = {
  themeColor: '#2563eb',
};

// Set the theme class before paint to avoid a flash of the wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');var d=t? t==='dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.classList.toggle('dark',d);}catch(e){}})();`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
