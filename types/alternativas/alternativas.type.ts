import { Perguntas } from "../perguntas/perguntas.type";
import { RespostasUsuarios } from "../respostasusuarios/respostasusuarios.type";

export interface Alternativas {
  id_alternativa: number;
  id_pergunta: number;
  alternativa_correta: boolean;
  texto_alternativa: string;
  Perguntas?: Perguntas; 
  Respostas_Usuarios?: RespostasUsuarios[]; 
}