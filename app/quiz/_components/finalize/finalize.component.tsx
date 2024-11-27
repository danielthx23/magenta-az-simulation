import Link from "next/link"
import Image from 'next/image';
interface FinalizeProps {
    loading: boolean,
    pontos: number
}

const Finalize = ({ loading, pontos }: FinalizeProps) => {
    return (
        <main className="h-screen w-full flex justify-center items-center ">
            {loading ? <h1 className="text-black">Finalizando quiz e gerando resultados, aguarde...</h1> : 
            <div >
                <Image  className="w-full h-auto object-cover" width={500} height={100}  src="https://cdn-icons-png.flaticon.com/512/2121/2121069.png" alt="img" />
                <h1 className="text-black text-xl">Parabéns! Você marcou:</h1>
                <div className="w-[250px] h-[250px] rounded-full bg-[#ffffff] flex flex-col justify-center items-center gap-4 ">

                <h1 className="text-black text-2xl">{pontos} / 1000 pontos</h1>
                <Link href={"/leaderboard"} className="bg-gray-400 px-4 py-2 rounded-md text-[#e3017e]">Acessar Leaderboard</Link>
                </div>
            </div>}
        </main>
    )

}

export default Finalize