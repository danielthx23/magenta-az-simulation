"use client"

import Link from "next/link";
import useAuth from "../../hooks/useauth/useauth.hook"
import { getBlobUrl } from "../../services/azurestorage/azurestorage.service";
import Button from "../button/button.component"
import Image from 'next/image';

const NavBar = () => {
    const {usuario, handleLogout} = useAuth()
    return (
        header className="w-full p-4 sticky top-0 left-0 flex justify-end px-16 gap-4 items-center bg-white">
            <nav className="w-full h-full text-lg text-black flex justify-between px-16">
                <ul>
                    <Link href="/feedback">Feedback</Link>
                </ul>
                <ul className="flex gap-4">
                    <li>{ usuario && <figure className="w-12 h-12">
                    <Image height={500} width={500} src={getBlobUrl(usuario.imagem)} alt="Preview" className="w-12 h-12 object-cover rounded-full" />
                </figure>}</li>
                <li>
                { usuario && <Button handleClick={() => handleLogout()} className="text-red-600 text-lg">Log Out</Button>}
                </li>
                </ul>
            </nav>
          </header>
    )    
}

export default NavBar