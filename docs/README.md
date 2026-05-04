# 🔄 TrocaApp - Sistema de Trocas (MVC)

Bem-vindo ao **TrocaApp**, um sistema web desenvolvido como projeto didático para ensinar a arquitetura **MVC (Model-View-Controller)** utilizando Node.js, Express e MySQL. Este documento serve como guia completo de estudos e referência do projeto.

---

## 1. Visão Geral e Fluxo de Negócio

O objetivo principal do sistema é conectar pessoas que desejam desapegar de itens através de trocas. O sistema opera baseado em dois perfis de usuário, que possuem responsabilidades e visualizações de tela totalmente distintas:

- **Ofertante (Dono do Produto):** Ele possui um *Dashboard* próprio onde cadastra os seus itens, insere descrições e sinaliza ativamente através de um *toggle* (caixa de seleção) se o produto está "Disponível para Troca". Ele tem controle total (Criar, Ler, Atualizar e Deletar) sobre seus próprios itens.
- **Interessado (O Comprador/Buscador):** É o usuário que busca produtos no sistema. Ao fazer login, ele tem acesso restrito à **Vitrine** geral, um *feed* que exibe exclusivamente os itens de outros ofertantes que estão sinalizados como `status_troca = true`.

---

## 2. 🎨 Documentação do Design System

Para manter a interface consistente de forma simples, sem a necessidade de frameworks complexos, criamos um *Design System* centralizado através de Variáveis Globais CSS (`:root`) no arquivo `client/public/css/style.css`. Toda nova tela do projeto deve seguir este padrão:

### Paleta de Cores
- **Cor Primária (`--cor-primaria` | `#4F46E5`):** Um tom *Indigo* (Azul Escuro). Utilizado em cabeçalhos, títulos principais e no botão de ação principal (ex: Cadastrar, Entrar, Tenho Interesse). Representa a marca.
- **Cor Secundária (`--cor-secundaria` | `#10B981`):** Um tom *Esmeralda* (Verde). Focado em *feedbacks* positivos ou mudança de estado de troca do produto na tela do ofertante.
- **Fundo e Superfície:** O fundo geral do body é o `--cor-fundo` (`#F3F4F6`), um cinza bem claro, que faz com que os elementos do sistema saltem aos olhos quando aplicados sobre a `--cor-superficie` (`#FFFFFF`), o branco puro (Cartões e Formulários).

### Componentes Padronizados
- **Cartões (`.card`):** É o container base do layout. Todo formulário ou card de produto deve ser envolvido por uma `<div class="card">`. Isso garante padronização de espaçamento interno, bordas arredondadas e uma sombra elegante.
- **Botões (`.btn`):** Use as classes compostas `.btn .btn-primary` ou `.btn .btn-success`. Eles possuem estilo de foco e uma micro-interação que "afunda" levemente o botão quando clicado (`transform: scale(0.98)`).
- **Inputs (`.form-control`):** Campos de texto padronizados com bordas sutis que assumem a cor primária do sistema quando recebem foco (clique), guiando o olhar do usuário.

---

## 3. 🏗️ Arquitetura MVC (Como o sistema se comunica)

Este projeto foi desenhado sob o padrão **MVC**, garantindo separação de responsabilidades. Isso facilita a detecção de erros e organiza o desenvolvimento em equipe.

* **`/client` (A *View* do MVC):** O **Front-end**. Contém nosso Design System e o HTML das páginas gerado via **EJS**. As requisições HTTP (consumindo APIs com `Fetch` e passando o token `JWT`) nascem aqui a partir de eventos JavaScript. O uso do EJS nos permite "fatiar" o HTML (usando *partials* para o cabeçalho e rodapé), garantindo o reaproveitamento máximo de código visual.
* **`/server` (O *Controller* e as Rotas):** O **Back-end**. É o orquestrador do sistema.
  * O arquivo `server.js` sobe a aplicação na porta escolhida e define as regras gerais.
  * A pasta `routes` define as URLs e aciona o **Middleware** (`authMiddleware.js`), que funciona como um porteiro para validar os *Tokens JWT* antes de qualquer ação.
  * A pasta `controllers` processa a regra de negócio propriamente dita (ex: validar se um usuário existe e aplicar *hash bcrypt* na senha) antes de chamar o Model.
* **`/data` e `models` (O *Model* do MVC):** A camada de persistência. A pasta `models` abriga os códigos JavaScript que disparam sentenças de consulta SQL (usando `mysql2` e *Pool* de conexões). A pasta `data` armazena os scripts físicos (como o `schema.sql`) para a recriação do banco em qualquer máquina.

O fluxo didático de ação: **View (Clique) → Rota (Recebe) → Middleware (Verifica Permissão) → Controller (Trata Dados) → Model (Salva no Banco) → View (Recebe Alerta de Sucesso).**

---

## 4. 🚀 Passo a Passo: Como rodar localmente

Siga as instruções abaixo para subir o ambiente de desenvolvimento na sua máquina ou na sala de aula:

### Passo 1: Configurar o Banco de Dados
1. Abra e inicie o seu servidor MySQL (ex: *XAMPP*, *WAMP* ou *MySQL Workbench*).
2. Acesse o arquivo `data/schema.sql` deste repositório.
3. Copie todo o código SQL e execute no banco de dados. Ele criará automaticamente a base de dados (`sistema_trocas`), as tabelas necessárias e inserirá dados de teste (usuários e produtos).

### Passo 2: Instalar as Dependências (Node.js)
Abra o seu terminal (Prompt de Comando ou VSCode). Navegue até a pasta do back-end (`server`) e instale todas as bibliotecas necessárias para rodar o projeto (`express`, `ejs`, `mysql2`, `dotenv`, etc.):
```bash
cd server
npm install
```

### Passo 3: Variáveis de Ambiente (.env)
Ainda dentro da pasta `server`, localize o arquivo `.env` (ou crie um se não existir) e preencha com as credenciais reais do seu MySQL e defina a porta. O arquivo deve ficar assim:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_do_banco_aqui
DB_NAME=sistema_trocas
JWT_SECRET=senha_secreta_para_gerar_tokens
```

### Passo 4: Rodar o Servidor
Com tudo configurado e dependências instaladas, inicie o back-end:
```bash
node server.js
```

Seu terminal exibirá algo parecido com:
> `🚀 Servidor rodando na porta 3000`
> `🌐 Acesse: http://localhost:3000`

Abra o seu navegador e acesse **[http://localhost:3000/login](http://localhost:3000/login)** para testar a aplicação Front-end injetada diretamente pela arquitetura MVC.

---
> 💡 *Este é um projeto com propósito didático desenvolvido especialmente para o ensino da tecnologia.*
