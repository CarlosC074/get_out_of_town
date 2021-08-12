var hotelList = document.querySelector('#hotel-card')
var fetchHotel = document.getElementById('hotelLocation')

//api fetch function
function getHotels(search) {
    fetch(`https://hotels4.p.rapidapi.com/locations/search?query=${search}&locale=en_US`, {
        'method': 'GET',
        'headers': {
            'x-rapidapi-key': 'bfd2b30cc8msh462c826fb7e70ffp1265c1jsn212cf292a1e9',
            'x-rapidapi-host': 'hotels4.p.rapidapi.com'
        }
    })
        .then(function (response) {
            console.log(response)
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            hotelList.innerHTML = ''
            for (var i = 0; i < data.suggestions.length; i++) {
                var item = data.suggestions[i]
                console.log(item.group)
                if (item.group === 'HOTEL_GROUP') {
                    item.entities.forEach(element => {              //repoList.appendChild(listItem);   
                        console.log(element)
                        var hotelEl = document.createElement('li');
                        hotelEl.classList = 'list-item flex-row justify-space-between align-center';

                        var titleEl = document.createElement('span');
                        titleEl.textContent = element.name;

                        hotelEl.appendChild(titleEl);

                        hotelList.appendChild(hotelEl)
                        //	L.marker([51.5, -0.09]).addTo(mymap).bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();
                        console.log('latitude', element.latitude)
                        console.log('longitude', element.longitude)
                    });
                }
            }
        });
}

//when for submitted, get value of search then pass to getHotels

//add eventlistener to fetchhotel.
fetchHotel.addEventListener('submit', function (e) {
    //prevent default behavior
    e.preventDefault()
    //get search value
    var searchInput = document.querySelector('.input').value
    //call getHotels with search input
    getHotels(searchInput)
    getWeather(searchInput)
})


var weather = document.querySelector('ul')
var description = document.querySelector('ul')
var wind = document.querySelector('ul')
var feels = document.querySelector('ul')
var fetchWeather = document.querySelector('#weather')
var search = document.querySelector('.input').innerHTML

console.log (fetchWeather)

function getWeather(search) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${search}&appid=31b6611bb5184f2c38241bc1d9103a1d`, {
       'method': 'GET',

        }
    )
        .then(function (response) {
            console.log(response)
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            console.log(data.main.temp)
            console.log(data.weather[0].description)
            console.log(data.main.feels_like)
            
            
            var weatherEl = document.querySelector('#tempDisplay');
            weatherEl.textContent = Math.round((parseInt(data.main.temp) - 273.15) * (9/5) + 32) + "F"
            // math.round to round to nearest integer. caluclation from kelvin to fahrenheit. 

            var descriptionEl = document.querySelector('#description')
            descriptionEl.textContent = data.weather[0].description

            var feelsEl = document.querySelector('#feelsLike')
            feelsEl.textContent = "Feels like " + Math.round((parseInt(data.main.feels_like) - 273.15) * (9/5) + 32) + "F"
        


            
        });
}


// fetchWeather.addEventListener('submit', function (e) {
//     //prevent default behavior
//     e.preventDefault()
//     console.log (search)
//     //get search value
//     var searchInput = document.querySelector('.input').value
//     //call getWeather with search input
//     getWeather(searchInput)
// }) 