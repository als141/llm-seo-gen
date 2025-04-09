import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// 認証が不要なパブリックルートを定義
const isPublicRoute = createRouteMatcher([
  '/',
  '/auth/sign-in',
  '/auth/sign-up',
  '/api/webhook/stripe',
  '/api/webhook/clerk'
]);

export default clerkMiddleware(async (auth, req) => {
  // パブリックルート以外は認証を要求
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
