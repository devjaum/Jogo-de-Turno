let LIMIT = 10; 
let attack = 0;
let defense = 0;
let nickname = "";


const limitElement = document.getElementById("limit");
const atkElement = document.getElementById("atk");
const defElement = document.getElementById("def");
const hpElement = document.getElementById("hp");

limitElement.innerText = "Pontos restantes: "+(LIMIT);

function increaseAttack() {
    if(LIMIT < 1) return;

    attack++;
    LIMIT--;

    updateAtk();
    updateLimit();
    updateHp();
}

function increaseDefense() {
    if(LIMIT < 1) return;

    defense++;
    LIMIT--;

    updateDef();
    updateLimit();
    updateHp();
}

function updateAtk() {
    atkElement.innerText = "Ataque: " + attack;
}

function updateDef() {
    defElement.innerText = "Defesa: " + defense;
}

function updateLimit() {
    limitElement.innerText = "Pontos restantes: " + LIMIT;
}

function updateHp() {
    hpElement.innerText = "Vida: " + (attack + defense) * 10;
}

function validateData() {
    if (LIMIT !== 0) {
        document.getElementById("limit").classList.add('incorrect');
        return false;
    }
    if (document.getElementById('nickname').value === "") {
        document.getElementById('nickname').classList.add('incorrectInput');
        return false;
    }
    return true;
}

function confirm() {
    if (!validateData()) return;

    clearValidationErrors();

    nickname = document.getElementById('nickname').value;
    storeData();
}

function clearValidationErrors() {
    document.getElementById('nickname').classList.remove('incorrectInput');
    document.getElementById("limit").classList.remove('incorrect');
}

function reset() {
    clearPlayerData();

    updateScreen();
}

function clearPlayerData() {
    attack = defense = 0;
    LIMIT = 10;
}

function updateScreen() {
    document.getElementById("atk").innerText = "Ataque: " + attack;
    document.getElementById("def").innerText = "Defesa: " + defense;
    document.getElementById("limit").innerText = "Pontos restantes: " + LIMIT;
    document.getElementById("hp").innerText = "Vida: " + (0);
    document.getElementById('nickname').value = "";
}

function storeData() {
    sessionStorage.setItem("nickname", nickname);
    sessionStorage.setItem("attack", attack);
    sessionStorage.setItem("defense", defense);

    goToHomePage();
}

function goToHomePage() {
    window.location.href = "/pages/home/index.htm";
}
