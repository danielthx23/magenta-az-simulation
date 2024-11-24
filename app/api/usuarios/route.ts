import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { email_usuario, nickname_usuario, imagem } = await request.json();

  const usuario = await prisma.usuarios.create({
    data: {
      email_usuario,
      nickname_usuario,
      imagem,
    },
  });

  return NextResponse.json(usuario, { status: 201 });
}

export async function GET() {
  const usuarios = await prisma.usuarios.findMany();
  return NextResponse.json(usuarios);
}