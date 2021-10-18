//--------------------------------------------------------------GLOBAL DATE VARIABLE-------------------------------------------------------------------------

//Reformat the dates to fit into 
function join(t, a, s) {
    function format(m) {
       let f = new Intl.DateTimeFormat('en', m);
       return f.format(t);
    }
    return a.map(format).join(s);
 }

 //allows more days to be added to the current date
 Date.prototype.addDays = function (days) {
    let date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  }

  //current date
 let myDate = new Date;
  //next day
 let tomorrow = myDate.addDays(1);
 
 let reformat = [{year: 'numeric'}, {month: '2-digit'}, {day: '2-digit'}];
 let myDateFinal = join(myDate, reformat, '-');
 let tomorrowFinal = join(tomorrow, reformat, '-');
 console.log(tomorrowFinal);

//--------------------------------------------------------------HOTELS API-------------------------------------------------------------------------

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
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            const destinationID = data.suggestions[0].entities[0].destinationId;
            console.log(destinationID);
            getHotelSpecs(destinationID);
        });
}

//-------------------------------------------------------------HOTELS APP PART 2: FETCHING HOTEL SPECIFICS-------------------------------------------------------------------------

function getHotelSpecs(destinationID) {
    

    fetch(`https://hotels4.p.rapidapi.com/properties/list?destinationId=${destinationID}&pageNumber=1&pageSize=5&checkIn=${myDateFinal}&checkOut=${tomorrowFinal}&adults1=1&sortOrder=PRICE&locale=en_US&currency=USD`, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "hotels4.p.rapidapi.com",
		"x-rapidapi-key": "b5c1a38213msh414830d58078f5dp146006jsnfc09beefafa7"
	}
})
.then(response => {
	return response.json();
})
.then(function (data)  {
    console.log(data);

    const body = data.data.body.searchResults.results;
    
    //const hotelName = body[i].name;
    //const hotelAddress = body[i].address.streetAddress;
    //const hotelImg = body[i].optimizedThumbUrls.srpDesktop;
    const hotelSection = document.querySelector("#hotelCard");

    hotelSection.innerHTML = body.map(result => 
        ` <div class="tile is-parent">
        <article class="tile is-child">
            <p class="title hotelName">${result.name}</p>
            <p class="content">${result.address.streetAddress}</p>
        </article>
        <div class="tile is-child hotelPic">
            <img src=
            ${result.optimizedThumbUrls.srpDesktop}
            alt = "${result.name}">
        </div>
    </div>`
    )
    
    const hotels = document.getElementsByClassName("hotelName");
    console.log(hotels)
    //When generating event listeners for the name tags, the data has to be parsed using the proper
    //array index on the body array. To match indexes, objects are made with an index, and the element.
    const hotelsAndIndex = [];
    
    //the map function refuses to apply here, so a normal for loop is used.
    for(var i =0; i < hotels.length; i++) {
        hotelsAndIndex[i] = {
            index: i,
            element: hotels[i],
        }
    }
    
    console.log(hotelsAndIndex[0].element);
    for(var i=0; i < hotelsAndIndex.length; i++) {
        const hotel = hotelsAndIndex[i].element;
        const index = hotelsAndIndex[i].index;

        hotel.addEventListener('click', function() {
            const hotelName = body[index].name;
            const landmarks = body[index].landmarks;
            const landmarkTab = document.querySelector("#landmarks")

                landmarkTab.innerHTML = 
                     `
                    <article>
                            <p class="title">Landmarks near ${hotelName}</p>
                            <br>
                            <ul id= "landmarkList">
    
                            </ul>
                    </article>
                    `

            for (var i =0; i < landmarks.length; i++) {
                const landmark = landmarks[i].label;
                const distance = landmarks[i].distance;
                let landmarkList = document.querySelector("#landmarkList");

                const landmarkListNode = document.createElement('li');
                var textNode = document.createTextNode(`${landmark}: ${distance}`);
                landmarkListNode.appendChild(textNode);
                landmarkListNode.classList.add("landmark");

                landmarkList.appendChild(landmarkListNode);

            }

        })
    }

})

    .catch(function(err) {
        let hotelCard = document.querySelector("#hotelCard");
        hotelCard.innerHTML = '<p class="loadingText title">It seems like the search did not got well, try something else.</p>'
    })

}


//--------------------------------------------------------------ADD EVENT LISTENER TO BUTTON-------------------------------------------------------------------------


//add eventlistener to fetchhotel.
fetchHotel.addEventListener('submit', function (e) {
    //prevent default behavior
    e.preventDefault()
    //As soon as the button is clicked, text shows up on the hotels tab to indicate to the user that hotels are being found, This text will dissappear and be replaced with the complete results
    const hotelCard = document.querySelector("#hotelCard");
    hotelCard.innerHTML = '<p class="loadingText title">The nearest hotels will appear shortly</p>'
    //get search value
    var searchPut = document.querySelector('.input').value
    //captializes the search input as savedCity to display on the dash
    const namedCity =  searchPut.charAt(0).toUpperCase() + searchPut.slice(1);
    const cityTitle = document.querySelector(".city-name");
    cityTitle.innerHTML = namedCity;
    console.log(namedCity);
    //search value is modified to fit with HTTP paradigms: In searches, spaces are replaced with %20 since spaces are not allowed in URLs.
    var searchInput = searchPut.replace(/ /g, "%20");
    //call getHotels with search input
    getHotels(searchInput)
    getWeather(searchInput)
})


//--------------------------------------------------------------WEATHER APP-------------------------------------------------------------------------
//Weather api: functional
//TODO: modify elements being appended. 
var weather = document.querySelector('ul')
var description = document.querySelector('ul')
var wind = document.querySelector('ul')
var feels = document.querySelector('ul')
var fetchWeather = document.querySelector('#weather')
var search = document.querySelector('.input').innerHTML

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


