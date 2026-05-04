# ♻️ trocAqui

O **trocAqui** é uma plataforma web desenvolvida para facilitar o escambo e a troca de produtos físicos. Atuando como uma ponte direta, o sistema conecta pessoas que desejam desapegar de itens (Ofertantes) com pessoas que possuem interesse nesses produtos (Interessados), criando um ambiente focado em economia circular e consumo consciente.

---

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando um ecossistema Javascript moderno no lado do servidor e tecnologias clássicas no frontend:

*   **Node.js & Express:** Servidor web e roteamento dinâmico.
*   **EJS (Embedded JavaScript):** Motor de visualização para renderização SSR (Server-Side Rendering).
*   **MySQL2:** Banco de Dados Relacional (Pool de Conexões).
*   **Multer:** Middleware para o gerenciamento e upload de arquivos físicos (imagens).
*   **Bcrypt & JWT:** Segurança via Hash de senhas e Tokens de autenticação protegidos em Cookies.
*   **HTML5, CSS3 & Vanilla JS:** Frontend construído nativamente, com scripts puros focados em didática.

---

## 🏗️ Arquitetura

O sistema adota estritamente o padrão **MVC (Model-View-Controller)**:
*   **Model (`server/models`):** Cuida exclusivamente da lógica de dados, comunicação com o MySQL e execução das Queries.
*   **View (`client/views`):** Telas e interfaces (EJS) focadas em exibir informações processadas.
*   **Controller (`server/controllers`):** Intercepta requisições, aplica as regras de negócio e despacha a visualização correspondente.

---

## 📋 Pré-requisitos

Para rodar este projeto na sua máquina, você precisará ter instalado:
*   [Node.js](https://nodejs.org/) (Versão 16.x ou superior)
*   [MySQL](https://dev.mysql.com/downloads/) (Versão 8.0 ou superior)

---

## ⚙️ Como Rodar Localmente (Passo a Passo)

1. **Clonar o Repositório**
   Abra o seu terminal e clone o projeto:
   ```bash
   git clone https://github.com/seu-usuario/trocaqui.git
   cd trocaqui
   ```

2. **Instalar Dependências**
   Na raiz do projeto, faça o download dos módulos:
   ```bash
   npm install
   ```

3. **Configurar o Banco de Dados**
   * Abra o seu cliente de banco de dados (ex: MySQL Workbench).
   * Importe e rode o script localizado em `data/schema.sql` (ou `data/criacao.sql`).
   * **Nota Importante:** O script recria as tabelas e já efetua cargas de usuários (`inserts`) para você poder testar o sistema imediatamente.
     * Administrador padrão - **Email:** `greg@gmail.com` | **Senha:** `greg`

4. **Configurar as Variáveis de Ambiente**
   Crie um arquivo `.env` na raiz do projeto (no mesmo nível do `package.json`) com os seguintes dados:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=sua_senha_do_mysql
   DB_NAME=trocaqui
   JWT_SECRET=sua_chave_secreta_jwt
   ```

5. **Iniciar o Servidor**
   Inicie a aplicação utilizando:
   ```bash
   npm start
   # ou 'node server.js'
   ```
   Acesse no seu navegador: `http://localhost:3000`

---

## 🎨 Design System

O projeto adota uma identidade visual impositiva, de alto contraste:
*   **Cores:** Uma paleta restrita baseada apenas em **Preto (#000000)**, **Vermelho (#FF0000)** e **Branco (#FFFFFF)**.
*   **Layout:** Utilização de `CSS Grid` para organizar formulários em colunas de 80% de largura, `Flexbox` para o alinhamento de componentes e *Footer* fixo, além de integrações imediatas usando o *Font Awesome* para iconografia interativa.
