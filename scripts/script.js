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


// (5) form submit event listener (a method that, upon form submit, prevents the default form behaviour, stores the user's inputs, and calls the error handling function if the user has inputted two different cities)
cityApp.formSubmitEventListener = () => {
    // listen for the user to submit the form
    $('form').on('submit', function (event) {
        event.preventDefault();
        
        // clear any appended results
        cityApp.reset();

        // store the user's input values in variables & format them to match the APIs required input (make them lower case & replace spaces with a dash, ex: New york -> new-york)
        const userCityOne = $cityOneInput.val();
        const userCityTwo = $cityTwoInput.val();
        const correctUserInputOne = $.trim(userCityOne.replace(/\b \b/g, '-')).toLowerCase();
        const correctUserInputTwo = $.trim(userCityTwo.replace(/\b \b/g, '-')).toLowerCase();

        // alert user if the inputs are equal to each other, if they aren't then call API error handling function
        if (correctUserInputOne === correctUserInputTwo) {
            alert('Please ensure you enter two different cities!');
        }
        else {
            cityApp.getCityScores(correctUserInputOne, correctUserInputTwo);
        }
    });
}


// (6) AJAX city scores (a method that ensures the user's inputted city is available in the API & calls the display function if the API returns all city objects successfully)
cityApp.getCityScores = (userCityOne, userCityTwo) => {
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
                    cityApp.displayCityScores(cityObjectOne, cityObjectTwo);
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
    // AJAX call for city one image & name
    $.ajax({
        url: `https://api.teleport.org/api/urban_areas/slug:${cityNameOne}/images/`,
        method: `GET`,
        dataType: `json`
    })
        .then((cityImageObject) => {
            cityApp.displayCityImage(cityImageObject, 0, cityNameOne);
        })

    // AJAX call for city two image & name
    $.ajax({
        url: `https://api.teleport.org/api/urban_areas/slug:${cityNameTwo}/images/`,
        method: `GET`,
        dataType: `json`
    })
        .then((cityImageObject) => {
            cityApp.displayCityImage(cityImageObject, 1, cityNameTwo);
        })
}


// (8) display city scores (a method that displays the scores and category labels on the user's screen)
cityApp.displayCityScores = (cityObjectOne, cityObjectTwo) => {
    // extract all 17 categories in the scores list and save them into a new array
    const cityOneScoresArray = cityObjectOne.categories;
    const cityTwoScoresArray = cityObjectTwo.categories;

    // get city total scores and round them to one decimal place
    const cityOneScoreTotalRaw = cityObjectOne.teleport_city_score;
    const cityOneScoreTotalFinal = cityOneScoreTotalRaw.toFixed(1);
    const cityTwoScoreTotalRaw = cityObjectTwo.teleport_city_score;
    const cityTwoScoreTotalFinal = cityTwoScoreTotalRaw.toFixed(1);
    
    // display city total score values and category heading title both lists 
    $cityOneTotalScore.text(`Total Score: ${cityOneScoreTotalFinal} / 100`);
    $cityOneScoresHeading.text(`Score out of 10`);
    $cityTwoTotalScore.text(`Total Score: ${cityTwoScoreTotalFinal} / 100`);
    $cityTwoScoresHeading.text(`Score out of 10`);

    // setup a for loop to track of each city object and append the appropriate content to the right lists
    for (let i = 0; i <= 1; i++) {
    
        if (i === 0) {

            cityOneScoresArray.map((cityScore) => {

                // round all score values to 1 decimal place
                const scoreValueRaw = cityScore.score_out_of_10;
                const scoreValueFinal = scoreValueRaw.toFixed(1);

                $cityOneScores.append(`<li><span class="sr-only dynamic-category-titles">${cityScore.name} <br></span>${scoreValueFinal}</li>`);
                $scoreCategoryTitles.append(`<li>${cityScore.name}</li>`);

                // alter how results are printed based on screen width (at 480px, print category titles in the same list as the category scores)
                if ($(window).width() <= 480) {
                    $('.dynamic-category-titles').removeClass('sr-only');
                }
                else {
                    $('.dynamic-category-titles').addClass('sr-only');
                }
            })
        }

        if (i === 1) {

            cityTwoScoresArray.map((cityScore) => {

                // round all score values to 1 decimal place
                const scoreValueRaw = cityScore.score_out_of_10;
                const scoreValueFinal = scoreValueRaw.toFixed(1);

                $cityTwoScores.append(`<li><span class="sr-only dynamic-category-titles">${cityScore.name} <br></span>${scoreValueFinal}</li>`);

                // alter how results are printed based on screen width (at 480px, print category titles in the same list as the category scores)
                if ($(window).width() <= 480) {
                    $('.dynamic-category-titles').removeClass('sr-only');
                }
                else {
                    $('.dynamic-category-titles').addClass('sr-only');
                }
            })
        }
    }

    // add border & height to dynamic results
    $results.addClass('results-dynamic');
    $resultsContainer.addClass('results-container-dynamic');

    // append 'choose different cities' button & ensure user can click it
    const differentCitiesButton = $('<button>').text('Choose Different Cities').addClass('different-cities-button');
    $chooseDifferentCities.append(differentCitiesButton);
    cityApp.chooseDifferentCities();

    // call style scores function
    cityApp.styleScores(cityOneScoresArray, cityTwoScoresArray, cityOneScoreTotalFinal, cityTwoScoreTotalFinal);
}


// style scores (a method that compares the category scores for each city and dynamically changes the color to green (higher score), red (lower score), or purple (equal scores))
cityApp.styleScores = (cityOneScoresArray, cityTwoScoresArray, cityOneScoreTotalFinal, cityTwoScoreTotalFinal) => {
    // STYLE the total city score values
    if (cityOneScoreTotalFinal > cityTwoScoreTotalFinal) {
        $cityOneTotalScore.css({ background: 'linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)', color: 'white' });

        $cityTwoTotalScore.css({ background: 'linear-gradient(to left top, #ff0000, #f86800, #e79b00, #ccc600, #a8eb12)', color: 'white' });

        // $cityOneTotalScore.css({background: 'green', color: 'white'});
        // $cityTwoTotalScore.css({ background: 'red', color: 'white'});
    }
    else if (cityOneScoreTotalFinal < cityTwoScoreTotalFinal) {
        $cityOneTotalScore.css({ background: 'linear-gradient(to left top, #ff0000, #f86800, #e79b00, #ccc600, #a8eb12)', color: 'white' });

        $cityTwoTotalScore.css({ background: 'linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)', color: 'white' });

        // $cityOneTotalScore.css({ background: 'red', color: 'white'});
        // $cityTwoTotalScore.css({ background: 'green', color: 'white' });
    }
    else {
        $cityOneTotalScore.css({ background: 'purple', color: 'white' });
        $cityTwoTotalScore.css({ background: 'purple', color: 'white' });
    }

    // STYLE the individual scores from all 17 categories  
    for (let i = 0; i <= 16; i++) {

        if (cityOneScoresArray[i].score_out_of_10 > cityTwoScoresArray[i].score_out_of_10) {

            const $cityOneScoreList = $(`#results-list-city-one > li:nth-child(${i + 1})`);
            $cityOneScoreList.css({ color: 'green' });

            const $cityTwoScoreList = $(`#results-list-city-two > li:nth-child(${i + 1})`);
            $cityTwoScoreList.css({ color: 'red' });
        }

        else if (cityOneScoresArray[i].score_out_of_10 < cityTwoScoresArray[i].score_out_of_10) {

            const $cityOneScoreList = $(`#results-list-city-one > li:nth-child(${i + 1})`);
            $cityOneScoreList.css({ color: 'red' });

            const $cityTwoScoreList = $(`#results-list-city-two > li:nth-child(${i + 1})`);
            $cityTwoScoreList.css({ color: 'green' });
        }
        else {
            // give a neutral color of purple if both score values are the same!
            const $cityOneScoreList = $(`#results-list-city-one > li:nth-child(${i + 1})`);
            $cityOneScoreList.css({ color: 'purple' });

            const $cityTwoScoreList = $(`#results-list-city-two > li:nth-child(${i + 1})`);
            $cityTwoScoreList.css({ color: 'purple' });
        }
    }
}


// (9) resize results (a method that alters how results are printed based on screen width (at 480px, print category titles in the same list as the category scores))
cityApp.resizeResults = () => {
    $(window).on("resize", () => {
        if ($(window).width() <= 480) {
            $('.dynamic-category-titles').removeClass('sr-only');
        }
        else {
            $('.dynamic-category-titles').addClass('sr-only');
        }
    }); 
}


// (10) display city name and photo (a method that displays the city name and image on the user's screen)
cityApp.displayCityImage = (cityObject, i, cityName) => {
    const cityImage = cityObject.photos[0].image.mobile;

    // replace city names with hyphens with an empty space
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
    // run form submit event listener & resize results methods
    cityApp.formSubmitEventListener();
    cityApp.resizeResults();
}


// (1) document ready (a function that waits for the document to load)
$(function () {
    cityApp.init();
});