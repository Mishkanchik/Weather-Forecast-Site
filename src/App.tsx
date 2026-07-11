import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, Wind, Droplets, Thermometer, Sunrise, Sunset, Compass, Layers, Sparkles, BookOpen, AlertTriangle } from "lucide-react"
import { WeatherWidget } from "@/components/ui/weather-widget"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { apiKey } from "./config"
import {
  SunIcon,
  MoonIcon,
  CloudIcon,
  RainIcon,
  SnowIcon,
  ThunderIcon,
  FogIcon,
  PartlyCloudyIcon,
  AnimatedWeatherIconsDemo
} from "@/components/ui/animated-weather-icons"
import { BasicDemo, AdvancedDemo, CompactDemo } from "@/components/ui/demo"

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

// Weather Background FX Component
function WeatherEffectBackground({ type, isDay }: { type: string; isDay: boolean }) {
  let gradientClass = "from-slate-950 via-slate-900 to-zinc-950"
  if (type === 'clear') {
    gradientClass = isDay 
      ? "from-sky-950/80 via-blue-900/60 to-[#030712]" 
      : "from-indigo-950/80 via-[#0a0f24] to-[#030712]"
  } else if (type === 'clouds') {
    gradientClass = "from-slate-900/90 via-slate-800/60 to-[#030712]"
  } else if (type === 'rain') {
    gradientClass = "from-blue-950/80 via-slate-900/70 to-[#030712]"
  } else if (type === 'snow') {
    gradientClass = "from-sky-950/45 via-slate-900/50 to-[#030712]"
  } else if (type === 'thunderstorm') {
    gradientClass = "from-purple-950/80 via-zinc-900/60 to-[#030712]"
  } else if (type === 'mist') {
    gradientClass = "from-teal-950/50 via-slate-900/65 to-[#030712]"
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

      {/* Rain drop particles */}
      {type === 'rain' && (
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          {Array.from({ length: 25 }).map((_, i) => (
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
          {Array.from({ length: 30 }).map((_, i) => (
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

      {/* Thunder lightning effect */}
      {type === 'thunderstorm' && (
        <motion.div
          className="absolute inset-0 bg-white/5 pointer-events-none"
          animate={{ opacity: [0, 0, 0.7, 0, 0, 0.3, 0, 0] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.7, 0.72, 0.74, 0.8, 0.82, 0.84, 1]
          }}
        />
      )}

      {/* Fog/mist drift */}
      {type === 'mist' && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <motion.div
            className="absolute top-1/4 -left-1/2 w-[200%] h-1/3 bg-gradient-to-r from-transparent via-teal-200/5 to-transparent blur-[35px]"
            animate={{ x: ["-40%", "40%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute top-1/2 -left-1/2 w-[200%] h-1/3 bg-gradient-to-r from-transparent via-slate-300/5 to-transparent blur-[40px]"
            animate={{ x: ["40%", "-40%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = React.useState<"dashboard" | "playground" | "icons" | "guide">("dashboard")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  
  // Weather state data
  const [weatherData, setWeatherData] = React.useState<WeatherDetailData | null>(null)
  const [coordinates, setCoordinates] = React.useState<{ latitude: number; longitude: number } | undefined>(undefined)
  const [dailyForecasts, setDailyForecasts] = React.useState<Record<string, ForecastItem[]>>({})
  const [selectedDate, setSelectedDate] = React.useState<string>("")
  
  // Custom mock data controller state for dashboard demonstration
  const [isDemoPresetMode, setIsDemoPresetMode] = React.useState(false)
  const [demoPreset, setDemoPreset] = React.useState<string>("clear")

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
    setIsDemoPresetMode(false)
    try {
      const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(name)}&units=metric&appid=${apiKey}`)
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error(`City "${name}" not found. Please try a different location.`)
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
      const formattedDateTime = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
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
      const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${currentData.coord.lat}&lon=${currentData.coord.lon}&units=metric&appid=${apiKey}`)
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
      setError(err instanceof Error ? err.message : "Failed to load weather data")
    } finally {
      setLoading(false)
    }
  }

  // Trigger search on submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim() !== "") {
      searchCity(searchQuery.trim())
    }
  }

  // Get location coordinate-based fetch
  const handleGeolocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          try {
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`)
            if (res.ok) {
              const data = await res.json()
              searchCity(data.name)
            } else {
              throw new Error()
            }
          } catch {
            setError("Could not retrieve city name from coordinates. Searching fallback...")
            searchCity("New York")
          }
        },
        () => {
          setError("Location access denied or unavailable. Loading default location.")
          searchCity("Kyiv")
        }
      )
    } else {
      setError("Geolocation is not supported by your browser.")
    }
  }

  // Set mock preset for previewing dashboard
  const handleMockPresetSelect = (preset: string) => {
    setIsDemoPresetMode(true)
    setDemoPreset(preset)
    
    // Set appropriate mock dashboard state
    const mockDetailsMap: Record<string, Partial<WeatherDetailData>> = {
      clear: {
        city: "Sunnyvale (Mock)",
        temperature: 27,
        weatherType: "clear",
        isDay: true,
        feelsLike: 29,
        humidity: 45,
        windSpeed: 3.6,
        pressure: 1018,
        sunrise: "06:12 AM",
        sunset: "08:34 PM"
      },
      clouds: {
        city: "London (Mock)",
        temperature: 15,
        weatherType: "clouds",
        isDay: true,
        feelsLike: 14,
        humidity: 80,
        windSpeed: 5.4,
        pressure: 1012,
        sunrise: "05:44 AM",
        sunset: "09:02 PM"
      },
      rain: {
        city: "Seattle (Mock)",
        temperature: 11,
        weatherType: "rain",
        isDay: true,
        feelsLike: 9,
        humidity: 95,
        windSpeed: 7.2,
        pressure: 1006,
        sunrise: "06:21 AM",
        sunset: "08:15 PM"
      },
      snow: {
        city: "Denver (Mock)",
        temperature: -4,
        weatherType: "snow",
        isDay: true,
        feelsLike: -9,
        humidity: 85,
        windSpeed: 4.5,
        pressure: 1022,
        sunrise: "07:05 AM",
        sunset: "05:40 PM"
      },
      thunderstorm: {
        city: "Miami (Mock)",
        temperature: 28,
        weatherType: "thunderstorm",
        isDay: false,
        feelsLike: 32,
        humidity: 88,
        windSpeed: 12.8,
        pressure: 1001,
        sunrise: "06:30 AM",
        sunset: "08:05 PM"
      },
      mist: {
        city: "San Francisco (Mock)",
        temperature: 13,
        weatherType: "mist",
        isDay: true,
        feelsLike: 12,
        humidity: 90,
        windSpeed: 2.1,
        pressure: 1015,
        sunrise: "06:01 AM",
        sunset: "08:29 PM"
      }
    }
    
    const baseMock = mockDetailsMap[preset] as WeatherDetailData
    setWeatherData({
      ...baseMock,
      dateTime: "Mock Time Preview"
    })
    
    // Set coordinates for Mock
    setCoordinates(undefined)
  }

  React.useEffect(() => {
    const lastCity = localStorage.getItem("lastSearchedCity")
    if (lastCity) {
      searchCity(lastCity)
    } else {
      searchCity("Kyiv") // Default city
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Resolve current active background details
  const currentBgType = weatherData?.weatherType || "clear"
  const currentBgDay = weatherData?.isDay ?? true

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
    <div className="relative min-h-screen pb-16 flex flex-col items-center">
      
      {/* Background Effect Layer */}
      <WeatherEffectBackground type={currentBgType} isDay={currentBgDay} />

      {/* Main Container */}
      <div className="w-full max-w-6xl px-4 mt-8 flex flex-col gap-6">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-950/30 backdrop-blur-md border border-slate-800/40 p-4 rounded-2xl shadow-xl w-full">
          
          {/* Logo & Sub */}
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-tr from-sky-400 to-indigo-500 p-2.5 rounded-xl shadow-lg shadow-sky-500/20">
              <Compass className="h-6 w-6 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white m-0 leading-none">WEATHER FLOW</h1>
              <p className="text-[10px] text-sky-400 font-semibold tracking-wider uppercase mt-1">Interactive Forecast Platform</p>
            </div>
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full md:w-auto max-w-md">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                id="city-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city (e.g. Seattle)"
                className="w-full bg-slate-900/60 border border-slate-700/50 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all backdrop-blur"
              />
            </div>
            <Button id="city-search-button" type="submit" variant="default" className="bg-sky-500 hover:bg-sky-600 text-white rounded-xl h-9 px-4">
              Search
            </Button>
            <Button
              id="geolocation-trigger-button"
              type="button"
              variant="outline"
              onClick={handleGeolocation}
              className="border-slate-700/50 bg-slate-900/60 hover:bg-slate-800 hover:text-white rounded-xl h-9 w-9 p-0 flex items-center justify-center"
              title="Get current location weather"
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </form>

        </header>

        {/* Tab Navigation */}
        <nav className="flex justify-center border-b border-slate-800/40 pb-px">
          <div className="flex gap-1 bg-slate-950/40 p-1.5 rounded-xl border border-slate-800/40 backdrop-blur-md">
            <button
              id="tab-btn-dashboard"
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeTab === 'dashboard' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
            >
              <Layers className="h-3.5 w-3.5" />
              Dashboard
            </button>
            <button
              id="tab-btn-playground"
              onClick={() => setActiveTab("playground")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeTab === 'playground' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Playground & Demos
            </button>
            <button
              id="tab-btn-icons"
              onClick={() => setActiveTab("icons")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeTab === 'icons' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
            >
              <SunIcon size={14} className="text-current" />
              Icon Showcase
            </button>
            <button
              id="tab-btn-guide"
              onClick={() => setActiveTab("guide")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeTab === 'guide' ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'}`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Architecture Guide
            </button>
          </div>
        </nav>

        {/* Tab Contents */}
        <main className="min-h-[400px]">
          
          <AnimatePresence mode="wait">
            
            {/* Dashboard Tab */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                {/* Warnings or Info */}
                {error && (
                  <div className="bg-red-500/15 border border-red-500/30 p-4 rounded-xl flex items-start gap-3" role="alert">
                    <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-red-300">{error}</p>
                      <p className="text-xs text-red-400 mt-1">If Geolocation is blocked, reset location settings or search using the text bar above.</p>
                    </div>
                  </div>
                )}

                {/* Dashboard Controls / Mock Presets Playground */}
                <Card className="bg-slate-950/25 border-slate-800/40 backdrop-blur-md rounded-2xl p-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-200 tracking-wide">Interactive Dashboard Playground</h3>
                      <p className="text-xs text-slate-400 mt-0.5">Toggle mock weather presets below to check dynamic background effects, responsive card overlays, and icon states.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['clear', 'clouds', 'rain', 'snow', 'thunderstorm', 'mist'].map((preset) => (
                        <Button
                          key={preset}
                          size="sm"
                          variant={isDemoPresetMode && demoPreset === preset ? "default" : "outline"}
                          onClick={() => handleMockPresetSelect(preset)}
                          className={`text-xs capitalize h-8 rounded-lg ${isDemoPresetMode && demoPreset === preset ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 text-slate-300'}`}
                        >
                          {preset}
                        </Button>
                      ))}
                      {isDemoPresetMode && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setIsDemoPresetMode(false)
                            const lastCity = localStorage.getItem("lastSearchedCity") || "Kyiv"
                            searchCity(lastCity)
                          }}
                          className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 h-8 px-2"
                        >
                          Reset Live
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>

                {/* Main Dashboard Layout Grid */}
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                    <div className="h-64 bg-slate-900/40 rounded-2xl border border-slate-800/40"></div>
                    <div className="h-64 md:col-span-2 bg-slate-900/40 rounded-2xl border border-slate-800/40"></div>
                  </div>
                ) : (
                  weatherData && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                      
                      {/* Left: WeatherWidget Demo in Action */}
                      <div className="flex flex-col gap-4 items-center">
                        <div className="w-full flex justify-between items-center px-1">
                          <span className="text-xs font-semibold text-slate-400 tracking-wider uppercase">Live Integrated Widget</span>
                          <span className="text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded font-mono">/components/ui/weather-widget.tsx</span>
                        </div>
                        
                        {/* Standard Weather Widget Component Integration */}
                        {isDemoPresetMode ? (
                          <WeatherWidget
                            width="100%"
                            className="bg-slate-900/40 border border-slate-800/40 rounded-2xl p-5 shadow-2xl backdrop-blur-xl"
                            animated={true}
                            onFetchWeather={async () => ({
                              city: weatherData.city,
                              temperature: weatherData.temperature,
                              weatherType: weatherData.weatherType,
                              dateTime: weatherData.dateTime,
                              isDay: weatherData.isDay
                            })}
                          />
                        ) : (
                          <WeatherWidget
                            apiKey={apiKey}
                            width="100%"
                            className="bg-slate-900/40 border border-slate-800/40 rounded-2xl p-5 shadow-2xl backdrop-blur-xl"
                            animated={true}
                            location={coordinates}
                            fallbackLocation={{ latitude: 50.4501, longitude: 30.5234 }} // default Kyiv
                          />
                        )}

                        {/* Extra City Detail Info Card */}
                        <Card className="w-full bg-slate-950/20 border-slate-800/40 backdrop-blur-md rounded-2xl overflow-hidden">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Location Coordinates</p>
                                <h4 className="text-xs font-semibold text-slate-200 mt-1 font-mono">
                                  {coordinates ? `${coordinates.latitude.toFixed(4)}° N, ${coordinates.longitude.toFixed(4)}° E` : "Mock Mode Coordinates"}
                                </h4>
                              </div>
                              <div className="p-2 rounded-lg bg-slate-800/40 text-slate-400">
                                <Compass className="h-4 w-4" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                      </div>

                      {/* Right: Weather Metrics & Forecast */}
                      <div className="md:col-span-2 flex flex-col gap-6">
                        
                        {/* Highlights Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          
                          <Card className="bg-slate-950/20 border-slate-800/30 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
                              <Thermometer className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Feels Like</p>
                              <h3 className="text-lg font-bold text-slate-100 mt-0.5">{weatherData.feelsLike}°C</h3>
                            </div>
                          </Card>

                          <Card className="bg-slate-950/20 border-slate-800/30 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 shrink-0">
                              <Droplets className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Humidity</p>
                              <h3 className="text-lg font-bold text-slate-100 mt-0.5">{weatherData.humidity}%</h3>
                            </div>
                          </Card>

                          <Card className="bg-slate-950/20 border-slate-800/30 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 shrink-0">
                              <Wind className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Wind Speed</p>
                              <h3 className="text-lg font-bold text-slate-100 mt-0.5">{weatherData.windSpeed} m/s</h3>
                            </div>
                          </Card>

                          <Card className="bg-slate-950/20 border-slate-800/30 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                              <Compass className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Pressure</p>
                              <h3 className="text-lg font-bold text-slate-100 mt-0.5">{weatherData.pressure} hPa</h3>
                            </div>
                          </Card>

                          <Card className="bg-slate-950/20 border-slate-800/30 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                              <Sunrise className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Sunrise</p>
                              <h3 className="text-lg font-bold text-slate-100 mt-0.5 text-ellipsis overflow-hidden whitespace-nowrap">{weatherData.sunrise}</h3>
                            </div>
                          </Card>

                          <Card className="bg-slate-950/20 border-slate-800/30 backdrop-blur-md rounded-2xl p-4 flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 shrink-0">
                              <Sunset className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Sunset</p>
                              <h3 className="text-lg font-bold text-slate-100 mt-0.5 text-ellipsis overflow-hidden whitespace-nowrap">{weatherData.sunset}</h3>
                            </div>
                          </Card>

                        </div>

                        {/* Forecast Sections */}
                        {!isDemoPresetMode && Object.keys(dailyForecasts).length > 0 && (
                          <div className="flex flex-col gap-4">
                            
                            {/* 5-Day selector */}
                            <div>
                              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">5-Day Forecast</h3>
                              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                                {Object.keys(dailyForecasts).slice(0, 5).map((date) => {
                                  const items = dailyForecasts[date]
                                  const dayInfo = items[0]
                                  const temp = Math.round(dayInfo.main.temp)
                                  const mainType = dayInfo.weather[0].main.toLowerCase()
                                  
                                  let weatherType: 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm' | 'mist' = 'clear'
                                  if (mainType.includes('clear')) weatherType = 'clear'
                                  else if (mainType.includes('cloud')) weatherType = 'clouds'
                                  else if (mainType.includes('rain') || mainType.includes('drizzle')) weatherType = 'rain'
                                  else if (mainType.includes('snow')) weatherType = 'snow'
                                  else if (mainType.includes('thunder')) weatherType = 'thunderstorm'
                                  
                                  const isSelected = selectedDate === date
                                  const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' })
                                  const formattedDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                  
                                  return (
                                    <button
                                      key={date}
                                      onClick={() => setSelectedDate(date)}
                                      className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border text-center transition-all min-w-[90px] ${isSelected ? 'bg-sky-500/25 border-sky-400 shadow-lg text-white' : 'bg-slate-950/20 border-slate-800/40 hover:bg-slate-800/30 text-slate-300'}`}
                                    >
                                      <span className="text-xs font-bold">{dayName}</span>
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
                              <Card className="bg-slate-950/20 border-slate-800/30 backdrop-blur-md rounded-2xl overflow-hidden">
                                <CardHeader className="p-4 border-b border-slate-800/30 bg-slate-950/40">
                                  <CardTitle className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Hourly Forecast for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4">
                                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                                    {dailyForecasts[selectedDate].map((hourItem) => {
                                      const time = hourItem.dt_txt.split(' ')[1].slice(0, 5)
                                      const temp = Math.round(hourItem.main.temp)
                                      const desc = hourItem.weather[0].description
                                      const rawIconName = hourItem.weather[0].main.toLowerCase()
                                      
                                      let wType: 'clear' | 'clouds' | 'rain' | 'snow' | 'thunderstorm' | 'mist' = 'clear'
                                      if (rawIconName.includes('clear')) wType = 'clear'
                                      else if (rawIconName.includes('cloud')) wType = 'clouds'
                                      else if (rawIconName.includes('rain') || rawIconName.includes('drizzle')) wType = 'rain'
                                      else if (rawIconName.includes('snow')) wType = 'snow'
                                      else if (rawIconName.includes('thunder')) wType = 'thunderstorm'
                                      
                                      const isDaytime = hourItem.weather[0].icon.includes('d')

                                      return (
                                        <div key={hourItem.dt} className="flex flex-col items-center p-2.5 rounded-xl border border-slate-800/40 bg-slate-950/30 text-center">
                                          <span className="text-[10px] font-bold text-slate-300 font-mono">{time}</span>
                                          <div className="my-1.5">
                                            {renderCustomWeatherIcon(wType, isDaytime, 28)}
                                          </div>
                                          <span className="text-xs font-semibold text-slate-100">{temp}°C</span>
                                          <span className="text-[8px] text-slate-400 line-clamp-1 mt-1 shrink-0 capitalize">{desc}</span>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </CardContent>
                              </Card>
                            )}

                          </div>
                        )}
                        
                        {isDemoPresetMode && (
                          <div className="flex flex-col items-center justify-center p-12 border border-dashed border-slate-800/60 rounded-2xl bg-slate-950/10">
                            <Compass className="h-8 w-8 text-sky-400 animate-spin" />
                            <h3 className="text-sm font-bold text-slate-200 mt-3">Live Forecast is Hidden in Mock Mode</h3>
                            <p className="text-xs text-slate-400 text-center max-w-sm mt-1">Click the "Reset Live" button above to pull genuine meteorological data for Ukrainian or international cities.</p>
                          </div>
                        )}

                      </div>

                    </div>
                  )
                )}

              </motion.div>
            )}

            {/* Playgrounds and Demos Tab */}
            {activeTab === "playground" && (
              <motion.div
                key="playground"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                
                <div className="bg-slate-950/30 backdrop-blur-md p-6 rounded-2xl border border-slate-800/40 shadow-xl">
                  <h2 className="text-xl font-bold tracking-tight text-white mb-2">Integrated Demos Showcase</h2>
                  <p className="text-xs text-slate-400">Below are the custom size and setting variants directly copied from the components. These demonstrate configuration versatility.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Advanced Demo */}
                  <Card className="bg-slate-950/20 border-slate-850/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
                    <CardHeader className="p-4 bg-slate-950/50 border-b border-slate-800/40 flex flex-row justify-between items-center">
                      <div>
                        <CardTitle className="text-sm font-bold text-white">Interactive Advanced Playground</CardTitle>
                        <CardDescription className="text-[10px]">Customize mock fetch toggles and weather states</CardDescription>
                      </div>
                      <span className="text-[10px] text-amber-400 bg-amber-400/5 px-2 py-0.5 rounded font-mono">AdvancedDemo</span>
                    </CardHeader>
                    <CardContent className="p-6">
                      <AdvancedDemo />
                    </CardContent>
                  </Card>

                  <div className="flex flex-col gap-6">
                    
                    {/* Basic Demo */}
                    <Card className="bg-slate-950/20 border-slate-850/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
                      <CardHeader className="p-4 bg-slate-950/50 border-b border-slate-800/40 flex flex-row justify-between items-center">
                        <div>
                          <CardTitle className="text-sm font-bold text-white">Basic Default Demo</CardTitle>
                          <CardDescription className="text-[10px]">Real queries from default coordinate location</CardDescription>
                        </div>
                        <span className="text-[10px] text-sky-400 bg-sky-400/5 px-2 py-0.5 rounded font-mono">BasicDemo</span>
                      </CardHeader>
                      <CardContent className="p-4">
                        <BasicDemo />
                      </CardContent>
                    </Card>

                    {/* Compact Demo */}
                    <Card className="bg-slate-950/20 border-slate-850/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl">
                      <CardHeader className="p-4 bg-slate-950/50 border-b border-slate-800/40 flex flex-row justify-between items-center">
                        <div>
                          <CardTitle className="text-sm font-bold text-white">Compact Size Preview</CardTitle>
                          <CardDescription className="text-[10px]">Rendered on a tight card grid layout</CardDescription>
                        </div>
                        <span className="text-[10px] text-teal-400 bg-teal-400/5 px-2 py-0.5 rounded font-mono">CompactDemo</span>
                      </CardHeader>
                      <CardContent className="p-4">
                        <CompactDemo />
                      </CardContent>
                    </Card>

                  </div>

                </div>

              </motion.div>
            )}

            {/* Custom Icon Showcase Tab */}
            {activeTab === "icons" && (
              <motion.div
                key="icons"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                
                <div className="bg-slate-950/30 backdrop-blur-md p-6 rounded-2xl border border-slate-800/40 shadow-xl">
                  <h2 className="text-xl font-bold tracking-tight text-white mb-2">Animated Weather SVGs Gallery</h2>
                  <p className="text-xs text-slate-400">A showcase of the custom SVG weather assets built with clean framer-motion loops and custom scaling triggers.</p>
                </div>

                <Card className="bg-slate-950/20 border-slate-850/40 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden p-6">
                  <AnimatedWeatherIconsDemo />
                </Card>

              </motion.div>
            )}

            {/* Installation Guide Tab */}
            {activeTab === "guide" && (
              <motion.div
                key="guide"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                
                <div className="bg-slate-950/30 backdrop-blur-md p-6 rounded-2xl border border-slate-800/40 shadow-xl">
                  <h2 className="text-xl font-bold tracking-tight text-white mb-2">Technical Integration Guide</h2>
                  <p className="text-xs text-slate-400">Documentation describing folder architectures, dependencies, and execution mappings.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Left explanation */}
                  <div className="lg:col-span-2 flex flex-col gap-6">
                    
                    <Card className="bg-slate-950/20 border-slate-850/40 backdrop-blur-md rounded-2xl p-6">
                      <h3 className="text-md font-bold text-white mb-3">Why `/components/ui` Folder Matters</h3>
                      <div className="text-xs text-slate-300 space-y-3 leading-relaxed">
                        <p>
                          In standard modern web frameworks (Vite, Next.js, etc.), simple atomic UI controls like Cards, Buttons, and Toggles are placed inside a centralized components folder, commonly named <code className="bg-slate-900 px-1 py-0.5 rounded text-sky-400">/components/ui</code>.
                        </p>
                        <p className="font-semibold text-slate-200">
                          1. CLI Tool Compatibility
                        </p>
                        <p>
                          shadcn UI functions as a component compiler CLI, downloading directly to folders set up in your local configuration (<code className="bg-slate-900 px-1 py-0.5 rounded text-sky-400">components.json</code>). If you place primitive controls in odd directories, CLI updates or newly injected buttons will fail to compile.
                        </p>
                        <p className="font-semibold text-slate-200">
                          2. Absolute Path Aliasing
                        </p>
                        <p>
                          Path configurations like <code className="bg-slate-900 px-1 py-0.5 rounded text-sky-400">@/components/ui/card</code> prevent complex import structures (e.g. <code className="bg-slate-900 px-1 py-0.5 rounded text-rose-400">"../../../../card"</code>), which are prone to breakage during page modifications or folder restructuring.
                        </p>
                      </div>
                    </Card>

                    <Card className="bg-slate-950/20 border-slate-850/40 backdrop-blur-md rounded-2xl p-6">
                      <h3 className="text-md font-bold text-white mb-3">Setting Up Shadcn + Tailwind from Scratch</h3>
                      <div className="text-xs space-y-4 font-mono text-sky-300">
                        <div>
                          <p className="text-slate-400 font-sans mb-1.5">1. Install Tailwind and PostCSS configurations:</p>
                          <pre className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-left overflow-x-auto text-[11px] leading-relaxed">
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p</pre>
                        </div>
                        <div>
                          <p className="text-slate-400 font-sans mb-1.5">2. Initialize shadcn CLI scaffolding:</p>
                          <pre className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-left overflow-x-auto text-[11px] leading-relaxed">
npx shadcn-ui@latest init</pre>
                        </div>
                        <div>
                          <p className="text-slate-400 font-sans mb-1.5">3. Add primitive buttons and cards using the CLI:</p>
                          <pre className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-left overflow-x-auto text-[11px] leading-relaxed">
npx shadcn-ui@latest add card button toggle</pre>
                        </div>
                      </div>
                    </Card>

                  </div>

                  {/* Right File Mapping Checklist */}
                  <Card className="bg-slate-950/20 border-slate-850/40 backdrop-blur-md rounded-2xl p-6 h-fit">
                    <h3 className="text-md font-bold text-white mb-3">Created Files Mapping</h3>
                    <ul className="space-y-3.5 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-green-400 rounded-full shrink-0"></span>
                        <div>
                          <p className="font-semibold text-slate-200">Tailwind Config</p>
                          <p className="text-[10px] text-slate-400 font-mono">./tailwind.config.js</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-green-400 rounded-full shrink-0"></span>
                        <div>
                          <p className="font-semibold text-slate-200">Global Tailwind CSS</p>
                          <p className="text-[10px] text-slate-400 font-mono">./src/index.css</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-green-400 rounded-full shrink-0"></span>
                        <div>
                          <p className="font-semibold text-slate-200">Utility helper</p>
                          <p className="text-[10px] text-slate-400 font-mono">./src/lib/utils.ts</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-green-400 rounded-full shrink-0"></span>
                        <div>
                          <p className="font-semibold text-slate-200">Shadcn Card</p>
                          <p className="text-[10px] text-slate-400 font-mono">./src/components/ui/card.tsx</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-green-400 rounded-full shrink-0"></span>
                        <div>
                          <p className="font-semibold text-slate-200">Shadcn Button</p>
                          <p className="text-[10px] text-slate-400 font-mono">./src/components/ui/button.tsx</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-green-400 rounded-full shrink-0"></span>
                        <div>
                          <p className="font-semibold text-slate-200">Shadcn Toggle</p>
                          <p className="text-[10px] text-slate-400 font-mono">./src/components/ui/toggle.tsx</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-green-400 rounded-full shrink-0"></span>
                        <div>
                          <p className="font-semibold text-slate-200">Animated SVG Icons</p>
                          <p className="text-[10px] text-slate-400 font-mono">./components/ui/animated-weather-icons.tsx</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-green-400 rounded-full shrink-0"></span>
                        <div>
                          <p className="font-semibold text-slate-200">Integrated Weather Widget</p>
                          <p className="text-[10px] text-slate-400 font-mono">./components/ui/weather-widget.tsx</p>
                        </div>
                      </li>
                    </ul>
                  </Card>

                </div>

              </motion.div>
            )}

          </AnimatePresence>
          
        </main>

      </div>
    </div>
  )
}

export default App
