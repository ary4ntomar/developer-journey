let url="http://universities.hipolabs.com/search?country=india&name=";

let btn=document.querySelector('button');
btn.addEventListener('click',async function(){
    let Coll= await getColleges();
    show(Coll);
}
)

function show (Coll){
    ul.innerHTML = "";
    for(let col of Coll){
     let li=document.createElement('li');
     li.innerHTML=`<b>Name:</b> ${col.name} <br>
                   <b>Country:</b> ${col.country} <br>
                    <b>State:</b> ${col['state-province']||'N/A'} <br>
      <b>Link:</b> <a href='${col.web_pages[0]} 'target='_blank'style= text-decoration:none;> visit website  </a> <hr>`;
     ul.appendChild(li)
    }
}




let inp=document.querySelector('input');
 let ul=document.querySelector('ul');

async function getColleges(){
    try{
        let state= inp.value;
        let res= await axios.get(url+state);
        return res.data;
    }catch{
        console.log('error');
        return [];
    }
}