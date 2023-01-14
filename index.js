
let gameWid = document.getElementById("game");
let vez = true;
let ataqueBtn = document.getElementById('AtackP');
let xpUpdate = document.createElement('p');
let continuarBtn = document.getElementById('btnContinuar');
let cont = 0;
let manterNivel = document.getElementById("manterNivel");
let proxLv = document.getElementById('proxLv');

let stts = {
    player:{
        hp:0,
        atk:0,
        def:0
    },
    mob:{
        hp:0,
        atk:0,
        def:0
    }
}
let barraXp = {
    xp:0,
    oldXp:0,
    newLv:0
}
init();
mostrarStts()
function init(){
    stts.player = {
        id: 0,
        lv:1,
        hp: 100,
        atk: 8,
        def: 5
    };
    stts.mob = {
        id: 1,
        lv:1,
        hp: 100,
        atk: 3,
        def: 7
    };
    stts.player.hp = (stts.player.atk+stts.player.def)*10;
    stts.mob.hp = (stts.mob.atk+stts.mob.def)*10;
    let sttsP = document.createElement("pre");
    sttsP.id = "sttsP"; sttsP.innerText = "Vida: "+stts.player.hp;
    let sttsM = document.createElement("pre");
    sttsM.id = "sttsM"; sttsM.innerText = "Vida: "+stts.mob.hp+" LV: " + stts.mob.lv;
    document.getElementById('hudP').appendChild(sttsP);
    document.getElementById('hudM').appendChild(sttsM);
    barraXp.xp = stts.mob.lv;
    xpUpdate.id = "xpBar";xpUpdate.innerText = "XP:"+"0/16";
    document.getElementById("hudP").appendChild(xpUpdate);

}

function d20(){
    return Math.floor(Math.random()*20+1);
}

function atack(atacante,atacado){
    let dado = d20();
    let escalonamentoDano = (atacante.atk/atacado.def+2)*dado*0.05;
    let dano = Math.floor(atacante.atk*escalonamentoDano);
    atacado.hp -= dano;
    if(verificarHp(atacado) == 0) atacado.hp = 0;
    return dano;
}

function verificarHp(atacado){
    if(atacado.hp <= 0) return atacado.hp = 0;
    return atacado.hp
}

function xpBar(xpUpdate){
    barraXp.oldXp = (4*stts.mob.lv**2+stts.mob.lv)/1.39+10;
    barraXp.xp += barraXp.oldXp;
    document.getElementById("hudP").appendChild(xpUpdate);
    return barraXp.xp.toFixed(2);
}

function lv_Up(){
    if(barraXp.xp >= barraXp.newLv){
        stts.player.atk += aleatorio1a3();
        stts.player.def += aleatorio1a3();
        stts.player.hp = (stts.player.atk+stts.player.def)*10;
        barraXp.newLv = (barraXp.xp*0.5)**1.3*2;
        barraXp.xp = 0;
        stts.player.lv++;
    }
    
    xpUpdate.innerText = "XP:"+barraXp.xp.toFixed(1)+"/"+barraXp.newLv.toFixed(1);
}

function next_mob(mob){
    proxLv.classList.add('disabled');
    mob.lv++;
    sttsMob(mob);
    ataqueBtn.innerText = "Atack";
    document.getElementById('sttsP').innerText = "Vida: "+ verificarHp(stts.player);
    document.getElementById('sttsM').innerText = "Vida: "+ verificarHp(stts.mob) + " LV: " + stts.mob.lv;
    let continuarBtn = document.getElementById('btnContinuar');
    continuarBtn.classList.add('disabled');
}

function sttsMob(mob){
    stts.mob.atk = aleatorio1a3() * mob.lv+1;
    stts.mob.def = aleatorio1a3() * mob.lv+1;
    stts.mob.hp = (stts.mob.atk+stts.mob.def)*10;
}

function proximo(){
    lv_Up(xpBar(xpUpdate));
    proxLv.innerText = "Mob lv. "+ Number(stts.mob.lv+1);
    proxLv.classList.remove('disabled');
    ataqueBtn.classList.add('disabled');
    document.getElementById('lvMob').classList.remove('disabled');
    document.getElementById('lvMob').innerText = "Level do monstro atual: "+ stts.mob.lv;
    continuarBtn.classList.remove('disabled');
    continuarBtn.innerText = "Mob lv. "+ Number(stts.mob.lv);
}

function proximoMob(){
    next_mob(stts.mob);
    document.getElementById('lvMob').classList.add('disabled');
    trocar(proxLv, continuarBtn);
}

function trocar(primeiro, segundo){
    primeiro.classList.add('primeiro');
    primeiro.classList.remove('segundo');
    segundo.classList.remove('primeiro');
    segundo.classList.add('segundo');
    ataqueBtn.classList.remove('disabled');
}

function nivelAnterior(){
    document.getElementById('lvMob').classList.remove('disabled');
    document.getElementById('lvMob').innerText = "Level do mostro atual: "+ stts.mob.lv;
    if(Number(stts.mob.lv)>1 && !manterNivel.checked) Number(stts.mob.lv--);
    
    sttsMob(stts.mob);
    stts.mob.hp = (stts.mob.atk+stts.mob.def)*10;
    ataqueBtn.innerText = "Atack";
    continuarBtn.classList.add("disabled");
    document.getElementById('sttsP').innerText = "Vida: "+ verificarHp(stts.player);
    document.getElementById('sttsM').innerText = "Vida: "+ verificarHp(stts.mob)+ " LV: " + stts.mob.lv;
    document.getElementById('lvMob').classList.add('disabled');
    proxLv.classList.add('disabled');
    if(manterNivel.checked) trocar(continuarBtn,proxLv);
    else ataqueBtn.classList.remove('disabled');
}
function aleatorio1a3(){
    return Math.floor(Math.random()*3+1);
}
function aleatorio1a5(){
    return Math.floor(Math.random()*5+1);
}
function mostrarStts(){
    document.getElementById('sttsGeral').innerText = "Lv: "+stts.player.lv+"\nHP:"+(stts.player.atk+stts.player.def)*10+"\nATK: "+stts.player.atk+"\nDEF: "+stts.player.def;

}
function atacar(){
    let danoPlayer = 0;
    let danoMob = 0;
    if(stts.player.hp <= 0){
        return alert("Game Over");
    };
    
    danoPlayer = atack(stts.player,stts.mob);
    danoMob = atack(stts.mob,stts.player);

    if(verificarHp(stts.mob) == 0) proximo(cont);
    
    mostrarStts()
    document.getElementById('sttsP').innerText = "Vida: "+ verificarHp(stts.player) + "\nDano: " + danoPlayer;
    document.getElementById('sttsM').innerText = "Vida: "+ verificarHp(stts.mob) + " LV: " + stts.mob.lv +  "\nDano: " + danoMob;
}
