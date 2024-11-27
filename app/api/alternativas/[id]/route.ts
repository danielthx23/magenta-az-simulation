import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const id = (await params).id;

  try {
    const { alternativa_correta, texto_alternativa, id_pergunta } = await request.json();

    const alternativa = await prisma.alternativas.update({
      where: { id_alternativa: Number(id) },
      data: {
        alternativa_correta: alternativa_correta,
        texto_alternativa: texto_alternativa,
        id_pergunta: id_pergunta, 
      },
      include: {
        Perguntas: true,
        Respostas_Usuarios: true, 
      },
    });

    return NextResponse.json(alternativa);
  } catch (error) {
    console.error("Error updating alternativa:", error);
    return NextResponse.json(
      { error: "Failed to update alternativa", details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
  const id = (await params).id;

  try {
    const deletedAlternativa = await prisma.alternativas.delete({
      where: { id_alternativa: Number(id) },
      include: {
        Respostas_Usuarios: true, 
      },
    });

    return NextResponse.json({ 
      message: 'Alternativa deletada com sucesso!', 
      deletedAlternativa 
    }, { status: 200 });
  } catch (error) {
    console.error("Error deleting alternativa:", error);
    return NextResponse.json(
      { error: "Failed to delete alternativa", details: error },
      { status: 500 }
    );
  }
}
