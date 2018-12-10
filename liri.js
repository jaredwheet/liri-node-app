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

                console.log(artist, songName, songPreviewURL, album)
            })
            .catch(function (err) {
                console.log(err);
            })
    }
    else {
        spotify
            .search({ type: 'track', limit: '2', query: searchCriteria })
            .then(function (response) {
                // console.log(JSON.stringify(response, null, 2))
                var artist = response.tracks.items[0].album.artists[0].name;
                var songName = response.tracks.items[0].name;
                var songPreviewURL = response.tracks.items[0].preview_url;
                var album = response.tracks.items[0].album.name;

                console.log(artist, songName, songPreviewURL, album)
            })
            .catch(function (err) {
                console.log(err);
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
            var concertDate = moment(response.data[0].datetime).format('MMMM Do YYYY, h:mm:ss a');;
            console.log(venueName,venueCity, venueRegion, concertDate)
        });
}
// bandsInTownSearch()

function movieSearch(searchCriteria) {
    console.log(searchCriteria)
    if (searchCriteria === undefined) {
        axios
            .get("http://www.omdbapi.com/?t=Mr+Nobody&apikey=trilogy")
            .then(
                function (response) {
                    console.log(response);
                    // * Title of the movie.
                    var title = response.data.Title
                    // * Year the movie came out.
                    var releaseYear = response.data.Year;
                    // * IMDB Rating of the movie.
                    var imdbRating = response.data.Ratings[0].Value;
                    // * Rotten Tomatoes Rating of the movie.
                    var rottenTomatoesRating = response.data.Ratings[1].Value;
                    // * Country where the movie was produced.
                    var countryProduced = response.data.Country;
                    // * Language of the movie.
                    var language = response.data.Language;
                    // * Plot of the movie.
                    var plot = response.data.Plot;
                    // * Actors in the movie.
                    var actors = response.data.Actors;
                    console.log(title, releaseYear, imdbRating, rottenTomatoesRating, countryProduced, language, plot, actors)
                });
    }
    else {
        axios
            .get("http://www.omdbapi.com/?t=" + searchCriteria + "&y=&plot=short&apikey=trilogy")
            .then(
                function (response) {
                    console.log(response);
                    // * Title of the movie.
                    var title = response.data.Title
                    // * Year the movie came out.
                    var releaseYear = response.data.Year;
                    // * IMDB Rating of the movie.
                    var imdbRating = response.data.Ratings[0].Value;
                    // * Rotten Tomatoes Rating of the movie.
                    // var rottenTomatoesRating = response.data.Ratings[1].Value;
                    // * Country where the movie was produced.
                    var countryProduced = response.data.Country;
                    // * Language of the movie.
                    var language = response.data.Language;
                    // * Plot of the movie.
                    var plot = response.data.Plot;
                    // * Actors in the movie.
                    var actors = response.data.Actors;
                    console.log(title, releaseYear, imdbRating, countryProduced, language, plot, actors)
                }
            );
    }
}
// movieSearch()

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }
        // We will then print the contents of data
        console.log(data);

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        // We will then re-display the content as an array for later use.
        console.log(dataArr);
        var dataForSearch = dataArr[1];
        var formattedDataForSearch = dataForSearch.slice(2, -3)
        console.log(formattedDataForSearch)

        if (dataArr[0] === "concert-this"){
            bandsInTownSearch(formattedDataForSearch)
        }
        else if (dataArr[0]==="spotify-this-song"){
            spotifySearch(formattedDataForSearch)
        }
        else if (dataArr[0] === "movie-this"){
            movieSearch(formattedDataForSearch)
        }             
    });
}
function runProgram(){
    if (searchCommand === "concert-this"){
        bandsInTownSearch(searchCriteria)
    }
    else if (searchCommand ==="spotify-this-song"){
        spotifySearch(searchCriteria)
    }
    else if (searchCommand === "movie-this"){
        movieSearch(searchCriteria)
    } 
    else if (searchCommand === "do-what-it-says"){
        doWhatItSays()
    }
    else {
        console.log("Do not recognize your command, try again with concert-this, spotify-this-song, movie-this or do-what-it-says.  Please follow that with your search criteria")
    }
};

runProgram()