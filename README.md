# ⚽ Torneio Brasileiro 2026 - Ultimate Broadcast

> **A experiência definitiva de pênaltis no navegador.** > Sinta a pressão da torcida, a física da bola e a emoção do mata-mata.

O **Torneio Brasileiro 2026** é um jogo de futebol arcade desenvolvido inteiramente com **HTML5 Canvas, CSS3 e Vanilla JavaScript**. O projeto simula uma campanha completa de campeonato, onde cada chute importa e a atmosfera do estádio reage em tempo real ao seu desempenho.

---

## ⚖️ Direitos Autorais e Marcas (Disclaimer)

Este projeto foi desenvolvido para fins educacionais e de aprendizado (programação web e game dev).

Escudos e Marcas: Os logotipos (escudos) e nomes dos times de futebol utilizados neste jogo são de propriedade intelectual e marcas registradas dos seus respectivos clubes e associações desportivas.

Uso: As imagens são carregadas diretamente de fontes públicas (Wikimedia Commons/Wikipedia) apenas para fins ilustrativos dentro da simulação.

Sem Afiliação: Este projeto não possui qualquer vínculo oficial, patrocínio ou afiliação com os clubes representados ou com a CBF.

---

## ✨ Destaques & Funcionalidades

### 🏟️ Atmosfera Imersiva & "Torcida Viva"

O grande diferencial deste jogo é a **Inteligência da Torcida**. O estádio não é apenas um desenho estático:
* **Reações Dinâmicas:** A torcida reage a quem está chutando.
    * **Apoio:** Se é o seu time, eles gritam *"Confia!"*, *"Manda na gaveta!"*.
    * **Pressão:** Se é o rival, eles tentam zikar: *"Vai isolar!"*, *"Perna de pau!"*.
* **Balões de Fala (Speech Bubbles):** O estádio "fala" com você através de balões visuais antes e depois dos chutes.
* **Feedback Visual:** Textos de **"GOL!"** (Amarelo) e **"DEFENDEU!"** (Laranja) explodem especificamente sobre a torcida que está comemorando.
* **Cores Reais:** A arquibancada se pinta automaticamente com as cores dos clubes em campo.

### 🎮 Modos de Jogo

Você escolhe como quer fazer história:
* **👟 Modo Artilheiro:** Assuma a responsabilidade. Controle a mira, a força e o efeito (curva) da bola para vencer o goleiro.
* **🧤 Modo Paredão:** Seja o herói. Controle o goleiro, leia o movimento do batedor e faça defesas milagrosas.

### 🏆 Simulação de Campeonato Realista

O jogo não para quando sua partida acaba.
* **Motor de Simulação:** Um sistema robusto simula **todas as outras partidas** do torneio em segundo plano.
* **Tabela Viva:** Os times do seu grupo e dos outros grupos somam pontos, vitórias e saldo de gols realistas. Você precisa jogar bem para se classificar!
* **48 Clubes:** Times de todo o Brasil, com escudos e cores oficiais.

### ⚙️ Física & Mecânicas Avançadas

* **Radar de Velocidade:** Um velocímetro em tempo real mede a potência do seu chute em **km/h**.
* **Clima Dinâmico:** Partidas podem acontecer sob sol escaldante ou chuvas torrenciais (com raios e vento lateral que afeta a bola).
* **Power-Ups:**
    * 🔥 **Super Chute:** Potência máxima e rastro de fogo.
    * ❄️ **Cavada Master:** O clássico "panenka" com física de flutuação.

### 🔊 Áudio Procedural (Web Audio API)

Esqueça arquivos mp3 pesados. Todo o som é **gerado via código** em tempo real:
* Sons de chute, trave e rede.
* Apito do árbitro.
* **Torcida:** Vaia grave ("Boo") para erros do rival e vibração ("Cheer") para gols.

---

## 🚀 Como Jogar

1.  **Inicie o Jogo:** Abra o arquivo `index.html` no seu navegador.
2.  **Menu Principal:** Clique em **NOVA CAMPANHA**.
3.  **Seleção:** Escolha seu time de coração entre os 48 disponíveis.
4.  **Função:** Decida se será **Artilheiro** ou **Paredão**.

### 🕹️ Controles

| Ação | Como fazer (Mouse/Toque) |
| :--- | :--- |
| **Mirar (Chute)** | Mova o cursor/dedo horizontalmente. |
| **Chutar** | Clique ou solte o toque no momento certo. |
| **Defender** | Mova o goleiro para os lados antes do chute da CPU. |
| **Power-Ups** | Clique nos botões laterais (🔥 ou ❄️) antes de chutar. |

---

## 🛠️ Instalação e Estrutura

Não é necessário instalar dependências (Node, npm, etc). O jogo é **Plug & Play**.

1.  Clone este repositório.
2.  Execute o `index.html`.

**Estrutura de Arquivos:**
text

`/
├── index.html   # Estrutura DOM, UI e Telas.
├── style.css    # Estilização, Animações CSS e Radar.
└── game.js      # Lógica, Física, Canvas, Áudio e Simulação.`

## 🎨 Personalização

Quer adicionar o time do seu bairro? É fácil. No arquivo game.js, localize a constante TEAMS e adicione:

{ 
    id: 'meu_time', 
    name: 'NOME', 
    color1: '#CorPrincipal', 
    color2: '#CorSecundaria', 
    keeperColor1: '#CorGoleiro', 
    crowdColors: ['#Cor1', '#Cor2'], 
    logo: 'URL_DA_IMAGEM' 
}

## 📜 Licença

Este projeto é Open Source. Sinta-se livre para usar, modificar e aprender com o código!

Desenvolvido com 💻 código e ⚽ paixão.
