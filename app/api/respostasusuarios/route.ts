import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const respostasUsuarios = await prisma.respostas_Usuarios.findMany({
    include: {
      Usuarios: true,
      Perguntas: true, 
      Alternativas: true, 
    },
  });

  return NextResponse.json(respostasUsuarios);
}

export async function POST(request: Request) {
  const { id_usuario, id_pergunta, id_alternativa, correta } = await request.json();

  const respostaUsuario = await prisma.respostas_Usuarios.create({
    data: {
      id_usuario: id_usuario,
      id_pergunta: id_pergunta,
      id_alternativa: id_alternativa,
      correta: correta,
    },
  });

  return NextResponse.json(respostaUsuario, { status: 201 });
}