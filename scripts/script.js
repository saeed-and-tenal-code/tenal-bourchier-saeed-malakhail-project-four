// (3) namespace object
const cityApp = {};



// (4) declaring global variables & caching selectors



// (5) form submit event listener (a method that, upon form submit, prevents the default form behaviour, stores the user's inputs, and ensures the user a) hasn't submitted an empty input field, and b) has inputted two different cities)
cityApp.formSubmitEventListener = () => {

    // listen for the user to submit the form
    $('form').on('submit', function (event) {
        event.preventDefault();
        
        // clear any appended results
        cityApp.reset();

        // store the user's input values in variables
        const userCityOne = $('#city-one').val();
        const userCityTwo = $('#city-two').val();

        // format the input values to match the APIs required input (ensure inputs are lower case & that spaces are replaced with a dash, ex: New york -> new-york)
        const correctUserInputOne = $.trim(userCityOne.replace(/\b \b/g, '-')).toLowerCase();
        const correctUserInputTwo = $.trim(userCityTwo.replace(/\b \b/g, '-')).toLowerCase();

        // (a) alert user if input is equal to an empty string
        if (correctUserInputOne === '' || correctUserInputTwo === '') {
            alert('Please ensure you enter a city name!');
        }
        // (b) alert user if the inputs are equal to each other
        else if (correctUserInputOne === correctUserInputTwo) {
            alert('Please ensure you enter two different cities!');
        }

        // call API error handling function
        cityApp.apiErrorHandling(correctUserInputOne, correctUserInputTwo);
        // cityApp.apiErrorHandling(correctUserInputTwo, 1);
    });
}



// (6) API error handling (a method that ensures the user's inputted city is available in the API) & AJAX city scores (a method that calls the API which returns an object containing city scores)
cityApp.apiErrorHandling = (userCityOne, userCityTwo) => {

    // AJAX call for city one
    $.ajax({
        url: `https://api.teleport.org/api/urban_areas/slug:${userCityOne}/scores/`,
        method: `GET`,
        dataType: `json`
    })

        // (1a) if call for first city is successful, then AJAX call for user's second city
        .then(function (cityObjectOne) {

            $.ajax({
                url: `https://api.teleport.org/api/urban_areas/slug:${userCityTwo}/scores/`,
                method: `GET`,
                dataType: `json`
            })

                // (2a) if call for second city is successful, then AJAX call for both city's images, display city info and bring user to results
                .then(function (cityObjectTwo) {

                    cityApp.getCityImage(userCityOne, userCityTwo);

                    cityApp.displayCityInfo(cityObjectOne, 0);
                    cityApp.displayCityInfo(cityObjectTwo, 1);

                    cityApp.scrollToResults();
                })

                // (2b) if call for second city is unsuccessful, then alert the user
                .fail(function () {
                    alert(`Sorry, looks like ${userCityTwo} isn't in our database! Please try another search.`);
                });
        })

        // (1b) if call for first city is unsuccessful, then alert the user
        .fail(function () {
            alert(`Sorry, looks like ${userCityOne} isn't in our database! Please try another search.`);
        });
}




// (8) AJAX city image (a method that calls the API which returns an object containing the city image & name)

cityApp.getCityImage = function (cityNameOne, cityNameTwo) {
    // AJAX call for city one image
    $.ajax({
        url: `https://api.teleport.org/api/urban_areas/slug:${cityNameOne}/images/`,
        method: `GET`,
        dataType: `json`
    })
        .then((cityImageObject) => {
            cityApp.displayCityImage(cityImageObject, 0, cityNameOne);
        })

    // AJAX call for city two image
    $.ajax({
        url: `https://api.teleport.org/api/urban_areas/slug:${cityNameTwo}/images/`,
        method: `GET`,
        dataType: `json`
    })
        .then((cityImageObject) => {
            cityApp.displayCityImage(cityImageObject, 1, cityNameTwo);
        })
}



// (9) display city scores (a method that displays the scores, icons, and category labels on the user's screen)
cityApp.displayCityInfo = (cityObject, i) => {

    // add border & height to dynamic results
    $('#results').addClass('results-dynamic');
    $('#results-container').addClass('results-container-dynamic');

    const cityScoresArray = cityObject.categories;
    // let cityOneTotalScore = 0;
    // let cityTwoTotalScore = 0;
    // let cityOneScoresArray = [];
    // let cityTwoScoresArray = [];

    cityScoresArray.map((cityScore) => {

        // round all score values to 1 decimal place
        const scoreValueRaw = cityScore.score_out_of_10;
        const scoreValueFinal = scoreValueRaw.toFixed(1);
        const scoreTotalRaw = cityObject.teleport_city_score;
        const scoreTotalFinal = scoreTotalRaw.toFixed(1);

        // a conditional that appends scores for city 1 and city 2 in separate lists
        if (i === 0) {
            $('#total-score-city-one').text(`Total Score: ${scoreTotalFinal} / 100`);
            $('#scores-heading-city-one').text(`Score out of 10`);
            $('#results-list-city-one').append(`<li><span class="sr-only">score for ${cityScore.name}</span>${scoreValueFinal}</li>`);
            $('#results-list-category-titles').append(`<li>${cityScore.name}</li>`);
        }
        else {
            $('#scores-heading-city-two').text(`Score out of 10`);
            $('#total-score-city-two').text(`Total Score: ${scoreTotalFinal} / 100`);
            $('#results-list-city-two').append(`<li><span class="sr-only">score for ${cityScore.name}</span>${scoreValueFinal}</li>`);

            // highlight the winner city function
            // cityTwoTotalScore = scoreTotalFinal;
            // cityTwoScoresArray = cityScoresArray;
        } 

        // console.log('name of score:', cityScore.name);
        // console.log('score rating:', cityScore.score_out_of_10);
    });

    if (i === 0) {
        // highlight the winner city function
        // cityOneTotalScore = scoreTotalFinal;
        // cityOneScoresArray = cityScoresArray;
    }


    // append 'choose different cities' button & ensure user can click it
    if (i === 0) {
        const chooseDifferentCities = $('<button>').text('Choose Different Cities').addClass('different-cities-button');
        $('#choose-different-cities').append(chooseDifferentCities);
    }
    cityApp.chooseDifferentCities();

    // cityApp.highlightWinner(cityOneTotalScore, cityTwoTotalScore, cityOneScoresArray, cityTwoScoresArray);
    
}



// alter how results are printed based on screen width (at 480px, print category titles in the same list as the category scores)
cityApp.resizeResults = () => {
    // REVIEW: i just moved this from the function above because it only worked on the initial printing of results and wouldn't change when the screen was resized after the fact... I will continue to play around with this after my appointment (after 3pm). Ill have to add/remove classes and call this fucntion in the above function somehow so the city scores are shown/hidden dynamically (might have to put inside an event listener: $(window).on("resize", resize); then call?)
    
    if ($(window).width() < 480) {
        $('#results-list-city-one').append(`<li>${cityScore.name}<br>${scoreValueFinal}</li>`);
        $('#results-list-city-two').append(`<li>${cityScore.name}<br>${scoreValueFinal}</li>`);
    }
    else {
        $('#results-list-city-one').append(`<li><span class="sr-only">score for ${cityScore.name}</span>${scoreValueFinal}</li>`);
        $('#results-list-city-two').append(`<li><span class="sr-only">score for ${cityScore.name}</span>${scoreValueFinal}</li>`);
    }
}



// cityApp.highlightWinner = (cityOneTotalScore, cityTwoTotalScore, cityOneScoresArray, cityTwoScoresArray) => {

//     console.log('city one:', cityOneTotalScore);
//     console.log(cityTwoTotalScore);

//     if (cityOneTotalScore > cityTwoTotalScore) {
//         $('#total-score-city-one').css({color: 'green'});
//         $('#total-score-city-two').css({color: 'red' });
//     }
//     else if (cityOneTotalScore < cityTwoTotalScore) {
//         $('#total-score-city-one').css({ color: 'red' });
//         $('#total-score-city-two').css({ color: 'green' });
//     }
//     else {
//         $('#total-score-city-one').css({ color: 'yellow' });
//         $('#total-score-city-two').css({ color: 'yellow' });
//     }

//     for (let i = 0; i < cityOneScoresArray.length; i++) {
        
//         if (cityOneScoresArray[i] > cityTwoScoresArray[i]) {

//         }
//         else if (cityOneScoresArray[i] < cityTwoScoresArray[i]) {

//         }
//         else {

//         }
        
//     }

// }



// (10) display city name and photo (a method that displays the city name and image on the user's screen
cityApp.displayCityImage = (cityObject, i, cityName) => {
    const cityImage = cityObject.photos[0].image.mobile;

    // replaced city names with hyphens with an empty space
    const correctedCityName = $.trim(cityName.replace(/-/g, ' '));

    // a conditional that appends the name & image for city 1 and city 2 in separate divs
    if (i === 0) {
        const cityOneImage = $('<img>').attr("src", `${cityImage}`).attr("alt", `A photo of ${correctedCityName}`).css({ margin: '0 0 15px 0' });
        $("#results-image-city-one-container").append(cityOneImage);
        $("#city-one-name").text(correctedCityName);
        
    }
    else {
        const cityTwoImage = $('<img>').attr("src", `${cityImage}`).attr("alt", `A photo of ${correctedCityName}`).css({ margin: '0 0 15px 0' });
        $("#results-image-city-two-container").append(cityTwoImage);
        $("#city-two-name").text(correctedCityName);
    }

}



// (11) scroll function (a method to automatically bring users to results)
cityApp.scrollToResults = () => {
    $('html').animate({
        scrollTop: $('#results').offset().top
    }, 1000);
}



// (12) choose different cities (a method that removes appended content, scrolls to the top of the page, and allows users to search again)
cityApp.chooseDifferentCities = () => {

    // listen for when the user clicks the 'compare different cities' button
    $('#choose-different-cities').on('click', function () {

        console.log('CLICK!');

        // clear any appended content
        cityApp.reset();

        // empty both inputs & put focus back in first input field
        $('#city-one').val('').focus();
        $('#city-two').val('');

        // remove button
        // $('#choose-different-cities').empty();

    });
}



// (13) reset (a method that clears all appended content in the results section)
cityApp.reset = () => {
    // remove all appended content
    $('#results').removeClass('results-dynamic');
    $('#results-container').removeClass('results-container-dynamic');
    $("#city-one-name").empty();
    $("#city-two-name").empty();
    $('#results-list-category-titles').empty();
    $('#results-list-city-one').empty();
    $('#results-list-city-two').empty();
    $('#total-score-city-one').empty();
    $('#total-score-city-two').empty();
    $('#choose-different-cities').empty();
    $('#category-titles').empty();
    $('#scores-heading-city-one').empty();
    $('#scores-heading-city-two').empty();
    $("#results-image-city-one-container").empty();
    $("#results-image-city-two-container").empty();

    // empty both inputs & put focus back in first input field
    // $('#city-one').focus();
}



// (2) initialization (a method that initializes the app)
cityApp.init = () => {

    // put focus inside of the first input field upon page load
    $('#city-one').focus();

    cityApp.formSubmitEventListener();
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