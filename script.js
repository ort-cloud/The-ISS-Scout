"use strict";

const geoAPI = "https://api.mapbox.com/geocoding/v5/mapbox.places";

const mpKey = `pk.eyJ1IjoiY2FybG9ydHkiLCJhIjoiY2p6MGpxNmNsMGNkYzNncWloeGtjdWc0MiJ9.44uitu32EXkSSvz3FWF0FA`;

const mbToken = `.json?cachebuster=1565810008146&autocomplete=false&fuzzyMatch=false&access_token=${mpKey}`;

let proxyUrl = "https://cors-anywhere.herokuapp.com/";

const iSSurl = "http://api.open-notify.org/iss-pass.json?";

function getLocation() {
  let passes = $("#num").val();
  fetch(`${geoAPI}/${userInput()}${mbToken}`)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    })
    .then(response => {
      const [lon, lat] = response.features[0].center;

      fetch(proxyUrl + `${iSSurl}lat=${lat}&lon=${lon}`)
        .then(res => {
          if (res.ok) {
            return res.json();
          }
        })
        .then(res => {
          console.log(res);
          displayResults(res);
        })
        .catch(errI => {
          console.log("Something wrong with ISS", errI);
        });
    })
    .catch(errM => {
      console.log("Something wrong with MapBox", errM);
      $('#pass-results').append(`<strong><span>Location not found. Try again.</span></strong>`)
    });
}

function displayResults(responseJson) {
  $("#pass-results").empty();
  responseJson.response.forEach(function(d) {
    let date = new Date(d["risetime"] * 1000);
    $("#pass-results").append("<br><span>" + date.toString() + "</span><br>");
  });
}

function userInput() {
  let userLocation = $("#address").val();
  return userLocation;
}

function clearResults() {
  $("#form").on("click", ".new-search", function(event) {
    event.preventDefault();
    $("#pass-results").empty();
    $(".value").val("");
    console.log('CLEAR!')
  });
}

function watchForm() {
  $("form").submit(event => {
    event.preventDefault();
    getLocation();
    clearResults();
  });
}

$(watchForm());
