// (3) namespace object
const cityApp = {};



// (4) declaring global variables & caching selectors


// (5) form submit event listener (a method that prevents the default form behaviour & calls the error handling function when the user submits the form)
cityApp.formSubmitEvenListener = () => {

    // on form submit store the user's inputted values into variables
    $('form').on('submit', function (event) {
        event.preventDefault();
        
        // empty appended results
        cityApp.reset();

        // store the user's input values in variables
        const userCityOne = $('#city-one').val();
        const userCityTwo = $('#city-two').val();

        
        // a conditional that:
        // (a) alerts user if input is equal to an empty string
        if (userCityOne === '' || userCityTwo === '') {
            alert('Please ensure you enter a city name!');
        }
        // (b) alerts user if the inputs are equal to each other
        else if (userCityOne === userCityTwo) {
            alert('Please ensure you enter two different cities!');
        }
        
        cityApp.formSubmitErrorHandling(userCityOne, 0);
        cityApp.formSubmitErrorHandling(userCityTwo, 1);

    })
}


// (6) error handling (a method that ensures the user a) hasn't submitted an empty input field, b) has inputted two different cities, and c) the inputted city is available in the API)
cityApp.formSubmitErrorHandling = (userCity, index) => {

    // after the AJAX call, check to see if both cities are returned successfully (ie: ensure the cities are available in the API) 
    $.when(cityApp.getCityInfo(userCity))
            // if they both return successfully, then display the city information
            .then(function (item) {

                cityApp.displayCityInfo(item, index);

            })

            // if one or both of the cities are not returned successfully (ie: if user's inputted city is not available in the API), then alert the user & do not display any city information
            .fail(function (item) { 
                // console.log(item);

                // Alert the user 
                console.log(userCity);

                cityApp.reset();
                
            });

    // get images for each city
    $.when (cityApp.getCityImage(userCity, index))
            
        .then(function (cityObject) {

            cityApp.displayCityImage(cityObject, index, userCity);

        })
}

// (7) AJAX function (a method that accepts one parameter (users city), then calls the API which returns an object containing city scores)
cityApp.getCityInfo = function (cityName) {

    return $.ajax({
            url: `https://api.teleport.org/api/urban_areas/slug:${cityName}/scores/`,
            method: `GET`,
            dataType: `json`
        })
}

// AJAX function (a method that accepts one parameter (users city), then calls the API which returns an object containing city images)
cityApp.getCityImage = function (cityName) {

    return $.ajax({
        url: `https://api.teleport.org/api/urban_areas/slug:${cityName}/images/`,
        method: `GET`,
        dataType: `json`
    })
}



// (9) display (a method that accepts one parameter (user's city object) and displays the city name, image, scores, icons, and category labels on the user's screen)
cityApp.displayCityInfo = (cityObject, i) => {

    const cityScoresArray = cityObject.categories;
    const totalCityScore = cityObject.teleport_city_score;
   
    cityScoresArray.map((cityScore) => {
        // round the score values to 2 decimal places
        const scoreValueRaw = cityScore.score_out_of_10;
        const scoreValueFinal = scoreValueRaw.toFixed(2);

        // a conditional that appends scores for city 1 and city 2 in separate lists
        if (i === 0) {
            $('#total-score-city-one').text(`Total Score: ${totalCityScore}`);
            $('#results-list-city-one').append(`<li>${scoreValueFinal}</li>`); 
            $('#results-list-category-titles').append(`<li>${cityScore.name}</li>`);
        }
        else {
            $('#total-score-city-two').text(`Total Score: ${totalCityScore}`);
            $('#results-list-city-two').append(`<li>${scoreValueFinal}</li>`);
        } 
        // console.log('name of score:', cityScore.name);
        // console.log('score rating:', cityScore.score_out_of_10);
    });
    
    if (i === 0) {
        // append 'choose different cities' button
        const chooseDifferentCities = $('<button>').text('Choose Different Cities').addClass('different-cities-button');
        $('#choose-different-cities').append(chooseDifferentCities);
    }

    // add border to dynamic results
    $('#results-container').addClass('results-container-dynamic');
}

cityApp.displayCityImage = (cityObject, i, cityName) => {
    const cityImage = cityObject.photos[0].image.mobile;

    if (i === 0) {
        const cityOneImage = $('<img>').attr("src", `${cityImage}`).attr("alt", `A photo of ${cityName}`);
        $("#results-image-city-one-container").append(cityOneImage);
        $("#city-one-name").text(cityName);
        
    }
    else {
        const cityTwoImage = $('<img>').attr("src", `${cityImage}`).attr("alt", `A photo of ${cityName}`);
        $("#results-image-city-two-container").append(cityTwoImage);
        $("#city-two-name").text(cityName);
    }
}


// (10) scroll function (a method to automatically bring users to results)
cityApp.scrollToResults = () => {
    $('html').animate({
        scrollTop: $('#results').offset().top
    }, 1000);
}


// (11) choose different cities (a method that removes appended content, scrolls to the top of the page,  allows suers to search again)
cityApp.chooseDifferentCities = () => {

    // listen for when the user clicks the 'compare different cities' button, when clicked:
    $('#choose-different-cities').on('click', function () {

        // clear cities array and appended content
        cityApp.reset();

        // remove button from
        $('#choose-different-cities').empty();

        // scroll to top of page to allow users to input new values (cities)
            // call scroll function here
    });

}


// reset function
cityApp.reset = () => {
    // remove all appended content
    $('#results-list-category-titles').empty();
    $('#results-list-city-one').empty();
    $('#results-list-city-two').empty();
    $('#choose-different-cities').empty();
    $('#results-container').removeClass('results-container-dynamic');

    // empty the cities array
    citiesArray.length = 0;
    $('#total-score-city-one').empty();
    $('#total-score-city-two').empty();
    $("#results-image-city-one-container").empty();
    $("#results-image-city-two-container").empty();
    $("#city-one-name").empty();
    $("#city-two-name").empty();
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