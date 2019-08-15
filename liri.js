//requirements and dependants
require("dotenv").config();
var keys = require('./keys.js');
var axios = require("axios");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var fs = require("fs");

//spotify npm
var spotify = new Spotify(keys.spotify);

//default movie
var defaultMovie = "Mr. Nobody";

// sets the action and the value to the variables
var action = process.argv[2];
var value = process.argv[3];

//switch to perform different actions
//sections of the code is a case
//break to break out of the switch block

switch (action) {
    case "concert-this":
        concertThis(value)
        break;

    case "spotify-this-song":
        spotifySongs(value)
        break;

    case "movie-this":
        if (value == "") {
            value = defaultMovie;
        }

        movieThis(value)
        break;
    case "do-what-it-says":

        doWhatItSays()
        break;
    default:
        break;

}

//function to allow user to search concert-this
function concertThis(artist) {
    axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp")
        .then(function (response) {
            console.log("Name of the venue:", response.data[0].venue.name);
            console.log("Venue location:", response.data[0].venue.city);
            var movieDate = moment(response.data[0].datetime).format('MM/DD/YYYY');
            console.log("Date of the Event:", movieDate);
        })
        .catch(function (error) {
            console.log(error);
        });
}


//function to allow user to search spotify-songs
function spotifySongs(songs) {
    if (songs === "") {
        songs = "I Saw the Sign";
    }

    spotify.search({ type: 'track', query: songs }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Artists: ", data.tracks.items[0].album.artists[0].name)
        console.log("Preview Link: ", data.tracks.items[0].preview_url)
        console.log("Album Name: ", data.tracks.items[0].album.name)
    });
}


////function to allow user to search movie-this
function movieThis(movieName) {
    axios.get("http://www.omdbapi.com/?apikey=42518777&t=" + movieName)
        .then(function (data) {

            var results = `
      Title of the movie: ${data.data.Title}
      Year the movie came out: ${data.data.Year}
      IMDB Rating of the movie: ${data.data.Rated}
      Rotten Tomatoes Rating of the movie: ${data.data.Ratings[1].Value}
      Country where the movie was produced: ${data.data.Country}
      Language of the movie: ${data.data.Language}
      Plot of the movie: ${data.data.Plot}
      Actors in the movie: ${data.data.Actors}`;
            console.log(results)

        })
        .catch(function (error) {
            console.log(error);
        });

    if (movieName === "Mr. Nobody") {
        console.log("-----------------------");
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
    };

}


//function to allow user to search do-what-it-says
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        data = data.split(",");
       
       
        var action = data[0]
        var value = data[1]
        switch (action) {


            case "concert-this":
                concertThis(value)
                break;

            case "spotify-this-song":
                spotifySongs(value)
                break;

            case "movie-this":
                movieThis(value)
                break;

            default:
                break;
        }

    });

}
        