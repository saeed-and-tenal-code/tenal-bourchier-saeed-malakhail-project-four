
// namespace object
const cityApp = {};

// AJAX function 
cityApp.getCityInfo = (cityName) => {
// a method that accepts one argument (users city), then calls the API and API returns object containing city scores
// call display function within .then()
    $.ajax({
        url: `https://api.teleport.org/api/urban_areas/slug:${cityName}/scores/`,
        method: `GET`,
        dataType: `json`
    })
        .then((result) => {
            console.log('your ajax request worked:', result);
        });
}


// (7) error handling 2.0
cityApp.apiErrorHandling = () => {
    // city must be a valid city (.catch() / .fail())
    // if value (city) is invalid, THEN alert the user
}


// (4) event listener function
cityApp.formSubmitEvenListener = () => {
    // on form submit store the user's inputted values into variables
    $('form').on('submit', function (event) {
        event.preventDefault();

        cityApp.formSubmitErrorHandling();
    }) 
}


// (5) error handling function
cityApp.formSubmitErrorHandling = () => {
    // ensure fields are filled out correctly: 
    // (a) input cannot be equal to an empty string
    // (c) cities can not be equal to each other
    // IF only one value (city) is provided by user OR the values are equal to each other
    // ELSE call the AJAX function (inputting the variables with users values stored within them)
    // call scroll function
    const userCityOne = $('#city-one').val();
    const userCityTwo = $('#city-two').val();
    if (userCityOne === '' || userCityTwo === '') {
        alert('Please ensure to enter a city name!');
    }
    else if (userCityOne === userCityTwo) {
        alert('Please ensure to enter two different cities!');
    } 
    else {
        cityApp.getCityInfo(userCityOne);
        cityApp.getCityInfo(userCityTwo);
    }
}
console.log(cityApp.formSubmitErrorHandling());

// (8) total score function
cityApp.totalScores = () => {
    // a method that adds up the individual category scores and calculates a 'final score' for both cities
    // display final total scores on page
}

// (9) display function 
cityApp.displayCityInfo = () => {
    // a method that accepts one argument (users city object) and displays information on the users screen
    // data to be displayed includes the city name, city image, and city scores (between 10 - 15) with associated icons, and score/category label
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



// (2) init function

cityApp.init = () => {
    cityApp.formSubmitEvenListener();
}

// (1) document ready function
$(function () {
    cityApp.init();
});