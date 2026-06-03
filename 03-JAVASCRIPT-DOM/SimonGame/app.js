let gameSeq=[];
let userSeq=[];
let started=false;
let level=0;

let btns=['cell1','cell2','cell3','cell4'];

let h3=document.querySelector('h3');

document.addEventListener('keypress',function(){
    if(started==false){
    console.log('game started');    
    started=true;

    levelUp();
   }
});

function btnFlash(btn){
    btn.classList.add('flash');
    setTimeout(function(){
        btn.classList.remove('flash');
    },250)
}

function userFlash(btn){
    btn.classList.add('flash');
    setTimeout(function(){
        btn.classList.remove('flash');
    },250)
}

function levelUp(){
    userSeq=[];
   level++;
   h3.innerText=`Level ${level}`;
   let randomValue=Math.floor(Math.random()*3);
   let ranClr=btns[randomValue];
   let randBtn=document.querySelector(`.${ranClr}`)

   gameSeq.push(ranClr);

   btnFlash(randBtn);
}

function checkAns(){
    let idx= level-1;

  if(userSeq[idx] === gameSeq[idx]){
   if(userSeq.length==gameSeq.length){
    setTimeout(levelUp,1000);
   }
  }  else{
    h3.innerHTML=`Game over !! Your score was <b>${level}</b> <br> press any key to start`;
    document.querySelector('body').style.color="white";
    setTimeout(function(){
        document.querySelector('body').style.color="white";
    },150);
    reset();
  }
}

function btnPressed(){
    let btn = this;
   userFlash(btn);

    userColor=btn.getAttribute('id');
    userSeq.push(userColor);
    checkAns();
}

let allBtns =document.querySelectorAll(".btn");
for(btn of allBtns){
    btn.addEventListener("click",btnPressed)
}

function reset(){
   started=false;
   gameSeq=[];
   userSeq=[];
   level=0;
}


