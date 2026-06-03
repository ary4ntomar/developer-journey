let rock=document.querySelector("#rock");
let paper=document.querySelector("#paper");
let scissor=document.querySelector("#scissor");
let start=document.querySelector("#start");

let myScore_=document.querySelector("#myscore");
let compScore_=document.querySelector("#compscore");

let myScore=0;
let compScore=0;


let gameChoices=['rock','paper','scissor'];

rock.addEventListener("click",()=>{
             
         let idx=Math.floor(Math.random()*3);
         let compChoice=gameChoices[idx];

         if(compChoice=='scissor'){
             start.style.backgroundColor="green";
             start.style.color="white";
             start.innerText="congrats!! you won"
             document.body.style.backgroundColor="green";
             myScore++;
             myScore_.innerText=myScore; }
            
         else if(compChoice=='rock'){
             start.style.backgroundColor="grey";
             start.style.color="white";
              start.innerText="Draww"
             document.body.style.backgroundColor="black"; }
        
         else{
             start.style.backgroundColor="red";
             start.style.color="white";
             start.innerText="You lost !! try again";
             document.body.style.backgroundColor="red";
             compScore++;
             compScore_.innerText=compScore;  }
})

paper.addEventListener("click",()=>{
           
    
         let idx=Math.floor(Math.random()*3);
         let compChoice=gameChoices[idx];
              
         if(compChoice=='rock'){
             start.style.backgroundColor="green";
             start.style.color="white";
             start.innerText="congrats!! you won"
             document.body.style.backgroundColor="green";
             myScore++;
             myScore_.innerText=myScore;}
            
         else if(compChoice=='paper'){
             start.style.backgroundColor="grey";
             start.style.color="white";
              start.innerText="Draww"
             document.body.style.backgroundColor="black"; }   
            
          else{
             start.style.backgroundColor="red";
             start.style.color="white";
             start.innerText="You lost !! try again"
             document.body.style.backgroundColor="red";
             compScore++;
             compScore_.innerText=compScore; }
})

scissor.addEventListener("click",()=>{
          
         let idx=Math.floor(Math.random()*3);
         let compChoice=gameChoices[idx];

         if(compChoice=='paper'){
             start.style.backgroundColor="green";
             start.style.color="white";
             start.innerText="congrats!! you won"
             document.body.style.backgroundColor="green";
             myScore++;
             myScore_.innerText=myScore;}
            
         else if(compChoice=='scissor'){
             start.style.backgroundColor="grey";
             start.style.color="white";
             start.innerText="Draww"
             document.body.style.backgroundColor="black"; } 
            
          else{
             start.style.backgroundColor="red";
             start.style.color="white";
             start.innerText="You lost !! try again"
             document.body.style.backgroundColor="red";
             compScore++;
            compScore_.innerText=compScore;
       }
})




