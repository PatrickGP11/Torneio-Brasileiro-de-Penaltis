# Torneio Brasileiro de Pênaltis 2026 ⚽🇧🇷

Um simulador de pênaltis estilo arcade desenvolvido em HTML5 Canvas, focado na imersão, física divertida e fidelidade visual aos clubes brasileiros.

![Status do Projeto](https://img.shields.io/badge/Status-Completo-brightgreen) ![Tech](https://img.shields.io/badge/Tech-HTML5%20%7C%20JS%20%7C%20Canvas-blue)

## 🎮 Funcionalidades Principais

* **32 Times Brasileiros:** Lista completa com escudos reais e paleta de cores autêntica.
* **Modos de Jogo:**
    * 👟 **Artilheiro:** Mire, coloque efeito na bola e vença o goleiro.
    * 🧤 **Paredão:** Controle o goleiro e garanta o zero no placar.
* **Imersão Visual:**
    * **Torcida Dinâmica:** A arquibancada é dividida ao meio. Apenas a torcida que ganha o lance (gol ou defesa) vibra e comemora.
    * **Uniformes Fiéis:** Configuração específica para cores de jogadores de linha e cores exclusivas para goleiros (ex: SPFC com goleiro de preto, Palmeiras com goleiro azul).
* **Sistema de Campeonato:** Fase de Grupos completa com tabela de classificação, seguida de chaveamento mata-mata até a final.

## 🛠️ Solução Técnica para Imagens (Escudos)

Um dos maiores desafios técnicos em jogos web locais é o bloqueio de **CORS (Cross-Origin Resource Sharing)** e proteção contra **Hotlink** que muitos servidores de imagem (como a Wikipédia) possuem.

Para garantir que todos os escudos apareçam sempre, sem erros de carregamento, este projeto implementa uma função de **Proxy de Imagem**:

``javascript
function getSafeLogo(url) {
    // Intercepta a URL original da Wikimedia
    const cleanUrl = url.replace(/^https?:\/\//, '');
    // Redireciona através do serviço de cache e redimensionamento wsrv.nl
    return `https://images.weserv.nl/?url=${cleanUrl}&w=120&h=120&output=png&il`;
}

Isso garante:

## 1. Conversão automática de SVG para PNG (melhor compatibilidade com Canvas).

## 2. Bypass de restrições de segurança de domínio cruzado.

## 3. Cache de imagem para carregamento rápido.

## 🚀 Como Executar
Basta clonar este repositório e abrir o arquivo index.html em qualquer navegador moderno (Chrome, Firefox, Edge, Safari). Não é necessária instalação de dependências ou servidor backend.

## 🎨 Estrutura do Projeto

index.html: Estrutura da interface e containers.

style.css: Estilização da UI, efeitos de vidro (Glassmorphism) e animações.

game.js:

Lógica de física da bola (curva, velocidade).

Renderização do Canvas (desenho vetorial dos jogadores e torcida).

Inteligência Artificial do goleiro e batedor.

Gerenciamento de estado do torneio.

## ⚠️ Créditos e Direitos

As imagens dos escudos são carregadas dinamicamente e pertencem aos seus respectivos clubes.

Este é um projeto de fã para fins de estudo e entretenimento.

## 👨‍💻 Autor

Desenvolvido por Patrick Gonçalves

💡 Projeto educacional e interativo em JavaScript
