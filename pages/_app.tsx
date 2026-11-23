import '../src/styles/globals.scss'

import type { AppProps } from 'next/app'
import Head from 'next/head'

import { NextSeo } from "next-seo";
import Footer from '../src/components/Footer';
import Script from 'next/script';
import * as gtag from '../google';
import { CREATE_SEO_CONFIG } from '../src/utils/utils';
import { ThemeProvider } from 'next-themes'

import 'react-medium-image-zoom/dist/styles.css';


function MyApp({ Component, pageProps, router }: AppProps) {
  const isPortal = router.pathname === "/login" || router.pathname === "/editor" || router.pathname.startsWith("/account/");
  const showTracking = process.env.NODE_ENV === "production" && !isPortal;
  const SEO_CONFIG = CREATE_SEO_CONFIG({});
  return (
    <>
      <NextSeo {...SEO_CONFIG} />
      <Head>
        <link rel="icon" href="/images/DBCM_logo.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1"
        />
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="google" content="notranslate" />
      </Head>

      {
        showTracking ?
          <>
            {gtag.GA_ADSENSE_ID && <Script async
              strategy="afterInteractive" src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${gtag.GA_ADSENSE_ID}`} crossOrigin="anonymous" />}
            {gtag.GA_TRACKING_ID && <>
            <Script async
              strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${gtag.GA_TRACKING_ID}`}></Script>
            <Script
              id="gtag-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gtag.GA_TRACKING_ID}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
            </>}
          </>

          : null
      }
      <ThemeProvider enableSystem={true} attribute="class">
        <Component {...pageProps} />
        <Footer />
      </ThemeProvider>
    </>
  )

}

export default MyApp
