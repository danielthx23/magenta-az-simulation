'use client';

import { PropsWithChildren, useEffect, useState } from "react";
import AuthContext from "./authcontext.context";
import { useRouter } from "next/navigation";
import { Usuarios } from "../../types/usuarios/usuarios.type";
import { FormState } from "../../hooks/useform/useform.hook";
import { toastAlerta } from "../../utils/toastalerta/toastalerta.util";

interface AuthProviderProps extends PropsWithChildren {}

export function AuthProvider({ children }: AuthProviderProps) {
    const router = useRouter();
    const [usuario, setUsuario] = useState<Usuarios | null>(null);

    const allowedEmails = [
        'danielakiyama8@gmail.com',
        'Anaclaramelo2707@gmail.com',
        'camilacsm.m26@gmail.com',
    ];

    async function handleLogin(usuarioLogin: FormState) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(usuarioLogin),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha no login');
            }

            const data = await response.json();
            setUsuario(data.usuario);

            const token = `${usuarioLogin.email_usuario}:${usuarioLogin.senha}`;
            localStorage.setItem('authToken', token);

            if (allowedEmails.includes(usuarioLogin.email_usuario)) {
                router.push('/dashboard'); 
            } else {
                router.push('/quiz'); 
            }

            toastAlerta("Login realizado com sucesso!", "sucesso");
        } catch (error) {
            const errorMessage =
                error instanceof Error && error.message
                    ? error.message
                    : "Erro inesperado ocorreu ao realizar login.";

                toastAlerta("Falha no Login: " + errorMessage, "erro")
        }
    }

    function handleLogout() {
        setUsuario(null);
        localStorage.removeItem('authToken');
        router.push('/');
    }

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            const [email, senha] = token.split(':');
            const loginData = { email_usuario: email, senha: senha } as FormState;

            handleLogin(loginData);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ usuario, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
}
