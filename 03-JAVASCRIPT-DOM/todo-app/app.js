 let inp=document.querySelector('input');
let btn=document.querySelector('button');

btn.addEventListener('click',()=>{
    console.log('btn clicked')
    todocontent();
});

inp.addEventListener('keydown',(e)=>{
    if(e.key=='Enter'){
        btn.click();
    }
})

function todocontent(){
     let ul=document.querySelector('.ul');
     let list=document.createElement('li');
     let checkbox=document.createElement('input');
     let button=document.createElement('button');
     let span=document.createElement('span'); 
     let img=document.createElement('img');

    
     img.src='cross.png';

     checkbox.type='checkbox';
     span.textContent=inp.value;

         if(inp.value!=''){
            checkbox.addEventListener('click',()=>{
             span.classList.toggle('done');
         }); 

         button.addEventListener('click',()=>{
            list.remove();
         })
         } else{
            return;

         }

           inp.value='';

     list.prepend(checkbox);
     list.appendChild(span);
     list.append(button);
     button.appendChild(img);
     ul.appendChild(list);

}
