let items = sessionStorage.getItem('items');
items = JSON.parse(items);
const swordSlimeButton = document.createElement('button');
let swordSlimeItens = document.createElement('p');
const divCrafting = document.createElement('div');
function loadingCraft(){
    swordSlimeButton.classList.add('buttonCrafting');
    swordSlimeButton.innerText = "Espada de slime";

    swordSlimeItens.innerText = " - 3 Slimes";
    swordSlimeItens.classList.add('textCrafting');
    swordSlimeItens.classList.add(validationSwordSlime() );
    if(validationSwordSlime(swordSlimeItens) != "incorrect")swordSlimeButton.onclick = swordSlime;

    divCrafting.classList.add("divCrafting");
    divCrafting.appendChild(swordSlimeButton);
    divCrafting.appendChild(swordSlimeItens);

    const main = document.getElementsByTagName('main')[0];
    main.appendChild(divCrafting);
}
function swordSlime(){
    sessionStorage.setItem('itemAttack',2);
    Object.keys(items).forEach(e=>{
        if(items[e][0] == "slime"){
            items[e][1] -= 3;
            if(items[e][1] <= 0) delete items[e];
        }
    });
    swordSlimeItens.classList.remove("correct");
    swordSlimeItens.classList.add(validationSwordSlime());
}
function validationSwordSlime(){
    let find = false;
    Object.keys(items).forEach(e=>{
        if(items[e][0] == "slime" && items[e][1] != 3){
            return find = true;
        }
        if(items[e] == "") return find = true;
    })
    if(items[0] === undefined) find = true;
    if(find) return "incorrect";
    return "correct";
}
function returnPage(){
    sessionStorage.setItem("items",JSON.stringify(items))
    window.location.href = '../home/index.htm';
}
loadingCraft();
document.getElementById('return').addEventListener('click',returnPage);