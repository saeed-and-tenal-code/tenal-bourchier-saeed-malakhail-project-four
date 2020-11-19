// (3) namespace object
const cityApp = {};



// (4) declaring global variables & caching selectors
const citiesArray = [];



// (5) form submit event listener (a method that prevents the default form behaviour & calls the error handling function when the user submits the form)
cityApp.formSubmitEvenListener = () => {

    // on form submit store the user's inputted values into variables
    $('form').on('submit', function (event) {
        event.preventDefault();

        cityApp.reset();
        // ensure cities array is empty & any appended results are cleared
        cityApp.chooseDifferentCities();

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
        // // (c) otherwise, calls the AJAX function (passing the above variables in as arguments)
        // else {
        //     cityApp.reset();
        //     citiesArray.push(cityApp.getCityInfo(userCityOne));
        //     citiesArray.push(cityApp.getCityInfo(userCityTwo));
        //     // console.log("citiesArray", citiesArray);
        // }

        cityApp.formSubmitErrorHandling(userCityOne, 0);
        cityApp.formSubmitErrorHandling(userCityTwo, 1);

    })
}



// (6) error handling (a method that ensures the user a) hasn't submitted an empty input field, b) has inputted two different cities, and c) the inputted city is available in the API)
cityApp.formSubmitErrorHandling = (userCity, index) => {



    // after the AJAX call, check to see if both cities are returned successfully (ie: ensure the cities are available in the API) 
    // for (let i = 0; i < citiesArray.length; i++) {

    $.when(cityApp.getCityInfo(userCity))
            // if they both return successfully, then display the city information
            .then(function (item) {

                // console.log(item);
                // console.log(item[0][0].categories);
                // console.log(item[1]['1']);
                // console.log(item);

                // for (let i = 0; i < item.length; i++) {
                    cityApp.displayCityInfo(item, index);
                // }


                
                
                // console.log('cities array 0 element', citiesArray);
                // if (citiesArray[0].statusText === 'OK' && citiesArray[1].statusText === 'OK') {
                    // cityApp.reset();
                    // const cityObject = item.map(city => {
                    //     return city[0];
                    // });
                    // console.log(cityObject);

                    // cityApp.displayCityInfo(cityObject[0],0);
                    // cityApp.displayCityInfo(cityObject[1],1);
                    // console.log(item);
                // }
            })

            // if one or both of the cities are not returned successfully (ie: if user's inputted city is not available in the API), then alert the user & do not display any city information
            .fail(function (item) { 
                // console.log(item);

                console.log(userCity);

                cityApp.reset();

                // if (item[0]['1'] !== 'error') {
                //     alert(`Sorry, the city: ${userCityOne} does not exist, Please Enter Again!`);
                // }
                // else if (item[1]['1'] !== 'error') {
                //     alert(`Sorry, the city: ${userCityTwo} does not exist, Please Enter Again!`);
                // }

                // if (item[0]['1'] === "error" && item[1]['1'] === "error") {
                //     alert(`Sorry, the city: ${userCityOne} & ${userCityTwo} do not exist, Please Enter Again!`);
                // }
                // else if (item[0]['1'] === "error") {
                //     alert(`Sorry, the city: ${userCityOne} does not exist, Please Enter Again!`);
                // }
                // else if (item[1]['1']) {
                //     alert(`Sorry, the city: ${userCityTwo} does not exist, Please Enter Again!`);
                // }

                // alert(item[0].responseJSON['message']);
                
                    // if (item.statusText === "Not Found"){
                    //     alert(`Sorry, the city: ${userCityOne} does not exist, Please Enter Again!`);
                    //     cityApp.reset();
                    // }
                    // else if (item[2] === "Not Found") {
                    //     alert(`Sorry, the city: ${userCityTwo} does not exist, Please Enter Again!`);
                    //     cityApp.reset();
                    // }
                
                // console.log(cityObject);
                
            });
    // }
}




// (7) AJAX function (a method that accepts one parameter (users city), then calls the API which returns an object containing city scores)
cityApp.getCityInfo = function (cityName) {

    return $.ajax({
            url: `https://api.teleport.org/api/urban_areas/slug:${cityName}/scores/`,
            method: `GET`,
            dataType: `json`
        })
}





// (8) total score (a method that adds up the individual category scores and calculates a 'final score' for both cities)
// cityApp.totalScores = () => {
//     // display final total scores on page

// }




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
        const chooseDifferentCities = $('<button>').text('Choose Different Cities');
        $('#choose-different-cities').html(chooseDifferentCities);
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
    $('#total-score-city-one').empty();
    $('#total-score-city-two').empty();

    // empty the cities array
    citiesArray.length = 0;
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