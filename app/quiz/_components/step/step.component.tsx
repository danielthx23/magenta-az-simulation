import Button from "../../../../components/button/button.component";
import { getBlobUrl } from "../../../../services/azurestorage/azurestorage.service";
import { Alternativas } from "../../../../types/alternativas/alternativas.type";
import { Perguntas } from "../../../../types/perguntas/perguntas.type";
import Image from 'next/image';

interface StepProps {
    pergunta: Perguntas;
    onAnswer: (id_pergunta: number, id_alternativa: number, correta: boolean) => void;
    loading: boolean
  }
  
  const Step = ({ pergunta, onAnswer, loading }: StepProps) => {
    const handleAnswerClick = (id_alternativa: number, correta: boolean) => {
      onAnswer(pergunta.id_pergunta, id_alternativa, correta);
    };
  
    return (
      <div className="w-full h-[80vh] lg:min-h-screen  flex justify-center items-center flex-col gap-8 bg-white rounded-lg">
        {pergunta.imagem && <figure className="w-full px-16  h-fit">
            <Image className="w-full h-auto object-cover" width={500} height={100} src={getBlobUrl(pergunta.imagem)} alt="Imagem da pergunta" />
          </figure>}
        <h2 className="text-xl">{pergunta.pergunta}</h2>
        <ul className="w-full">
          {pergunta.Alternativas && pergunta.Alternativas.map((alt: Alternativas, index) => (
            <li className="w-full py-2 px-16" key={alt.id_alternativa} >
              <Button className="w-full py-2 border border-gray-200 bg-red-100 hover:bg-gray-200 transition-all ease-in-out rounded-md text-lg flex gap-4 shadow" disabled={loading} handleClick={() => handleAnswerClick(alt.id_alternativa, alt.alternativa_correta)}>
                <p>{index + 1}.</p>
                <p>{loading ? "Carregando..." : alt.texto_alternativa}</p>
              </Button>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default Step;
  