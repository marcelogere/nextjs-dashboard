import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Rutas completamente públicas (no requieren autenticación)
const isPublicRoute = createRouteMatcher([
  '/',
  '/api/webhook(.*)',
]);

// Rutas de API que deben ignorarse
const isIgnoredRoute = createRouteMatcher([
  '/_next(.*)',
  '/favicon.ico',
]);

export default clerkMiddleware(async (auth, req) => {
  // Ignorar ciertas rutas
  if (isIgnoredRoute(req)) {
    return NextResponse.next();
  }

  // Obtener sesión de Clerk
  const { userId } = await auth();

  // Si el usuario está autenticado y está en la página principal, redirigir al dashboard
  if (userId && req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Permitir rutas públicas
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Si no hay sesión activa, redirigir al sign-in de Clerk
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Usuario autenticado → continuar
  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)',
    '/',
    '/(api|trpc)(.*)',
  ],
};