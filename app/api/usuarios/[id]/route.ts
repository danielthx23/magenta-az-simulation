import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  const { id_usuario, email_usuario, nickname_usuario, imagem } = await request.json();

  const usuario = await prisma.usuarios.update({
    where: { id_usuario },
    data: { email_usuario, nickname_usuario, imagem },
  });

  return NextResponse.json(usuario);
}

export async function DELETE(request: Request) {
  const { id_usuario } = await request.json();

  await prisma.usuarios.delete({
    where: { id_usuario },
  });

  return NextResponse.json({ message: 'Usuario deleted successfully!' }, { status: 204 });
}