import React, { useState } from "react";
import Button from "../../../../components/button/button.component";
import { getBlobUrl } from "../../../../services/azurestorage/azurestorage.service";
import { Alternativas } from "../../../../types/alternativas/alternativas.type";
import { Perguntas } from "../../../../types/perguntas/perguntas.type";
import Image from "next/image";

interface StepProps {
  pergunta: Perguntas;
  onAnswer: (id_pergunta: number, id_alternativa: number, correta: boolean) => void;
  loading: boolean;
}

const Step = ({ pergunta, onAnswer, loading }: StepProps) => {
  const [selectedAlternative, setSelectedAlternative] = useState<number | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const handleAnswerClick = (id_alternativa: number, correta: boolean) => {
    if (!loading && selectedAlternative === null) {
      setSelectedAlternative(id_alternativa);
      setShowCorrectAnswer(true);
      onAnswer(pergunta.id_pergunta, id_alternativa, correta);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center flex-col gap-8 bg-white rounded-lg p-4">
      <h2 className="text-xl font-semibold text-center">{pergunta.pergunta}</h2>
      {pergunta.imagem && (
        <figure className="w-5/6 px-16 h-fit">
          <Image
            className="w-full h-auto object-cover rounded-md"
            width={500}
            height={300}
            src={getBlobUrl(pergunta.imagem)}
            alt="Imagem da pergunta"
            onError={(e) => {
              e.currentTarget.src = "/fallback-image.png";
            }}
          />
        </figure>
      )}
      <ul className="w-full flex flex-col items-center gap-4">
        {pergunta.Alternativas?.map((alt: Alternativas, index) => {
          const isSelected = alt.id_alternativa === selectedAlternative;
          const isCorrect = alt.alternativa_correta;
          const showCorrectStyle = showCorrectAnswer && isCorrect;

          const buttonClass = [
            "w-full py-2 border border-gray-200 bg-red-100 hover:bg-gray-200 transition-all ease-in-out rounded-md text-lg flex gap-4 shadow",
            loading || selectedAlternative !== null ? "cursor-not-allowed" : "hover:bg-gray-200",
            isSelected
              ? isCorrect
                ? "bg-green-300 text-white"
                : "bg-red-300 text-white"
              : showCorrectStyle
              ? "bg-green-300 text-white"
              : "bg-white text-black border border-gray-300",
          ].join(" ");
  
    return (
      <div className="w-full h-[80vh] lg:min-h-screen  flex justify-center items-center flex-col gap-8 bg-white rounded-lg">
        {pergunta.imagem && <figure className="w-full px-16  h-fit">
            <Image className="w-full h-auto object-cover" width={500} height={100} src={getBlobUrl(pergunta.imagem)} alt="Imagem da pergunta" />
          </figure>}
        <h2 className="text-xl">{pergunta.pergunta}</h2>
        <ul className="w-full">
          {pergunta.Alternativas && pergunta.Alternativas.map((alt: Alternativas, index) => (
            <li className="w-full py-2 px-16" key={alt.id_alternativa} >
              <Button className={buttonClass} disabled={loading || selectedAlternative !== null} handleClick={() => handleClick={() => handleAnswerClick(alt.id_alternativa, isCorrect)}>
                <span className="font-medium">{index + 1}.</span>
                <span>{loading ? "Carregando..." : alt.texto_alternativa}</span>
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Step;
