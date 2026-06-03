console.log("axios value:", axios);



const URL_="https://dog.ceo/api/breeds/image/random";

const img= document.createElement("img");
const btn=document.createElement("button");

document.body.appendChild(img);
document.body.appendChild(btn);

btn.innerText="load new image";

btn.addEventListener("click",()=>{
    dogBreeds();
})

const dogBreeds= async()=>{
     try{
         let res=await axios.get(URL_);
         console.log(res.data.message);
         img.src=res.data.message
         }

     catch(err)
         {
           console.log(err);
         }     
            
     }

dogBreeds();