import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const { pathname } = request.nextUrl;
  const method = request.method;

  const allowedEmails = [
    'danielakiyama8@gmail.com',
    'Anaclaramelo2707@gmail.com',
    'camilacsm.m26@gmail.com',
  ];
  const isLoginOrUsuariosPost =
    pathname.startsWith('/api/login') ||
    (pathname.startsWith('/api/usuarios') && method === 'POST');

  if (!authHeader) {
    if (isLoginOrUsuariosPost) {
      return NextResponse.next();
    }
    return NextResponse.json(
      { message: 'Header de autorização ausente.' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1];
  if (!token || !isValidEmail(token)) {
    return NextResponse.json(
      { message: 'Token de autorização inválido.' },
      { status: 403 }
    );
  }

  if (allowedEmails.includes(token)) {
    const response = NextResponse.next();
    response.headers.set('x-user-email', token);
    return response;
  }

  if (
    (pathname.startsWith('/api/leaderboard') && ['GET', 'POST'].includes(method)) ||
    (pathname.startsWith('/api/perguntas') && method === 'GET') ||
    (pathname.startsWith('/api/respostasusuarios') && method === 'POST') ||
    (pathname.startsWith('/api/usuarios') && ['POST', 'PUT'].includes(method))
  ) {
    const response = NextResponse.next();
    response.headers.set('x-user-email', token);
    return response;
  }

  return NextResponse.json(
    { message: 'Acesso não autorizado.' },
    { status: 403 }
  );
}

function isValidEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export const config = {
  matcher: [
    '/api/:path*', 
  ],
};
