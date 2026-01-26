import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Next.js Proxy for Route Protection
 * Since we use localStorage for client-side authentication,
 * this proxy primarily handles route configuration.
 * Actual authentication checks are done in layout components.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function proxy(_request: NextRequest) {
  // Allow the request to proceed
  // Authentication is handled client-side in layout components
  return NextResponse.next();
}

/**
 * Proxy configuration
 * Specifies which routes the proxy should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
