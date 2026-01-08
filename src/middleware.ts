import createMiddleware from 'next-intl/middleware';
import { routing } from './navigation';
import { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: true  // Enable browser language auto-detection
});

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip locale handling for API routes
  if (pathname.startsWith('/api/')) {
    return;
  }

  return intlMiddleware(request);
}

export const config = {
  // Match all pathnames except API routes and static files
  matcher: ['/', '/(ko|en|ja)/:path*', '/((?!api|_next|.*\\..*).*)']
};
