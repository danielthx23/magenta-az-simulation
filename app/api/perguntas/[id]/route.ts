import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { uploadImageToAzure } from '../../../../services/azurestorage/azurestorage.service';
import { Alternativas } from '../../../../types/alternativas/alternativas.type';  // Import the correct type

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    const id = (await params).id;
    const body = await request.json();
    const { pergunta, Alternativas, imagem } = body;

    let imageUrl = imagem; 

    if (imagem) {
        imageUrl = await uploadImageToAzure(imagem, "perguntas");
    }

    const updatedData = await prisma.perguntas.update({
        where: { id_pergunta: Number(id) },
        data: {
            pergunta: pergunta,
            ...(imageUrl && { imagem: imageUrl }), 
            Alternativas: {
                upsert: Alternativas.map((alt: Alternativas) => ({
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

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    const id = (await params).id;
    const perguntaId = Number(id);

    const pergunta = await prisma.perguntas.findUnique({
        where: { id_pergunta: perguntaId },
    });

    if (!pergunta) {
        return NextResponse.json({ message: 'Pergunta não encontrada!' }, { status: 404 });
    }

    await prisma.$transaction([
        prisma.alternativas.deleteMany({
            where: { id_pergunta: perguntaId },
        }),
        prisma.perguntas.delete({
            where: { id_pergunta: perguntaId },
        }),
    ]);

    return NextResponse.json({ message: 'Pergunta deletada com sucesso!' }, { status: 204 });
}
