import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request,  { params }: { params: Promise<{ id: string }> }) {
  const { pontos } = await request.json();
  const id_usuario = Number((await params).id);

  try {
    const updatedPlayer = await prisma.leaderboard.update({
      where: { id_usuario },
      data: { pontos },
    });

    return NextResponse.json(updatedPlayer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update leaderboard entry'}, { status: 400 });
    console.error(error);
  }
}

export async function DELETE(request: Request,  { params }: { params: Promise<{ id: string }> }) {
  const id_usuario = Number((await params).id); 

  try {
    await prisma.leaderboard.delete({
      where: { id_usuario },
    });

    return NextResponse.json({ message: 'Leaderboard entry deleted successfully!' }, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete leaderboard entry' }, { status: 400 });
    console.error(error);
  }
}
