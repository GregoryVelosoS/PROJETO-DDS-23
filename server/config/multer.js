const multer = require('multer');
const path = require('path');
const fs = require('fs');

/**
 * =========================================================================
 * DIDÁTICA DA AULA: CONFIGURAÇÃO DO UPLOAD COM MULTER
 * =========================================================================
 * No modelo MVC, o Cliente envia um arquivo (imagem) através de um form (enctype="multipart/form-data").
 * O Express nativamente não entende arquivos físicos, apenas texto. O 'Multer' é o middleware 
 * responsável por pegar a imagem, dar um nome novo e salvar numa pasta antes de passar para o Controller!
 */

// Configuração do "DiskStorage" (Armazenamento no Disco/HD do Servidor)
const storage = multer.diskStorage({
    
    // 1. DEFINIÇÃO DA PASTA DE DESTINO (Onde o arquivo vai parar?)
    destination: (req, file, cb) => {
        // Regra de Negócio: Precisamos separar fotos de usuários das fotos de produtos.
        // Vamos ler a URL para descobrir quem está fazendo o upload.
        let pastaDestino = 'gerais'; // Fallback (Caso algo dê erro)
        
        if (req.originalUrl.includes('/usuarios')) {
            pastaDestino = 'usuarios';
        } else if (req.originalUrl.includes('/produtos')) {
            pastaDestino = 'produtos';
        }

        // Montamos o caminho absoluto apontando para a pasta pública do Front-end (EJS vai ler de lá)
        const uploadPath = path.join(__dirname, `../../client/public/uploads/${pastaDestino}`);
        
        // Extra p/ aula: Se a pasta não existir no sistema do aluno, o Node tenta criar para não dar erro
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        // "cb" significa Callback (chamar de volta). O primeiro parâmetro é null (indicando que não houve erros).
        cb(null, uploadPath);
    },

    // 2. DEFINIÇÃO DO NOME DO ARQUIVO (Evitando sobrescrever fotos com o mesmo nome)
    filename: (req, file, cb) => {
        // Explicar na aula: Se dois usuários mandarem "foto.png", a segunda vai apagar a primeira!
        // Solução: Concatenamos os milissegundos atuais (Date.now()) com um número aleatório e a extensão original.
        // Ex: 169823489123-145627-foto.png
        
        const timestamp = Date.now();
        const numeroAleatorio = Math.round(Math.random() * 1E9);
        const extensaoDoArquivo = path.extname(file.originalname); // Pega o '.png' ou '.jpg'
        
        const nomeFinalSeguro = `${timestamp}-${numeroAleatorio}${extensaoDoArquivo}`;
        
        cb(null, nomeFinalSeguro);
    }
});

// Finaliza exportando a variável upload já configurada, pronta para ser usada nas Rotas
const upload = multer({ storage: storage });

module.exports = upload;
