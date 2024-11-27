import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id_usuario = Number((await params).id); 

  try {
    await prisma.$transaction([
      prisma.respostas_Usuarios.deleteMany({
        where: { id_usuario },
      }),
      prisma.leaderboard.deleteMany({
        where: { id_usuario },
      }),
    ]);

    return NextResponse.json({ message: 'User quiz data reset successfully!' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to reset user quiz data' }, { status: 400 });
  }
}
