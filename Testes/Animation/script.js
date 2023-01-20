let dado = document.getElementById('dado');

function rolarDado(){
    let numeroAleatorio = Math.floor(Math.random()* 20)+1;
    let faces = document.querySelectorAll(".face");
    dado.classList.add('animated');
    setTimeout(function(){
        dado.classList.remove('animated');
        for(let i = 0; i < faces.length; i++){
            faces[i].style.display = 'none';
        }
        document.querySelector(".face" + numeroAleatorio).style.display = "block";
    },3000);
}
function gerarNum(x){
    for(let i = 0; i < x; i++){
        let y = document.createElement("p");
        y.id = i+1;
        y.innerText = i+1;
        y.classList.add('face')
        dado.appendChild(y);
    }
}
gerarNum(20);