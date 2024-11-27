import { Leaderboard } from "../leaderboard/leaderboard.type";
import { RespostasUsuarios } from "../respostasusuarios/respostasusuarios.type";

export interface Usuarios {
    id_usuario: number;               
    data_registro: Date;              
    email_usuario: string;          
    nickname_usuario: string;         
    imagem: string;         
    senha: string;           
    Respostas_Usuarios?: RespostasUsuarios[]; 
    Leaderboard?: Leaderboard;         
  }