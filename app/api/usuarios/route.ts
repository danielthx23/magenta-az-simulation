import { NextResponse } from 'next/server';
import { uploadImageToAzure } from '../../../services/azurestorage/azurestorage.service';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const apiSecret = process.env.API_SECRET;

export async function POST(request: Request) {
  try {
    if (!apiSecret) {
      throw new Error('API_SECRET is not set in environment variables');
    }

    const key = Buffer.from(apiSecret, 'hex');
    if (key.length !== 32) {
      throw new Error('API_SECRET must be a 64-character hex string representing 32 bytes');
    }

    const body = await request.json();
    const { email_usuario, nickname_usuario, imagem, senha } = body;

    if (!email_usuario || !nickname_usuario || !senha) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    const iv = crypto.randomBytes(16); 
    const cipher = crypto.createCipheriv('aes-256-ctr', key, iv);
    let encryptedPassword = cipher.update(senha, 'utf8', 'hex');
    encryptedPassword += cipher.final('hex');
    const encryptedData = iv.toString('hex') + encryptedPassword;

    const user = await prisma.usuarios.create({
      data: {
        email_usuario,
        nickname_usuario,
        senha: encryptedData,
        imagem: 'https://storageaccmagenta01.blob.core.windows.net/magentapplication/usuarios/profile.png' 
      },
    });
    
    if(imagem !== undefined) {

    const imageUrl = await uploadImageToAzure(imagem, 'usuarios');
    
    await prisma.usuarios.update({
      where: { id_usuario: Number(user.id_usuario) }, 
      data: {
        ...(imageUrl && { imagem: imageUrl }),
      },
    });
  }

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    return NextResponse.json(
      { error: 'Falha ao criar usuário. Verifique os dados e tente novamente.' },
      { status: 500 }
    );
  }
}
