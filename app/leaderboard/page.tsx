"use client";

import { useEffect, useState } from "react";
import { Leaderboard } from "../../types/leaderboard/leaderboard.type";
import useAuth from "../../hooks/useauth/useauth.hook";
import { toastAlerta } from "../../utils/toastalerta/toastalerta.util";
import { useRouter } from "next/navigation";

const LeaderboardPage = () => {
  const {usuario} = useAuth();
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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Leaderboard</h1>
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Rank</th>
            <th className="px-4 py-2 border-b">Apelido</th>
            <th className="px-4 py-2 border-b">Pontos</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.length > 0 ? leaderboard.map((entry: Leaderboard, index) => (
            <tr key={entry.Usuarios?.nickname_usuario} className="border-b">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{entry.Usuarios?.nickname_usuario}</td>
              <td className="px-4 py-2">{entry.pontos}</td>
            </tr>
          )) : <h1>Não há ninguem no leaderboard</h1>}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardPage;
