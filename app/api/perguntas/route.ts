import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const quantity = searchParams.get('quantity') || '10'; 

  const perguntas = await prisma.perguntas.findMany({
    where: { ativa: true },
    take: Number(quantity),
  });

  const shuffledPerguntas = perguntas.sort(() => 0.5 - Math.random());
  return NextResponse.json(shuffledPerguntas);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { pergunta, alternativas } = body;

  const newPergunta = await prisma.perguntas.create({
    data: {
      pergunta,
      ativa: true,
      Alternativas: {
        create: alternativas, 
      },
    },
    include: { Alternativas: true },
  });

  return NextResponse.json(newPergunta, { status: 201 });
}