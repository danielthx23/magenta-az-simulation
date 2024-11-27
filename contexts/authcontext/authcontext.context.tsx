'use client'

import { createContext } from "react"
import { Usuarios } from "../../types/usuarios/usuarios.type"
import { FormState } from "../../hooks/useform/useform.hook"

interface AuthContextProps {
    usuario: Usuarios | null
    handleLogout(): void
    handleLogin(usuario: FormState): Promise<void>
}

export const AuthContext = createContext({} as AuthContextProps)

export default AuthContext