import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { id_pergunta, alternativa_correta, texto_alternativa } = await request.json();
  
    const alternativa = await prisma.alternativas.create({
      data: {
        id_pergunta,
        alternativa_correta,
        texto_alternativa,
      },
    });
  
    return NextResponse.json(alternativa, { status: 201 });
  }