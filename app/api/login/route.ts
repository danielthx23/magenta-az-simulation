import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const apiSecret = process.env.API_SECRET;

export async function POST(request: Request) {
  const { email_usuario, senha } = await request.json();

  try {
    if (!apiSecret) {
      throw new Error('API_SECRET is not set in environment variables');
    }

    const key = Buffer.from(apiSecret, 'hex');
    if (key.length !== 32) {
      throw new Error('API_SECRET must be a 64-character hex string representing 32 bytes');
    }

    const user = await prisma.usuarios.findUnique({
      where: { email_usuario },
      include: {
        Respostas_Usuarios: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

    const encryptedData = user.senha;
    const iv = Buffer.from(encryptedData.slice(0, 32), 'hex');
    const encryptedPassword = encryptedData.slice(32);

    const decipher = crypto.createDecipheriv('aes-256-ctr', key, iv);
    let decryptedPassword = decipher.update(encryptedPassword, 'hex', 'utf8');
    decryptedPassword += decipher.final('utf8');

    if (decryptedPassword === senha) {
      return NextResponse.json({ message: 'Login bem-sucedido', usuario: user }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 });
    }

  } catch (error) {
    console.error('Erro no login:', error);
    return NextResponse.json({ error: 'Erro ao realizar login' }, { status: 500 });
  }
}