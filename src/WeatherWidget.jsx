// WeatherWidget.jsx 
import React, { useEffect, useState } from "react";
import axios from "axios";

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [locationAllowed, setLocationAllowed] = useState(true);

  const API_KEY = "1d345797293b3441bd60474356012a7f"; 

  useEffect(() => {
    if (navigator.geolocation) {
      console.log("Geolocation is supported!");  // Log if geolocation is supported
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log("Location obtained:", position);  // Log position object
 
          try {
            const response = await axios.get(
              `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            setWeather(response.data);
          } catch (error) {
            console.error("Failed to fetch weather:", error);
            // Check if the error has a response (API error), request (network error), or just message
            if (error.response) {
              console.log("Error Response: ", error.response);
            } else if (error.request) {
              console.log("Error Request: ", error.request);
            } else {
              console.log("Error Message: ", error.message);
            }
          }
        },
        (error) => {
          setLocationAllowed(false);
          console.error("Permission denied:", error); // Log geolocation denial
        }
      );
    } else {
      setLocationAllowed(false);
      console.error("Geolocation not supported"); // Log if geolocation is not supported
    }
  }, []);

  if (!locationAllowed) return <p>Location not allowed.</p>;
  if (!weather) return <p>Loading weather...</p>;

  return (
    <div style={{
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      background: "#f0f4f8",
      maxWidth: "250px"
    }}>
      <h4>🌤️ Weather Info</h4>
      <p><strong>Location:</strong> {weather.name}</p>
      <p><strong>Temp:</strong> {weather.main.temp}°C</p>
      <p><strong>Humidity:</strong> {weather.main.humidity}%</p>
      <p><strong>Condition:</strong> {weather.weather[0].description}</p>
    </div>
  );
};

export default WeatherWidget;
