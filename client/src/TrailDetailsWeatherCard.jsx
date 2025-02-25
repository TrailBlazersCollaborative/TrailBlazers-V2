import React from "react";
import ReactWeather, { useOpenWeather } from "react-open-weather";

export default function TrailDetailsWeatherCard({ trail, lightMode }) {
  // sourced from https://www.npmjs.com/package/react-open-weather
  const { data, isLoading, errorMessage } = useOpenWeather({
    key: `${import.meta.env.VITE_OPENWEATHERAPIKEY}`,
    lat: `${trail.lat}`,
    lon: `${trail.lon}`,
    lang: "en",
    unit: "imperial", // values are (metric, standard, imperial)
  });

  const customStyles = {
    fontFamily: "Roboto, sans-serif",
    gradientStart: "rgba(255, 255, 255, 0.05)",
    gradientMid: "rgba(255, 255, 255, 0.05)",
    gradientEnd: "rgba(255, 255, 255, 0.05)",
    locationFontColor: "#FFF",
    todayTempFontColor: "#FFF",
    todayDateFontColor: "#B5DEF4",
    todayRangeFontColor: "#B5DEF4",
    todayDescFontColor: "#B5DEF4",
    todayInfoFontColor: "#B5DEF4",
    todayIconColor: "#B5DEF4",
    forecastBackgroundColor: "rgba(255, 255, 255, 0.05)",
    forecastSeparatorColor: "#DDD",
    forecastDateColor: "#FFF",
    forecastDescColor: "#FFF",
    forecastRangeColor: "#FFF",
    forecastIconColor: "#B5DEF4",
  };

  const customLightStyles = {
    // fontFamily: "Roboto, sans-serif",
    // gradientStart: "rgba(255, 255, 255, 0.05)",
    // gradientMid: "rgba(255, 255, 255, 0.05)",
    // gradientEnd: "rgba(255, 255, 255, 0.05)",
    // locationFontColor: "#FFF",
    // todayTempFontColor: "#FFF",
    todayDateFontColor: "#2c5601",
    todayRangeFontColor: "#2c5601",
    todayDescFontColor: "#2c5601",
    todayInfoFontColor: "#2c5601",
    todayIconColor: "#2c5601",
    // forecastBackgroundColor: "rgba(255, 255, 255, 0.05)",
    forecastSeparatorColor: "#2c5601",
    // forecastDateColor: "#FFF",
    // forecastDescColor: "#FFF",
    // forecastRangeColor: "#FFF",
    forecastIconColor: "#2c5601",
    background: "white",
    gradientStart: "#ffffff",
    gradientMid: "#ffffff",
    gradientEnd: "#ffffff",
    forecastBackgroundColor: "#ffffff",
    containerBoxShadow: "none",
    locationFontWeight: "700",
  };

  return (
    <div>
      {!lightMode ? (
        <ReactWeather
          theme={customStyles}
          isLoading={isLoading}
          errorMessage={errorMessage}
          data={data}
          lang="en"
          locationLabel={trail.city}
          unitsLabels={{ temperature: "F", windSpeed: "Km/h" }}
          showForecast
        />
      ) : (
        <ReactWeather
          theme={customLightStyles}
          isLoading={isLoading}
          errorMessage={errorMessage}
          data={data}
          lang="en"
          locationLabel={trail.city}
          unitsLabels={{ temperature: "F", windSpeed: "Km/h" }}
          showForecast
        />
      )}
    </div>
  );
}
