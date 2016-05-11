'use strict'

var openWeatherApp = (function IIFE () {
  var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?appid=8f0c0b91ace6feefcf602fc745e039f7&units=metric'
  var $variables = {}
  var weatherData = {}

  function getData (latitude, longitude) {
    return $.getJSON(apiUrl + '&lat=' + latitude + '&lon=' + longitude)
  }

  function setWeatherData (data) {
    weatherData.region = data.name
    weatherData.country = data.sys.country
    weatherData.celsius = data.main.temp.toFixed(1)
    weatherData.fahrenheit = (weatherData.celsius * 9 / 5 + 32).toFixed(1)
    weatherData.description = data.weather[0].description
    weatherData.humidity = data.main.humidity
    weatherData.icon = data.weather[0].icon
  }

  function updateView () {
    $variables.location.text(weatherData.region + ', ' + weatherData.country)
    $variables.icon.attr('src', 'http://openweathermap.org/img/w/' + weatherData.icon + '.png')
    $variables.icon.attr('alt', weatherData.description)
    $variables.temperature.text(weatherData.celsius)
    $variables.description.text(weatherData.description)
    $variables.humidity.text('Humidity: ' + weatherData.humidity + '%')
    $variables.unit.text('°C')
  }

  function convertTemperature () {
    if ($variables.unit.text() === '°C') {
      $variables.temperature.text(weatherData.fahrenheit)
      $variables.unit.text('°F')
    } else {
      $variables.temperature.text(weatherData.celsius)
      $variables.unit.text('°C')
    }
  }

  function handleDocumentReady () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (location) {
        getData(location.coords.latitude, location.coords.longitude).then(function (data) {
          setWeatherData(data)
          updateView()
        })
      })
    }
  }

  function handleUnitClick () {
    convertTemperature()
  }

  function init (options) {
    $variables.location = $(options.location)
    $variables.temperature = $(options.temperature)
    $variables.unit = $(options.unit)
    $variables.description = $(options.description)
    $variables.humidity = $(options.humidity)
    $variables.icon = $(options.icon)

    $(document).bind('ready', handleDocumentReady)
    $variables.unit.bind('click', handleUnitClick)
  }

  return {
    init: init
  }
}())

$(document).ready(function () {
  openWeatherApp.init({
    location: '#location',
    temperature: '#temperature',
    description: '#description',
    humidity: '#humidity',
    icon: '#icon',
    unit: '#unit'
  })
})
