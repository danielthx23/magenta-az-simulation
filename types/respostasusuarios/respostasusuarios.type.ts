import { Alternativas } from "../alternativas/alternativas.type";
import { Perguntas } from "../perguntas/perguntas.type";
import { Usuarios } from "../usuarios/usuarios.type";

export interface RespostasUsuarios {
  id_usuario: number;        
  id_pergunta: number;       
  id_alternativa: number;    
  correta: boolean;           
  data_resposta: Date;       
  Usuarios?: Usuarios;        
  Perguntas?: Perguntas;    
  Alternativas?: Alternativas; 
}
