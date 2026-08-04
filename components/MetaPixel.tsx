"use client";

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Script from 'next/script';

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

/**
 * Helper to dispatch custom Meta Ads pixel events from any component
 * e.g., trackMetaEvent('AddToCart', { content_name: 'Petal Bra', value: 399, currency: 'INR' })
 */
export function trackMetaEvent(eventName: string, options?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.fbq && META_PIXEL_ID) {
    window.fbq('track', eventName, options);
  }
}

function PixelTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname && window.fbq && META_PIXEL_ID) {
      window.fbq('track', 'PageView');
    }
  }, [pathname, searchParams]);

  return null;
}

export default function MetaPixel() {
  if (!META_PIXEL_ID) {
    return null;
  }

  return (
    <>
      <Script
        id="meta-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt="Meta Pixel"
        />
      </noscript>
      <Suspense fallback={null}>
        <PixelTracker />
      </Suspense>
    </>
  );
}
