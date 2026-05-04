-- Criação do banco de dados para o sistema de trocas
CREATE DATABASE IF NOT EXISTS sistema_trocas;

-- Seleciona o banco de dados para uso
USE sistema_trocas;

-- Deleta as tabelas antigas (se existirem) para garantir uma recriação limpa e evitar erros de chave estrangeira
DROP TABLE IF EXISTS interesses;
DROP TABLE IF EXISTS produtos;
DROP TABLE IF EXISTS usuarios;

-- ==========================================================
-- TABELA: usuarios
-- REGRA DIDÁTICA APLICADA: Todas as restrições NOT NULL foram removidas
-- para facilitar o teste de inserções manuais e integrações parciais.
-- ==========================================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(255),
    telefone VARCHAR(20),
    foto VARCHAR(255),
    perfil ENUM('ofertante', 'interessado', 'administrador')
);

-- ==========================================================
-- TABELA: produtos
-- REGRA DIDÁTICA APLICADA: Nenhuma coluna é estritamente obrigatória (NOT NULL)
-- ==========================================================
CREATE TABLE produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,           
    nome VARCHAR(100),        
    descricao TEXT,                    
    preco DECIMAL(10,2),               
    condicao ENUM('novo', 'usado') DEFAULT 'usado',
    foto VARCHAR(255),
    is_publico BOOLEAN DEFAULT TRUE,
    status_troca BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ==========================================================
-- TABELA: interesses (Match)
-- REGRA DIDÁTICA APLICADA: Chaves estrangeiras opcionais
-- ==========================================================
CREATE TABLE interesses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_produto INT,
    id_interessado INT,
    data_interesse DATETIME DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_produto) REFERENCES produtos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_interessado) REFERENCES usuarios(id) ON DELETE CASCADE
);

-- ==========================================================
-- CARGA INICIAL DE TESTES (INSERTS DIDÁTICOS)
-- ==========================================================

-- 1. Usuário Administrador
-- NOTA: A senha gerada no hash bcrypt equivale a palavra 'greg'
INSERT INTO usuarios (nome, email, senha, telefone, perfil) 
VALUES (
    'Admin Greg', 
    'greg@gmail.com', 
    '$2b$10$8T/lyLpEkQuKddEL/7uBzuSjl5gFOYux6Kdff3mTleOL5rrth20zO', 
    '11999999999', 
    'administrador'
);

-- 2. Usuário Ofertante de Teste
-- NOTA: A senha gerada no hash bcrypt também equivale a palavra 'greg' para facilitar a aula
INSERT INTO usuarios (nome, email, senha, telefone, perfil) 
VALUES (
    'João Ofertante', 
    'ofertante@teste.com', 
    '$2b$10$8T/lyLpEkQuKddEL/7uBzuSjl5gFOYux6Kdff3mTleOL5rrth20zO', 
    '11888888888', 
    'ofertante'
);

-- 3. Usuário Interessado de Teste
-- NOTA: A senha gerada no hash bcrypt também equivale a palavra 'greg'
INSERT INTO usuarios (nome, email, senha, telefone, perfil) 
VALUES (
    'Maria Interessada', 
    'interessado@teste.com', 
    '$2b$10$8T/lyLpEkQuKddEL/7uBzuSjl5gFOYux6Kdff3mTleOL5rrth20zO', 
    '11777777777', 
    'interessado'
);
