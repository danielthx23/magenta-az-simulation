-- Table: Usuarios
CREATE TABLE Usuarios (
    id_usuario SERIAL PRIMARY KEY,
    data_registro TIMESTAMP NOT NULL,
    email_usuario VARCHAR(255) UNIQUE NOT NULL,
    nickname_usuario VARCHAR(255) UNIQUE NOT NULL,
    senha           VARCHAR(255) NOT NULL,
    imagem VARCHAR(255) DEFAULT 'default.png'
);

-- Table: Perguntas
CREATE TABLE Perguntas (
    id_pergunta SERIAL PRIMARY KEY,
    pergunta TEXT NOT NULL,
    imagem VARCHAR(255),
    ativa BOOLEAN NOT NULL
);

-- Table: Alternativas
CREATE TABLE Alternativas (
    id_alternativa SERIAL PRIMARY KEY,
    id_pergunta INT NOT NULL,
    alternativa_correta BOOLEAN NOT NULL,
    texto_alternativa TEXT NOT NULL,
    CONSTRAINT fk_alternativas_perguntas FOREIGN KEY (id_pergunta) 
        REFERENCES Perguntas (id_pergunta) ON DELETE CASCADE
);

-- Index for id_pergunta in Alternativas
CREATE INDEX idx_alternativas_id_pergunta ON Alternativas (id_pergunta);

-- Table: Respostas_Usuarios
CREATE TABLE Respostas_Usuarios (
    id_usuario INT NOT NULL,
    id_pergunta INT NOT NULL,
    id_alternativa INT NOT NULL,
    correta BOOLEAN NOT NULL,
    data_resposta TIMESTAMP NOT NULL,
    CONSTRAINT pk_respostas_usuarios PRIMARY KEY (id_usuario, id_pergunta, id_alternativa),
    CONSTRAINT fk_respostas_usuarios_usuarios FOREIGN KEY (id_usuario) 
        REFERENCES Usuarios (id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_respostas_usuarios_perguntas FOREIGN KEY (id_pergunta) 
        REFERENCES Perguntas (id_pergunta) ON DELETE CASCADE,
    CONSTRAINT fk_respostas_usuarios_alternativas FOREIGN KEY (id_alternativa) 
        REFERENCES Alternativas (id_alternativa) ON DELETE CASCADE
);

-- Indexes for Respostas_Usuarios
CREATE INDEX idx_respostas_usuarios_id_pergunta ON Respostas_Usuarios (id_pergunta);
CREATE INDEX idx_respostas_usuarios_id_alternativa ON Respostas_Usuarios (id_alternativa);

-- Table: Leaderboard
CREATE TABLE Leaderboard (
    id_usuario INT PRIMARY KEY,
    pontos INT NOT NULL CHECK (pontos >= 0 AND pontos <= 1000),
    CONSTRAINT fk_leaderboard_usuarios FOREIGN KEY (id_usuario) 
        REFERENCES Usuarios (id_usuario) ON DELETE CASCADE
);
