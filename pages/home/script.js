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
        let damageScale = (Math.max(this.atk, MINIMUM_ATK)/target.def+2)*roll*0.05;
        let damage = Math.floor(this.atk*damageScale);
        damage = Math.max(damage, MINIMUM_DAMAGE);
        target.hp -= damage;
        if(target.hp <= 0) target.hp = 0;
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
      /**
       * Faz o jogador subir de level
       */
      levelUp() {
          this.atk += d3();
          this.def += d3();
          this.hp = (this.atk+this.def)*10;
          this.level++;
      }
}

let nickname = sessionStorage.getItem("nickname")
let attack = Number(sessionStorage.getItem("attack"))
let defense = Number(sessionStorage.getItem("defense"))
const attackButton = document.getElementById('attackButton');
const player = new Player(0,1,0,attack,defense);
const MobGenerated = generateMob()
const Mob = new Character(1,1,0,MobGenerated[0],MobGenerated[1]);

function hudPlayer(){
    let playerInformation = document.getElementById("hudPlayerInformation");
    if(!verifyDom(document.getElementById('playerInformation'))){
        let pre = document.createElement('pre');
        pre.innerText = "Nick: "+nickname+"\nVida: "+player.hp+"\nAtaque: "+player.atk+"\nDefesa: "+player.def;
        pre.id = "playerInformation"
        playerInformation.appendChild(pre);
    }else{
        let pre = document.getElementById('playerInformation');
        pre.innerText = "Nick: "+nickname+"\nVida: "+player.hp+"\nAtaque: "+player.atk+"\nDefesa: "+player.def;
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
        pre.innerText = "Lv: "+Mob.level+"\nVida: "+Mob.hp
        pre.id = "mobInformation"
        mobInformation.appendChild(pre);
    }else{
        let pre = document.getElementById('mobInformation');
        pre.innerText = "Lv: "+Mob.level+"\nVida: "+Mob.hp
    }
    
}
function generateMob(){
    let atk = 0;
    let def = 0;
    const LIMIT = 10;
    while(atk+def != LIMIT){
        atk = d10();
        def = d10();
    };
    return [atk, def]
}
function d3(){
    return Math.floor(Math.random()*3+1);
}
function d5(){
    return Math.floor(Math.random()*5+1);
}
function d10(){
    return Math.floor(Math.random()*10+1);
}
function d20(){
    return Math.floor(Math.random()*20+1);
}
updateHud()
function updateHud(){
    hudPlayer();
    hudMob();
}
attackButton.addEventListener('click', ()=>{
    if(Mob.hp == 0) return;
    player.attack(Mob);
    Mob.attack(player);
    updateHud();
})