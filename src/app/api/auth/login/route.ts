import { NextResponse } from 'next/server';
import { createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const expectedEmail = (process.env.ADMIN_EMAIL || 'contato@lazaroantunes.com.br').toLowerCase().trim();
    const expectedPassword = process.env.ADMIN_PASSWORD || 'Lazaro@2026';

    const inputEmail = (email || '').toLowerCase().trim();
    const inputPassword = (password || '').trim();

    if (inputEmail !== expectedEmail || inputPassword !== expectedPassword) {
      return NextResponse.json(
        { ok: false, error: 'E-mail ou senha incorretos.' },
        { status: 401 }
      );
    }

    const token = createSessionToken(inputEmail);

    const response = NextResponse.json({
      ok: true,
      message: 'Login realizado com sucesso!',
      user: { email: inputEmail, name: 'Lázaro Antunes' },
    });

    // Define cookie HttpOnly seguro
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 dias
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
