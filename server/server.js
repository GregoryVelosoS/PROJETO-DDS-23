/**
 * Arquivo Principal do Servidor (Entry Point)
 * 
 * Este arquivo é responsável por inicializar a nossa aplicação backend.
 * Ele configura o servidor Express, carrega as variáveis de ambiente
 * e define a porta em que o servidor irá escutar as requisições HTTP.
 */

// Importa o módulo 'express', framework fundamental para construir APIs em Node.js
const express = require('express');
const path = require('path'); // Para manipulação segura de caminhos de pastas

// Importa o módulo 'dotenv' e já executa a função config()
// Isso faz com que o Node leia o arquivo .env e carregue os dados de ambiente para process.env
require('dotenv').config();

const app = express();

// MIDDLEWARES FUNDAMENTAIS PARA O FUNCIONAMENTO DE UMA APLICAÇÃO SSR:
app.use(express.json()); // Lê dados JSON
app.use(express.urlencoded({ extended: true })); // Permite que o servidor leia os dados vindos dos "forms" do EJS
app.use(require('cookie-parser')()); // Permite ler o Cookie JWT do navegador

// CONFIGURAÇÃO DO EJS E PASTAS DO FRONT-END (CLIENT)
// Define o EJS como motor de visualização de páginas HTML
app.set('view engine', 'ejs');
// Aponta para o Express onde estão os arquivos .ejs (Views)
app.set('views', path.join(__dirname, '../client/views'));
// Libera o acesso público à pasta onde guardamos o style.css, imagens e js do front
app.use(express.static(path.join(__dirname, '../client/public')));

// ROTA DE TESTE: Para verificar se o servidor subiu corretamente
// 'app.get' define que quando o cliente acessar a rota raiz ('/') via método GET, esta função rodará.
app.get('/', (req, res) => {
    // CORREÇÃO: Removido o res.json e adicionado o redirecionamento para o fluxo da tela do MVC
    res.redirect('/login');
});

// ==========================================
// INTEGRAÇÃO DAS ROTAS (MVC)
// ==========================================
// Aqui nós conectamos as rotas que criamos na pasta 'routes' ao servidor.
const usuarioRoutes = require('./routes/usuarioRoutes');
const produtoRoutes = require('./routes/produtoRoutes');

// Toda requisição que começar com '/usuarios' vai ser gerenciada pelo usuarioRoutes
app.use('/usuarios', usuarioRoutes);

// Toda requisição que começar com '/produtos' vai ser gerenciada pelo produtoRoutes
app.use('/produtos', produtoRoutes);

// ==========================================
// ROTAS DE RENDERIZAÇÃO DO FRONT-END (EJS)
// ==========================================
app.get('/login', (req, res) => res.render('auth/login'));
app.get('/cadastro', (req, res) => res.render('auth/cadastro')); // Cadastro unificado
app.get('/interessado', (req, res) => res.render('vitrine/interessado'));

// DEFINIÇÃO DA PORTA
// O servidor vai tentar pegar a porta configurada no .env. 
// Caso não encontre nada, usará a porta 3000 como "plano B" (fallback).
const PORT = process.env.PORT || 3000;

// INICIANDO O SERVIDOR
// A função listen faz com que o servidor comece a "ouvir" e responder requisições na porta especificada.
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`🌐 Acesse: http://localhost:${PORT}`);
});
