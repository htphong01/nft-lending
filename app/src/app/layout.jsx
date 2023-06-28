import { Providers } from '@/redux/provider';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import '@/styles/global.css';

export default function RootLayout({ children }) {
  return (
    // <Provider store={store}>
    <html lang='en' suppressHydrationWarning>
      <head>
        <title>AvengersFI</title>
      </head>
      <body>
        <Providers>
          <Header />
          <div className='container'>{children}</div>
          <Footer />
        </Providers>
      </body>
    </html>
    // </Provider>
  );
}
