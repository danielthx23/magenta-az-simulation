import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json();
  const { updatedPergunta, updatedAlternativas } = body;

  const updatedData = await prisma.perguntas.update({
    where: { id_pergunta: Number(params.id) },
    data: {
      pergunta: updatedPergunta,
      Alternativas: {
        upsert: updatedAlternativas.map((alt: any) => ({
          where: { id_alternativa: alt.id_alternativa },
          create: alt,
          update: alt,
        })),
      },
    },
    include: { Alternativas: true },
  });

  return NextResponse.json(updatedData);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id); 

  await prisma.$transaction(async (prisma: PrismaClient) => {
    await prisma.alternativas.deleteMany({
      where: { perguntaId: id },
    });

    await prisma.perguntas.delete({
      where: { id_pergunta: id },
    });
  });

  return NextResponse.json({ message: 'Pergunta deletada com sucesso!' }, { status: 204 });
}