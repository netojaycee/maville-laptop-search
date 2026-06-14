import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/onyami')
  const isLoginPage = req.nextUrl.pathname === '/onyami/login'

  if (isAdminRoute && !isLoginPage && !req.auth) {
    const loginUrl = new URL('/onyami/login', req.url)
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isLoginPage && req.auth) {
    return NextResponse.redirect(new URL('/onyami', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/onyami/:path*'],
}
