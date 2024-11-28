"use client";

import { useEffect, useState } from "react";
import { Leaderboard } from "../../types/leaderboard/leaderboard.type";
import useAuth from "../../hooks/useauth/useauth.hook";
import { toastAlerta } from "../../utils/toastalerta/toastalerta.util";
import { useRouter } from "next/navigation";
import { FaTrophy } from "react-icons/fa6";
import Image from "next/image";


const LeaderboardPage = () => {
  const { usuario } = useAuth();
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  if (!usuario) {
    toastAlerta("Você precisa estar logado para acessar o LeaderBoard!", "info");
    router.push("/login")
  }

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/leaderboard", {
          headers: {
            Authorization: `Bearer ${usuario?.email_usuario}`,
          },
        });
        const data = await response.json();
        setLeaderboard(data.usuarios);
      } catch (error) {
        console.error("Erro ao buscar leaderboard:", error);
        toastAlerta("Erro ao buscar leaderboard", "erro")
      } finally {
        setLoading(false)
      }
    };

    fetchLeaderboard();
  }, [usuario?.email_usuario]);

  if (loading) {
    return <div className="w-full h-screen text-center flex justify-center items-center">Carregando leaderboard...</div>;
  }

  return (
    <div className="py-6 bg-pink-600 h-[90vh]">
      <FaTrophy size={32} color="orange" className="m-auto" />
      <h1 className="text-3xl font-semibold mb-4 text-center p-2  text-white  ">Ranking</h1>
      <section className="w-full h-[80vh] bg-white py-10 rounded-t-[50px]  ">

        {leaderboard.length > 0 ? leaderboard.map((entry: Leaderboard, index) => (
          <div
            key={entry.Usuarios?.nickname_usuario}
            className={`flex m-auto items-center justify-between w-[95%] p-4 rounded-[20px] ${index === 0
              ? 'bg-yellow-400'
              : index === 1
                ? 'bg-gray-300'
                : index === 2
                  ? 'bg-yellow-700'
                  : 'bg-white'
              } border-2 border-gray-300 shadow-md rounded-md mb-2`} >

            <div className="flex items-center">
              <h4 className="text-xl font-bold text-gray-800 mr-6 p-2">{index + 1}</h4>
              <h1 className="text-lg  text-gray-900">
                {entry.Usuarios?.nickname_usuario.toLocaleUpperCase() || 'Usuário Desconhecido'}
              </h1>
            </div>

            {/* <Image width={100} height={100} src="#" alt="Foto do User"/> */}

            <h4 className="text-xl text-gray-600">
              {entry.pontos + ' pt ' || 'N/A'}
            </h4>
          </div>
        )) : (
          <h1 className="text-center text-gray-500 text-xl mt-4">
            Não há ninguém no leaderboard
          </h1>
        )}

      </section>

    </div>
  );
};

export default LeaderboardPage;
