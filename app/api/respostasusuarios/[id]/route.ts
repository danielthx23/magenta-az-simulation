// app/api/respostas_usuarios/[id]/route.ts

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(request: Request) {
  const { id_usuario, id_pergunta, id_alternativa, correta } = await request.json();

  const respostaUsuario = await prisma.respostas_Usuarios.update({
    where: { id_usuario_id_pergunta_id_alternativa: { id_usuario, id_pergunta, id_alternativa } },
    data: { correta: correta },
  });

  return NextResponse.json(respostaUsuario);
}

export async function DELETE(request: Request) {
  const { id_usuario, id_pergunta, id_alternativa } = await request.json();

  await prisma.respostas_Usuarios.delete({
    where: { id_usuario_id_pergunta_id_alternativa: { id_usuario, id_pergunta, id_alternativa } },
  });

  return NextResponse.json({ message: 'Resposta do usuário deletada com sucesso!' }, { status: 204 });
}