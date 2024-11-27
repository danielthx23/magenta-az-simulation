import Link from "next/link"

interface FinalizeProps {
    loading: boolean,
    pontos: number
}

const Finalize = ({ loading, pontos }: FinalizeProps) => {
    return (
        <main className="h-screen w-full flex justify-center items-center bg-white">
            {loading ? <h1 className="text-black">Finalizando quiz e gerando resultados, aguarde...</h1> : 
            <div className="w-[600px] h-[600px] rounded-full bg-[#e3017e] flex flex-col justify-center items-center gap-4 ">
                <h1 className="text-white text-xl">Quiz finalizado! Você marcou</h1>
                <h1 className="text-white text-2xl">{pontos} / 1000 pontos</h1>
                <Link href={"/leaderboard"} className="bg-white px-4 py-2 rounded-md text-[#e3017e]">Acessar Leaderboard</Link>
            </div>}
        </main>
    )

}

export default Finalize