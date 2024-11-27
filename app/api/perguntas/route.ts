import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { uploadImageToAzure } from '../../../services/azurestorage/azurestorage.service';

const prisma = new PrismaClient();

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const quantity = searchParams.get('quantity') || '10'; 

    const perguntas = await prisma.perguntas.findMany({
        where: { ativa: true },
        take: Number(quantity),
        include: {
            Alternativas: true, 
          },
    });

    const shuffledPerguntas = perguntas.sort(() => 0.5 - Math.random());
    return NextResponse.json(shuffledPerguntas);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { pergunta, Alternativas, imagem } = body;

    const newPergunta = await prisma.perguntas.create({
        data: {
            pergunta: pergunta,
            ativa: true,
            imagem: "", 
            Alternativas: {
                create: Alternativas, 
            },
        },
        include: { Alternativas: true },
    });

    if(imagem !== undefined) {

    const imageUrl = await uploadImageToAzure(imagem, "perguntas");

    await prisma.perguntas.update({
        where: { id_pergunta: Number(newPergunta.id_pergunta) }, 
        data: {
            ...(imageUrl && { imagem: imageUrl }),
        },
      });
    }

    return NextResponse.json(newPergunta, { status: 201 });
}