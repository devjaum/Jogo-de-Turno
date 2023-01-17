class Character {
    constructor(id, level, hp, atk, def) {
        this.id = id;
        this.level = level;
        this.hp = (atk+def)*10;
        this.atk = atk;
        this.def = def;
    }
    /**
     * Permite que o personagem ataque outro personagem
     * @param {Object} target - O personagem alvo do ataque
     * @return {number} damage - O dano causado pelo ataque
     */
    attack(target) {
        
        const MINIMUM_DAMAGE = 2;
        const MINIMUM_ATK = 0;
        let roll = d20();
        let damageScale = (Math.max(this.atk, MINIMUM_ATK)/(target.def+0.9)+2)*roll*0.05;
        let damage = Math.floor(this.atk*damageScale);
        damage = Math.max(damage, MINIMUM_DAMAGE);
        target.hp -= damage;
        if(target.hp <= 0) target.hp = 0;
        animationData(damage);
        return damage;
    }
}
/**
 * Classe que representa o jogador
 * @extends Character
 */
class Player extends Character {
    /**
     * 
     * @param {number} id - O Id do jogador
     * @param {number} level - O level do jogador
     * @param {number} hp - A vida do jogador
     * @param {number} atk - O ataque do jogador
     * @param {number} def - A defesa do jogador
     */


      constructor(id, level, hp, atk, def) {
        super(id, level, hp, atk, def);
        this.experience = 0;
      }
}
//#region Variaveis
let nickname = sessionStorage.getItem("nickname");
let attack = Number(sessionStorage.getItem("attack"));
let defense = Number(sessionStorage.getItem("defense"));
let level = (sessionStorage.getItem('level') === 'null')?1:sessionStorage.getItem('level');
const attackButton = document.getElementById('attackButton');
const player = new Player(0,level,0,attack,defense);
let mobLevel = Number(sessionStorage.getItem("mobLevel"));
if(mobLevel == 0) mobLevel = 1;
const MobGenerated = generateMob();
let Mob = new Character(1,mobLevel,0,MobGenerated[0],MobGenerated[1]);
const dado = document.getElementById('dado');
const labelDano = document.createElement('label');
const p = document.getElementById("numDado");
labelDano.id = "damageCaused";
dado.appendChild(labelDano);
let animationInterval;
let buttonContinue = document.createElement('button');
let buttonReturn = document.createElement('button');
let div = document.createElement('div');
let pDivNextMob = document.createElement('p');
let xp = 0;
//#endregion
function hudPlayer(){
    let up = ((((4*player.level**2+player.level)/1.39+10)*0.5)**1.3*2);
    let playerInformation = document.getElementById("hudPlayerInformation");
    if(!verifyDom(document.getElementById('playerInformation'))){
        let pre = document.createElement('pre');
        pre.innerText = "Nick: "+nickname+"\nVida: "+player.hp+"\nAtaque: "+player.atk+"\nDefesa: "+player.def+'\nXp: '+xp.toFixed(2)+"/"+up.toFixed(2);
        pre.id = "playerInformation"
        playerInformation.appendChild(pre);
    }else{
        let pre = document.getElementById('playerInformation');
        pre.innerText = "Nick: "+nickname+"\nVida: "+player.hp+"\nAtaque: "+player.atk+"\nDefesa: "+player.def+'\nXp: '+xp.toFixed(2)+"/"+up.toFixed(2);
    }
    
    
}
function verifyDom(dom){
    if(dom) return true;
    return false;
}
function hudMob(){
    let mobInformation = document.getElementById("hudMobInformation");
    if(!verifyDom(document.getElementById('mobInformation'))){
        let pre = document.createElement('pre');
        pre.innerText = "Lv: "+Mob.level+"\nVida: "+Mob.hp+"\nAtaque: "+Mob.atk+"\nDefesa: "+Mob.def;
        pre.id = "mobInformation"
        mobInformation.appendChild(pre);
    }else{
        let pre = document.getElementById('mobInformation');
        pre.innerText = "Lv: "+Mob.level+"\nVida: "+Mob.hp+"\nAtaque: "+Mob.atk+"\nDefesa: "+Mob.def;
    }
    
}
function generateMob(){
    let atk = 0;
    let def = 0;
    const LIMIT = 7 + (mobLevel*3);
    while(atk+def != LIMIT){
        atk = dNvalor(LIMIT);
        def = dNvalor(LIMIT);
    };
    return [atk, def]
}
function dNvalor(x){
    return Math.floor(Math.random()*x+1);
}
function d20(){
    const numDado = Math.floor(Math.random()*20+1);
    if(numDado < 10) return p.innerText = "0"+String(numDado);
    else p.innerText = numDado;
    if(numDado === 20) return 40;
    return numDado;
}
function animationData(damage){
    
    setTimeout(function(){
        dado.style.display = "flex";
        dado.style.animation = "rolar 1.3s ease 0s 1 normal forwards";
    },10);
    if(labelDano.className == "mob") labelDano.innerText = "Dano sofrido: "+damage;
    else labelDano.innerText = "Dano causado: "+damage;
    dado.style.display = "none";
    dado.style.animation = ""
}
function updateHud(){
    hudPlayer();
    hudMob();
    
}
function nextMoborReturn(showDiv){
    xp += (4*Mob.level**2+Mob.level)/1.39+10;
    div.style.display = showDiv;
    div.id = "hudChoice";
    pDivNextMob.innerText = "Dejesa continuar ou ficar?";
    buttonContinue.id = "nextMob";
    buttonContinue.innerText = "Continuar";
    buttonReturn.id = "return";
    buttonReturn.innerText = "Ficar";
    div.appendChild(pDivNextMob);
    div.appendChild(buttonContinue);
    div.appendChild(buttonReturn);
    document.getElementsByTagName('main')[0].appendChild(div);
}
function xpUp(){
    let nextLv = (((4*player.level**2+player.level)/1.39+10)*0.5)**1.3*2;
    if(xp >= nextLv){
        sessionStorage.setItem('mobLevel', Mob.level);
        sessionStorage.setItem('level', ++level);
        return window.location.href = "../character-update/index.htm";
    }
    return false;
}
updateHud()
attackButton.addEventListener('click', ()=>{
    attackButton.disabled = true;
    if(player.hp == 0) return;
    if(Mob.hp == 0) return nextMoborReturn("block");
    labelDano.classList.add('player');
    labelDano.classList.remove('mob');
    player.attack(Mob);
    updateHud();
    animationInterval = setInterval(animationData, 2000);
    
    if(Mob.hp === 0) {
        attackButton.innerText = "Coletar XP";
        attackButton.disabled = false;
        return clearInterval(animationInterval)
    };
    setTimeout(()=>{
        labelDano.classList.add('mob');
        labelDano.classList.remove('player');
        Mob.attack(player);
        clearInterval(animationInterval);
        updateHud();
        attackButton.disabled = false;
    },2000);
});
buttonContinue.addEventListener('click', ()=>{
    attackButton.disabled = false;

    Mob = new Character(1,++mobLevel,0,MobGenerated[0]+Mob.level+1,MobGenerated[1]+Mob.level+1);
    nextMoborReturn('none');
    xpUp();
    attackButton.innerText = "Ataque"
    return updateHud();
})
buttonReturn.addEventListener('click', ()=>{
    attackButton.disabled = false;

    xpUp();
    nextMoborReturn('none');
    let statusMob = generateMob();
    Mob.atk = statusMob[0];
    Mob.def = statusMob[1];
    Mob.hp = (statusMob[0]+statusMob[1])*10;
    dado.style.display = "none";
    dado.style.animation = ""
    attackButton.innerText = "Ataque";
    return updateHud();
})
