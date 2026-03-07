import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    const body = await request.json();
    const { password } = body;

    const rawAdminPassword = process.env.ADMIN_PASSWORD;

    // Testamos a senha de várias formas para garantir o acesso:
    // 1. Senha limpa (sem aspas)
    // 2. Senha como está no ENV
    const cleanAdminPassword = rawAdminPassword?.replace(/^["']|["']$/g, '').trim();

    if (password === cleanAdminPassword || password === rawAdminPassword) {
        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'active', {
            httpOnly: true,
            secure: true, // Forçamos true para garantir funcionamento em HTTPS (Vercel)
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7, // 1 semana
            path: '/',
        });

        return NextResponse.json({ success: true });
    }

    console.log('Tentativa de login falhou. Verifique se a variável ADMIN_PASSWORD está definida na Vercel.');
    return NextResponse.json({ success: false }, { status: 401 });
}
