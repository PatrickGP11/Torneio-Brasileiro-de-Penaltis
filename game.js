const c = document.getElementById("c");
const ctx = c.getContext("2d");

// --- REFERÊNCIAS DOM ---
const screens = {
    menu: document.getElementById("menu"),
    teamSelect: document.getElementById("team-select"),
    roleSelect: document.getElementById("role-select"),
    hub: document.getElementById("tournament-hub"),
    gameOver: document.getElementById("game-over"),
    champion: document.getElementById("champion-screen"),
    hud: document.getElementById("hud")
};

const hudEls = {
    p1Name: document.getElementById("team-name-p1"),
    p1Score: document.getElementById("gols-p1"),
    cpuName: document.getElementById("team-name-cpu"),
    cpuScore: document.getElementById("gols-cpu"),
    round: document.getElementById("round"),
    stage: document.getElementById("match-stage-hud"),
    feedback: document.getElementById("feedback-msg")
};

const hubElsDom = { // Renomeado para evitar conflito
    stageName: document.getElementById("stage-name"),
    p1: document.getElementById("hub-p1"),
    cpu: document.getElementById("hub-cpu"),
    standingsBody: document.getElementById("standings-body"),
    standingsBox: document.getElementById("standings-box"),
    bracketBox: document.getElementById("bracket-box"),
    bracketList: document.getElementById("bracket-list")
};

/* ================= 32 TIMES ================= */
const TEAMS = [
    { id: 'fla', name: 'FLA', color1: '#C8102E', color2: '#000000' },
    { id: 'pal', name: 'PAL', color1: '#006437', color2: '#FFFFFF' },
    { id: 'spfc', name: 'SAO', color1: '#FE0000', color2: '#FFFFFF' },
    { id: 'cor', name: 'COR', color1: '#000000', color2: '#FFFFFF' },
    { id: 'vas', name: 'VAS', color1: '#000000', color2: '#FFFFFF' },
    { id: 'flu', name: 'FLU', color1: '#9F022D', color2: '#00913C' },
    { id: 'bot', name: 'BOT', color1: '#000000', color2: '#FFFFFF' },
    { id: 'san', name: 'SAN', color1: '#FFFFFF', color2: '#000000' },
    { id: 'gre', name: 'GRE', color1: '#0D80BF', color2: '#000000' },
    { id: 'int', name: 'INT', color1: '#E30613', color2: '#FFFFFF' },
    { id: 'cam', name: 'CAM', color1: '#000000', color2: '#FFFFFF' },
    { id: 'cru', name: 'CRU', color1: '#0054A6', color2: '#FFFFFF' },
    { id: 'bah', name: 'BAH', color1: '#003194', color2: '#F02328' },
    { id: 'vit', name: 'VIT', color1: '#E61812', color2: '#000000' },
    { id: 'for', name: 'FOR', color1: '#115EAC', color2: '#E61812' },
    { id: 'cea', name: 'CEA', color1: '#000000', color2: '#FFFFFF' },
    { id: 'spo', name: 'SPO', color1: '#E30613', color2: '#000000' },
    { id: 'cap', name: 'CAP', color1: '#E61812', color2: '#000000' },
    { id: 'cfc', name: 'CFC', color1: '#005334', color2: '#FFFFFF' },
    { id: 'goi', name: 'GOI', color1: '#005F36', color2: '#FFFFFF' },
    { id: 'vil', name: 'VIL', color1: '#E30613', color2: '#FFFFFF' },
    { id: 'pay', name: 'PAY', color1: '#0091CF', color2: '#FFFFFF' },
    { id: 'bGT', name: 'RBB', color1: '#D30F15', color2: '#FFFFFF' },
    { id: 'cui', name: 'CUI', color1: '#018036', color2: '#FDE900' },
    { id: 'ame', name: 'AME', color1: '#038E46', color2: '#000000' },
    { id: 'juv', name: 'JUV', color1: '#038E46', color2: '#FFFFFF' },
    { id: 'ava', name: 'AVA', color1: '#00679A', color2: '#FFFFFF' },
    { id: 'fig', name: 'FIG', color1: '#000000', color2: '#FFFFFF' },
    { id: 'cha', name: 'CHA', color1: '#009B3A', color2: '#FFFFFF' },
    { id: 'cri', name: 'CRI', color1: '#FDD116', color2: '#000000' },
    { id: 'pon', name: 'PON', color1: '#000000', color2: '#FFFFFF' },
    { id: 'gua', name: 'GUA', color1: '#038E46', color2: '#FFFFFF' }
];

/* ================= LÓGICA DO TORNEIO ================= */
let Tournament = {
    active: false,
    playerTeam: null,
    playerRole: 'player',
    stage: 'groups',
    groups: [],
    groupIndex: 0,
    groupMatchIndex: 0,
    bracketMatches: [],
    standings: {}
};

let animationFrameId;

function stopGameLoop() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
}

// --- FÍSICA E CONFIGURAÇÕES ---
let currentMatch = { p1: null, cpu: null, scoreP1: 0, scoreCpu: 0, round: 1, finished: false };
const CONFIG = { goalLeft: 60, goalRight: 340, goalTop: 190, penaltyY: 550 };
let gameState = "MENU";
let ball = { x: 200, y: CONFIG.penaltyY, z: 0, vx: 0, vy: 0, vz: 0, curve: 0, scale: 1, moving: false, rotation: 0 };
let keeper = { x: 200, y: CONFIG.goalTop, targetX: 200, animState: "idle" };
let juiz = { ready: false, timer: 0, whistled: false };
let feedbackTimer = 0;
let shakeAmount = 0;
let aimX = 200;
let inputActive = false;
let globalTime = 0; // Para animação da torcida

// --- FÍSICA CALIBRADA ---
function getLockedPhysics() {
    let speedY, speedX, margin;

    if (Tournament.stage === 'groups') {
        speedY = -6.5;
        speedX = 0.025;
        margin = 85;
    }
    else if (Tournament.stage === 'sf' || Tournament.stage === 'final') {
        speedY = -9.5;
        speedX = 0.033;
        margin = 30;
    }
    else {
        speedY = -8.0;
        speedX = 0.029;
        margin = 55;
    }
    return { y: speedY, x: speedX, cpuMargin: margin };
}

function switchScreen(name) {
    stopGameLoop();
    Object.values(screens).forEach(s => s.style.display = 'none');
    screens[name].style.display = (['teamSelect', 'roleSelect', 'hub'].includes(name)) ? 'flex' : 'block';
    if (name === 'menu') screens.menu.style.display = 'flex';
}

function goToTeamSelect() { renderTeamGrid(); switchScreen('teamSelect'); }
function backToMenu() { switchScreen('menu'); }
function backToTeamSelect() { switchScreen('teamSelect'); }

function renderTeamGrid() {
    const grid = document.getElementById('teams-grid');
    grid.innerHTML = '';
    TEAMS.forEach(t => {
        const div = document.createElement('div');
        div.className = 'team-card';
        div.innerHTML = `<div class="team-flag" style="background: linear-gradient(135deg, ${t.color1} 50%, ${t.color2} 50%)"></div><div class="team-name-card">${t.name}</div>`;
        div.onclick = () => {
            Tournament.playerTeam = t;
            document.getElementById('selected-team-display').textContent = t.name;
            switchScreen('roleSelect');
        };
        grid.appendChild(div);
    });
}

function initTournament(role) {
    Tournament.active = true;
    Tournament.playerRole = role;
    Tournament.stage = 'groups';
    Tournament.groupMatchIndex = 0;
    Tournament.standings = {};
    Tournament.bracketMatches = [];

    TEAMS.forEach(t => { Tournament.standings[t.id] = { points: 0, wins: 0, losses: 0, played: 0 }; });

    let shuffled = [...TEAMS].sort(() => 0.5 - Math.random());
    Tournament.groups = [];
    for (let i = 0; i < 8; i++) Tournament.groups.push(shuffled.slice(i * 4, i * 4 + 4));

    Tournament.groups.forEach((g, i) => {
        if (g.find(t => t.id === Tournament.playerTeam.id)) Tournament.groupIndex = i;
    });
    updateTournamentHub();
}

function updateTournamentHub() {
    switchScreen('hub');
    const myGroup = Tournament.groups[Tournament.groupIndex];

    if (Tournament.stage === 'groups') {
        hubElsDom.stageName.textContent = `FASE DE GRUPOS - JOGO ${Tournament.groupMatchIndex + 1}/3`;
        hubElsDom.standingsBox.style.display = "block";
        hubElsDom.bracketBox.style.display = "none";
        renderGroupTable(myGroup);
        const opponents = myGroup.filter(t => t.id !== Tournament.playerTeam.id);
        const nextOpponent = opponents[Tournament.groupMatchIndex];
        setupMatch(Tournament.playerTeam, nextOpponent);
    } else {
        let stageTitle = "";
        if (Tournament.stage === 'r16') stageTitle = "OITAVAS DE FINAL";
        if (Tournament.stage === 'qf') stageTitle = "QUARTAS DE FINAL";
        if (Tournament.stage === 'sf') stageTitle = "SEMIFINAL";
        if (Tournament.stage === 'final') stageTitle = "GRANDE FINAL";
        hubElsDom.stageName.textContent = stageTitle;
        hubElsDom.standingsBox.style.display = "none";
        hubElsDom.bracketBox.style.display = "block";
        renderBracket();
    }
}

function renderGroupTable(group) {
    const sorted = [...group].sort((a, b) => {
        const statsA = Tournament.standings[a.id];
        const statsB = Tournament.standings[b.id];
        return (statsB.points - statsA.points) || (statsB.wins - statsA.wins);
    });
    hubElsDom.standingsBody.innerHTML = "";
    sorted.forEach((team, index) => {
        const s = Tournament.standings[team.id];
        const tr = document.createElement("tr");
        tr.className = index < 2 ? "row-qualified" : "row-eliminated";
        tr.innerHTML = `<td>${index + 1}</td><td>${team.name}</td><td>${s.points}</td><td>${s.wins}</td><td>${s.losses}</td>`;
        hubElsDom.standingsBody.appendChild(tr);
    });
}

function renderBracket() {
    hubElsDom.bracketList.innerHTML = "";
    Tournament.bracketMatches.forEach(match => {
        const div = document.createElement("div");
        const isPlayerMatch = (match.t1.id === Tournament.playerTeam.id || match.t2.id === Tournament.playerTeam.id);
        div.className = isPlayerMatch ? "bracket-match player-match" : "bracket-match";
        div.innerHTML = `<span style="color:${match.t1.color1}">${match.t1.name}</span><span class="bracket-vs">X</span><span style="color:${match.t2.color1}">${match.t2.name}</span>`;
        hubElsDom.bracketList.appendChild(div);
        if (isPlayerMatch) setupMatch(match.t1, match.t2);
    });
}

function setupMatch(p1, cpu) {
    if (p1.id !== Tournament.playerTeam.id) { currentMatch.p1 = cpu; currentMatch.cpu = p1; }
    else { currentMatch.p1 = p1; currentMatch.cpu = cpu; }
    hubElsDom.p1.textContent = currentMatch.p1.name; hubElsDom.p1.style.color = currentMatch.p1.color1;
    hubElsDom.cpu.textContent = currentMatch.cpu.name; hubElsDom.cpu.style.color = currentMatch.cpu.color1;
}

function startMatchFromHub() {
    stopGameLoop();
    currentMatch.scoreP1 = 0; currentMatch.scoreCpu = 0; currentMatch.round = 1; currentMatch.finished = false;
    switchScreen('hud'); c.style.display = 'block';
    hudEls.p1Name.textContent = currentMatch.p1.name; hudEls.p1Name.style.color = currentMatch.p1.color1;
    hudEls.cpuName.textContent = currentMatch.cpu.name; hudEls.cpuName.style.color = currentMatch.cpu.color1;
    hudEls.stage.textContent = Tournament.stage === 'groups' ? "GRUPOS" : "MATA-MATA";
    resetPenaltyRound();
    loop();
}

function resetPenaltyRound() {
    ball = { x: 200, y: CONFIG.penaltyY, z: 0, vx: 0, vy: 0, vz: 0, curve: 0, scale: 1, moving: false, rotation: 0 };
    keeper.x = 200; keeper.animState = "idle";
    gameState = "WAIT_JUIZ"; inputActive = false; juiz.ready = false; juiz.whistled = false;
    juiz.timer = 70;
    showFeedback("PREPARA...", "#fff");
    updateHud();
}

function updateHud() {
    hudEls.round.textContent = currentMatch.round;
    hudEls.p1Score.textContent = currentMatch.scoreP1;
    hudEls.cpuScore.textContent = currentMatch.scoreCpu;
}

function showFeedback(text, color) {
    hudEls.feedback.textContent = text;
    hudEls.feedback.style.color = color;
    hudEls.feedback.style.opacity = 1;
    hudEls.feedback.style.transform = "translate(-50%, -50%) scale(1.2)";
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => {
        hudEls.feedback.style.opacity = 0;
        hudEls.feedback.style.transform = "translate(-50%, -50%) scale(0.8)";
    }, 1200);
}

function getX(e) {
    let clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const rect = c.getBoundingClientRect();
    return (clientX - rect.left) * (c.width / rect.width);
}

function handleMove(e) {
    if (gameState !== "PLAY" || !inputActive) return;
    if (e.cancelable) e.preventDefault();
    let x = getX(e);
    if (Tournament.playerRole === 'player') {
        aimX = Math.max(CONFIG.goalLeft, Math.min(CONFIG.goalRight, x));
    } else {
        const target = Math.max(CONFIG.goalLeft, Math.min(CONFIG.goalRight, x));
        keeper.x += (target - keeper.x) * 0.35;
    }
}

function handleEnd() {
    if (gameState === "PLAY" && !ball.moving && juiz.ready && inputActive) {
        if (Tournament.playerRole === 'player') shoot();
    }
}

c.addEventListener('touchstart', (e) => { if (e.cancelable) e.preventDefault(); }, { passive: false });
c.addEventListener('touchmove', handleMove, { passive: false });
c.addEventListener('touchend', handleEnd);
c.addEventListener('mousemove', handleMove);
c.addEventListener('mousedown', (e) => {
    if (gameState === "PLAY" && juiz.ready && Tournament.playerRole === 'player' && !ball.moving && inputActive) shoot();
});

function shoot() {
    const dx = aimX - ball.x;
    ball.moving = true;
    const physics = getLockedPhysics();
    ball.vx = dx * physics.x;
    ball.vy = physics.y;
    ball.vz = 0.16;
    ball.curve = dx * 0.00025;
    playSound('kick');

    if (Tournament.playerRole === 'player') {
        const errorMargin = 180;
        keeper.targetX = aimX + (Math.random() - 0.5) * errorMargin;
        setTimeout(() => {
            keeper.animState = keeper.targetX < 200 ? "dive_left" : "dive_right";
        }, 400 + Math.random() * 200);
    }
}

function cpuShoot() {
    if (ball.moving) return;
    const physics = getLockedPhysics();
    const target = (CONFIG.goalLeft + physics.cpuMargin) + Math.random() * ((CONFIG.goalRight - physics.cpuMargin) - (CONFIG.goalLeft + physics.cpuMargin));
    const dx = target - ball.x;
    ball.moving = true;
    ball.vx = dx * physics.x;
    ball.vy = physics.y;
    ball.vz = 0.16;
    ball.curve = dx * 0.00025;
    playSound('kick');
}

function update() {
    globalTime++;
    if (gameState === "WAIT_JUIZ") {
        juiz.timer--;
        if (juiz.timer <= 0 && !juiz.whistled) {
            juiz.whistled = true;
            playSound('whistle');
            showFeedback("AGUARDE...", "#fff");
            setTimeout(() => {
                juiz.ready = true;
                gameState = "PLAY";
                inputActive = true;
                showFeedback("VAI!", "#00e676");
                if (Tournament.playerRole === 'keeper') cpuShoot();
            }, 1800);
        }
    }

    if (Tournament.playerRole === 'player' && ball.moving) {
        keeper.x += (keeper.targetX - keeper.x) * 0.05;
    }

    if (ball.moving) {
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.vx += ball.curve;
        ball.rotation += 8;
        ball.scale = 0.5 + (0.5 * ((ball.y - CONFIG.goalTop) / (CONFIG.penaltyY - CONFIG.goalTop)));
        if (ball.y <= CONFIG.goalTop + 10) checkResult();
    }
    if (shakeAmount > 0) shakeAmount--;
}

function checkResult() {
    ball.moving = false;
    let result = "";
    const inGoal = ball.x > CONFIG.goalLeft && ball.x < CONFIG.goalRight;
    const save = Math.abs(ball.x - keeper.x) < 35;

    if (!inGoal) { result = "FORA"; showFeedback("PRA FORA!", "#ff5252"); }
    else if (save) { result = "DEFESA"; showFeedback("DEFENDEU!", "#ff9800"); playSound('save'); }
    else { result = "GOL"; showFeedback("GOOOOL!", "#ffeb3b"); shakeAmount = 20; playSound('goal'); }

    if (Tournament.playerRole === 'player') {
        if (result === "GOL") currentMatch.scoreP1++; else currentMatch.scoreCpu++;
    } else {
        if (result === "DEFESA" || result === "FORA") currentMatch.scoreP1++; else currentMatch.scoreCpu++;
    }

    gameState = "RESULT";
    currentMatch.round++;
    if (currentMatch.round > 5) setTimeout(endMatch, 2000);
    else setTimeout(resetPenaltyRound, 2000);
}

function endMatch() {
    stopGameLoop();
    const playerWon = currentMatch.scoreP1 > currentMatch.scoreCpu;
    const isDraw = currentMatch.scoreP1 === currentMatch.scoreCpu;

    if (Tournament.stage === 'groups') {
        if (playerWon) { updateStats(currentMatch.p1.id, 3, 1, 0); updateStats(currentMatch.cpu.id, 0, 0, 1); }
        else if (isDraw) { updateStats(currentMatch.p1.id, 1, 0, 0); updateStats(currentMatch.cpu.id, 1, 0, 0); }
        else { updateStats(currentMatch.p1.id, 0, 0, 1); updateStats(currentMatch.cpu.id, 3, 1, 0); }

        const myGroup = Tournament.groups[Tournament.groupIndex];
        const others = myGroup.filter(t => t.id !== currentMatch.p1.id && t.id !== currentMatch.cpu.id);
        if (others.length === 2) {
            const winner = Math.random() > 0.5 ? others[0] : others[1];
            updateStats(winner.id, 3, 1, 0); updateStats(winner === others[0] ? others[1].id : others[0].id, 0, 0, 1);
        }

        Tournament.groupMatchIndex++;
        if (Tournament.groupMatchIndex >= 3) endGroupStage();
        else updateTournamentHub();

    } else {
        if (playerWon) advanceKnockout();
        else showGameOver("Você perdeu nos pênaltis.");
    }
}

function updateStats(teamId, pts, w, l) {
    Tournament.standings[teamId].points += pts;
    Tournament.standings[teamId].wins += w;
    Tournament.standings[teamId].losses += l;
    Tournament.standings[teamId].played += 1;
}

function endGroupStage() {
    let qualifiedTeams = [];
    Tournament.groups.forEach(group => {
        group.sort((a, b) => {
            const sa = Tournament.standings[a.id];
            const sb = Tournament.standings[b.id];
            return (sb.points - sa.points) || (sb.wins - sa.wins);
        });
        qualifiedTeams.push(group[0], group[1]);
    });

    const playerQualified = qualifiedTeams.find(t => t.id === Tournament.playerTeam.id);
    if (playerQualified) {
        Tournament.stage = 'r16';
        generateBracket(qualifiedTeams);
        updateTournamentHub();
    } else { showGameOver("Eliminado na Fase de Grupos."); }
}

function generateBracket(teams) {
    Tournament.bracketMatches = [];
    let shuffled = [...teams].sort(() => 0.5 - Math.random());
    for (let i = 0; i < shuffled.length; i += 2) {
        Tournament.bracketMatches.push({ t1: shuffled[i], t2: shuffled[i + 1] });
    }
}

function advanceKnockout() {
    const stages = ['r16', 'qf', 'sf', 'final'];
    const currentIdx = stages.indexOf(Tournament.stage);
    if (Tournament.stage === 'final') { showChampionScreen(); return; }

    let nextRoundTeams = [Tournament.playerTeam];
    Tournament.bracketMatches.forEach(match => {
        if (match.t1.id !== Tournament.playerTeam.id && match.t2.id !== Tournament.playerTeam.id) {
            nextRoundTeams.push(Math.random() > 0.5 ? match.t1 : match.t2);
        }
    });

    Tournament.stage = stages[currentIdx + 1];
    generateBracket(nextRoundTeams);
    updateTournamentHub();
}

function showGameOver(reason) { switchScreen('gameOver'); document.getElementById('elimination-reason').textContent = reason; }
function showChampionScreen() { switchScreen('champion'); document.getElementById('champion-team').textContent = Tournament.playerTeam.name; playSound('goal'); }

// --- RENDERIZAÇÃO MELHORADA ---
function draw() {
    ctx.clearRect(0, 0, c.width, c.height);

    // 1. O Campo vem PRIMEIRO (fundo)
    drawField();

    // 2. A Torcida vem EM CIMA do fundo (mas atrás do gol)
    drawCrowd();

    // 3. Rede e Traves
    drawNet();

    // 4. Jogadores
    drawKeeper(); // Goleiro com uniforme
    drawRef();    // Juiz com uniforme

    // 5. Bola e Sombras
    if (ball.moving || gameState === "WAIT_JUIZ" || gameState === "PLAY") {
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        const shadowScale = ball.scale * 1.2;
        ctx.beginPath();
        ctx.ellipse(ball.x, ball.y + (8 * (1 - ball.scale)), 8 * shadowScale, 4 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    drawBall();

    // 6. Mira do jogador
    if (Tournament.playerRole === 'player' && gameState === "PLAY" && !ball.moving && inputActive) {
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath(); ctx.moveTo(ball.x, ball.y); ctx.lineTo(aimX, CONFIG.goalTop + 20); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = "rgba(255,255,255,0.9)"; ctx.beginPath(); ctx.arc(aimX, CONFIG.goalTop + 20, 6, 0, Math.PI * 2); ctx.fill();
    }
}

function drawCrowd() {
    // DESENHAR ARQUIBANCADA (Fundo Escuro)
    // Para não ficar torcida flutuando na grama, pintamos o topo de cinza
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, c.width, CONFIG.goalTop - 10);

    // Desenha as "pessoas"
    const rows = 6;
    const cols = 25;
    const startY = 70; // Empurrei um pouco para baixo para sair debaixo do placar
    const spacingX = c.width / cols;
    const spacingY = 16;

    for (let r = 0; r < rows; r++) {
        for (let cl = 0; cl < cols; cl++) {
            // Escolhe time baseado na posição
            const isP1 = cl < cols / 2;
            const team = isP1 ? currentMatch.p1 : currentMatch.cpu;
            const color = Math.random() > 0.5 ? team.color1 : team.color2;

            // Animação de "pulo"
            let bounce = 0;
            if (gameState === "RESULT") {
                // Torcida comemora se for gol
                bounce = Math.sin(globalTime * 0.5 + cl) * 5;
            } else {
                // Movimento ambiente
                bounce = Math.sin(globalTime * 0.1 + r + cl) * 2;
            }

            const x = cl * spacingX + 10;
            const y = startY + r * spacingY + bounce;

            // Desenha "pessoa" (círculo simples)
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawField() {
    // Gramado
    for (let i = 0; i < 12; i++) {
        ctx.fillStyle = i % 2 === 0 ? "#2e7d32" : "#388e3c";
        ctx.fillRect(0, i * (c.height / 12), c.width, c.height / 12);
    }

    // Linhas do campo
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 4;

    // Grande área
    ctx.strokeRect(40, CONFIG.goalTop, 320, 160);
    // Pequena área
    ctx.strokeRect(120, CONFIG.goalTop, 160, 60);
    // Meia lua
    ctx.beginPath(); ctx.arc(200, CONFIG.goalTop + 160, 40, 0, Math.PI, false); ctx.stroke();
    // Marca do pênalti
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(200, CONFIG.penaltyY, 4, 0, Math.PI * 2); ctx.fill();
}

function drawNet() {
    const shake = (Math.random() - 0.5) * shakeAmount;
    const l = CONFIG.goalLeft + shake, r = CONFIG.goalRight + shake, t = CONFIG.goalTop, d = 35;

    // Traves
    ctx.lineWidth = 5; ctx.strokeStyle = "#ddd"; ctx.lineJoin = "round";

    // Fundo da rede (linhas mais finas)
    ctx.lineWidth = 1; ctx.strokeStyle = "rgba(255,255,255,0.3)";

    // Desenho hexagonal simples da rede
    const netSpacing = 12;
    for (let x = l; x < r; x += netSpacing) {
        ctx.beginPath(); ctx.moveTo(x, t); ctx.lineTo(x + (x - 200) * 0.15, t + d); ctx.stroke();
    }
    for (let y = 0; y < d; y += 6) {
        ctx.beginPath();
        ctx.moveTo(l - (y * 0.2), t + y);
        ctx.lineTo(r + (y * 0.2), t + y);
        ctx.stroke();
    }

    // Traves principais (re-desenho por cima)
    ctx.lineWidth = 6; ctx.strokeStyle = "#eee";
    ctx.beginPath();
    ctx.moveTo(l, t); ctx.lineTo(r, t); // Travessão
    ctx.moveTo(l, t); ctx.lineTo(l, t + 600); // Trave Esq
    ctx.moveTo(r, t); ctx.lineTo(r, t + 600); // Trave Dir
    ctx.stroke();
}

function drawHuman(x, y, color1, color2, scale, isKeeper, animState) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    // Rotação para pulo do goleiro
    if (isKeeper) {
        if (animState === 'dive_left') ctx.rotate(Math.PI / 3.5);
        if (animState === 'dive_right') ctx.rotate(-Math.PI / 3.5);
    }

    // Cabeça
    ctx.fillStyle = "#d2b48c"; // Pele
    ctx.beginPath(); ctx.arc(0, -25, 12, 0, Math.PI * 2); ctx.fill();

    // Camisa (Trapézio)
    ctx.fillStyle = color1;
    ctx.beginPath();
    ctx.moveTo(-15, -15); ctx.lineTo(15, -15); // Ombros
    ctx.lineTo(12, 15); ctx.lineTo(-12, 15); // Cintura
    ctx.fill();

    // Detalhe camisa
    ctx.fillStyle = color2;
    ctx.fillRect(-5, -15, 10, 30);

    // Braços (Mangas + Pele)
    ctx.fillStyle = color1; // Manga
    ctx.beginPath(); ctx.arc(-16, -10, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(16, -10, 5, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = "#d2b48c"; // Braço Pele
    // Se for goleiro, braços esticados
    if (isKeeper && animState !== 'idle') {
        ctx.fillRect(-22, -25, 6, 20); // Braço Esq cima
        ctx.fillRect(16, -25, 6, 20);  // Braço Dir cima
    } else {
        ctx.fillRect(-20, -10, 6, 20); // Braço Esq baixo
        ctx.fillRect(14, -10, 6, 20);  // Braço Dir baixo
    }

    // Luvas (se goleiro)
    if (isKeeper) {
        ctx.fillStyle = "#fff";
        if (animState !== 'idle') {
            ctx.beginPath(); ctx.arc(-19, -30, 8, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(19, -30, 8, 0, Math.PI * 2); ctx.fill();
        } else {
            ctx.beginPath(); ctx.arc(-17, 12, 6, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(17, 12, 6, 0, Math.PI * 2); ctx.fill();
        }
    }

    // Calção
    ctx.fillStyle = color2; // Cor do time 2 ou branco
    ctx.fillRect(-13, 15, 26, 12);

    // Pernas
    ctx.fillStyle = "#d2b48c";
    ctx.fillRect(-11, 27, 8, 15);
    ctx.fillRect(3, 27, 8, 15);

    // Meias
    ctx.fillStyle = color1;
    ctx.fillRect(-11, 35, 8, 10);
    ctx.fillRect(3, 35, 8, 10);

    // Chuteiras
    ctx.fillStyle = "#111";
    ctx.fillRect(-11, 45, 10, 6);
    ctx.fillRect(3, 45, 10, 6);

    ctx.restore();
}

function drawKeeper() {
    const activeKeeper = Tournament.playerRole === 'player' ? currentMatch.cpu : currentMatch.p1;
    // Ajuste de posição Y para o desenho do boneco
    drawHuman(keeper.x, keeper.y + 20, activeKeeper.color1, activeKeeper.color2, 1, true, keeper.animState);
}

function drawRef() {
    const rx = 40, ry = CONFIG.penaltyY - 60;
    // Juiz: Camisa preta, detalhe amarelo, escala menor
    drawHuman(rx, ry, "#000", "#ffeb3b", 0.7, false, "idle");
}

function drawBall() {
    if (gameState === "MENU" || gameState === "RESULT" && !ball.moving) return;
    ctx.save();
    ctx.translate(ball.x, ball.y);
    ctx.scale(ball.scale, ball.scale);
    ctx.rotate(ball.rotation * Math.PI / 180);

    // Bola base
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();

    // Gomos da bola (pentágonos estilizados)
    ctx.fillStyle = "#111";
    ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(4, -5); ctx.lineTo(-4, -5); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-9, 2); ctx.lineTo(-5, 7); ctx.lineTo(-2, 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(9, 2); ctx.lineTo(5, 7); ctx.lineTo(2, 2); ctx.fill();

    // Brilho
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.beginPath(); ctx.arc(-3, -3, 4, 0, Math.PI * 2); ctx.fill();

    ctx.restore();
}

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();
function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator(); const g = audioCtx.createGain();
    osc.connect(g); g.connect(audioCtx.destination); const t = audioCtx.currentTime;
    if (type === 'kick') { osc.type = 'triangle'; osc.frequency.setValueAtTime(150, t); osc.frequency.exponentialRampToValueAtTime(40, t + 0.1); g.gain.setValueAtTime(1, t); g.gain.exponentialRampToValueAtTime(0.01, t + 0.1); osc.start(); osc.stop(t + 0.1); }
    if (type === 'whistle') { osc.type = 'sine'; osc.frequency.setValueAtTime(2500, t); osc.frequency.linearRampToValueAtTime(1800, t + 0.15); g.gain.setValueAtTime(0.3, t); g.gain.linearRampToValueAtTime(0, t + 0.2); osc.start(); osc.stop(t + 0.2); }
    if (type === 'goal') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(100, t); osc.frequency.linearRampToValueAtTime(400, t + 0.6); g.gain.setValueAtTime(0.5, t); g.gain.linearRampToValueAtTime(0, t + 1.2); osc.start(); osc.stop(t + 1.2); }
    if (type === 'save') { osc.type = 'square'; osc.frequency.setValueAtTime(300, t); osc.frequency.exponentialRampToValueAtTime(80, t + 0.15); g.gain.setValueAtTime(0.5, t); g.gain.linearRampToValueAtTime(0, t + 0.15); osc.start(); osc.stop(t + 0.15); }
}

function loop() {
    if (c.style.display === 'block') {
        update();
        draw();
        animationFrameId = requestAnimationFrame(loop);
    }
}

switchScreen('menu');