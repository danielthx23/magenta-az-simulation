import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const id = (await params).id;

  const respostasUsuarios = await prisma.respostas_Usuarios.findMany({
    where: { id_usuario: Number(id) },
    include: {
      Usuarios: true,
      Perguntas: true, 
      Alternativas: true, 
    },
  });

  return NextResponse.json(respostasUsuarios);
}