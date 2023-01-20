class Character {
    constructor(id, level, hp, atk, def,itemAttack,itemDefense) {
        this.id = id;
        this.level = level;
        this.hp = (atk+def)*10;
        this.atk = atk;
        this.def = def;
        this.itemAttack = itemAttack;
        this.itemDefense = itemDefense;
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
        let damageScale = (Math.max((this.atk+this.itemAttack), MINIMUM_ATK)/((target.def+this.itemDefense)+0.9)+2)*roll*0.05;
        let damage = Math.floor((this.atk+this.itemAttack)*damageScale);
        damage = Math.max(damage, MINIMUM_DAMAGE);
        target.hp -= damage;
        if(target.hp <= 0) target.hp = 0;
        if(!document.getElementById("skipAnimation").checked) animationData(damage);
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
     * @param {number} itemAttack - O item de ataque do jogador (espadas...)
     * @param {number} itemDefense - O item de defesa do jogador (escudos...)
     */


      constructor(id, level, hp, atk, def,itemAttack,itemDefense) {
        super(id, level, hp, atk, def,itemAttack,itemDefense);
      }
}
//#region Variaveis
const btBackCraft = document.getElementById('return');
let nickname = sessionStorage.getItem("nickname");
let attack = Number(sessionStorage.getItem("attack"));
let itemAttack = (!sessionStorage.getItem("itemAttack")?0:Number(sessionStorage.getItem("itemAttack")));
let itemDefense = (!sessionStorage.getItem("itemDefense")?0:Number(sessionStorage.getItem("itemDefense")));
let defense = Number(sessionStorage.getItem("defense"));
let level = Number(sessionStorage.getItem("level"));
const attackButton = document.getElementById('attackButton');
const player = new Player(0,level,0,attack,defense,itemAttack,itemDefense);
let mobLevel = Number(sessionStorage.getItem("mobLevel"));
if(mobLevel == 0) mobLevel = 1;
const MobGenerated = generateMob();
let Mob = new Character(1,mobLevel,0,MobGenerated[0],MobGenerated[1],0,0);
const dado = document.getElementById('dado');
const labelDano = document.createElement('label');
const p = document.getElementById("numDado");
labelDano.id = "damageCaused";
dado.appendChild(labelDano);
let animationInterval;
let buttonContinue = document.createElement('button');
let buttonReturn = document.createElement('button');
let buttonCrafting = document.createElement('button');
let div = document.createElement('div');
let pDivNextMob = document.createElement('p');
let xp = 0;
let pLife = document.createElement("label");
let bag = document.getElementById("bag");
let bagItems = document.getElementById("bagItems");
let itemsBag = (sessionStorage.getItem('items'))?JSON.parse(sessionStorage.getItem('items')):{};
let swordSlimeButton = document.createElement('button');
let swordSlimeItens = document.createElement('p');
const divCrafting = document.createElement('div');
//#endregion
function hudPlayer(){
    let up = ((((4*player.level**2+player.level)/1.39+10)*0.5)**1.3*2);
    let playerInformation = document.getElementById("hudPlayerInformation");
    if(!verifyDom(document.getElementById('playerInformation'))){
        let pre = document.createElement('pre');
        pre.innerText = "Nick: "+nickname+"\nVida: "+player.hp+"/"+(player.def+player.atk)*10+"\nAtaque: "+player.atk+" + "+itemAttack+"\nDefesa: "+player.def+" + "+itemDefense+'\nXp: '+xp.toFixed(2)+"/"+up.toFixed(2);
        pre.id = "playerInformation"
        playerInformation.appendChild(pre);
    }else{
        let pre = document.getElementById('playerInformation');
        pre.innerText = "Nick: "+nickname+"\nVida: "+player.hp+"/"+(player.def+player.atk)*10+"\nAtaque: "+player.atk+" + "+itemAttack+"\nDefesa: "+player.def+" + "+itemDefense+'\nXp: '+xp.toFixed(2)+"/"+up.toFixed(2);
    }
    hudBag();
    
}
function hudBag(){
    if(itemsBag[0]===undefined) bagItems.innerText = "";
    bagItems.innerText = "";
    Object.keys(itemsBag).forEach(e=>{
        bagItems.innerText += itemsBag[e][0]+" - "+itemsBag[e][1]+"\n";
    });
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
    if(showDiv != "none") {
        xp += (4*Mob.level**2+Mob.level)/1.39+10;
        dropItems();
    }
    div.style.display = showDiv;
    div.id = "hudChoice";
    pDivNextMob.innerText = "Dejesa continuar ou ficar?";
    buttonContinue.id = "nextMob";
    buttonContinue.innerText = "Continuar";
    buttonReturn.id = "btReturn";
    buttonReturn.innerText = "Ficar";
    buttonCrafting.innerText = "Fazer itens";
    buttonCrafting.id = "buttonCrafting";
    pLife.innerText = "Recupera: +"+ parseInt(((player.def+player.atk)*10)*0.23.toFixed(1)) + " de vida";
    div.appendChild(pDivNextMob);
    div.appendChild(buttonContinue);
    div.appendChild(buttonReturn);
    div.appendChild(pLife);
    div.appendChild(buttonCrafting);
    if(player.hp != (player.def+player.atk)*10) pLife.style.display = "flex";
    else pLife.style.display = "none";
    document.getElementsByTagName('main')[0].appendChild(div);
    
}
function xpUp(){
    let nextLv = (((4*player.level**2+player.level)/1.39+10)*0.5)**1.3*2;
    if(xp.toFixed(2) >= nextLv.toFixed(2)){
        sessionStorage.setItem('mobLevel', Mob.level);
        sessionStorage.setItem('level', ++level);
        sessionStorage.setItem('items', JSON.stringify(itemsBag));
        return window.location.href = "../character-update/index.htm";
    }
    return false;
}
function dropItems(){
    const item = "slime";
    updateBag(item);
    hudPlayer();
}
function updateBag(item){
    let find = false;
    Object.keys(itemsBag).forEach(e => {
        if(itemsBag[e][0] === item) { 
            find = true;
            return ++itemsBag[e][1];
        }
    });
    const last = Object.keys(itemsBag).length;
    if(!find) itemsBag[last] = [item,1];
}
function crafting(){
    dado.style.display = "none";
    btBackCraft.classList.remove('disabled');
    divCrafting.classList.remove('disabled');
    updateHud();
    loadingCraft();
}
function loadingCraft(){
    swordSlimeButton.classList.add('buttonCrafting');
    swordSlimeButton.innerText = "Espada de slime";

    swordSlimeItens.innerText = " - 3 Slimes";
    swordSlimeItens.classList.add('textCrafting');
    swordSlimeItens.classList.add(validationSwordSlime() );
    if(validationSwordSlime() != "incorrect")swordSlimeButton.onclick = swordSlime;

    divCrafting.classList.add("divCrafting");
    divCrafting.appendChild(swordSlimeButton);
    swordSlimeButton = document.getElementById("btCraftSwordSlime");
    divCrafting.appendChild(swordSlimeItens);

    const main = document.getElementsByTagName('main')[0];
    main.appendChild(divCrafting);
}
function swordSlime(){
    itemAttack = 2;
    Object.keys(itemsBag).forEach(e=>{
        if(itemsBag[e][0] == "slime"){
            itemsBag[e][1] -= 3;
            if(itemsBag[e][1] <= 0) delete itemsBag[e];
        }
    });
    swordSlimeItens.classList.remove("correct");
    swordSlimeItens.classList.add(validationSwordSlime());
    sessionStorage.setItem("items", JSON.stringify(itemsBag));
    updateHud();
}
function validationSwordSlime(){
    let find = false;
    Object.keys(itemsBag).forEach(e=>{
        if(itemsBag[e][0] == "slime" && itemsBag[e][1] != 3){
            return find = true;
        }
        if(itemsBag[e] == "") return find = true;
    })
    if(itemsBag[0] === undefined) find = true;
    if(find) return "incorrect";
    return "correct";
}
function returnPage(){
    sessionStorage.setItem('itemAttack', itemAttack);
    sessionStorage.setItem('itemDefense', itemDefense);
    divCrafting.classList.add('disabled');
    btBackCraft.classList.add('disabled');
    div.style.display = 'block';
}
function gameOver(){
    alert("Game over!");
    sessionStorage.setItem('itemAttack', 0);
    sessionStorage.setItem('itemDefense', 0);
    sessionStorage.setItem('mobLevel', 1);
    sessionStorage.setItem('level',1);
    sessionStorage.setItem('items', JSON.stringify({}));
    window.location.href = '../character-creation/index.htm';
}
document.getElementById('return').addEventListener('click',()=>{
    returnPage();
});

updateHud();

attackButton.addEventListener('click', ()=>{
    if(player.hp == 0) return gameOver();
    if(Mob.hp == 0) return nextMoborReturn("block");
    labelDano.classList.add('player');
    labelDano.classList.remove('mob');
    player.attack(Mob);
    updateHud();
    if(document.getElementById("skipAnimation").checked){        
        labelDano.classList.add('mob');
        labelDano.classList.remove('player');
        Mob.attack(player);
        if(Mob.hp === 0) {
            attackButton.innerText = "Coletar XP";
        };
        if(player.hp === 0) attackButton.innerText = "Game over!";
        updateHud();
    }
    else{
        attackButton.disabled = true;
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
            if(player.hp === 0) attackButton.innerText = "Game over!";
            clearInterval(animationInterval);
            updateHud();
            attackButton.disabled = false;
        },2000);
    }
   
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
    let life = parseInt(((player.def+player.atk)*10)*0.23.toFixed(1));
    if(Number(player.hp) + life >= (player.def+player.atk)*10) player.hp = (player.def+player.atk)*10;
    else player.hp += life;
    return updateHud();
})
buttonCrafting.addEventListener('click', ()=>{
    div.style.display = 'none';
    crafting();
})
btBackCraft.addEventListener('click',returnPage)

