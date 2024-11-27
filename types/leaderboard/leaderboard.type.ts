import { Usuarios } from "../usuarios/usuarios.type";

export interface Leaderboard {
    id_usuario: number;
    pontos: number;
    Usuarios?: Usuarios;
  }