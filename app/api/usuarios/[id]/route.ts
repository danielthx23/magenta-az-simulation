import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { uploadImageToAzure } from '../../../../services/azurestorage/azurestorage.service';

const prisma = new PrismaClient();

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    const id = (await params).id;
    const { email_usuario, nickname_usuario, imagem } = await request.json();

    const usuario = await prisma.usuarios.update({
        where: { id_usuario: Number(id) },
        data: {
            email_usuario: email_usuario,
            nickname_usuario: nickname_usuario,
        },
    });

    const imageUrl = await uploadImageToAzure(imagem, "usuarios");

    await prisma.usuarios.update({
        where: { id_usuario: Number(usuario.id_usuario) }, 
        data: {
            ...(imageUrl && { imagem: imageUrl }), 
        },
      });

    return NextResponse.json(usuario);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
    const id = (await params).id;

    await prisma.usuarios.delete({
        where: { id_usuario: Number(id) },
    });

    return NextResponse.json({ message: 'Usuario deleted successfully!' }, { status: 204 });
}