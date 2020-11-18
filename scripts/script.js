// (3) namespace object
const cityApp = {};



// (4) form submit event listener (a method that prevents the default form behaviour & calls the error handling function when the user submits the form)
cityApp.formSubmitEvenListener = () => {

    $('form').on('submit', function (event) {
        event.preventDefault();

        cityApp.formSubmitErrorHandling();
    });

}



// (5) error handling (a method that ensures the user hasn't submitted an empty input field and that the user inputted two different cities)
cityApp.formSubmitErrorHandling = () => {
    // store the user's input values in variables
    const userCityOne = $('#city-one').val();
    const userCityTwo = $('#city-two').val();

    // (a) alert user if input is equal to an empty string
    // (b) alert user if the inputs are equal to each other
    // (c) if a & b are false, then call the AJAX function twice (passing the above variables as arguments)
    if (userCityOne === '' || userCityTwo === '') {
        alert('Please ensure you enter a city name!');
        //REVIEW: THIS IS FIRING UPON PAGE LOAD!!!!!!
    }
    else if (userCityOne === userCityTwo) {
        alert('Please ensure you enter two different cities!');
    }
    else {
        cityApp.getCityInfo(userCityOne);
        cityApp.getCityInfo(userCityTwo);
        // cityApp.getCityPromise(userCityOne);
        // cityApp.getCityPromise(userCityTwo);
    }
}



// (6) AJAX function (a method that accepts one parameter (users city), then calls the API which returns an object containing city scores)
cityApp.getCityInfo = (cityName) => {

    $.ajax({
        url: `https://api.teleport.org/api/urban_areas/slug:${cityName}/scores/`,
        method: `GET`,
        dataType: `json`
    })
    
    // call display function within .then()
        .then((result) => {
            console.log('your ajax request worked:', result);
            cityApp.displayCityInfo(result);
        });
}



// PROMISE/ERROR HANDLING FOR CITY
cityApp.checkForCity = new Promise( (callAjax, alert) => {
    if (parameterHere) {
        cityApp.getCityInfo();
        // how to pass parameters in here?
    } else {
        alert(`Sorry, looks like this city isn't in our database yet!`);
        // how does the user know WHICH city isn't searchable?
    }
});



// AJAX PROMISE function
// cityApp.getCityPromise = (userCity) => {
//     const citiesArray = [];

//     for (let n = 1; n <= 2; n++) {
//         citiesArray.push(cityApp.getCityInfo(userCity));
//     }

//     $.when(...citiesArray)
//         .then((...successfullyReturnedCity) => {
//             console.log(successfullyReturnedCity)
//         })
// }



// (7) api error handling (a method that ensures the user's inputted city is available in the API)
cityApp.apiErrorHandling = () => {
    // city must be a valid city (.catch() / .fail())
    // if value (city) is invalid, THEN alert the user
}



// (8) total score (a method that adds up the individual category scores and calculates a 'final score' for both cities)
cityApp.totalScores = () => {
    // display final total scores on page
}



// (9) display (a method that accepts one parameter (user's city object) and displays the city name, image, scores, icons, and category labels on the user's screen)
cityApp.displayCityInfo = (cityObject) => {

    const cityScoresArray = cityObject.categories;

    cityScoresArray.map((cityScore) => {
        const scoreValueRaw = cityScore.score_out_of_10;
        const scoreValueFinal = scoreValueRaw.toFixed(2);

        $('.results-list-city-one').append(`<li>${cityScore.name}: ${scoreValueFinal}</li>`);
        $('.results-list-city-two').append(`<li>${cityScore.name}: ${scoreValueFinal}</li>`);

        console.log('name of score:', cityScore.name);
        console.log('score rating:', cityScore.score_out_of_10);
    });

}



// (10) scroll function
cityApp.scrollToResults = () => {
    // a method to automatically bring users to results
}



// (11) reset function
cityApp.searchAgain = () => {
    // listen for when the user clicks the 'search again' button, when clicked:
        // (a) remove all appended information
        // (b) scroll to top of page to allow users to input new values (cities)
}



// (2) initialization (a method that initializes the app)
cityApp.init = () => {
    cityApp.formSubmitEvenListener();
}



// (1) document ready (a function that waits for the document to load)
$(function () {
    cityApp.init();
});








// MVP GOALS
    // (1) Landing page to welcome the user to the site & explain what the user can expect from it & how to use it
    // (2) Allow user to input 2 different city names
    // (3) Display between 10 - 15 categories, each with a score out of 10, to allow the user to compare the two cities
    // (4) Display an icon with each category (ex: a house for 'rental')
    // (5) add up & display the 'total score' for each city
    // (6) include a 'search again' button to remove appended information & allow the user to search for new cities

// STRETCH GOALS
    // (1) have the icons transition to green or red depending on the score of city 1 vs city 2
    // (2) give the user an option to 'save' one of the cities and enter a second new city to compare it to
    // (3) allow users to compare up to 3 cities (minimum of 2 cities, maximum of 3 cities)
    // (4) allow the user to assign different 'importance levels' to categories of their own choice