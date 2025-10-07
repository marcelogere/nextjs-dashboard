import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Rutas públicas (no requieren autenticación)
const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',   // añade aquí la ruta de sign-in para permitir acceso público
  '/api/webhook(.*)',
]);

// Rutas ignoradas (assets, _next, favicon, etc)
const isIgnoredRoute = createRouteMatcher([
  '/_next(.*)',
  '/favicon.ico',
]);

export default clerkMiddleware(async (auth, req) => {
  // Ignorar rutas de assets
  if (isIgnoredRoute(req)) {
    return NextResponse.next();
  }

  const { userId } = await auth();

  // Permitir rutas públicas sin autenticación
  if (isPublicRoute(req)) {
    // Ya sea usuario autenticado o no, puede acceder aquí
    return NextResponse.next();
  }

  // Si usuario está autenticado y está en landing page, redirigir a dashboard
  if (userId && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Si usuario no está autenticado y está en ruta protegida, redirigir al login
  if (!userId) {
    return NextResponse.redirect(new URL('https://true-dogfish-43.accounts.dev/sign-in', req.url));
  }

  // Usuario autenticado en rutas protegidas: permitir acceso
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',  // proteger todas rutas que no sean archivos estáticos ni _next
    '/',
    '/(api|trpc)(.*)',
  ],
};
