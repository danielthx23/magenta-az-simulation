import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1; 
  const perPage = Number(url.searchParams.get('perPage')) || 10; 
  const offset = (page - 1) * perPage; 

  const totalCount = await prisma.leaderboard.count(); 
  const usuarios = await prisma.leaderboard.findMany({
    orderBy: {
      pontos: 'desc', 
    },
    take: perPage, 
    skip: offset, 
    include: {
      Usuarios: true,
    }
  });

  return NextResponse.json({
    usuarios,
    totalCount,
    page,
    perPage,
    totalPages: Math.ceil(totalCount / perPage),
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { id_usuario, pontos } = body;

  const newPlayer = await prisma.leaderboard.create({
    data: {
      id_usuario: id_usuario,
      pontos: pontos,
    },
  });

  return NextResponse.json(newPlayer, { status: 201 });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id_usuario, pontos } = body;

  const updatedPlayer = await prisma.leaderboard.update({
    where: { id_usuario: id_usuario },
    data: { pontos: pontos },
  });

  return NextResponse.json(updatedPlayer);
}