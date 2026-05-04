# Documentação Técnica e Fluxo de Negócio: Sistema 'trocAqui'

Este documento detalha o fluxo principal de valor e as tecnologias do sistema **trocAqui**, desenhado sob a rigorosa arquitetura MVC (Model-View-Controller) utilizando Node.js e construído para fins didáticos.

## 🎨 1. Design System e Identidade Visual
O sistema foi concebido utilizando uma paleta de cores estritamente minimalista e brutalista, focada em alto contraste e legibilidade:
- **Cor de Fundo:** Branco (`#FFFFFF`)
- **Cor Principal:** Preto (`#000000`) - Utilizado para textos principais, bordas, painéis e botões primários.
- **Cor de Destaque:** Vermelho (`#FF0000`) - Utilizado para interações (Hover), destaque nos inputs, ícones ativos e botões secundários.

O layout conta com um `Footer` sempre fixado no final da página (utilizando `Flexbox`) e os formulários de interação utilizam `CSS Grid` para dividirem os campos em duas colunas responsivas, ocupando confortavelmente **80% da tela** em monitores Desktop (com espaçamentos internos ampliados) e empilhando os campos nativamente em dispositivos Mobile. Para aprimorar a usabilidade, implementamos botões com ícones fornecidos pela biblioteca **Font Awesome**.

## 🏗️ 2. Arquitetura e Segurança
- **Arquitetura MVC:** O projeto está nitidamente dividido entre as regras de apresentação (EJS em `client/views`), a lógica de negócios e roteamento (Node.js em `server/controllers` e `server/routes`) e o acesso e comunicação com dados (`server/models`).
- **Autenticação RBAC:** Todo o controle de acesso baseia-se em Papéis (Roles). O sistema entende três perfis: `administrador`, `ofertante` e `interessado`. Os acessos às telas e menus no cabeçalho variam perfeitamente de acordo com quem está logado.
- **Sessões e Cookies:** Ao invés de trafegar dados de senhas a todo momento, a validação de login (usando senhas em hash via `bcrypt`) gera um Token criptografado (`JWT`) persistido como um cookie `HttpOnly` seguro no navegador do cliente.

## 🛠️ 3. Recursos de Mídia (Upload e Previews)
Formulários que envolvem imagens (Cadastro e Edição de Contas ou Produtos) utilizam a estrutura de dados `multipart/form-data`. 
- **Frontend (Visualização Imediata):** Um script em JavaScript (`comportamento.js`) intercepta as seleções de fotos usando a API nativa `FileReader`. Isso permite a injeção instantânea da foto selecionada numa caixa de "Preview", evitando que o usuário mande uma imagem errada sem querer.
- **Backend (Armazenamento Seguro):** O módulo `Multer` entra em ação, captura a foto da requisição HTTP, altera o nome do arquivo injetando o tempo atual (para evitar nomes repetidos gerando colisão) e guarda o arquivo na subpasta correta (`/uploads/produtos`). No MySQL, é salvo **apenas** o caminho textual da imagem.

## 🔄 4. O Fluxo de Transações (Coração do App)

### Passo 1: O Ofertante Cadastra e Gerencia
O usuário com o perfil `ofertante` acessa o seu painel de controle e registra os itens. 
O botão **"Toggle (Alternar)"** de Visibilidade na tabela permite que ele ligue e desligue o produto da Vitrine de forma imediata (invertendo dinamicamente o status booleano `is_publico` no banco de dados). Ele pode aprimorar as postagens na tela de edição mantendo a imagem atual ou enviando uma nova.

### Passo 2: A Vitrine de Trocas e o Match
A rota `/produtos/vitrine` é aberta a todos os interessados e ofertantes da rede. 
O Controller busca na base de dados APENAS os itens marcados como Públicos e, antes de carregar a tela EJS, descobre através de consultas SQL quais cartões o usuário logado já curtiu no passado.
Isso habilita o botão de **Toggle de Interesse**. Com um clique, ele processa a inclusão ou a remoção do interesse do banco de dados na hora, alterando os ícones (Corações vazios viram corações vermelhos) instantaneamente na tela.

### Passo 3: O Fechamento de Negócio ("Leads")
Quando o Ofertante retorna ao seu Dashboard particular, a inteligência do sistema mostra os resultados! Utilizando o poder do banco de dados relacional (um comando `INNER JOIN` triplo unindo tabelas de Produtos, Interesses e Usuários), o sistema gera uma lista completa apontando o **Nome e o Telefone/WhatsApp** exato da pessoa que deu "Coraçãozinho" nos itens dele. 
Isso conclui o ciclo, permitindo o contato externo para o fechamento da troca.
