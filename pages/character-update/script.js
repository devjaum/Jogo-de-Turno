let LIMIT = 3;
let atk;
let def;
let level;

const hp = document.getElementById("hp");
const attack = document.getElementById("atk");
const defense = document.getElementById("def");
const limit = document.getElementById('limit');
reset();

function increaseAttack(){
    if(LIMIT == 0)return;
    atk++;
    LIMIT--;
    updateHud()
}
function increaseDefense(){
    if(LIMIT == 0)return;
    def++;
    LIMIT--;
    updateHud()
}
function decreaseAttack(){
    if(LIMIT == 3)return;
    atk--;
    LIMIT++;
    updateHud()
}
function decreaseDefense(){
    if(LIMIT == 3)return;
    def--;
    LIMIT++;
    updateHud()
}
function updateHud(){
    hp.innerText = "Vida: "+(atk+def)*10;
    attack.innerText = "Ataque: "+atk;
    defense.innerText = "Defesa: "+def;
    limit.innerText = "Pontos restantes: " + LIMIT;
}
function confirm(){
    sessionStorage.setItem("attack", atk);
    sessionStorage.setItem("defense", def);
    sessionStorage.setItem("mobLevel", level);
    goToHomePage();
}  
function reset(){
    atk = Number(sessionStorage.getItem("attack"));
    def = Number(sessionStorage.getItem("defense"));
    level = Number(sessionStorage.getItem("mobLevel"));
    LIMIT = 3;
    updateHud();
}
function goToHomePage() {
    window.location.href = "../home/index.htm";
}