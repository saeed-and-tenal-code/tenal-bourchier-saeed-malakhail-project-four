// (3) namespace object
const cityApp = {};


// (4) cached selectors
const $results = $('#results');
const $resultsContainer = $('#results-container');
const $cityOneInput = $('#city-one');
const $cityTwoInput = $('#city-two');
const $cityOneName = $("#city-one-name");
const $cityTwoName = $("#city-two-name");
const $cityOneImageContainer = $("#results-image-city-one-container");
const $cityTwoImageContainer = $("#results-image-city-two-container");
const $cityOneTotalScore = $('#total-score-city-one');
const $cityTwoTotalScore = $('#total-score-city-two');
const $cityOneScoresHeading = $('#scores-heading-city-one');
const $cityTwoScoresHeading = $('#scores-heading-city-two');
const $cityOneScores = $('#results-list-city-one');
const $cityTwoScores = $('#results-list-city-two');
const $scoreCategoryTitles = $('#results-list-category-titles');
const $chooseDifferentCities = $('#choose-different-cities');


// (5) form submit event listener (a method that, upon form submit, prevents the default form behaviour, stores the user's inputs, and ensures the user a) hasn't submitted an empty input field, and b) has inputted two different cities)
cityApp.formSubmitEventListener = () => {

    // listen for the user to submit the form
    $('form').on('submit', function (event) {
        event.preventDefault();
        
        // clear any appended results
        cityApp.reset();

        // store the user's input values in variables
        const userCityOne = $cityOneInput.val();
        const userCityTwo = $cityTwoInput.val();

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


// (7) AJAX city image (a method that calls the API which returns an object containing the city image & name)
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


// (8) display city scores (a method that displays the scores, icons, and category labels on the user's screen)
cityApp.displayCityInfo = (cityObject, i) => {

    // add border & height to dynamic results
    $results.addClass('results-dynamic');
    $resultsContainer.addClass('results-container-dynamic');

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
            $cityOneTotalScore.text(`Total Score: ${scoreTotalFinal} / 100`);
            $cityOneScoresHeading.text(`Score out of 10`);
            $cityOneScores.append(`<li><span class="sr-only">score for ${cityScore.name}</span>${scoreValueFinal}</li>`);
            $scoreCategoryTitles.append(`<li>${cityScore.name}</li>`);
        }
        else {
            $cityTwoTotalScore.text(`Total Score: ${scoreTotalFinal} / 100`);
            $cityTwoScoresHeading.text(`Score out of 10`);
            $cityTwoScores.append(`<li><span class="sr-only">score for ${cityScore.name}</span>${scoreValueFinal}</li>`);

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
        const differentCitiesButton = $('<button>').text('Choose Different Cities').addClass('different-cities-button');
        $chooseDifferentCities.append(differentCitiesButton);
    }
    cityApp.chooseDifferentCities();

    // cityApp.highlightWinner(cityOneTotalScore, cityTwoTotalScore, cityOneScoresArray, cityTwoScoresArray);
}


// (9) alter how results are printed based on screen width (at 480px, print category titles in the same list as the category scores)
cityApp.resizeResults = () => {
    // REVIEW: i just moved this from the function above because it only worked on the initial printing of results and wouldn't change when the screen was resized after the fact... I will continue to play around with this after my appointment (after 3pm). Ill have to add/remove classes and call this fucntion in the above function somehow so the city scores are shown/hidden dynamically (might have to put inside an event listener: $(window).on("resize", resize); then call?)
    if ($(window).width() < 480) {
        $cityOneScores.append(`<li>${cityScore.name}<br>${scoreValueFinal}</li>`);
        $cityTwoScores.append(`<li>${cityScore.name}<br>${scoreValueFinal}</li>`);
    }
    else {
        $cityOneScores.append(`<li><span class="sr-only">score for ${cityScore.name}</span>${scoreValueFinal}</li>`);
        $cityTwoScores.append(`<li><span class="sr-only">score for ${cityScore.name}</span>${scoreValueFinal}</li>`);
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
        $cityOneImageContainer.append(cityOneImage);
        $cityOneName.text(correctedCityName);
        
    }
    else {
        const cityTwoImage = $('<img>').attr("src", `${cityImage}`).attr("alt", `A photo of ${correctedCityName}`).css({ margin: '0 0 15px 0' });
        $cityTwoImageContainer.append(cityTwoImage);
        $cityTwoName.text(correctedCityName);
    }
}


// (11) scroll function (a method to automatically bring users to results)
cityApp.scrollToResults = () => {
    $('html').animate({
        scrollTop: $results.offset().top
    }, 1000);
}


// (12) choose different cities (a method that removes appended content, scrolls to the top of the page, and allows users to search again)
cityApp.chooseDifferentCities = () => {
    // listen for when the user clicks the 'compare different cities' button
    $('#choose-different-cities').on('click', function () {
        // clear any appended content
        cityApp.reset();

        // empty both inputs & put focus back in first input field
        $cityOneInput.val('').focus();
        $cityTwoInput.val('');
    });
}


// (13) reset (a method that clears all appended content in the results section)
cityApp.reset = () => {
    // remove all appended content
    $results.removeClass('results-dynamic');
    $resultsContainer.removeClass('results-container-dynamic');
    $cityOneName.empty();
    $cityTwoName.empty();
    $scoreCategoryTitles.empty();
    $cityOneScores.empty();
    $cityTwoScores.empty();
    $cityOneTotalScore.empty();
    $cityTwoTotalScore.empty();
    $chooseDifferentCities.empty();
    $scoreCategoryTitles.empty();
    $cityOneScoresHeading.empty();
    $cityTwoScoresHeading.empty();
    $cityOneImageContainer.empty();
    $cityTwoImageContainer.empty();
}


// (2) initialization (a method that initializes the app)
cityApp.init = () => {
    // put focus inside of the first input field upon page load
    $cityOneInput.focus();
    // run form submit event listener
    cityApp.formSubmitEventListener();
}


// (1) document ready (a function that waits for the document to load)
$(function () {
    cityApp.init();
});