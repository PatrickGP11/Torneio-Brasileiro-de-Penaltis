const c = document.getElementById("c");
const ctx = c.getContext("2d");

// --- CONFIGURAÇÃO DE FRASES DA TORCIDA ---
const CROWD_PHRASES = {
    striker: {
        support: ["Manda na gaveta!", "É gol certo!", "Confia!", "Bate com raiva!", "O goleiro tremeu!", "Ensina como faz!"],
        rival: ["Perna de pau!", "Vai isolar!", "Chuta fofo!", "Mão de alface tá lá!", "Tira o pé!", "Erra! Erra!"]
    },
    keeper: {
        support: ["Paredão!", "Não passa nada!", "Fecha o gol!", "São Marcos!", "Pega tudo!", "Muralha!"],
        rival: ["Frangueiro!", "Chama o VAR!", "Goleiro de pebolim!", "Essa entra!", "Mão furada!", "Aceita que dói menos!"]
    },
    reaction_good: ["GOLAÇO!", "AULA!", "LENDA!", "MONSTRO!", "TOCA PRO PAI!", "EU JÁ SABIA!"],
    reaction_bad: ["QUE ISSO?", "ISOLOU!", "VERGONHA!", "VOLTA PRA BASE!", "PIADA!", "FRANGO!"]
};

let speechBubbles = []; // Lista de balões ativos

// --- REFERÊNCIAS DOM ---
const screens = {
    menu: document.getElementById("menu"),
    teamSelect: document.getElementById("team-select"),
    roleSelect: document.getElementById("role-select"),
    hub: document.getElementById("tournament-hub"),
    gameOver: document.getElementById("game-over"),
    champion: document.getElementById("champion-screen"),
    hud: document.getElementById("hud"),
    ranking: document.getElementById("ranking-screen")
};

const hudEls = {
    p1Name: document.getElementById("team-name-p1"),
    p1Score: document.getElementById("gols-p1"),
    p1Logo: document.getElementById("logo-p1"),
    cpuName: document.getElementById("team-name-cpu"),
    cpuScore: document.getElementById("gols-cpu"),
    cpuLogo: document.getElementById("logo-cpu"),
    round: document.getElementById("round"),
    stage: document.getElementById("match-stage-hud"),
    feedback: document.getElementById("feedback-msg"),
    narrator: document.getElementById("narrator-box"),
    powerupBox: document.getElementById("powerup-container"),
    btnFire: document.getElementById("btn-fire"),
    btnChip: document.getElementById("btn-chip"),
    p1Dots: document.getElementById("p1-dots"),
    cpuDots: document.getElementById("cpu-dots"),
    vignette: document.getElementById("pressure-vignette"),
    placarBox: document.getElementById("placar-main"),
    windIndicator: document.getElementById("wind-indicator"),
    speedRadar: document.getElementById("speed-radar"),
    speedVal: document.getElementById("speed-val"),
    speedFill: document.getElementById("speed-fill")
};

const hubElsDom = {
    stageName: document.getElementById("stage-name"),
    p1: document.getElementById("hub-p1"),
    cpu: document.getElementById("hub-cpu"),
    p1Img: document.getElementById("hub-img-p1"),
    cpuImg: document.getElementById("hub-img-cpu"),
    standingsBody: document.getElementById("standings-body"),
    standingsBox: document.getElementById("standings-box"),
    bracketBox: document.getElementById("bracket-box"),
    bracketList: document.getElementById("bracket-list"),
    weatherForecast: document.getElementById("weather-forecast"),
    groupLetter: document.getElementById("group-letter")
};

function getSafeLogo(url) {
    if (!url) return '';
    const cleanUrl = url.replace(/^https?:\/\//, '');
    return `https://images.weserv.nl/?url=${cleanUrl}&w=120&h=120&output=png&il`;
}

/* ================= TIMES (48 EQUIPES) ================= */
const TEAMS = [
    // RIO (4)
    { id: 'fla', name: 'FLA', color1: '#C8102E', color2: '#000000', keeperColor1: '#FFFF00', keeperColor2: '#000000', crowdColors: ['#C8102E', '#000000'], logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Flamengo-RJ_%28BRA%29.png' },
    { id: 'vas', name: 'VAS', color1: '#000000', color2: '#FFFFFF', keeperColor1: '#888888', keeperColor2: '#000000', crowdColors: ['#000000', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/pt/8/8b/EscudoDoVascoDaGama.svg' },
    { id: 'flu', name: 'FLU', color1: '#9F022D', color2: '#00913C', keeperColor1: '#555555', keeperColor2: '#FFFFFF', crowdColors: ['#9F022D', '#00913C', '#FFFFFF'], logo: 'upload.wikimedia.org/wikipedia/commons/a/ad/Fluminense_FC_escudo.png' },
    { id: 'bot', name: 'BOT', color1: '#000000', color2: '#FFFFFF', keeperColor1: '#800080', keeperColor2: '#FFFFFF', crowdColors: ['#000000', '#FFFFFF'], logo: 'upload.wikimedia.org/wikipedia/commons/5/52/Botafogo_de_Futebol_e_Regatas_logo.svg' },
    // SP (7)
    { id: 'spfc', name: 'SAO', color1: '#FFFFFF', color2: '#000000', keeperColor1: '#111111', keeperColor2: '#FF0000', crowdColors: ['#FF0000', '#FFFFFF', '#000000'], logo: 'upload.wikimedia.org/wikipedia/commons/6/6f/Brasao_do_Sao_Paulo_Futebol_Clube.svg' },
    { id: 'pal', name: 'PAL', color1: '#006437', color2: '#FFFFFF', keeperColor1: '#0000FF', keeperColor2: '#FFFFFF', crowdColors: ['#006437', '#FFFFFF'], logo: 'upload.wikimedia.org/wikipedia/commons/1/10/Palmeiras_logo.svg' },
    { id: 'cor', name: 'COR', color1: '#FFFFFF', color2: '#000000', keeperColor1: '#FF8C00', keeperColor2: '#000000', crowdColors: ['#FFFFFF', '#000000'], logo: 'https://upload.wikimedia.org/wikipedia/pt/b/b4/Corinthians_simbolo.png' },
    { id: 'san', name: 'SAN', color1: '#FFFFFF', color2: '#000000', keeperColor1: '#00FF7F', keeperColor2: '#000000', crowdColors: ['#FFFFFF', '#000000'], logo: 'upload.wikimedia.org/wikipedia/commons/3/35/Santos_logo.svg' },
    { id: 'bGT', name: 'RBB', color1: '#FFFFFF', color2: '#D30F15', keeperColor1: '#FFFF00', keeperColor2: '#000000', crowdColors: ['#D30F15', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/pt/9/9e/RedBullBragantino.png' },
    { id: 'pon', name: 'PON', color1: '#000000', color2: '#FFFFFF', keeperColor1: '#CCCCCC', keeperColor2: '#000000', crowdColors: ['#000000', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Associa%C3%A7%C3%A3o_Atl%C3%A9tica_Ponte_Preta_logo.png' },
    { id: 'gua', name: 'GUA', color1: '#038E46', color2: '#FFFFFF', keeperColor1: '#0000FF', keeperColor2: '#FFFFFF', crowdColors: ['#038E46', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ec/Guarani_FC_-_SP.svg' },
    // SUL (5)
    { id: 'gre', name: 'GRE', color1: '#0D80BF', color2: '#000000', keeperColor1: '#000000', keeperColor2: '#FFFFFF', crowdColors: ['#0D80BF', '#000000', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Gremio_logo.svg' },
    { id: 'int', name: 'INT', color1: '#E30613', color2: '#FFFFFF', keeperColor1: '#FFFF00', keeperColor2: '#000000', crowdColors: ['#E30613', '#FFFFFF'], logo: 'upload.wikimedia.org/wikipedia/commons/f/f1/Escudo_do_Sport_Club_Internacional.svg' },
    { id: 'juv', name: 'JUV', color1: '#3cff00b6', color2: '#FFFFFF', keeperColor1: '#FF00FF', keeperColor2: '#000000', crowdColors: ['#3cff00b6', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/EC_Juventude.svg' },
    { id: 'cha', name: 'CHA', color1: '#009B3A', color2: '#FFFFFF', keeperColor1: '#000000', keeperColor2: '#009B3A', crowdColors: ['#009B3A', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/pt/b/bc/Escudo_de_2018_da_Chapecoense.png' },
    { id: 'cri', name: 'CRI', color1: '#FDD116', color2: '#000000', keeperColor1: '#FFFFFF', keeperColor2: '#000000', crowdColors: ['#FDD116', '#000000', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Crici%C3%BAma_Esporte_Clube_logo_%28until_2025%29.svg' },
    // MG (3)
    { id: 'cam', name: 'CAM', color1: '#000000', color2: '#FFFFFF', keeperColor1: '#FFA500', keeperColor2: '#000000', crowdColors: ['#000000', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Clube_Atl%C3%A9tico_Mineiro_logo.svg' },
    { id: 'cru', name: 'CRU', color1: '#0054A6', color2: '#FFFFFF', keeperColor1: '#FFFF00', keeperColor2: '#0054A6', crowdColors: ['#0054A6', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Cruzeiro_Esporte_Clube_%28logo%29.svg' },
    { id: 'ame', name: 'AME', color1: '#000000', color2: '#038E46', keeperColor1: '#FF0000', keeperColor2: '#FFFFFF', crowdColors: ['#038E46', '#000000'], logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Escudo_do_America_Futebol_Clube.svg' },
    // NE (7)
    { id: 'bah', name: 'BAH', color1: '#FFFFFF', color2: '#003194', keeperColor1: '#FF0000', keeperColor2: '#000000', crowdColors: ['#003194', '#FF0000', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/pt/9/90/ECBahia.png' },
    { id: 'vit', name: 'VIT', color1: '#E61812', color2: '#000000', keeperColor1: '#00FF00', keeperColor2: '#000000', crowdColors: ['#E61812', '#000000'], logo: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Esporte_Clube_Vit%C3%B3ria_%282024%29.svg' },
    { id: 'for', name: 'FOR', color1: '#115EAC', color2: '#E61812', keeperColor1: '#FFFF00', keeperColor2: '#000000', crowdColors: ['#115EAC', '#E61812', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/commons/4/40/FortalezaEsporteClube.svg' },
    { id: 'cea', name: 'CEA', color1: '#000000', color2: '#FFFFFF', keeperColor1: '#800000', keeperColor2: '#FFFFFF', crowdColors: ['#000000', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/commons/3/38/Cear%C3%A1_Sporting_Club_logo.svg' },
    { id: 'spo', name: 'SPO', color1: '#000000', color2: '#E30613', keeperColor1: '#FFFF00', keeperColor2: '#000000', crowdColors: ['#000000', '#E30613'], logo: 'https://upload.wikimedia.org/wikipedia/pt/1/17/Sport_Club_do_Recife.png' },
    { id: 'nau', name: 'NAU', color1: '#E30613', color2: '#FFFFFF', keeperColor1: '#0000FF', keeperColor2: '#FFFFFF', crowdColors: ['#E30613', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/pt/d/de/Simbolo-escudo-nautico.png' },
    { id: 'sant', name: 'STC', color1: '#000000', color2: '#E30613', keeperColor1: '#FFFF00', keeperColor2: '#000000', crowdColors: ['#E30613', '#000000'], logo: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/Santa_Cruz_Futebol_Clube_%281915-99%29.png' },
    // CO/NO/OUTROS
    { id: 'cap', name: 'CAP', color1: '#E61812', color2: '#000000', keeperColor1: '#333333', keeperColor2: '#FFFFFF', crowdColors: ['#E61812', '#000000'], logo: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Athletico_Paranaense_%28Logo_2019%29.svg' },
    { id: 'cfc', name: 'CFC', color1: '#FFFFFF', color2: '#005334', keeperColor1: '#FFFF00', keeperColor2: '#005334', crowdColors: ['#005334', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Coritiba_Foot_Ball_Club_logo.svg' },
    { id: 'goi', name: 'GOI', color1: '#005F36', color2: '#FFFFFF', keeperColor1: '#000000', keeperColor2: '#FFFFFF', crowdColors: ['#005F36', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Goi%C3%A1s_Esporte_Clube_logo.svg' },
    { id: 'vil', name: 'VIL', color1: '#E30613', color2: '#FFFFFF', keeperColor1: '#0000FF', keeperColor2: '#FFFFFF', crowdColors: ['#E30613', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Vila_Nova_Logo_Oficial.svg' },
    { id: 'cui', name: 'CUI', color1: '#018036', color2: '#FDE900', keeperColor1: '#000000', keeperColor2: '#FDE900', crowdColors: ['#018036', '#FDE900'], logo: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Cuiab%C3%A1_EC.svg' },
    { id: 'ava', name: 'AVA', color1: '#00679A', color2: '#FFFFFF', keeperColor1: '#FFFF00', keeperColor2: '#00679A', crowdColors: ['#00679A', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8c/Ava%C3%AD_Futebol_Clube_logo.svg' },
    { id: 'fig', name: 'FIG', color1: '#000000', color2: '#FFFFFF', keeperColor1: '#FF7F50', keeperColor2: '#000000', crowdColors: ['#000000', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/pt/7/7b/Figueirense.png' },
    { id: 'pay', name: 'PAY', color1: '#0091CF', color2: '#FFFFFF', keeperColor1: '#000000', keeperColor2: '#0091CF', crowdColors: ['#0091CF', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/pt/6/6c/Paysandu_SC.png' },
    { id: 'rem', name: 'REM', color1: '#000033', color2: '#FFFFFF', keeperColor1: '#888888', keeperColor2: '#000033', crowdColors: ['#000033', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Clube_do_Remo.svg' },
    { id: 'sam', name: 'SAM', color1: '#E30613', color2: '#FDD116', keeperColor1: '#000000', keeperColor2: '#FFFFFF', crowdColors: ['#E30613', '#FDD116'], logo: 'https://upload.wikimedia.org/wikipedia/commons/1/14/NOVO_ESCUDO_SAMPAIO_CORR%C3%8AA.png' },
    { id: 'abc', name: 'ABC', color1: '#000000', color2: '#FFFFFF', keeperColor1: '#FDD116', keeperColor2: '#000000', crowdColors: ['#000000', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/commons/d/df/ABC_FC_-_RN.svg' },
    { id: 'ame_rn', name: 'AMR', color1: '#E30613', color2: '#FFFFFF', keeperColor1: '#000000', keeperColor2: '#FFFFFF', crowdColors: ['#E30613', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/commons/6/61/Am%C3%A9rica_Futebol_Clube_%28Natal%29_logo_%282023%29.png' },
    { id: 'crb', name: 'CRB', color1: '#E30613', color2: '#FFFFFF', keeperColor1: '#0000FF', keeperColor2: '#FFFFFF', crowdColors: ['#E30613', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/commons/7/73/CRB_logo.svg' },
    { id: 'csa', name: 'CSA', color1: '#003399', color2: '#FFFFFF', keeperColor1: '#FF0000', keeperColor2: '#FFFFFF', crowdColors: ['#003399', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/commons/6/64/CSA_logo.png' },
    { id: 'mir', name: 'MIR', color1: '#FDD116', color2: '#00913C', keeperColor1: '#000000', keeperColor2: '#FFFFFF', crowdColors: ['#FDD116', '#00913C'], logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5b/Mirassol_FC_logo.png' },
    { id: 'nov', name: 'NOV', color1: '#000000', color2: '#FDD116', keeperColor1: '#FFFFFF', keeperColor2: '#000000', crowdColors: ['#000000', '#FDD116'], logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Gr%C3%AAmio_Novorizontino.svg' },
    { id: 'itu', name: 'ITU', color1: '#E30613', color2: '#000000', keeperColor1: '#FFFFFF', keeperColor2: '#000000', crowdColors: ['#E30613', '#000000'], logo: 'https://upload.wikimedia.org/wikipedia/pt/2/28/ItuanoFC.png' },
    { id: 'bot_sp', name: 'BSP', color1: '#E30613', color2: '#FFFFFF', keeperColor1: '#000000', keeperColor2: '#FFFFFF', crowdColors: ['#E30613', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/Botafogo_Futebol_Clube_%28Ribeir%C3%A3o_Preto%29_logo_%282021%29.png' },
    { id: 'ope', name: 'OPE', color1: '#000000', color2: '#FFFFFF', keeperColor1: '#FDD116', keeperColor2: '#000000', crowdColors: ['#000000', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/pt/1/16/Oper%C3%A1rioFerrovi%C3%A1rioEC%282018%29.png' },
    { id: 'bru', name: 'BRU', color1: '#FFFFFF', color2: '#E30613', keeperColor1: '#000000', keeperColor2: '#FFFFFF', crowdColors: ['#E30613', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/Brusque_Futebol_Clube_logo_%282023%29.png' },
    { id: 'vil_mg', name: 'VMG', color1: '#E30613', color2: '#FFFFFF', keeperColor1: '#000000', keeperColor2: '#FFFFFF', crowdColors: ['#E30613', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9c/Villa_Nova_AC_%28Estr%29_-_MG.svg' },
    { id: 'tomb', name: 'TOM', color1: '#E30613', color2: '#FFFFFF', keeperColor1: '#000000', keeperColor2: '#FFFFFF', crowdColors: ['#E30613', '#FFFFFF'], logo: 'https://upload.wikimedia.org/wikipedia/pt/8/85/TombenseFC.png' }
];

/* ================= LÓGICA DO JOGO ================= */
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

let powerUps = { fire: 1, chip: 1 };
let activePowerUp = null;

let weather = 'sunny';
let lightningTimer = 0;
let isLightning = false;
let slowMotionFactor = 1.0;
let pressureMode = false;
let cameraZoom = 1.0;
let cameraY = 0;
let windX = 0;

let currentMatch = { p1: null, cpu: null, scoreP1: 0, scoreCpu: 0, round: 1, finished: false, roundWinner: null };
let matchHistory = { p1: [], cpu: [] };

const CONFIG = { goalLeft: 60, goalRight: 340, goalTop: 190, penaltyY: 550 };
let gameState = "MENU";
let ball = { x: 200, y: CONFIG.penaltyY, z: 0, vx: 0, vy: 0, vz: 0, curve: 0, scale: 1, moving: false, rotation: 0 };
let ballTrail = [];
let particles = [];
let keeper = { x: 200, y: CONFIG.goalTop, targetX: 200, animState: "idle" };
let juiz = { ready: false, timer: 0, whistled: false };
let feedbackTimer = 0;
let shakeAmount = 0;
let aimX = 200;
let aimWobble = 0;
let inputActive = false;
let globalTime = 0;
let playerAnim = { y: 0, jump: 0 };

function getLockedPhysics() {
    let speedY, speedX, margin;
    if (activePowerUp === 'fire') { speedY = -14.0; speedX = 0.040; margin = 30; }
    else if (activePowerUp === 'chip') { speedY = -3.5; speedX = 0.015; margin = 120; }
    else {
        if (Tournament.stage === 'groups') { speedY = -6.5; speedX = 0.025; margin = 85; }
        else if (Tournament.stage === 'sf' || Tournament.stage === 'final') { speedY = -9.5; speedX = 0.033; margin = 30; }
        else { speedY = -8.0; speedX = 0.029; margin = 55; }
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

function showRanking() {
    switchScreen('ranking');
    const list = document.getElementById('ranking-list');
    list.innerHTML = '';
    const history = JSON.parse(localStorage.getItem('penalty_champions') || '[]');

    if (history.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <span style="font-size:30px; margin-bottom:10px; opacity:0.5;">🏆</span>
                <p>Nenhum título conquistado ainda.</p>
            </div>`;
        return;
    }
    history.reverse().forEach(entry => {
        const div = document.createElement('div');
        div.className = 'ranking-item';
        div.innerHTML = `<span>🏆 ${entry.team}</span><span class="rank-date">${entry.date}</span>`;
        list.appendChild(div);
    });
}

function saveChampion(teamName) {
    let history = JSON.parse(localStorage.getItem('penalty_champions') || '[]');
    history.push({ team: teamName, date: new Date().toLocaleDateString('pt-BR') });
    if (history.length > 50) history.shift();
    localStorage.setItem('penalty_champions', JSON.stringify(history));
}

function renderTeamGrid() {
    const grid = document.getElementById('teams-grid');
    grid.innerHTML = '';
    TEAMS.forEach(t => {
        const div = document.createElement('div');
        div.className = 'team-card';
        const safeLogo = getSafeLogo(t.logo);
        div.innerHTML = `
            <div class="team-flag-wrapper" style="width:40px; height:40px; margin-bottom:8px; display:flex; justify-content:center; align-items:center;">
                <img src="${safeLogo}" class="team-flag-img" style="max-width:100%; max-height:100%;" 
                onerror="this.style.display='none'; this.parentNode.style.backgroundColor='${t.color1}'; this.parentNode.style.borderRadius='50%'; this.parentNode.style.border='2px solid ${t.color2}'; this.parentNode.innerHTML='<span style=\\'color:#fff; font-weight:bold; font-size:10px; text-shadow:1px 1px 0 #000\\'>${t.name}</span>'">
            </div>
            <div class="team-name-card">${t.name}</div>
        `;
        div.onclick = () => {
            Tournament.playerTeam = t;
            document.getElementById('selected-team-display').textContent = t.name;
            const bigSafeLogo = getSafeLogo(t.logo);
            document.getElementById('selected-team-logo-big').innerHTML = `<img src="${bigSafeLogo}" style="width:80px; height:80px; object-fit:contain;" onerror="this.style.display='none'">`;
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
    for (let i = 0; i < 12; i++) {
        Tournament.groups.push(shuffled.slice(i * 4, i * 4 + 4));
    }

    Tournament.groups.forEach((g, i) => {
        if (g.find(t => t.id === Tournament.playerTeam.id)) Tournament.groupIndex = i;
    });

    powerUps = { fire: 1, chip: 1 };
    updateTournamentHub();
}

function updateTournamentHub() {
    switchScreen('hub');
    weather = Math.random() > 0.7 ? 'rain' : 'sunny';
    const weatherIcon = weather === 'rain' ? '🌧️ Chuva Forte' : '☀️ Sol';
    hubElsDom.weatherForecast.textContent = `Previsão: ${weatherIcon}`;

    if (weather === 'rain') {
        windX = (Math.random() - 0.5) * 0.15;
        hudEls.windIndicator.style.display = 'block';
    } else {
        windX = 0;
        hudEls.windIndicator.style.display = 'none';
    }

    const myGroup = Tournament.groups[Tournament.groupIndex];
    const groupLetters = "ABCDEFGHIJKL";
    hubElsDom.groupLetter.textContent = groupLetters[Tournament.groupIndex];

    if (Tournament.stage === 'groups') {
        hubElsDom.stageName.textContent = `FASE DE GRUPOS - JOGO ${Tournament.groupMatchIndex + 1}/3`;
        hubElsDom.standingsBox.style.display = "block";
        hubElsDom.bracketBox.style.display = "none";
        renderGroupTable(myGroup);
        const opponents = myGroup.filter(t => t.id !== Tournament.playerTeam.id);
        const nextOpponent = opponents[Tournament.groupMatchIndex];
        setupMatch(Tournament.playerTeam, nextOpponent);
    } else {
        let stageTitle = "MATA-MATA";
        if (Tournament.stage === 'r32') stageTitle = "16-AVOS DE FINAL";
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
        let rowClass = "row-eliminated";
        if (index < 2) rowClass = "row-qualified";
        if (index === 2) rowClass = "row-third";

        const div = document.createElement("div");
        div.className = `standings-row ${rowClass}`;

        div.innerHTML = `
            <span style="width:20px; text-align:center; font-weight:bold;">${index + 1}</span>
            <img class="table-logo" src="${getSafeLogo(team.logo)}" onerror="this.style.display='none'">
            <span style="flex-grow:1; font-weight:bold;">${team.name}</span>
            <span style="width:30px; text-align:center;">${s.points}</span>
            <span style="width:30px; text-align:center;">${s.wins}</span>
            <span style="width:30px; text-align:center;">${s.losses}</span>
        `;
        hubElsDom.standingsBody.appendChild(div);
    });
}

// --- CONFRONTOS COM ESCUDOS (BRACKET) ---
function renderBracket() {
    hubElsDom.bracketList.innerHTML = "";
    Tournament.bracketMatches.forEach(match => {
        const div = document.createElement("div");
        const isPlayerMatch = (match.t1.id === Tournament.playerTeam.id || match.t2.id === Tournament.playerTeam.id);
        div.className = isPlayerMatch ? "bracket-match player-match" : "bracket-match";

        div.innerHTML = `
            <div class="bracket-team">
                <img class="bracket-logo" src="${getSafeLogo(match.t1.logo)}">
                <span style="color:${match.t1.color1}">${match.t1.name}</span>
            </div>
            <span class="bracket-vs">VS</span>
            <div class="bracket-team bracket-team-right">
                <span style="color:${match.t2.color1}">${match.t2.name}</span>
                <img class="bracket-logo" src="${getSafeLogo(match.t2.logo)}">
            </div>
        `;

        hubElsDom.bracketList.appendChild(div);
        if (isPlayerMatch) setupMatch(match.t1, match.t2);
    });
}

function setupMatch(p1, cpu) {
    if (p1.id !== Tournament.playerTeam.id) { currentMatch.p1 = cpu; currentMatch.cpu = p1; }
    else { currentMatch.p1 = p1; currentMatch.cpu = cpu; }
    hubElsDom.p1.textContent = currentMatch.p1.name;
    hubElsDom.p1Img.src = getSafeLogo(currentMatch.p1.logo);
    hubElsDom.cpu.textContent = currentMatch.cpu.name;
    hubElsDom.cpuImg.src = getSafeLogo(currentMatch.cpu.logo);
}

function startMatchFromHub() {
    stopGameLoop();
    currentMatch.scoreP1 = 0; currentMatch.scoreCpu = 0; currentMatch.round = 1; currentMatch.finished = false;
    currentMatch.roundWinner = null;
    matchHistory = { p1: [], cpu: [] };

    pressureMode = (Tournament.stage === 'sf' || Tournament.stage === 'final');

    switchScreen('hud'); c.style.display = 'block';

    hudEls.p1Name.textContent = currentMatch.p1.name;
    hudEls.p1Logo.src = getSafeLogo(currentMatch.p1.logo);
    hudEls.p1Logo.onerror = function () { this.style.display = 'none'; };

    hudEls.cpuName.textContent = currentMatch.cpu.name;
    hudEls.cpuLogo.src = getSafeLogo(currentMatch.cpu.logo);
    hudEls.cpuLogo.onerror = function () { this.style.display = 'none'; };

    hudEls.stage.textContent = Tournament.stage === 'groups' ? "GRUPOS" : "MATA-MATA";

    setNarrator("As equipes se posicionam. Vai começar!");
    resetPenaltyRound();
    loop();
}

function setNarrator(text) {
    hudEls.narrator.textContent = text;
    hudEls.narrator.style.opacity = 1;
    hudEls.narrator.style.animation = 'none';
    hudEls.narrator.offsetHeight;
    hudEls.narrator.style.animation = 'fadeIn 0.5s';
}

function updatePowerUpUI() {
    if (Tournament.playerRole === 'keeper') {
        hudEls.powerupBox.style.display = 'none';
        return;
    }
    hudEls.powerupBox.style.display = 'flex';

    hudEls.btnFire.className = 'pwr-btn';
    if (activePowerUp === 'fire') hudEls.btnFire.classList.add('pwr-active-fire');
    if (powerUps.fire <= 0) hudEls.btnFire.classList.add('pwr-used');

    hudEls.btnChip.className = 'pwr-btn';
    if (activePowerUp === 'chip') hudEls.btnChip.classList.add('pwr-active-chip');
    if (powerUps.chip <= 0) hudEls.btnChip.classList.add('pwr-used');
}

function activatePowerUp(type) {
    if (gameState !== "PLAY" && gameState !== "WAIT_JUIZ") return;
    if (activePowerUp === type) {
        activePowerUp = null;
    } else {
        if (powerUps[type] > 0) {
            activePowerUp = type;
        }
    }
    updatePowerUpUI();
}

function resetPenaltyRound() {
    ball = { x: 200, y: CONFIG.penaltyY, z: 0, vx: 0, vy: 0, vz: 0, curve: 0, scale: 1, moving: false, rotation: 0 };
    ballTrail = [];
    activePowerUp = null;
    updatePowerUpUI();

    keeper.x = 200; keeper.animState = "idle";
    gameState = "WAIT_JUIZ"; inputActive = false; juiz.ready = false; juiz.whistled = false;
    juiz.timer = 70;
    slowMotionFactor = 1.0;
    cameraZoom = 1.0; cameraY = 0;
    aimWobble = 0;
    playerAnim = { y: 0, jump: 0 };

    hudEls.speedRadar.classList.remove('radar-show'); // Reset radar
    hudEls.speedFill.style.width = '0%'; // Reset bar

    if (currentMatch.round > 5 && currentMatch.scoreP1 === currentMatch.scoreCpu) {
        hudEls.placarBox.classList.add('sudden-death-hud');
        setNarrator("MORTE SÚBITA! Errou, perdeu.");
    } else {
        hudEls.placarBox.classList.remove('sudden-death-hud');
    }

    if (pressureMode || currentMatch.round >= 5) {
        hudEls.vignette.style.opacity = 0.6;
        hudEls.vignette.classList.add('pulse-anim');
        if (!juiz.whistled) playSound('heartbeat');
    } else {
        hudEls.vignette.style.opacity = 0;
        hudEls.vignette.classList.remove('pulse-anim');
    }

    showFeedback("PREPARA...", "#fff");
    updateHud();
}

function renderDots() {
    let htmlP1 = '';
    const totalRounds = Math.max(5, currentMatch.round);
    for (let i = 0; i < totalRounds; i++) {
        let status = 'pending';
        if (i < matchHistory.p1.length) status = matchHistory.p1[i];
        htmlP1 += `<div class="dot ${status}"></div>`;
    }
    hudEls.p1Dots.innerHTML = htmlP1;

    let htmlCpu = '';
    for (let i = 0; i < totalRounds; i++) {
        let status = 'pending';
        if (i < matchHistory.cpu.length) status = matchHistory.cpu[i];
        htmlCpu += `<div class="dot ${status}"></div>`;
    }
    hudEls.cpuDots.innerHTML = htmlCpu;
}

function updateHud() {
    hudEls.round.textContent = currentMatch.round;
    hudEls.p1Score.textContent = currentMatch.scoreP1;
    hudEls.cpuScore.textContent = currentMatch.scoreCpu;
    renderDots();
}

function showFeedback(text, color) {
    hudEls.feedback.textContent = text;
    hudEls.feedback.style.color = color;
    hudEls.feedback.style.opacity = 1;
    hudEls.feedback.style.transform = "translate(-50%, -50%) scale(1.2)";
    clearTimeout(feedbackTimer);
    feedbackTimer = setTimeout(() => {
        hudEls.feedback.style.opacity = 0;
        hudEls.feedback.style.transform = "translate(-50%, -50%) scale(0.5)";
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

function spawnGrass(x, y) {
    for (let i = 0; i < 10; i++) {
        particles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 4,
            vy: (Math.random() - 1) * 4,
            life: 40,
            color: Math.random() > 0.5 ? "#388e3c" : "#2e7d32",
            type: 'grass'
        });
    }
}

function spawnSparks(x, y) {
    for (let i = 0; i < 15; i++) {
        particles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            life: 30,
            color: "#fff",
            type: 'spark'
        });
    }
}

function shoot() {
    const finalAim = aimX + aimWobble;
    const dx = finalAim - ball.x;

    ball.moving = true;
    const physics = getLockedPhysics();

    if (activePowerUp && powerUps[activePowerUp] > 0) {
        powerUps[activePowerUp]--;
        if (activePowerUp === 'fire') playSound('fire');
        if (activePowerUp === 'chip') playSound('kick');
    } else {
        playSound('kick');
    }
    updatePowerUpUI();

    ball.vx = dx * physics.x;
    ball.vy = physics.y;
    ball.vz = 0.16;
    ball.curve = dx * 0.00025;

    spawnGrass(ball.x, ball.y + 10);

    if (Tournament.playerRole === 'player') {
        const errorMargin = 180;
        keeper.targetX = aimX + (Math.random() - 0.5) * errorMargin;
        let reactionTime = 300 + Math.random() * 150;
        if (activePowerUp === 'fire') reactionTime += 100;
        if (activePowerUp === 'chip') reactionTime = 100;

        setTimeout(() => {
            keeper.animState = keeper.targetX < 200 ? "dive_left" : "dive_right";
        }, reactionTime);
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
    spawnGrass(ball.x, ball.y + 10);

    setTimeout(() => {
        if (ball.vx < -0.01) keeper.animState = "dive_left";
        else if (ball.vx > 0.01) keeper.animState = "dive_right";
    }, 200);
}

function update() {
    globalTime++;
    if (gameState === "PLAY" && !ball.moving) {
        aimWobble = Math.sin(globalTime * 0.1) * 10;
    }

    if (gameState === "WAIT_JUIZ") {
        juiz.timer--;
        if (juiz.timer < 50 && juiz.timer > 0) {
            cameraZoom = 1.0 + Math.sin(globalTime * 0.05) * 0.05;
            cameraY = 50;
        } else {
            cameraZoom += (1.0 - cameraZoom) * 0.1;
            cameraY += (0 - cameraY) * 0.1;
        }

        if (Math.random() < 0.02) {
            const type = Math.random() > 0.5 ? 'support' : 'rival';
            spawnSpeechBubble(type);
        }

        if (juiz.timer <= 0 && !juiz.whistled) {
            juiz.whistled = true;
            playSound('whistle');
            showFeedback("AGUARDE...", "#fff");
            setNarrator("O batedor ajeita com carinho...");
            setTimeout(() => {
                juiz.ready = true;
                gameState = "PLAY";
                inputActive = true;
                showFeedback("VAI!", "#00e676");
                if (Tournament.playerRole === 'keeper') cpuShoot();
            }, 1800);
        }
    } else {
        cameraZoom += (1.0 - cameraZoom) * 0.1;
        cameraY += (0 - cameraY) * 0.1;
    }

    if (gameState === "RESULT" && currentMatch.roundWinner === 'p1') {
        playerAnim.jump = Math.abs(Math.sin(globalTime * 0.2)) * 10;
    } else {
        playerAnim.jump = 0;
    }

    if (Tournament.playerRole === 'player' && ball.moving) {
        let diveSpeed = 0.08;
        if (activePowerUp === 'chip') diveSpeed = 0.15;
        keeper.x += ((keeper.targetX - keeper.x) * diveSpeed) * slowMotionFactor;
    }

    if (ball.moving) {
        if (globalTime % 3 === 0) {
            let trailColor = activePowerUp === 'fire' ? '#ff5722' : 'white';
            ballTrail.push({ x: ball.x, y: ball.y, scale: ball.scale, opacity: 0.6, color: trailColor });
        }
        if (ballTrail.length > 15) ballTrail.shift();

        if (ball.y < CONFIG.goalTop + 80 && ball.y > CONFIG.goalTop - 20) {
            slowMotionFactor = 0.3;
        } else {
            slowMotionFactor = 1.0;
        }

        ball.x += ball.vx * slowMotionFactor;
        ball.x += windX * slowMotionFactor;

        ball.y += ball.vy * slowMotionFactor;
        ball.vx += ball.curve * slowMotionFactor;
        ball.rotation += 8 * slowMotionFactor;

        if (activePowerUp === 'chip') {
            ball.scale = 0.5 + (0.5 * Math.sin((ball.y - CONFIG.goalTop) / 400 * Math.PI));
            if (ball.y < CONFIG.goalTop) ball.scale = 0.5;
        } else {
            ball.scale = 0.5 + (0.5 * ((ball.y - CONFIG.goalTop) / (CONFIG.penaltyY - CONFIG.goalTop)));
        }

        if (ball.y <= CONFIG.goalTop + 10) checkResult();
    }

    if (shakeAmount > 0) shakeAmount--;

    if (gameState === "PLAY" && Math.random() < 0.03) {
        particles.push({
            x: Math.random() * c.width,
            y: Math.random() * 100 + 30,
            vx: 0, vy: 0,
            life: 5,
            color: "rgba(255,255,255,0.8)",
            type: 'flash'
        });
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.type === 'grass') p.vy += 0.2;
        if (p.type === 'confetti') {
            p.vy += 0.05;
            p.x += Math.sin(globalTime * 0.1 + p.offset) * 1;
        }
        if (p.type === 'rain') {
            p.y += 15;
            p.x -= 2;
            if (p.y > c.height) { p.y = -10; p.x = Math.random() * c.width + 100; }
        }
        if (p.type === 'spark') {
            p.vy += 0.1;
        }
        if (p.life <= 0 && p.type !== 'rain') particles.splice(i, 1);
    }

    if (weather === 'rain') {
        if (particles.filter(p => p.type === 'rain').length < 100) {
            particles.push({
                x: Math.random() * c.width + 50,
                y: Math.random() * c.height,
                vx: -2, vy: 15,
                life: 999,
                color: "rgba(174, 194, 224, 0.6)",
                type: 'rain'
            });
        }
        if (Math.random() < 0.005) {
            isLightning = true;
            lightningTimer = 5;
            playSound('thunder');
        }
        if (lightningTimer > 0) {
            lightningTimer--;
            if (lightningTimer <= 0) isLightning = false;
        }
    } else {
        for (let i = particles.length - 1; i >= 0; i--) {
            if (particles[i].type === 'rain') particles.splice(i, 1);
        }
    }
}

function checkResult() {
    ball.moving = false;
    slowMotionFactor = 1.0;

    let result = "";
    const inGoal = ball.x > CONFIG.goalLeft && ball.x < CONFIG.goalRight;
    const save = Math.abs(ball.x - keeper.x) < 30;
    const hitPost = !inGoal && (ball.x > CONFIG.goalLeft - 15 && ball.x < CONFIG.goalRight + 15);

    let speed = Math.floor(Math.random() * (120 - 85) + 85);
    if (activePowerUp === 'fire') speed += 30;
    if (activePowerUp === 'chip') speed = Math.floor(Math.random() * (60 - 40) + 40);

    hudEls.speedVal.textContent = speed;
    let percent = Math.min(100, (speed / 140) * 100);
    hudEls.speedFill.style.width = `${percent}%`;

    hudEls.speedRadar.classList.add('radar-show');
    setTimeout(() => hudEls.speedRadar.classList.remove('radar-show'), 2000);

    let isPlayerShooter = (Tournament.playerRole === 'player');
    let soundToPlay = '';

    if (hitPost) {
        result = "TRAVE";
        showFeedback("NA TRAVE!", "#fff");
        playSound('post');
        spawnSparks(ball.x, CONFIG.goalTop);
        setNarrator("MEU DEUS! A bola explode no travessão!");
        soundToPlay = isPlayerShooter ? 'crowd_boo' : 'crowd_cheer';
    }
    else if (!inGoal) {
        result = "FORA";
        showFeedback("PRA FORA!", "#ff5252");
        setNarrator("Isolou! Mandou lá na arquibancada.");
        soundToPlay = isPlayerShooter ? 'crowd_boo' : 'crowd_cheer';
    }
    else if (save) {
        result = "DEFESA";
        showFeedback("DEFENDEU!", "#ff9800");
        playSound('save');
        setNarrator("Que defesa espetacular do goleiro!");
        soundToPlay = isPlayerShooter ? 'crowd_boo' : 'crowd_cheer';
    }
    else {
        result = "GOL";
        showFeedback("GOOOOL!", "#ffeb3b");
        shakeAmount = 20;
        playSound('goal');
        setNarrator("É GOOOOL! Indefensável!");
        soundToPlay = isPlayerShooter ? 'crowd_cheer' : 'crowd_boo';
    }

    setTimeout(() => playSound(soundToPlay), 100);

    let particleText = "";
    let particleSide = "";

    if (result === "GOL") {
        particleText = "GOL!";
        particleSide = (Tournament.playerRole === 'player') ? 'left' : 'right';
    }
    else if (result === "DEFESA") {
        if (Tournament.playerRole === 'keeper') {
            particleText = "DEFENDEU!";
            particleSide = 'left';
        }
    }

    if (particleText !== "") {
        const minX = particleSide === 'left' ? 20 : 220;
        const maxX = particleSide === 'left' ? 180 : 380;

        for (let i = 0; i < 15; i++) {
            particles.push({
                x: Math.random() * (maxX - minX) + minX,
                y: Math.random() * 100 + 50,
                vx: 0, vy: -2,
                life: 60,
                text: particleText,
                color: particleText === "GOL!" ? "#ffeb3b" : "#ff9800",
                type: 'text'
            });
        }
    }

    let isGoal = (result === "GOL");
    let isPlayerAction = (Tournament.playerRole === 'player');

    if (isPlayerAction) {
        if (isGoal) spawnSpeechBubble('good');
        else spawnSpeechBubble('bad');
    } else {
        if (isGoal) spawnSpeechBubble('bad');
        else spawnSpeechBubble('good');
    }

    // --- CORREÇÃO DE PONTUAÇÃO ---
    if (Tournament.playerRole === 'player') {
        if (result === "GOL") {
            currentMatch.scoreP1++;
            matchHistory.p1.push('goal');
            currentMatch.roundWinner = 'p1';
        } else {
            currentMatch.scoreCpu++;
            matchHistory.p1.push('miss');
            currentMatch.roundWinner = 'cpu';
        }
    }
    else { // MODO KEEPER (PAREDÃO)
        if (result === "GOL") {
            currentMatch.scoreCpu++; // CPU fez gol -> Ponto pra CPU
            matchHistory.cpu.push('goal');
            currentMatch.roundWinner = 'cpu';
        } else {
            // AQUI ESTAVA O ERRO: Se você defende, o ponto é SEU!
            currentMatch.scoreP1++;
            matchHistory.cpu.push('miss');
            currentMatch.roundWinner = 'p1';
        }
    }

    // Histórico de Bolinhas
    if (Tournament.playerRole === 'player') {
        if (result === "GOL") { matchHistory.cpu.push('miss'); }
        else { matchHistory.cpu.push('goal'); }
    } else {
        if (result === "GOL") { matchHistory.p1.push('miss'); }
        else { matchHistory.p1.push('goal'); }
    }

    gameState = "RESULT";
    currentMatch.round++;
    if (currentMatch.round > 5) setTimeout(endMatch, 2500);
    else setTimeout(resetPenaltyRound, 2500);
}

function endMatch() {
    stopGameLoop();
    const playerWon = currentMatch.scoreP1 > currentMatch.scoreCpu;
    const isDraw = currentMatch.scoreP1 === currentMatch.scoreCpu;

    if (Tournament.stage === 'groups') {
        // Atualiza Stats do Jogador
        if (playerWon) { updateStats(currentMatch.p1.id, 3, 1, 0); updateStats(currentMatch.cpu.id, 0, 0, 1); }
        else if (isDraw) { updateStats(currentMatch.p1.id, 1, 0, 0); updateStats(currentMatch.cpu.id, 1, 0, 0); }
        else { updateStats(currentMatch.p1.id, 0, 0, 1); updateStats(currentMatch.cpu.id, 3, 1, 0); }

        // Simula TODOS os outros jogos, inclusive o jogo restante do grupo do player
        simulateOtherMatches();

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

// === CORREÇÃO DA LÓGICA DE SIMULAÇÃO DOS GRUPOS ===
function simulateOtherMatches() {
    const roundIndex = Tournament.groupMatchIndex;

    Tournament.groups.forEach((group, gIndex) => {
        const isPlayerGroup = (gIndex === Tournament.groupIndex);

        if (isPlayerGroup) {
            // NO GRUPO DO JOGADOR:
            // O jogador acabou de jogar contra 'currentMatch.cpu'.
            // Precisamos encontrar os outros dois times e simular o jogo entre eles.
            // Isso garante que todos joguem na rodada.
            const pId = Tournament.playerTeam.id;
            const cpuId = currentMatch.cpu.id;

            // Filtra o grupo para achar os 2 times que NÃO jogaram agora
            const otherTeams = group.filter(t => t.id !== pId && t.id !== cpuId);

            // Simula jogo entre eles
            if (otherTeams.length === 2) {
                runSimulatedMatch(otherTeams[0], otherTeams[1]);
            }

        } else {
            // NOS OUTROS GRUPOS:
            // Simulação padrão Round Robin
            // Rodada 0: [0 vs 1] e [2 vs 3]
            // Rodada 1: [0 vs 2] e [1 vs 3]
            // Rodada 2: [0 vs 3] e [1 vs 2]

            let pairs = [];
            if (roundIndex === 0) pairs = [[0, 1], [2, 3]];
            else if (roundIndex === 1) pairs = [[0, 2], [1, 3]];
            else pairs = [[0, 3], [1, 2]]; // Round 2

            pairs.forEach(p => {
                runSimulatedMatch(group[p[0]], group[p[1]]);
            });
        }
    });
}

function runSimulatedMatch(tA, tB) {
    // Placar Aleatório
    let goalsA = Math.floor(Math.random() * 4); // 0 a 3 gols
    let goalsB = Math.floor(Math.random() * 4);

    // Para manter a lógica antiga de "Pênaltis", vamos forçar um vencedor na maioria das vezes,
    // mas o código suporta empate se quiser. Vamos manter desempate forçado para simplicidade da tabela.
    if (goalsA === goalsB) {
        if (Math.random() > 0.5) goalsA++; else goalsB++;
    }

    if (goalsA > goalsB) {
        updateStats(tA.id, 3, 1, 0); // Vitoria A
        updateStats(tB.id, 0, 0, 1); // Derrota B
    } else {
        updateStats(tA.id, 0, 0, 1); // Derrota A
        updateStats(tB.id, 3, 1, 0); // Vitoria B
    }
}

function endGroupStage() {
    let qualifiedTeams = [];
    let thirdPlacePool = [];

    Tournament.groups.forEach(group => {
        group.sort((a, b) => {
            const sa = Tournament.standings[a.id];
            const sb = Tournament.standings[b.id];
            return (sb.points - sa.points) || (sb.wins - sa.wins);
        });
        qualifiedTeams.push(group[0]);
        qualifiedTeams.push(group[1]);
        thirdPlacePool.push(group[2]);
    });

    thirdPlacePool.sort((a, b) => {
        const sa = Tournament.standings[a.id];
        const sb = Tournament.standings[b.id];
        return (sb.points - sa.points) || (sb.wins - sa.wins);
    });
    const bestThirds = thirdPlacePool.slice(0, 8);
    bestThirds.forEach(t => qualifiedTeams.push(t));

    const playerQualified = qualifiedTeams.find(t => t.id === Tournament.playerTeam.id);

    if (playerQualified) {
        Tournament.stage = 'r32';
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
    const stages = ['r32', 'r16', 'qf', 'sf', 'final'];
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

function showChampionScreen() {
    switchScreen('champion');
    document.getElementById('champion-team').textContent = Tournament.playerTeam.name;
    document.getElementById('champion-logo').src = getSafeLogo(Tournament.playerTeam.logo);
    playSound('goal');
    saveChampion(Tournament.playerTeam.name);

    particles = [];
    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * c.width,
            y: Math.random() * c.height - c.height,
            vx: 0, vy: Math.random() * 2 + 1,
            life: 9999,
            color: `hsl(${Math.random() * 360}, 100%, 50%)`,
            type: 'confetti',
            offset: Math.random() * 100
        });
    }
    function championLoop() {
        if (screens.champion.style.display !== 'none') {
            globalTime++;
            update();
            ctx.clearRect(0, 0, c.width, c.height);
            drawParticles();
            requestAnimationFrame(championLoop);
        }
    }
    championLoop();
}

function draw() {
    ctx.clearRect(0, 0, c.width, c.height);

    if (isLightning) {
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.fillRect(0, 0, c.width, c.height);
    }

    let sx = 0, sy = 0;
    if (shakeAmount > 0) {
        sx = (Math.random() - 0.5) * shakeAmount;
        sy = (Math.random() - 0.5) * shakeAmount;
    }

    ctx.save();
    ctx.translate(c.width / 2, c.height / 2);
    ctx.scale(cameraZoom, cameraZoom);
    ctx.translate(-c.width / 2 + sx, -c.height / 2 + sy + cameraY);

    drawField();
    drawCrowd();

    drawSpeechBubbles();

    drawNet();
    drawKeeper();
    drawRef();

    ballTrail.forEach(t => {
        ctx.save();
        ctx.translate(t.x, t.y);
        ctx.scale(t.scale, t.scale);
        ctx.fillStyle = t.color || `rgba(255,255,255,${t.opacity})`;
        ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        t.opacity -= 0.05;
    });

    if (ball.moving || gameState === "WAIT_JUIZ" || gameState === "PLAY") {
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        const shadowScale = ball.scale * 1.2;
        ctx.beginPath();
        ctx.ellipse(ball.x, ball.y + (8 * (1 - ball.scale)), 8 * shadowScale, 4 * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();
    }
    drawBall();

    if (Tournament.playerRole === 'player' && gameState === "PLAY" && !ball.moving && inputActive) {
        const wobbleX = aimX + aimWobble;
        ctx.strokeStyle = "rgba(255,255,255,0.4)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.beginPath(); ctx.moveTo(ball.x, ball.y); ctx.lineTo(wobbleX, CONFIG.goalTop + 20); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.beginPath(); ctx.arc(wobbleX, CONFIG.goalTop + 20, 15, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(wobbleX, CONFIG.goalTop + 20, 3, 0, Math.PI * 2); ctx.fill();
    }

    drawParticles();
    ctx.restore();

    if (weather === 'rain') {
        ctx.fillStyle = "rgba(0, 10, 30, 0.15)";
        ctx.fillRect(0, 0, c.width, c.height);
    }
}

function drawParticles() {
    particles.forEach(p => {
        if (p.type === 'text') {
            ctx.font = "bold 14px 'Russo One'";
            ctx.fillStyle = p.color;
            ctx.textAlign = "center";
            ctx.fillText(p.text, p.x, p.y);
        } else if (p.type === 'flash') {
            ctx.fillStyle = p.color;
            ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2); ctx.fill();
        } else {
            ctx.fillStyle = p.color;
            if (p.type === 'grass') ctx.fillRect(p.x, p.y, 4, 4);
            else if (p.type === 'confetti') ctx.fillRect(p.x, p.y, 6, 8);
            else if (p.type === 'rain') { ctx.fillRect(p.x, p.y, 2, 8); }
            else if (p.type === 'spark') ctx.fillRect(p.x, p.y, 3, 3);
        }
    });
}

function drawCrowd() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, c.width, CONFIG.goalTop - 10);
    const rows = 6;
    const cols = 25;
    const startY = 70;
    const spacingX = c.width / cols;
    const spacingY = 16;
    for (let r = 0; r < rows; r++) {
        for (let cl = 0; cl < cols; cl++) {
            const isP1Side = cl < cols / 2;
            const team = isP1Side ? currentMatch.p1 : currentMatch.cpu;
            let color;
            if (team.crowdColors && team.crowdColors.length > 0) {
                const colorIndex = (cl + r) % team.crowdColors.length;
                color = team.crowdColors[colorIndex];
            } else { color = Math.random() > 0.5 ? team.color1 : team.color2; }
            let bounce = 0;
            if (gameState === "RESULT") {
                if (currentMatch.roundWinner === 'p1' && isP1Side) { bounce = Math.sin(globalTime * 0.8 + cl) * 8; }
                else if (currentMatch.roundWinner === 'cpu' && !isP1Side) { bounce = Math.sin(globalTime * 0.8 + cl) * 8; }
                else { bounce = Math.sin(globalTime * 0.05 + r) * 1; }
            } else { bounce = Math.sin(globalTime * 0.1 + r + cl) * 2; }
            const x = cl * spacingX + 10;
            const y = startY + r * spacingY + bounce;
            ctx.fillStyle = color;
            ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
        }
    }
}

function spawnSpeechBubble(type) {
    let textArray = [];
    let isLeft = true;

    if (gameState === "WAIT_JUIZ") {
        const isStriker = Tournament.playerRole === 'player';
        if (type === 'support') {
            textArray = isStriker ? CROWD_PHRASES.striker.support : CROWD_PHRASES.keeper.support;
            isLeft = true;
        } else {
            textArray = isStriker ? CROWD_PHRASES.striker.rival : CROWD_PHRASES.keeper.rival;
            isLeft = false;
        }
    } else {
        if (type === 'good') {
            textArray = CROWD_PHRASES.reaction_good;
            isLeft = true;
        } else {
            textArray = CROWD_PHRASES.reaction_bad;
            isLeft = false;
        }
    }

    const text = textArray[Math.floor(Math.random() * textArray.length)];
    const minX = isLeft ? 20 : 220;
    const maxX = isLeft ? 150 : 380;
    const x = Math.random() * (maxX - minX) + minX;
    const y = Math.random() * 80 + 40;

    speechBubbles.push({
        x: x, y: y,
        text: text,
        life: 100,
        scale: 0
    });
}

function drawSpeechBubbles() {
    speechBubbles.forEach(b => {
        if (b.life < 90 && b.scale < 1) b.scale += 0.1;
        if (b.life < 10) b.scale -= 0.1;

        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.scale(b.scale, b.scale);

        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 2;

        ctx.beginPath();
        const w = ctx.measureText(b.text).width + 20;
        const h = 30;
        ctx.roundRect(-w / 2, -h / 2, w, h, 10);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, h / 2);
        ctx.lineTo(-5, h / 2 + 8);
        ctx.lineTo(5, h / 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#000";
        ctx.font = "bold 12px 'Roboto'";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(b.text, 0, 0);

        ctx.restore();

        b.life--;
        b.y -= 0.2;
    });
    speechBubbles = speechBubbles.filter(b => b.life > 0);
}

function drawField() {
    for (let i = 0; i < 12; i++) {
        ctx.fillStyle = i % 2 === 0 ? "#2e7d32" : "#388e3c";
        ctx.fillRect(0, i * (c.height / 12), c.width, c.height / 12);
    }
    if (weather === 'rain') {
        ctx.fillStyle = "rgba(50, 40, 30, 0.1)";
        ctx.fillRect(0, 0, c.width, c.height);
    }
    ctx.strokeStyle = "rgba(255,255,255,0.9)"; ctx.lineWidth = 4;
    ctx.strokeRect(40, CONFIG.goalTop, 320, 160);
    ctx.strokeRect(120, CONFIG.goalTop, 160, 60);
    ctx.beginPath(); ctx.arc(200, CONFIG.goalTop + 160, 40, 0, Math.PI, false); ctx.stroke();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(200, CONFIG.penaltyY, 4, 0, Math.PI * 2); ctx.fill();
}

function drawNet() {
    const l = CONFIG.goalLeft, r = CONFIG.goalRight, t = CONFIG.goalTop, d = 35;
    ctx.lineWidth = 5; ctx.strokeStyle = "#ddd"; ctx.lineJoin = "round";
    ctx.lineWidth = 1; ctx.strokeStyle = "rgba(255,255,255,0.3)";
    const netSpacing = 12;
    for (let x = l; x < r; x += netSpacing) { ctx.beginPath(); ctx.moveTo(x, t); ctx.lineTo(x + (x - 200) * 0.15, t + d); ctx.stroke(); }
    for (let y = 0; y < d; y += 6) { ctx.beginPath(); ctx.moveTo(l - (y * 0.2), t + y); ctx.lineTo(r + (y * 0.2), t + y); ctx.stroke(); }
    ctx.lineWidth = 6; ctx.strokeStyle = "#eee";
    ctx.beginPath(); ctx.moveTo(l, t); ctx.lineTo(r, t);
    ctx.moveTo(l, t); ctx.lineTo(l, t + 600);
    ctx.moveTo(r, t); ctx.lineTo(r, t + 600);
    ctx.stroke();
}

function drawHuman(x, y, color1, color2, scale, isKeeper, animState, isRef = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    if (!isKeeper) {
        if (!isRef) ctx.translate(0, -playerAnim.jump);

        ctx.fillStyle = "#d2b48c"; ctx.beginPath(); ctx.arc(0, -25, 12, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = color1;
        ctx.beginPath(); ctx.moveTo(-15, -15); ctx.lineTo(15, -15);
        ctx.lineTo(12, 15); ctx.lineTo(-12, 15); ctx.fill();
        ctx.fillStyle = color2; ctx.fillRect(-5, -15, 10, 30);
        ctx.fillStyle = "#d2b48c";
        ctx.fillRect(-20, -10, 6, 20);
        ctx.fillRect(14, -10, 6, 20);
        ctx.fillStyle = color2; ctx.fillRect(-13, 15, 26, 12);
        ctx.fillStyle = "#d2b48c"; ctx.fillRect(-11, 27, 8, 15); ctx.fillRect(3, 27, 8, 15);
        ctx.fillStyle = color1; ctx.fillRect(-11, 35, 8, 10); ctx.fillRect(3, 35, 8, 10);
        ctx.fillStyle = "#111"; ctx.fillRect(-11, 45, 10, 6); ctx.fillRect(3, 45, 10, 6);
        ctx.restore();
        return;
    }

    if (animState === 'dive_left') {
        ctx.translate(0, 30);
        ctx.rotate(Math.PI / 2.5);
        ctx.translate(0, -30);
    }
    if (animState === 'dive_right') {
        ctx.translate(0, 30);
        ctx.rotate(-Math.PI / 2.5);
        ctx.translate(0, -30);
    }

    ctx.fillStyle = "#d2b48c"; ctx.beginPath(); ctx.arc(0, -25, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = color1;
    ctx.beginPath(); ctx.moveTo(-15, -15); ctx.lineTo(15, -15);
    ctx.lineTo(12, 15); ctx.lineTo(-12, 15); ctx.fill();
    ctx.fillStyle = color2; ctx.fillRect(-5, -15, 10, 30);
    ctx.fillStyle = color2; ctx.fillRect(-13, 15, 26, 12);
    ctx.fillStyle = "#d2b48c"; ctx.fillRect(-11, 27, 8, 15); ctx.fillRect(3, 27, 8, 15);
    ctx.fillStyle = color1; ctx.fillRect(-11, 35, 8, 10); ctx.fillRect(3, 35, 8, 10);
    ctx.fillStyle = "#111"; ctx.fillRect(-11, 45, 10, 6); ctx.fillRect(3, 45, 10, 6);

    ctx.fillStyle = color1;
    ctx.beginPath(); ctx.arc(-16, -10, 5, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(16, -10, 5, 0, Math.PI * 2); ctx.fill();

    if (animState !== 'idle') {
        ctx.fillStyle = color1;
        ctx.fillRect(-22, -25, 6, 10);
        ctx.fillRect(16, -25, 6, 10);
        ctx.fillStyle = "#d2b48c";
        ctx.fillRect(-22, -15, 6, 10);
        ctx.fillRect(16, -15, 6, 10);
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.beginPath(); ctx.arc(-19, -35, 10, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(19, -35, 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(-19, -30, 8, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(19, -30, 8, 0, Math.PI * 2); ctx.fill();
    }
    else {
        ctx.save();
        ctx.translate(-16, -10);
        ctx.rotate(0.2);
        ctx.fillStyle = color1; ctx.fillRect(-3, 0, 6, 12);
        ctx.fillStyle = "#d2b48c"; ctx.fillRect(-3, 12, 6, 10);
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0, 26, 7, 0, Math.PI * 2); ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(16, -10);
        ctx.rotate(-0.2);
        ctx.fillStyle = color1; ctx.fillRect(-3, 0, 6, 12);
        ctx.fillStyle = "#d2b48c"; ctx.fillRect(-3, 12, 6, 10);
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(0, 26, 7, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
    }

    ctx.restore();
}

function drawKeeper() {
    const activeKeeper = Tournament.playerRole === 'player' ? currentMatch.cpu : currentMatch.p1;
    const kColor1 = activeKeeper.keeperColor1 || '#888888';
    const kColor2 = activeKeeper.keeperColor2 || '#000000';
    drawHuman(keeper.x, keeper.y + 25, kColor1, kColor2, 0.8, true, keeper.animState);
}

function drawRef() {
    const rx = 40, ry = CONFIG.penaltyY - 60;
    drawHuman(rx, ry, "#FDD116", "#000000", 0.7, false, "idle", true);
}

function drawBall() {
    if (gameState === "MENU" || gameState === "RESULT" && !ball.moving) return;
    ctx.save(); ctx.translate(ball.x, ball.y); ctx.scale(ball.scale, ball.scale); ctx.rotate(ball.rotation * Math.PI / 180);
    ctx.fillStyle = "#fff";
    if (activePowerUp === 'fire' && ball.moving) ctx.fillStyle = "#ffccbc";

    ctx.beginPath(); ctx.arc(0, 0, 10, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#111";
    ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(4, -5); ctx.lineTo(-4, -5); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-9, 2); ctx.lineTo(-5, 7); ctx.lineTo(-2, 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(9, 2); ctx.lineTo(5, 7); ctx.lineTo(2, 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.3)"; ctx.beginPath(); ctx.arc(-3, -3, 4, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
}

const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();

function playSound(type) {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const t = audioCtx.currentTime;

    const createNoise = () => {
        const bufferSize = audioCtx.sampleRate * 2;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.value = 1000;
        noise.connect(noiseFilter);
        return { src: noise, filter: noiseFilter };
    };

    const osc = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    osc.connect(g);
    g.connect(audioCtx.destination);

    if (type === 'kick') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, t);
        osc.frequency.exponentialRampToValueAtTime(0.01, t + 0.15);
        g.gain.setValueAtTime(1, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
        osc.start(); osc.stop(t + 0.15);
    }
    if (type === 'fire') {
        const n = createNoise();
        const ng = audioCtx.createGain();
        n.filter.connect(ng);
        ng.connect(audioCtx.destination);
        n.filter.frequency.setValueAtTime(100, t);
        n.filter.frequency.linearRampToValueAtTime(1000, t + 0.3);
        ng.gain.setValueAtTime(1, t);
        ng.gain.exponentialRampToValueAtTime(0.01, t + 0.5);
        n.src.start(); n.src.stop(t + 0.5);
    }
    if (type === 'whistle') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(2500, t);
        osc.frequency.linearRampToValueAtTime(1800, t + 0.15);
        g.gain.setValueAtTime(0.3, t);
        g.gain.linearRampToValueAtTime(0, t + 0.2);
        osc.start(); osc.stop(t + 0.2);
    }
    if (type === 'goal') {
        const osc2 = audioCtx.createOscillator();
        const g2 = audioCtx.createGain();
        osc2.connect(g2); g2.connect(audioCtx.destination);
        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(500, t);
        osc2.frequency.linearRampToValueAtTime(800, t + 1);
        g2.gain.setValueAtTime(0.5, t);
        g2.gain.linearRampToValueAtTime(0, t + 1.5);
        osc2.start(); osc2.stop(t + 1.5);

        const n = createNoise();
        const ng = audioCtx.createGain();
        n.filter.connect(ng);
        ng.connect(audioCtx.destination);
        ng.gain.setValueAtTime(0, t);
        ng.gain.linearRampToValueAtTime(0.8, t + 0.1);
        ng.gain.exponentialRampToValueAtTime(0.01, t + 2.0);
        n.src.start(); n.src.stop(t + 2.0);
    }
    if (type === 'crowd_aww') {
        const n = createNoise();
        const ng = audioCtx.createGain();
        n.filter.frequency.value = 500;
        n.filter.connect(ng);
        ng.connect(audioCtx.destination);
        ng.gain.setValueAtTime(0, t);
        ng.gain.linearRampToValueAtTime(0.5, t + 0.1);
        ng.gain.exponentialRampToValueAtTime(0.01, t + 1.0);
        n.src.start(); n.src.stop(t + 1.0);
    }
    if (type === 'crowd_boo') {
        const n = createNoise();
        const ng = audioCtx.createGain();
        n.filter.frequency.value = 200;
        n.filter.connect(ng);
        ng.connect(audioCtx.destination);

        ng.gain.setValueAtTime(0, t);
        ng.gain.linearRampToValueAtTime(0.6, t + 0.2);
        ng.gain.exponentialRampToValueAtTime(0.01, t + 2.0);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, t);
        osc.frequency.linearRampToValueAtTime(80, t + 2.0);
        g.gain.setValueAtTime(0.2, t);
        g.gain.linearRampToValueAtTime(0, t + 2.0);

        n.src.start(); n.src.stop(t + 2.0);
        osc.start(); osc.stop(t + 2.0);
    }
    if (type === 'save') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(200, t);
        osc.frequency.exponentialRampToValueAtTime(50, t + 0.2);
        g.gain.setValueAtTime(0.6, t);
        g.gain.linearRampToValueAtTime(0, t + 0.2);
        osc.start(); osc.stop(t + 0.2);
    }
    if (type === 'post') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(800, t);
        g.gain.setValueAtTime(1, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.start(); osc.stop(t + 0.1);
    }
    if (type === 'crowd_cheer') {
        const n = createNoise();
        const ng = audioCtx.createGain();
        n.filter.frequency.value = 1200;
        n.filter.connect(ng);
        ng.connect(audioCtx.destination);
        ng.gain.setValueAtTime(0, t);
        ng.gain.linearRampToValueAtTime(0.6, t + 0.1);
        ng.gain.exponentialRampToValueAtTime(0.01, t + 1.0);
        n.src.start(); n.src.stop(t + 1.0);
    }
    if (type === 'thunder') {
        const n = createNoise();
        const ng = audioCtx.createGain();
        n.filter.frequency.value = 200;
        n.filter.connect(ng);
        ng.connect(audioCtx.destination);
        ng.gain.setValueAtTime(1, t);
        ng.gain.exponentialRampToValueAtTime(0.01, t + 1.5);
        n.src.start(); n.src.stop(t + 1.5);
    }
    if (type === 'heartbeat') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(60, t);
        g.gain.setValueAtTime(1, t);
        g.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
        osc.start(); osc.stop(t + 0.1);

        const osc2 = audioCtx.createOscillator();
        const g2 = audioCtx.createGain();
        osc2.connect(g2); g2.connect(audioCtx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(60, t + 0.2);
        g2.gain.setValueAtTime(0.8, t + 0.2);
        g2.gain.exponentialRampToValueAtTime(0.01, t + 0.3);
        osc2.start(t + 0.2); osc2.stop(t + 0.4);
    }
}

function loop() {
    if (c.style.display === 'block') { update(); draw(); animationFrameId = requestAnimationFrame(loop); }
}

switchScreen('menu');