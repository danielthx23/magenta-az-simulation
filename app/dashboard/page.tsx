'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Input from "../../components/input/input.component";
import Button from "../../components/button/button.component";
import useAuth from "../../hooks/useauth/useauth.hook";
import { Perguntas } from "../../types/perguntas/perguntas.type";
import { RespostasUsuarios } from "../../types/respostasusuarios/respostasusuarios.type";
import { Leaderboard } from "../../types/leaderboard/leaderboard.type";
import Image from 'next/image';
import { getBlobUrl } from "../../services/azurestorage/azurestorage.service";
import Link from "next/link";
import { toastAlerta } from "../../utils/toastalerta/toastalerta.util";

const Dashboard = () => {
    const { usuario } = useAuth();
    const router = useRouter();

    const [perguntas, setPerguntas] = useState<Perguntas[]>([]);
    const [novaPergunta, setNovaPergunta] = useState("");
    const [novaImagem, setNovaImagem] = useState<File | null>(null);
    const [alternativas, setAlternativas] = useState<string[]>([""]);
    const [correta, setCorreta] = useState<number | null>(null);
    const [respostasUsuarios, setRespostasUsuarios] = useState<RespostasUsuarios[]>([]);
    const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
    const [selectedPerguntaId, setSelectedPerguntaId] = useState<number | null>(null);

    useEffect(() => {
        if (!usuario) {
            router.push("/login");
            return;
        }

        fetchPerguntas();
        fetchLeaderboard();
        fetchRespostasUsuarios();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [usuario]);

    const fetchPerguntas = async () => {
        try {
            const response = await fetch("/api/perguntas", {
                headers: {
                    Authorization: `Bearer ${usuario?.email_usuario}`,
                },
            });
            const data = await response.json();
            setPerguntas(data);
        } catch (error) {
            console.error("Erro ao buscar perguntas:", error);
            toastAlerta("Erro ao buscar perguntas", "erro")
        }
    };

    const fetchLeaderboard = async () => {
        try {
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
        }
    };

    const fetchRespostasUsuarios = async () => {
        try {
            const response = await fetch("/api/respostasusuarios", {
                headers: {
                    Authorization: `Bearer ${usuario?.email_usuario}`,
                },
            });
            const data = await response.json();
            setRespostasUsuarios(data);
        } catch (error) {
            console.error("Erro ao buscar respostas dos usuários:", error);
            toastAlerta("Erro ao buscar respostas dos usuários", "erro")
        }
    };

    const addPergunta = async () => {
        if (!novaPergunta || alternativas.length === 0 || correta === null) return;

        const reader = new FileReader();
      let base64String = undefined;

      if (novaImagem) {
        reader.readAsDataURL(novaImagem);
      }
  
      reader.onloadend = async () => {
        base64String = reader.result; 
      };

            const formattedAlternativas = alternativas.map((alternativaText, index) => {
                return {
                    texto_alternativa: alternativaText,
                    alternativa_correta: correta === index,
                };
            });

            try {
                const response = await fetch("/api/perguntas", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${usuario?.email_usuario}`,
                    },
                    body: JSON.stringify({
                        pergunta: novaPergunta,
                        Alternativas: formattedAlternativas,
                        imagem: base64String,
                    }),
                });

                if (!response.ok) throw new Error("Erro ao criar pergunta");

                toastAlerta("Pergunta adicionada com sucesso!", "sucesso")
                setNovaPergunta("");
                setAlternativas([""]);
                setCorreta(null);
                fetchPerguntas()
            } catch (error) {
                console.error("Erro ao adicionar pergunta:", error);
                toastAlerta("Erro ao adicionar pergunta", "erro")
            }
    };

    const handleAlternativaChange = (index: number, value: string) => {
        const updatedAlternativas = [...alternativas];
        updatedAlternativas[index] = value;
        setAlternativas(updatedAlternativas);
    };

    const handleCorretaChange = (index: number) => {
        setCorreta(correta === index ? null : index);
    };

    const addAlternativa = () => {
        setAlternativas([...alternativas, ""]); 
    };

    const deletePergunta = async (perguntaId: number) => {
        try {
            const response = await fetch(`/api/perguntas/${perguntaId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${usuario?.email_usuario}`,
                },
            });

            if (!response.ok) throw new Error("Erro ao deletar pergunta");
            toastAlerta("Pergunta deletada com sucesso!", "sucesso")
            fetchPerguntas(); 
        } catch (error) {
            console.error("Erro ao deletar pergunta:", error);
            toastAlerta("Erro ao deletar pergunta", "erro")
        }
    };

    const handleResetQuiz = async (id_usuario: number) => {
        try {
          const response = await fetch(`/api/reset/${id_usuario}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${usuario?.email_usuario}`,
            },
          });
    
          if (response.ok) {
            toastAlerta('Dados do quiz do usuário foram resetados com sucesso!', "sucesso");
          } else {
            const error = await response.json();
            toastAlerta('Falha ao resetar!', "erro");
            console.log(error)
          }
        } catch (err) {
          console.error(err);
          toastAlerta('Um erro ocorreu ao resetar os dados do usuário.', 'erro');
        }
      };

    return (
        <main className="w-full h-fit py-24 flex justify-center items-center px-16 bg-gray-50">
            <div className="w-full max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-lg">
                <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Dashboard</h1>
    
                <section className="mb-8 p-4 border rounded-md shadow-sm bg-gray-100">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Criar Pergunta</h2>
                    <div className="mb-4">
                        <Input
                            label="Nova Pergunta"
                            value={novaPergunta}
                            handleChange={(_, e) => setNovaPergunta(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Imagem da Pergunta</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setNovaImagem(e.target.files?.[0] || null)}
                            className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {novaImagem && (
                            <div className="mt-4 mb-4">
                                <h3 className="text-sm">Pré-visualização da Imagem:</h3>
                                <Image
                                    src={URL.createObjectURL(novaImagem)}
                                    alt="Imagem da Pergunta"
                                    width={200}
                                    height={200}
                                    className="object-cover mt-2 rounded-md border border-gray-300"
                                />
                            </div>
                        )}
                    </div>
    
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Alternativas</h3>
                        {alternativas.length > 0 ? alternativas.map((alternativa, index) => (
                            <div key={index} className="mb-2 flex items-center">
                                <input
                                    type="text"
                                    value={alternativa}
                                    onChange={(e) => handleAlternativaChange(index, e.target.value)}
                                    className="w-full p-2 mb-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="checkbox"
                                    checked={correta === index}
                                    onChange={() => handleCorretaChange(index)}
                                    className="ml-2 h-5 w-5"
                                />
                                <label className="ml-2 text-gray-600">Alternativa Correta</label>
                            </div>
                        )) : <h1 className="text-gray-600">Nenhuma Alternativa</h1>}
                        <Button handleClick={addAlternativa} className="mt-2">
                            Adicionar Alternativa
                        </Button>
                    </div>
    
                    <Button handleClick={addPergunta} className="mt-4 bg-blue-600 text-white hover:bg-blue-700">
                        Adicionar Pergunta
                    </Button>
                </section>
    
                <section className="mb-8 p-4 border rounded-md shadow-sm bg-gray-100">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Perguntas e Alternativas</h2>
                    <Button handleClick={fetchPerguntas} className="bg-blue-600 text-white hover:bg-blue-700">
                        Atualizar Perguntas
                    </Button>
                    {perguntas.length > 0 ? perguntas.map((pergunta) => (
                        <div
                            key={pergunta.id_pergunta}
                            className={`mb-6 p-4 border rounded-md shadow-sm cursor-pointer ${selectedPerguntaId === pergunta.id_pergunta ? 'bg-blue-200' : 'bg-white'}`}
                            onClick={() => setSelectedPerguntaId(pergunta.id_pergunta === selectedPerguntaId ? null : pergunta.id_pergunta)}
                        >
                            <h3 className="text-lg font-semibold text-gray-800">{pergunta.pergunta}</h3>
    
                            {pergunta.imagem && <div className="mt-4">
                                <h3 className="text-sm">Pré-visualização da Imagem:</h3>
                                <Image
                                    src={getBlobUrl(pergunta.imagem)}
                                    alt="Imagem da Pergunta"
                                    width={200}
                                    height={200}
                                    className="object-cover mt-2 rounded-md border border-gray -300"
                                />
                            </div>} 
    
                            <div>
                                {pergunta.Alternativas && pergunta.Alternativas.length > 0 ? pergunta.Alternativas.map((alternativa, index) => (
                                    <div key={index} className="mb-2">
                                        <input
                                            type="text"
                                            value={alternativa.texto_alternativa}
                                            readOnly
                                            className="w-full p-2 mb-2 border border-gray-300 rounded-md bg-gray-200"
                                        />
                                        <input
                                            type="checkbox"
                                            checked={alternativa.alternativa_correta}
                                            readOnly
                                            className="h-5 w-5"
                                        />
                                        <label className="ml-2 text-gray-600">Alternativa Correta</label>
                                    </div>
                                )) : <h1 className="text-gray-600">Sem Alternativas</h1>}
                            </div>
                            <Button handleClick={() => deletePergunta(pergunta.id_pergunta)} className="mt-2 bg-red-600 text-white hover:bg-red-700">
                                Deletar Pergunta
                            </Button>
                        </div>
                    )) : <h1 className="text-gray-600">Sem Perguntas</h1>}
                </section>
    
                <section className="mt-8 p-4 border rounded-md shadow-sm bg-gray-100">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Leaderboard</h2>
                    <Button handleClick={fetchLeaderboard} className="bg-blue-600 text-white hover:bg-blue-700">
                        Atualizar Leaderboard
                    </Button>
                    <div className="space-y-4">
                        {leaderboard.length > 0 ? leaderboard.map((entry, index) => (
                            <div key={index} className="flex justify-between border-b py-2">
                                <span className="text-gray-800">{entry.Usuarios?.nickname_usuario}</span>
                                <span className="text-gray-800">{entry.pontos} pontos</span>
                                <Button handleClick={() => handleResetQuiz(entry.Usuarios?.id_usuario ? entry.Usuarios?.id_usuario : 0)} className="bg-red-600 px-2 py-1 text-white">Resetar Quiz desse usuário</Button>
                            </div>
                        )) : <h1 className="text-gray-600">Nenhum leaderboard</h1>}
                    </div>
                </section>
    
                <section className="mt-8 p-4 border rounded-md shadow-sm bg-gray-100">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Respostas dos Usuários</h2>
                    <Button handleClick={fetchRespostasUsuarios} className="bg-blue-600 text-white hover:bg-blue-700">
                        Atualizar Respostas
                    </Button>
                    <div className="space-y-4">
                        {respostasUsuarios.length > 0 ? respostasUsuarios.map((resposta, index) => (
                            <div key={index} className="flex justify-between border-b py-2">
                                <span className="text-gray-800">{resposta.Usuarios?.nickname_usuario}</span>
                                <span className="text-gray-800">{resposta.Perguntas?.pergunta}</span>
                            </div>
                        )) : <h1 className="text-gray-600">Nenhuma resposta</h1>}
                    </div>
                </section>
                <Link href="/quiz" className="mt-4 inline-block text-blue-600 hover:underline">Entrar no Quiz</Link>
            </div>
        </main>
    );
};

export default Dashboard;