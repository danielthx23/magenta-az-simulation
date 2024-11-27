'use client'

import { useState } from "react";
import Button from "../../../../components/button/button.component";
import { RespostasUsuarios } from "../../../../types/respostasusuarios/respostasusuarios.type";
import Step from "../step/step.component";
import { Perguntas } from "../../../../types/perguntas/perguntas.type";
import { useRouter } from "next/navigation";
import useAuth from "../../../../hooks/useauth/useauth.hook";
import { toastAlerta } from "../../../../utils/toastalerta/toastalerta.util";
import Finalize from "../finalize/finalize.component";

const Quiz = () => {
    const { usuario } = useAuth();
    const router = useRouter();
    const [perguntas, setPerguntas] = useState<Perguntas[]>([]);
    const [currentStep, setCurrentStep] = useState(1);
    const [respostas, setRespostas] = useState<RespostasUsuarios[]>([]);
    const [loading, setLoading] = useState(false);
    const [finalize, setFinalize] = useState(false); 
    const [pontos, setPontos] = useState(0);

    if (!usuario) {
        toastAlerta('Você precisa estar logado para iniciar o quiz.', 'info');
        router.push('/login');
        return;
    }

    if ((usuario.Respostas_Usuarios && usuario.Respostas_Usuarios.length > 0)) {
        toastAlerta('Você já realizou esse quiz! Avise um dos administradores para resetar sua resposta.', 'info');
        router.push('/leaderboard');
        return;
    }
    
    const startQuiz = async () => {
        if (!usuario || (usuario.Respostas_Usuarios && usuario.Respostas_Usuarios.length > 0)) {
            toastAlerta('Você precisa estar logado para iniciar o quiz.', 'info');
            router.push('/login');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch('/api/perguntas', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${usuario.email_usuario}`, 
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Erro ao buscar perguntas');
            const data = await response.json();
            setPerguntas(data);
            setCurrentStep(2);
        } catch (error) {
            console.error(error);
            toastAlerta('Falha ao iniciar o quiz. Tente novamente.', 'erro');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (id_pergunta: number, id_alternativa: number, correta: boolean) => {
        if (!usuario) return;
    
        const resposta: RespostasUsuarios = {
            id_usuario: usuario.id_usuario,
            id_pergunta,
            id_alternativa,
            correta,
            data_resposta: new Date(),
        };
    
        setRespostas((prev) => [...prev, resposta]);
    
        setCurrentStep((prevStep) => {
            if ((prevStep - 1) < perguntas.length) {
                return prevStep + 1;
            } else {
                finalizeQuiz(); 
                return prevStep;
            }
        });
    };
    
    const finalizeQuiz = async () => {
        if (!usuario || respostas.length === 0 || (usuario.Respostas_Usuarios && usuario.Respostas_Usuarios.length > 0)) return;

        const calculatedPoints = (respostas.reduce((total, resp) => total + (resp.correta ? 1 : 0), 0) / respostas.length) * 1000;
        setPontos(calculatedPoints);

        try {
            setLoading(true);
            await Promise.all(
                respostas.map((resposta) =>
                    fetch('/api/respostasusuarios', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${usuario.email_usuario}`, 
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(resposta),
                    })
                )
            );

            await fetch('/api/leaderboard', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${usuario.email_usuario}`, 
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id_usuario: usuario.id_usuario,
                    pontos: calculatedPoints,
                }),
            });

            setFinalize(true); 
        } catch (error) {
            console.error('Erro ao salvar respostas ou pontuação no leaderboard:', error);
            alert('Erro ao finalizar o quiz.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && finalize) {
        return <p className="text-xl w-full h-screen text-center flex justify-center items-center text-white">Finalizando quiz e gerando resultados, aguarde...</p>;
    }

    if (loading) {
        return <p className="text-xl w-full h-screen text-center flex justify-center items-center text-white">Carregando...</p>;
    }

    if (finalize) {
        return <Finalize loading={loading} pontos={pontos} />;
    }

    if (currentStep === 1) {
        return (
            <main className="w-full h-screen flex justify-center items-center">
                <Button
                    className="text-2xl px-4 py-2 rounded-2xl bg-white text-[#e3017e] hover:bg-[#e3017e] hover:text-white border-2 hover:border-[#e3017e] transition-all ease-in-out"
                    handleClick={startQuiz}
                    disabled={usuario?.Respostas_Usuarios ? usuario?.Respostas_Usuarios.length > 0 : false}
                >
                    {usuario?.Respostas_Usuarios && usuario?.Respostas_Usuarios.length > 0 ? "Você já realizou esse Quiz! Avise um dos administradores para resetar sua resposta." : "Iniciar Quiz"}
                </Button>
            </main>
        );
    }

    if (currentStep > 1 && perguntas.length > 0) {
        const pergunta = perguntas[currentStep - 2];
        return (
            <Step
                key={pergunta.id_pergunta}
                pergunta={pergunta}
                onAnswer={handleAnswer}
                loading={loading}
            />
        );
    }

    return null;
};

export default Quiz;
