import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Params {
  id: string;
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const id = Number(params.id);
  const { alternativa_correta, texto_alternativa } = await request.json();

  const alternativa = await prisma.alternativas.update({
    where: { id_alternativa: id },
    data: { alternativa_correta, texto_alternativa },
  });

  return NextResponse.json(alternativa);
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  const id = Number(params.id);

  await prisma.alternativas.delete({
    where: { id_alternativa: id },
  });

  return NextResponse.json({ message: 'Alternativa deletada com sucesso!' }, { status: 204 });
}