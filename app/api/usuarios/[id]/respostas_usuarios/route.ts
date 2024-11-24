import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Params {
  id: string;
}

export async function GET(request: Request, { params }: { params: Params }) {
  const id_usuario = Number(params.id);

  const respostasUsuarios = await prisma.respostas_usuarios.findMany({
    where: { id_usuario },
    include: {
      Usuarios: true,
      Perguntas: true, 
      Alternativas: true, 
    },
  });

  return NextResponse.json(respostasUsuarios);
}