require("dotenv").config();
var axios = require("axios");
var keys = require("./keys");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require("moment")
var fs = require("fs")

var searchCommand = process.argv[2];
var searchCriteria = process.argv[3];

function spotifySearch(searchCriteria) {
    if (searchCriteria === undefined) {
        spotify
            .search({ type: 'track', limit: '2', query: "The Sign Ace of Base" })
            .then(function (response) {
                // console.log(JSON.stringify(response, null, 2))
                var artist = response.tracks.items[0].album.artists[0].name;
                var songName = response.tracks.items[0].name;
                var songPreviewURL = response.tracks.items[0].preview_url;
                var album = response.tracks.items[0].album.name;
                console.log("--------------RESULTS--------------")
                console.log("No Song Provided - Default search results below.")
                console.log(`Artist: ${artist} \nSong Name: ${songName} \nSong Preview URL: ${songPreviewURL} \nAlbum: ${album}`)

            })
            .catch((err) => {
                console.log("You have encountered an error >>> Try another search!")
            })
    }
    else {
        spotify
            .search({ type: 'track', limit: '5', query: searchCriteria })
            .then(function (response) {
                // console.log(JSON.stringify(response, null, 2))
                var artist = response.tracks.items[0].album.artists[0].name;
                var songName = response.tracks.items[0].name;
                var songPreviewURL = response.tracks.items[0].preview_url;
                var album = response.tracks.items[0].album.name;
                console.log("--------------RESULTS--------------")
                console.log(`Artist: ${artist} \nSong Name: ${songName} \nSong Preview URL: ${songPreviewURL} \nAlbum: ${album}`)
            })
            .catch((err) => {
                console.log("You have encountered an error >>> Try another search!")
            })
    }
};
// spotifySearch()

function bandsInTownSearch(searchCriteria) {
    axios({
        method: 'get',
        url: "https://rest.bandsintown.com/artists/" + searchCriteria + "/events?app_id=codingbootcamp",
        // responseType:'stream'
    })
        .then(function (response) {
            var venueName = response.data[0].venue.name;
            var venueCity = response.data[0].venue.city;
            var venueRegion = response.data[0].venue.region;
            var concertDate = moment(response.data[0].datetime).format('MMMM Do YYYY, h:mm:ss a');
            console.log("--------------RESULTS--------------")
            console.log(`Venue Name: ${venueName} \nVenue City: ${venueCity} \nVenue State: ${venueRegion} \nConcert Date and Time: ${concertDate}`);
        }).catch((err) => {
            console.log("You have encountered an error >>> Try another search!")
        })
};

// bandsInTownSearch()

function movieSearch(searchCriteria) {
    if (searchCriteria === undefined) {
        axios
            .get("http://www.omdbapi.com/?t=Mr+Nobody&apikey=trilogy")
            .then(
                function (response) {
                    var title = response.data.Title
                    var releaseYear = response.data.Year;
                    var imdbRating = response.data.Ratings[0].Value;
                    var rottenTomatoesRating = response.data.Ratings[1].Value;
                    var countryProduced = response.data.Country;
                    var language = response.data.Language;
                    var plot = response.data.Plot;
                    var actors = response.data.Actors;
                    console.log("--------------RESULTS--------------")
                    console.log(`Movie Title: ${title} \nReleased:  ${releaseYear} \nIMDB Rating: ${imdbRating} \nRotten Tomatoes Rating: ${rottenTomatoesRating} \nCountry Produced: ${countryProduced} \nLanguage:  ${language} \nPlot: ${plot} \nActors: ${actors}`)
                }).catch((err) => {
                    console.log("You have encountered an error >>> Try another search!")
                });
    }
    else {
        axios
            .get("http://www.omdbapi.com/?t=" + searchCriteria + "&y=&plot=short&apikey=trilogy")
            .then(
                function (response) {
                    var title = response.data.Title
                    var releaseYear = response.data.Year;
                    var imdbRating = response.data.Ratings[0].Value;
                    var rottenTomatoesRating = response.data.Ratings[1].Value;
                    var countryProduced = response.data.Country;
                    var language = response.data.Language;
                    var plot = response.data.Plot;
                    var actors = response.data.Actors;
                    console.log("--------------RESULTS--------------")
                    console.log(`Movie Title: ${title} \nReleased:  ${releaseYear} \nIMDB Rating: ${imdbRating} \nRotten Tomatoes Rating: ${rottenTomatoesRating} \nCountry Produced: ${countryProduced} \nLanguage:  ${language} \nPlot: ${plot} \nActors: ${actors}`)
                }).catch((err) => {
                    console.log("You have encountered an error >>> Try another search!")
                })
    }
}
// movieSearch()

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");        
        var dataForSearch = dataArr[1];
        var formattedDataForSearch = dataForSearch.slice(2, -3)        
        if (dataArr[0] === "concert-this") {
            bandsInTownSearch(formattedDataForSearch)
        }
        else if (dataArr[0] === "spotify-this-song") {
            spotifySearch(formattedDataForSearch)
        }
        else if (dataArr[0] === "movie-this") {
            movieSearch(formattedDataForSearch)
        }
    });
}
function runProgram() {
    if (searchCommand === "concert-this") {
        bandsInTownSearch(searchCriteria)
    }
    else if (searchCommand === "spotify-this-song") {
        spotifySearch(searchCriteria)
    }
    else if (searchCommand === "movie-this") {
        movieSearch(searchCriteria)
    }
    else if (searchCommand === "do-what-it-says") {
        doWhatItSays()
    }
    else {
        console.log("Do not recognize your command, try again with concert-this, spotify-this-song, movie-this or do-what-it-says.  Please follow that with your search criteria")
    }
};

runProgram()