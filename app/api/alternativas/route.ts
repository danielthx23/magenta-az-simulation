import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    const { alternativa_correta, texto_alternativa, id_pergunta } = await request.json();
  
    const alternativa = await prisma.alternativas.create({
      data: {
        alternativa_correta: alternativa_correta,
        texto_alternativa: texto_alternativa,
        Perguntas: {
          connect: { id_pergunta: id_pergunta }, 
      }
      },
    });
  
    return NextResponse.json(alternativa, { status: 201 });
  }