# 🏆 Torneio Brasileiro de Pênaltis

Um simulador de pênaltis arcade desenvolvido em JavaScript puro (Vanilla JS), inspirado no cenário do futebol brasileiro de 2026. O jogo agora conta com um sistema completo de competição, desde a fase de grupos até a grande final.

## 🕹️ Funcionalidades

- **32 Times Brasileiros**: Inclui os principais clubes das Séries A e B com suas cores tradicionais.
- **Sistema de Torneio Realista**:
    - **Fase de Grupos**: 8 grupos de 4 times, com 3 rodadas de confrontos.
    - **Mata-Mata**: Oitavas, Quartas, Semi e Final (estilo Copa do Mundo).
- **Escolha de Função**: Jogue o torneio inteiro como **Batedor** (focado em precisão) ou como **Goleiro** (focado em reflexos).
- **Física de Chute Aprimorada**: Curva de bola suavizada para maior controle e variedade de chutes.
- **Feedback Visual e Sonoro**: Efeitos sonoros para chutes, gols, defesas e apito do juiz, além de vibração de rede (shake effect).
- **Tela de Campeão**: Comemoração especial com troféu ao vencer a final.

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura das telas e containers.
- **CSS3**: Estilização, animações de transição e layout responsivo do grid de times.
- **JavaScript (ES6+)**: Lógica da física da bola, IA do goleiro e motor do torneio.
- **Canvas API**: Renderização 2D do campo, jogadores e animações.
- **Web Audio API**: Geração de sons via osciladores (sem necessidade de arquivos de áudio externos).

## 🚀 Como Jogar

1. **Seleção**: Escolha seu time do coração entre os 32 disponíveis.
2. **Função**: Defina se você quer ser o **Artilheiro** ou o **Paredão**.
3. **Fase de Grupos**: Vença seus jogos para somar pontos. Apenas os 2 melhores de cada grupo avançam.
4. **Mata-Mata**: No mata-mata, perder significa ser eliminado. O empate nos pênaltis dá vantagem ao jogador.
5. **Controles**:
    - **Mouse/Touch**: Move a mira (Batedor) ou move o goleiro (Goleiro).
    - **Clique/Tap**: Executa o chute quando o juiz autorizar.

## 📂 Estrutura de Arquivos

- `index.html`: Gerenciamento das telas (Menu, Seleção, Hub, Jogo).
- `style.css`: Identidade visual escura com detalhes em verde e amarelo.
- `game.js`: O "cérebro" do jogo, contendo a física, as regras do torneio e a renderização.

## 📈 Melhorias Futuras (Backlog)

- [ ] Adicionar sistema de "Morte Súbita" em caso de empate real.
- [ ] Implementar sistema de salvamento (LocalStorage) para continuar o torneio depois.
- [ ] Adicionar estatísticas de gols marcados e defesas feitas ao longo da campanha.
- [ ] Multiplayer local (P1 vs P2).

---
## 👨‍💻 Autor

Desenvolvido por Patrick Gonçalves

💡 Projeto educacional e interativo em JavaScript
