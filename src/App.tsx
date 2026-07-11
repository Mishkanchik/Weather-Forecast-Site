import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Wind, Droplets, Thermometer, Sunrise, Sunset, Compass, AlertTriangle } from "lucide-react"
import { WeatherWidget } from "@/components/ui/weather-widget"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiKey } from "./config"
import { SunIcon, MoonIcon, PartlyCloudyIcon, RainIcon, SnowIcon, ThunderIcon, FogIcon, CloudIcon } from "@/components/ui/animated-weather-icons"

type Language = 'uk' | 'en'

interface ForecastItem {
  dt: number
  dt_txt: string
  main: {
    temp: number
    feels_like: number
    humidity: number
    pressure: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
  }
}

interface WeatherDetailData {
  city: string
  temperature: number
  weatherType: 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm' | 'mist'
  dateTime: string
  isDay: boolean
  feelsLike: number
  humidity: number
  windSpeed: number
  pressure: number
  sunrise: string
  sunset: string
}

interface CitySuggestion {
  en: string
  uk: string
}

// Translations Dictionary
const translations = {
  en: {
    title: "WEATHER FLOW",
    searchPlaceholder: "Search city (e.g. Kyiv)",
    searchBtn: "Search",
    feelsLike: "Feels Like",
    humidity: "Humidity",
    windSpeed: "Wind Speed",
    pressure: "Pressure",
    sunrise: "Sunrise",
    sunset: "Sunset",
    coordinates: "Coordinates",
    forecast5Day: "5-Day Forecast",
    hourlyForecastFor: "Hourly Forecast for",
    errorMessage: "City not found. Please try again.",
    locationBlocked: "Location access denied. Please type a city above.",
    liveIntegratedWidget: "Live Weather Widget",
    tryAgain: "Try Again",
    loadingText: "Loading weather data..."
  },
  uk: {
    title: "WEATHER FLOW",
    searchPlaceholder: "Пошук міста (напр. Київ)",
    searchBtn: "Пошук",
    feelsLike: "Відчувається як",
    humidity: "Вологість",
    windSpeed: "Швидкість вітру",
    pressure: "Атм. тиск",
    sunrise: "Схід сонця",
    sunset: "Захід сонця",
    coordinates: "Координати",
    forecast5Day: "Прогноз на 5 днів",
    hourlyForecastFor: "Погодинний прогноз на",
    errorMessage: "Місто не знайдено. Спробуйте ще раз.",
    locationBlocked: "Доступ до локації обмежено. Введіть місто вручну.",
    liveIntegratedWidget: "Погода наживо",
    tryAgain: "Спробувати знову",
    loadingText: "Завантаження погоди..."
  }
}

// Curated list of cities for autocomplete suggestions
const autocompleteCities: CitySuggestion[] = [
  { en: "Kyiv", uk: "Київ" },
  { en: "Lviv", uk: "Львів" },
  { en: "Odesa", uk: "Одеса" },
  { en: "Kharkiv", uk: "Харків" },
  { en: "Dnipro", uk: "Дніпро" },
  { en: "Donetsk", uk: "Донецьк" },
  { en: "Zaporizhzhia", uk: "Запоріжжя" },
  { en: "Kryvyi Rih", uk: "Кривий Ріг" },
  { en: "Mykolaiv", uk: "Миколаїв" },
  { en: "Mariupol", uk: "Маріуполь" },
  { en: "Luhansk", uk: "Луганськ" },
  { en: "Vinnytsia", uk: "Вінниця" },
  { en: "Kherson", uk: "Херсон" },
  { en: "Poltava", uk: "Полтава" },
  { en: "Chernihiv", uk: "Чернігів" },
  { en: "Cherkasy", uk: "Черкаси" },
  { en: "Khmelnytskyi", uk: "Хмельницький" },
  { en: "Zhytomyr", uk: "Житомир" },
  { en: "Chernivtsi", uk: "Чернівці" },
  { en: "Sumy", uk: "Суми" },
  { en: "Rivne", uk: "Рівне" },
  { en: "Ivano-Frankivsk", uk: "Івано-Франківськ" },
  { en: "Kropyvnytskyi", uk: "Кропивницький" },
  { en: "Ternopil", uk: "Тернопіль" },
  { en: "Lutsk", uk: "Луцьк" },
  { en: "Tsuman", uk: "Цумань" },
  { en: "Uzhhorod", uk: "Ужгород" },
  // Global
  { en: "London", uk: "Лондон" },
  { en: "New York", uk: "Нью-Йорк" },
  { en: "Paris", uk: "Париж" },
  { en: "Tokyo", uk: "Токіо" },
  { en: "Berlin", uk: "Берлін" },
  { en: "Rome", uk: "Рим" },
  { en: "Madrid", uk: "Мадрид" },
  { en: "Los Angeles", uk: "Лос-Анджелес" },
  { en: "Chicago", uk: "Чикаго" },
  { en: "Toronto", uk: "Торонто" },
  { en: "Sydney", uk: "Сідней" },
  { en: "Vienna", uk: "Відень" },
  { en: "Amsterdam", uk: "Амстердам" },
  { en: "Warsaw", uk: "Варшава" },
  { en: "Prague", uk: "Прага" },
  { en: "Budapest", uk: "Будапешт" },
  { en: "Singapore", uk: "Сінгапур" },
  { en: "Dubai", uk: "Дубай" },
  { en: "Istanbul", uk: "Стамбул" },
  { en: "Seoul", uk: "Сеул" },
  // More Ukrainian Cities
  { en: "Kremenchuk", uk: "Кременчук" },
  { en: "Bila Tserkva", uk: "Біла Церква" },
  { en: "Mukachevo", uk: "Мукачево" },
  { en: "Uman", uk: "Умань" },
  { en: "Kamianets-Podilskyi", uk: "Кам'янець-Подільський" },
  { en: "Brovary", uk: "Бровари" },
  { en: "Berdiansk", uk: "Бердянськ" },
  { en: "Pavlohrad", uk: "Павлоград" },
  { en: "Konotop", uk: "Конотоп" }
]

const mapWeatherType = (condition: string): 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm' | 'mist' => {
  const main = condition.toLowerCase()
  if (main.includes('clear')) return 'clear'
  if (main.includes('cloud')) return 'clouds'
  if (main.includes('rain') || main.includes('drizzle')) return 'rain'
  if (main.includes('snow')) return 'snow'
  if (main.includes('thunder')) return 'thunderstorm'
  if (main.includes('mist') || main.includes('fog') || main.includes('haze')) return 'mist'
  return 'clear'
}

// Weather Background FX Component
function WeatherEffectBackground({ type, isDay }: { type: string; isDay: boolean }) {
  let gradientClass = "from-slate-950 via-slate-900 to-zinc-950"
  if (type === 'clear') {
    gradientClass = isDay 
      ? "from-sky-400/60 via-sky-600/45 to-[#030712]" 
      : "from-indigo-950/50 via-[#060a1f] to-[#030712]"
  } else if (type === 'clouds') {
    gradientClass = "from-slate-800/50 via-slate-900/40 to-[#030712]"
  } else if (type === 'rain') {
    gradientClass = "from-blue-950/60 via-slate-900/50 to-[#030712]"
  } else if (type === 'snow') {
    gradientClass = "from-sky-950/30 via-slate-900/40 to-[#030712]"
  } else if (type === 'thunderstorm') {
    gradientClass = "from-[#0a051c] via-[#05030e] to-[#010103]"
  } else if (type === 'mist') {
    gradientClass = "from-zinc-900/60 via-slate-900/50 to-[#030712]"
  }

  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} transition-all duration-1000 -z-20 overflow-hidden`}>
      {/* Sun or Moon Glow */}
      {type === 'clear' && isDay && (
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-500/10 blur-[90px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.7, 0.9, 0.7] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
      {type === 'clear' && !isDay && (
        <motion.div 
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-purple-500/5 blur-[90px]"
          animate={{ scale: [1, 1.08, 1], opacity: [0.5, 0.7, 0.5] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Clouds Drifting Overlay (Overcast visual) */}
      {type === 'clouds' && (
        <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute top-10"
            animate={{ x: ["-300px", "100vw"] }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            <CloudIcon size={220} className="text-slate-100" />
          </motion.div>
          <motion.div
            className="absolute top-44"
            animate={{ x: ["100vw", "-350px"] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            <CloudIcon size={320} className="text-slate-100" />
          </motion.div>
        </div>
      )}

      {/* Rain drop particles */}
      {type === 'rain' && (
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-blue-400 w-[1px] h-[15px] rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`
              }}
              animate={{ y: ["0vh", "100vh"] }}
              transition={{
                duration: 1 + Math.random() * 0.8,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      )}

      {/* Snow particles */}
      {type === 'snow' && (
        <div className="absolute inset-0 opacity-50 pointer-events-none">
          {Array.from({ length: 35 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: `${1.5 + Math.random() * 2.5}px`,
                height: `${1.5 + Math.random() * 2.5}px`,
                left: `${Math.random() * 100}%`,
                top: `-10px`
              }}
              animate={{
                y: ["0vh", "100vh"],
                x: ["0px", `${(Math.random() - 0.5) * 30}px`]
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 3
              }}
            />
          ))}
        </div>
      )}

      {/* Thunderstorm lightning bolt & flash animations */}
      {type === 'thunderstorm' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Periodic light flash */}
          <motion.div
            className="absolute inset-0 bg-white/20"
            animate={{ opacity: [0, 0, 0.8, 0, 0, 0.4, 0, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.7, 0.72, 0.74, 0.8, 0.82, 0.84, 1]
            }}
          />
          {/* Floating glowing lightning bolts */}
          <motion.div
            className="absolute top-10 left-1/4 text-amber-300/40 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]"
            animate={{
              opacity: [0, 0, 1, 0, 0, 1, 0, 0],
              scale: [0.8, 0.8, 1.2, 0.8, 0.8, 1, 0.8, 0.8]
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          >
            <svg viewBox="0 0 24 24" width="90" height="90" fill="currentColor">
              <path d="M19 11h-6v9.3c0 .5-.6.8-1 .5l-7.3-8.8c-.4-.5-.1-1.3.6-1.3h6V2.7c0-.5.6-.8 1-.5l7.3 8.8c.4.5.1 1.3-.6 1.3z"/>
            </svg>
          </motion.div>
          <motion.div
            className="absolute top-40 right-1/4 text-amber-400/30 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]"
            animate={{
              opacity: [0, 0, 0, 0.8, 0, 0, 0.6, 0],
              scale: [0.9, 0.9, 0.9, 1.3, 0.9, 0.9, 1.1, 0.9]
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 1 }}
          >
            <svg viewBox="0 0 24 24" width="70" height="70" fill="currentColor">
              <path d="M19 11h-6v9.3c0 .5-.6.8-1 .5l-7.3-8.8c-.4-.5-.1-1.3.6-1.3h6V2.7c0-.5.6-.8 1-.5l7.3 8.8c.4.5.1 1.3-.6 1.3z"/>
            </svg>
          </motion.div>
        </div>
      )}

      {/* Mist/Fog Drift with extra visual density */}
      {type === 'mist' && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Heavy foggy backdrop layer */}
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[12px]" />
          
          <motion.div
            className="absolute top-1/4 -left-1/2 w-[200%] h-1/3 bg-gradient-to-r from-transparent via-slate-200/10 to-transparent blur-[35px]"
            animate={{ x: ["-30%", "30%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-1/2 -left-1/2 w-[200%] h-1/3 bg-gradient-to-r from-transparent via-teal-300/5 to-transparent blur-[40px]"
            animate={{ x: ["30%", "-30%"] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
    </div>
  )
}

// Calculate moon phase based on a date
function getMoonPhase(date: Date): { phase: number; nameEn: string; nameUk: string; icon: string } {
  // Epoch: New Moon on Jan 6, 2000 18:14:00 UTC (Julian date 2451550.26)
  const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0))
  const diffMs = date.getTime() - knownNewMoon.getTime()
  const diffDays = diffMs / (1000 * 60 * 60 * 24)
  const lunarPeriod = 29.530588853
  const rawPhase = (diffDays / lunarPeriod) % 1
  const phase = rawPhase < 0 ? rawPhase + 1 : rawPhase

  let nameEn = ""
  let nameUk = ""
  let icon = ""

  if (phase < 0.03 || phase > 0.97) {
    nameEn = "New Moon"
    nameUk = "Новий Місяць"
    icon = "🌑"
  } else if (phase >= 0.03 && phase < 0.22) {
    nameEn = "Waxing Crescent"
    nameUk = "Молодий Місяць"
    icon = "🌒"
  } else if (phase >= 0.22 && phase < 0.28) {
    nameEn = "First Quarter"
    nameUk = "Перша Чверть"
    icon = "🌓"
  } else if (phase >= 0.28 && phase < 0.47) {
    nameEn = "Waxing Gibbous"
    nameUk = "Прибуваючий Місяць"
    icon = "🌔"
  } else if (phase >= 0.47 && phase < 0.53) {
    nameEn = "Full Moon"
    nameUk = "Повня"
    icon = "🌕"
  } else if (phase >= 0.53 && phase < 0.72) {
    nameEn = "Waning Gibbous"
    nameUk = "Спадаючий Місяць"
    icon = "🌖"
  } else if (phase >= 0.72 && phase < 0.78) {
    nameEn = "Last Quarter"
    nameUk = "Остання Чверть"
    icon = "🌗"
  } else {
    nameEn = "Waning Crescent"
    nameUk = "Старий Місяць"
    icon = "🌘"
  }

  return { phase, nameEn, nameUk, icon }
}

function App() {
  const [language, setLanguage] = React.useState<Language>('uk')
  const [searchQuery, setSearchQuery] = React.useState("")
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  
  // Suggestion states
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [suggestions, setSuggestions] = React.useState<CitySuggestion[]>([])
  
  // Weather state data
  const [weatherData, setWeatherData] = React.useState<WeatherDetailData | null>(null)
  const [coordinates, setCoordinates] = React.useState<{ latitude: number; longitude: number } | undefined>(undefined)
  const [dailyForecasts, setDailyForecasts] = React.useState<Record<string, ForecastItem[]>>({})
  const [selectedDate, setSelectedDate] = React.useState<string>("")

  const t = translations[language]

  const groupForecastByDate = (list: ForecastItem[]) => {
    const daily: Record<string, ForecastItem[]> = {}
    list.forEach(item => {
      const date = item.dt_txt.split(' ')[0]
      if (!daily[date]) daily[date] = []
      daily[date].push(item)
    })
    return daily
  }

  const searchCity = async (name: string) => {
    setLoading(true)
    setError(null)
    setShowSuggestions(false)
    try {
      const normalizedName = name.trim().toLowerCase()
      const matchedCity = autocompleteCities.find(
        city => city.en.toLowerCase() === normalizedName || city.uk.toLowerCase() === normalizedName
      )
      const queryName = matchedCity ? matchedCity.en : name

      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(queryName)}&units=metric&lang=${language}&appid=${apiKey}`)
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(t.errorMessage)
        }
        throw new Error(`Weather fetching failed (${res.status}): ${res.statusText}`)
      }
      const currentData = await res.json()
      
      const mainCondition = currentData.weather[0].main.toLowerCase()
      let weatherType: 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm' | 'mist' = 'clear'
      if (mainCondition.includes('clear')) weatherType = 'clear'
      else if (mainCondition.includes('cloud')) weatherType = 'clouds'
      else if (mainCondition.includes('rain') || mainCondition.includes('drizzle')) weatherType = 'rain'
      else if (mainCondition.includes('snow')) weatherType = 'snow'
      else if (mainCondition.includes('thunder')) weatherType = 'thunderstorm'
      else if (mainCondition.includes('mist') || mainCondition.includes('fog') || mainCondition.includes('haze')) weatherType = 'mist'

      const now = new Date()
      const formattedDateTime = new Intl.DateTimeFormat(language === 'uk' ? 'uk-UA' : 'en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: language === 'en'
      }).format(now)

      const parsedWeather: WeatherDetailData = {
        city: currentData.name,
        temperature: Math.round(currentData.main.temp),
        weatherType,
        dateTime: formattedDateTime,
        isDay: currentData.weather[0].icon.includes('d'),
        feelsLike: Math.round(currentData.main.feels_like),
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        pressure: currentData.main.pressure,
        sunrise: new Date(currentData.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sunset: new Date(currentData.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }

      setWeatherData(parsedWeather)
      setCoordinates({ latitude: currentData.coord.lat, longitude: currentData.coord.lon })
      localStorage.setItem('lastSearchedCity', currentData.name)

      // Fetch forecast
      const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&units=metric&lang=${language}&appid=${apiKey}`)
      if (forecastRes.ok) {
        const forecastData = await forecastRes.json()
        const grouped = groupForecastByDate(forecastData.list)
        setDailyForecasts(grouped)
        const dates = Object.keys(grouped)
        if (dates.length > 0) {
          setSelectedDate(dates[0])
        }
      }
    } catch (err) {
      console.error(err)
      setError(err instanceof Error ? err.message : t.errorMessage)
    } finally {
      setLoading(false)
    }
  }

  // Handle input changes and show suggestions
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    if (value.trim().length > 0) {
      const filtered = autocompleteCities.filter(city => 
        city.en.toLowerCase().includes(value.toLowerCase()) ||
        city.uk.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5)
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  // Trigger search on submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim() !== "") {
      searchCity(searchQuery.trim())
    }
  }

  // Geolocation trigger
  const handleGeolocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&lang=${language}&appid=${apiKey}`)
            if (res.ok) {
              const data = await res.json()
              searchCity(data.name)
            } else {
              throw new Error()
            }
          } catch {
            setError(t.errorMessage)
            searchCity("New York")
          }
        },
        () => {
          setError(t.locationBlocked)
          searchCity("Kyiv")
        }
      )
    } else {
      setError("Geolocation not supported.")
    }
  }

  // Custom fetch function to handle localized widget fetches
  const customWidgetFetch = async (lat: number, lon: number) => {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=${language}&appid=${apiKey}`)
    if (!res.ok) throw new Error("Fetch failed")
    const currentData = await res.json()
    
    const now = new Date()
    const formattedDateTime = new Intl.DateTimeFormat(language === 'uk' ? 'uk-UA' : 'en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: language === 'en'
    }).format(now)

    const rawCondition = currentData.weather[0].main
    const mappedType = mapWeatherType(rawCondition)

    return {
      city: currentData.name,
      temperature: Math.round(currentData.main.temp),
      weatherType: mappedType,
      dateTime: formattedDateTime,
      isDay: currentData.weather[0].icon.includes('d')
    }
  }

  // Refetch when language switches
  React.useEffect(() => {
    const currentCity = weatherData?.city || localStorage.getItem("lastSearchedCity") || "Kyiv"
    searchCity(currentCity)
    // Close suggestions box on language change
    setShowSuggestions(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  // Click outside suggestions box to close it
  React.useEffect(() => {
    const handleOutsideClick = () => {
      setShowSuggestions(false)
    }
    window.addEventListener("click", handleOutsideClick)
    return () => window.removeEventListener("click", handleOutsideClick)
  }, [])

  // Dynamically resolve background based on selected date
  const getActiveBackground = () => {
    const dates = Object.keys(dailyForecasts)
    if (!selectedDate || dates.length === 0 || selectedDate === dates[0]) {
      return {
        type: weatherData?.weatherType || 'clear',
        isDay: weatherData?.isDay ?? true
      }
    }
    const dayForecast = dailyForecasts[selectedDate]
    if (dayForecast && dayForecast.length > 0) {
      const firstHour = dayForecast[0]
      const rawCondition = firstHour.weather[0].main
      const isDaytime = firstHour.weather[0].icon.includes('d')
      return {
        type: mapWeatherType(rawCondition),
        isDay: isDaytime
      }
    }
    return {
      type: weatherData?.weatherType || 'clear',
      isDay: weatherData?.isDay ?? true
    }
  }

  const { type: activeBgType, isDay: activeBgDay } = getActiveBackground()

  const renderCustomWeatherIcon = (type: string, isDay: boolean, size = 64) => {
    switch (type) {
      case 'clear':
        return isDay ? <SunIcon size={size} /> : <MoonIcon size={size} />
      case 'clouds':
        return <PartlyCloudyIcon size={size} />
      case 'rain':
        return <RainIcon size={size} />
      case 'snow':
        return <SnowIcon size={size} />
      case 'thunderstorm':
        return <ThunderIcon size={size} />
      case 'mist':
        return <FogIcon size={size} />
      default:
        return <CloudIcon size={size} />
    }
  }

  return (
    <div className="relative min-h-screen pb-16 flex flex-col items-center select-none w-full">
      
      {/* Weather Background FX */}
      <WeatherEffectBackground type={activeBgType} isDay={activeBgDay} />

      {/* Main Container */}
      <div className="w-full max-w-5xl px-4 mt-6 flex flex-col gap-6">
        
        {/* Header (Production layout) */}
        <header className="relative z-50 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-950/20 backdrop-blur border border-slate-800/30 p-4 rounded-2xl shadow-lg w-full">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-sky-400 to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-sky-500/10">
              <Compass className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white m-0 leading-none">{t.title}</h1>
            </div>
          </div>

          {/* Search bar & Language Switcher */}
          <div className="flex gap-2 w-full sm:w-auto items-center justify-end">
            
            {/* Input with suggestion dropdown */}
            <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-auto relative" onClick={(e) => e.stopPropagation()}>
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  id="city-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-slate-900/50 border border-slate-700/40 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500 transition-all"
                  autoComplete="off"
                />
                
                {/* Suggestions List */}
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl z-50 backdrop-blur-md"
                    >
                      {suggestions.map((city) => {
                        const displayName = language === 'uk' ? city.uk : city.en
                        return (
                          <button
                            key={city.en}
                            type="button"
                            onClick={() => {
                              setSearchQuery(displayName)
                              searchCity(displayName)
                              setShowSuggestions(false)
                            }}
                            className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-sky-500/20 hover:text-white transition-colors border-b border-slate-800/40 last:border-0"
                          >
                            {displayName}
                          </button>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <Button id="city-search-button" type="submit" variant="default" className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl h-9 px-4 shrink-0">
                {t.searchBtn}
              </Button>
              <Button
                id="geolocation-trigger-button"
                type="button"
                variant="outline"
                onClick={handleGeolocation}
                className="border-slate-700/40 bg-slate-900/50 hover:bg-slate-800 hover:text-white rounded-xl h-9 w-9 p-0 flex items-center justify-center shrink-0"
              >
                <MapPin className="h-4 w-4" />
              </Button>
            </form>

            {/* Language Selection Toggle */}
            <Button
              type="button"
              variant="outline"
              onClick={() => setLanguage(lang => lang === 'uk' ? 'en' : 'uk')}
              className="border-slate-700/40 bg-slate-900/50 hover:bg-slate-800 text-xs font-bold text-sky-400 rounded-xl h-9 px-3 shrink-0"
              title="Change Language / Змінити мову"
            >
              {language === 'uk' ? 'EN' : 'УКР'}
            </Button>
          </div>

        </header>

        {/* Core Site Content Grid */}
        <main className="min-h-[400px]">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-3 mb-6" role="alert">
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-300">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center p-20 gap-4">
              <Compass className="h-10 w-10 text-sky-400 animate-spin" />
              <p className="text-xs text-slate-400 font-mono tracking-wider">{t.loadingText}</p>
            </div>
          ) : (
            weatherData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start w-full"
              >
                
                {/* Left Side: Standardized Live Widget */}
                <div className="flex flex-col gap-4 w-full">
                  <WeatherWidget
                    width="100%"
                    className="bg-slate-900/30 border border-slate-800/30 rounded-2xl p-5 shadow-xl backdrop-blur"
                    animated={true}
                    onFetchWeather={customWidgetFetch}
                    location={coordinates}
                  />

                  {/* Lat/Lon coordinates info */}
                  {coordinates && (
                    <Card className="bg-slate-950/15 border-slate-800/30 backdrop-blur rounded-2xl">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{t.coordinates}</p>
                          <h4 className="text-xs font-semibold text-slate-200 mt-1 font-mono">
                            {coordinates.latitude.toFixed(4)}° N, {coordinates.longitude.toFixed(4)}° E
                          </h4>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-800/30 text-slate-400">
                          <Compass className="h-4 w-4" />
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {/* Right Side: Detailed Metrics Grid & Forecasts */}
                <div className="md:col-span-2 flex flex-col gap-6 w-full">
                  
                  {/* Detailed metrics highlights grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    
                    <Card className="bg-slate-950/15 border-slate-800/30 backdrop-blur rounded-2xl p-4 flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
                        <Thermometer className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{t.feelsLike}</p>
                        <h3 className="text-base font-bold text-slate-100 mt-0.5">{weatherData.feelsLike}°C</h3>
                      </div>
                    </Card>

                    <Card className="bg-slate-950/15 border-slate-800/30 backdrop-blur rounded-2xl p-4 flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 shrink-0">
                        <Droplets className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{t.humidity}</p>
                        <h3 className="text-base font-bold text-slate-100 mt-0.5">{weatherData.humidity}%</h3>
                      </div>
                    </Card>

                    <Card className="bg-slate-950/15 border-slate-800/30 backdrop-blur rounded-2xl p-4 flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 shrink-0">
                        <Wind className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{t.windSpeed}</p>
                        <h3 className="text-base font-bold text-slate-100 mt-0.5">{weatherData.windSpeed} m/s</h3>
                      </div>
                    </Card>

                    <Card className="bg-slate-950/15 border-slate-800/30 backdrop-blur rounded-2xl p-4 flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                        <Compass className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{t.pressure}</p>
                        <h3 className="text-base font-bold text-slate-100 mt-0.5">{weatherData.pressure} hPa</h3>
                      </div>
                    </Card>

                    <Card className="bg-slate-950/15 border-slate-800/30 backdrop-blur rounded-2xl p-4 flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                        <Sunrise className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{t.sunrise}</p>
                        <h3 className="text-base font-bold text-slate-100 mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">{weatherData.sunrise}</h3>
                      </div>
                    </Card>

                    <Card className="bg-slate-950/15 border-slate-800/30 backdrop-blur rounded-2xl p-4 flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 shrink-0">
                        <Sunset className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{t.sunset}</p>
                        <h3 className="text-base font-bold text-slate-100 mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap">{weatherData.sunset}</h3>
                      </div>
                    </Card>

                  </div>

                  {/* 5-Day selector */}
                  {Object.keys(dailyForecasts).length > 0 && (
                    <div className="flex flex-col gap-4">
                      
                      <div>
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{t.forecast5Day}</h3>
                        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin w-full">
                          {Object.keys(dailyForecasts).slice(0, 5).map((date) => {
                            const items = dailyForecasts[date]
                            const dayInfo = items[0]
                            const temp = Math.round(dayInfo.main.temp)
                            const rawCondition = dayInfo.weather[0].main
                            const weatherType = mapWeatherType(rawCondition)
                            
                            const isSelected = selectedDate === date
                            const dayName = new Date(date).toLocaleDateString(language === 'uk' ? 'uk-UA' : 'en-US', { weekday: 'short' })
                            const formattedDate = new Date(date).toLocaleDateString(language === 'uk' ? 'uk-UA' : 'en-US', { month: 'short', day: 'numeric' })
                            
                            return (
                              <button
                                key={date}
                                onClick={() => setSelectedDate(date)}
                                className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border text-center transition-all min-w-[90px] ${isSelected ? 'bg-sky-500/20 border-sky-400 shadow-md text-white' : 'bg-slate-950/10 border-slate-800/40 hover:bg-slate-800/20 text-slate-300'}`}
                              >
                                <span className="text-xs font-bold capitalize">{dayName}</span>
                                <span className="text-[10px] text-slate-400">{formattedDate}</span>
                                <div className="my-1">
                                  {renderCustomWeatherIcon(weatherType, true, 32)}
                                </div>
                                <span className="text-sm font-semibold">{temp}°C</span>
                              </button>
                            )
                          })}
                        </div>
                      </div>

                      {/* Hourly forecast for selected day */}
                      {selectedDate && dailyForecasts[selectedDate] && (
                        <Card className="bg-slate-950/15 border-slate-800/30 backdrop-blur rounded-2xl overflow-hidden w-full">
                          <CardHeader className="p-4 border-b border-slate-800/20 bg-slate-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider m-0">
                              {t.hourlyForecastFor} {new Date(selectedDate).toLocaleDateString(language === 'uk' ? 'uk-UA' : 'en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </h3>
                            {(() => {
                              const moonPhase = getMoonPhase(new Date(selectedDate))
                              return (
                                <div className="flex items-center gap-1.5 bg-slate-900/40 border border-slate-800/60 px-2.5 py-1 rounded-xl text-xs shrink-0 self-start sm:self-auto">
                                  <span className="text-sm leading-none">{moonPhase.icon}</span>
                                  <span className="text-slate-400 font-medium">
                                    {language === 'uk' ? 'Фаза Місяця:' : 'Moon Phase:'}
                                  </span>
                                  <span className="text-sky-300 font-semibold">
                                    {language === 'uk' ? moonPhase.nameUk : moonPhase.nameEn}
                                  </span>
                                </div>
                              )
                            })()}
                          </CardHeader>
                          <CardContent className="p-4">
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 w-full">
                              {dailyForecasts[selectedDate].map((hourItem) => {
                                const time = hourItem.dt_txt.split(' ')[1].slice(0, 5)
                                const temp = Math.round(hourItem.main.temp)
                                const desc = hourItem.weather[0].description
                                const rawCondition = hourItem.weather[0].main
                                const wType = mapWeatherType(rawCondition)
                                const isDaytime = hourItem.weather[0].icon.includes('d')

                                return (
                                  <div key={hourItem.dt} className="flex flex-col items-center p-2.5 rounded-xl border border-slate-800/30 bg-slate-950/20 text-center">
                                    <span className="text-[10px] font-bold text-slate-300 font-mono">{time}</span>
                                    <div className="my-1.5">
                                      {renderCustomWeatherIcon(wType, isDaytime, 28)}
                                    </div>
                                    <span className="text-xs font-semibold text-slate-100">{temp}°C</span>
                                    <span className="text-[8px] text-slate-400 line-clamp-1 mt-1 capitalize">{desc}</span>
                                  </div>
                                )
                              })}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                    </div>
                  )}

                </div>

              </motion.div>
            )
          )}
          
        </main>

      </div>
    </div>
  )
}

export default App
