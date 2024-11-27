"use client"

import useAuth from "../../hooks/useauth/useauth.hook"
import { getBlobUrl } from "../../services/azurestorage/azurestorage.service";
import Button from "../button/button.component"
import Image from 'next/image';

const NavBar = () => {
    const {usuario, handleLogout} = useAuth()
    return (
        <header className="w-full p-8 sticky top-0 left-0 flex justify-end px-16 gap-4 items-center bg-white">
            { usuario && <figure className="w-12 h-12">
                    <Image height={500} width={500} src={getBlobUrl(usuario.imagem)} alt="Preview" className="w-12 h-12 object-cover rounded-full" />
                </figure>}
            { usuario && <Button handleClick={() => handleLogout()} className="text-red-600 text-lg">Log Out</Button>}
          </header>
    )    
}

export default NavBar