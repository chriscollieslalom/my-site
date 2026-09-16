const weatherLocation = document.getElementById('weather-location');
      const weatherEmoji = document.getElementById('weather-emoji');
      const weatherTemp = document.getElementById('weather-temp');
      const weatherCondition = document.getElementById('weather-condition');

      function weatherMeta(code) {
        const conditions = {
          0: { emoji: '☀️', label: 'Clear sky' },
          1: { emoji: '🌤️', label: 'Mostly clear' },
          2: { emoji: '⛅', label: 'Partly cloudy' },
          3: { emoji: '☁️', label: 'Cloudy' },
          45: { emoji: '🌫️', label: 'Foggy' },
          48: { emoji: '🌫️', label: 'Depositing rime fog' },
          51: { emoji: '🌦️', label: 'Light drizzle' },
          53: { emoji: '🌦️', label: 'Drizzle' },
          55: { emoji: '🌧️', label: 'Heavy drizzle' },
          56: { emoji: '🌧️', label: 'Freezing drizzle' },
          57: { emoji: '🌧️', label: 'Heavy freezing drizzle' },
          61: { emoji: '🌦️', label: 'Light rain' },
          63: { emoji: '🌧️', label: 'Rain' },
          65: { emoji: '🌧️', label: 'Heavy rain' },
          66: { emoji: '🌧️', label: 'Freezing rain' },
          67: { emoji: '🌧️', label: 'Heavy freezing rain' },
          71: { emoji: '❄️', label: 'Light snow' },
          73: { emoji: '❄️', label: 'Snow' },
          75: { emoji: '❄️', label: 'Heavy snow' },
          77: { emoji: '❄️', label: 'Snow grains' },
          80: { emoji: '🌦️', label: 'Rain showers' },
          81: { emoji: '🌧️', label: 'Heavy showers' },
          82: { emoji: '🌧️', label: 'Violent showers' },
          85: { emoji: '🌨️', label: 'Snow showers' },
          86: { emoji: '🌨️', label: 'Heavy snow showers' },
          95: { emoji: '⛈️', label: 'Thunderstorm' },
          96: { emoji: '⛈️', label: 'Thunderstorm with hail' },
          99: { emoji: '⛈️', label: 'Severe thunderstorm' }
        };

        return conditions[code] || { emoji: '🌤️', label: 'Conditions' };
      }

      function updateWeather(latitude, longitude) {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`;

        fetch(url)
          .then((response) => response.json())
          .then((data) => {
            if (!data.current) {
              throw new Error('No weather data available');
            }

            const { temperature_2m, weather_code } = data.current;
            const condition = weatherMeta(weather_code);
            const locationName = data.timezone ? data.timezone.split('/').pop().replace('_', ' ') : 'Your area';

            weatherLocation.textContent = locationName;
            weatherEmoji.textContent = condition.emoji;
            weatherTemp.textContent = `${Math.round(temperature_2m)}°C`;
            weatherCondition.textContent = condition.label;
          })
          .catch(() => {
            weatherLocation.textContent = 'Location unavailable';
            weatherEmoji.textContent = '🌍';
            weatherTemp.textContent = '--°C';
            weatherCondition.textContent = 'Try again';
          });
      }

      function showFallbackMessage(message) {
        const card = document.getElementById('weather-card');
        card.classList.add('fallback');
        weatherLocation.textContent = 'Weather';
        weatherEmoji.textContent = '📍';
        weatherTemp.textContent = '';
        weatherCondition.textContent = message;
      }

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            updateWeather(position.coords.latitude, position.coords.longitude);
          },
          () => {
            showFallbackMessage('Enable location to see your weather.');
          }
        );
      } else {
        showFallbackMessage('Enable location to see your weather.');
      }