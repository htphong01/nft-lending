import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import '@/styles/global.css';

export default function RootLayout({ children }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <title>Next.js</title>
      </head>
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
