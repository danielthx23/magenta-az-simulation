import { Alternativas } from "../alternativas/alternativas.type";
import { RespostasUsuarios } from "../respostasusuarios/respostasusuarios.type";

export interface Perguntas {
    id_pergunta: number;
    pergunta: string;
    imagem?: string;
    ativa: boolean;
    Alternativas?: Alternativas[];
    Respostas_Usuarios?: RespostasUsuarios[];
  }