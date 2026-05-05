# Documentação Técnica e Fluxo de Negócio: Sistema 'trocAqui'

Este documento detalha o fluxo principal de valor e as tecnologias do sistema **trocAqui**, desenhado sob a rigorosa arquitetura MVC (Model-View-Controller) utilizando Node.js e construído para fins didáticos.

## 🎨 1. Design System e Identidade Visual
O sistema foi concebido utilizando uma paleta de cores estritamente minimalista e brutalista, focada em alto contraste e legibilidade:
- **Cor de Fundo:** Branco (`#FFFFFF`)
- **Cor Principal:** Preto (`#000000`) - Utilizado para textos principais, bordas, painéis e botões primários.
- **Cor de Destaque:** Vermelho (`#FF0000`) - Utilizado para interações (Hover), destaque nos inputs, ícones ativos e botões secundários.

O layout conta com um `Footer` sempre fixado no final da página (utilizando `Flexbox`) e os formulários de interação utilizam `CSS Grid` para dividirem os campos em duas colunas responsivas, ocupando confortavelmente **80% da tela** em monitores Desktop (com espaçamentos internos ampliados) e empilhando os campos nativamente em dispositivos Mobile. Para aprimorar a usabilidade, implementamos botões com ícones fornecidos pela biblioteca **Font Awesome**.

## 🏗️ 2. Arquitetura, Organização de Domínios e Segurança
- **Arquitetura MVC Organizada:** O projeto está nitidamente dividido entre as regras de apresentação, rotas e dados. Para espelhar perfeitamente o padrão arquitetural em larga escala, a camada de **Views (EJS)** foi sub-dividida em "Domínios de Negócio":
  - `/views/auth/` (Telas de entrada e registro público)
  - `/views/usuarios/` (Gestão do CRUD de perfis e administradores)
  - `/views/produtos/` (Gestão de catálogos e dashboards)
  - `/views/vitrine/` (Área pública de exposição de produtos)
  - `/views/partials/` (Componentes fixos como Header e Footer)
- **Autenticação RBAC e Redirecionamento Dinâmico:** Todo o controle de acesso baseia-se em Papéis (Roles): `administrador`, `ofertante` e `interessado`. O sistema possui inteligência para efetuar redirecionamentos dinâmicos (ex: Ao criar uma conta, se o usuário tiver um Cookie JWT válido de Admin, ele retorna para a gestão; caso seja um usuário público, ele é direcionado ao Login).
- **Sessões e Cookies:** A validação de login (usando senhas em hash via `bcrypt`) gera um Token criptografado (`JWT`) persistido como um cookie `HttpOnly` seguro no navegador do cliente.

## 🛠️ 3. Recursos de Mídia (Upload e Previews)
Formulários que envolvem imagens utilizam a estrutura de dados `multipart/form-data`. 
- **Frontend (Visualização Imediata):** Um script em JavaScript (`comportamento.js`) intercepta as seleções de fotos usando a API nativa `FileReader`. Isso permite a injeção instantânea da foto selecionada numa caixa de "Preview", evitando erros de upload.
- **Backend (Armazenamento Seguro):** O módulo `Multer` entra em ação, captura a foto da requisição HTTP, altera o nome do arquivo injetando o tempo atual (para evitar nomes repetidos) e guarda o arquivo fisicamente. No banco de dados MySQL, é salvo **apenas** o caminho textual da imagem.

## 🔄 4. O Fluxo de Transações (Coração do App)

### Passo 1: O Ofertante Cadastra e Gerencia
O usuário com o perfil `ofertante` acessa o seu painel de controle e registra os itens. 
O botão **"Toggle (Alternar)"** de Visibilidade na tabela permite que ele ligue e desligue o produto da Vitrine de forma imediata (invertendo dinamicamente o status booleano `is_publico` no banco de dados). Ele pode aprimorar as postagens na tela de edição mantendo a imagem atual ou enviando uma nova.

### Passo 2: A Vitrine de Trocas e o Match Inteligente
A rota `/produtos/vitrine` é aberta a todos os interessados e ofertantes da rede. 
O Controller busca na base de dados APENAS os itens marcados como Públicos. Utilizando comandos `INNER JOIN`, ele intercepta os dados da tabela de `usuarios` e já imprime no próprio "Card" da Vitrine quem é o dono do produto e seu telefone de contato, encurtando as distâncias.
Além disso, antes de carregar a tela EJS, descobre através de consultas SQL quais cartões o usuário logado já curtiu no passado. Isso habilita o botão de **Toggle de Interesse**.

### Passo 3: O Fechamento de Negócio ("Leads")
Quando o Ofertante retorna ao seu Dashboard particular (`/produtos/listar`), a inteligência do sistema mostra os resultados! Utilizando um comando `INNER JOIN` triplo unindo tabelas de Produtos, Interesses e Usuários, o sistema gera uma lista completa apontando o **Nome e o Telefone/WhatsApp** exato da pessoa que deu "Coraçãozinho" nos itens dele. 
Na mesma tabela, um atalho extrai o `id_produto` gerado pelo JOIN, permitindo que o ofertante clique em "Detalhes" e visualize instantaneamente o item específico que gerou aquele lead, fechando completamente o ciclo de transação!
