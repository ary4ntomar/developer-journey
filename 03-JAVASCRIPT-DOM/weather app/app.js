let url='https://api.openweathermap.org/data/2.5/weather?appid=c93e3a09f261660eaac3abecb480347b&units=metric&q=';

let btn= document.querySelector('button');
btn.addEventListener('click',async()=>{
    console.log('button was clicked');


    let WeatherChanges= await weatherData();
    if(WeatherChanges){
        let temp=document.querySelector('.temp');
        let city=document.querySelector('.city');
        let wind=document.querySelector('.wind');
        let humid=document.querySelector('.humid');
        let weatherIcon=document.querySelector('.weatherIcon');
        temp.innerHTML=`${Math.floor(WeatherChanges.main.temp)}°C`;
        city.innerHTML=`${WeatherChanges.name}`;
        wind.innerHTML=`${WeatherChanges.wind.speed}km/hr<br>Wind Speed`;
        humid.innerHTML=`${WeatherChanges.main.humidity}%<br>humidity`;
        if(WeatherChanges.weather[0].main=='Clear'){weatherIcon.src="images/clear.png"}
         else if(WeatherChanges.weather[0].main=='Clouds'){weatherIcon.src="images/cloudy.png"}
          else if(WeatherChanges.weather[0].main=='Rain'){weatherIcon.src="images/rain.png"}
           else if(WeatherChanges.weather[0].main=='Drizzle'){weatherIcon.src="images/drizzle.png"}
            else if(WeatherChanges.weather[0].main=='Mist'){weatherIcon.src="images/mist.png"}
    } 
         
})


 let inp=document.querySelector('input');

async function weatherData() {
    try{
         let inp=document.querySelector('input');
        let inpValue=inp.value;
        let res= await axios.get(url+inpValue);
         console.log(res.data);
        return res.data;
    }catch{
        alert('Wrong input:Please recheck and try again');
        return'';
    }
}

