/**
 * COMPORTAMENTO.JS
 * Lógica interativa do lado do cliente para o Design System 'trocAqui'
 */

// Garante que o script só roda após o HTML ser totalmente renderizado pelo EJS
document.addEventListener('DOMContentLoaded', () => {
    
    // Sistema de Preview de Imagem (Formulários de Cadastro)
    const inputFoto = document.getElementById('foto');
    const previewBox = document.getElementById('preview-box');
    const previewImg = document.getElementById('preview-img');

    // Se existirem na página (evita erros em páginas que não têm formulário de foto)
    if (inputFoto && previewBox && previewImg) {
        
        // Adiciona um "escutador" para quando o valor do campo de arquivo mudar
        inputFoto.addEventListener('change', function(evento) {
            
            // Pega o arquivo que foi selecionado na janela do sistema operacional
            const arquivo = evento.target.files[0];
            
            if (arquivo) {
                // FileReader é a ferramenta do Navegador que consegue ler arquivos do PC do usuário sem enviar pro servidor ainda!
                const leitorDeArquivo = new FileReader();
                
                // Engatilha essa função para quando ele terminar de carregar o arquivo na memória
                leitorDeArquivo.onload = function(e) {
                    previewImg.src = e.target.result; // O resultado da leitura vira o 'src' da imagem
                    previewBox.style.display = 'block'; // Mostra a caixa que tem a bordinha vermelha
                };
                
                // Dá o comando para ler o arquivo como texto em Base64 (que é como imagens podem ser escritas no HTML)
                leitorDeArquivo.readAsDataURL(arquivo);
            } else {
                // Se a pessoa abriu a caixa e clicou em "Cancelar", limpamos e escondemos
                previewImg.src = '';
                previewBox.style.display = 'none';
            }
        });
    }
});
