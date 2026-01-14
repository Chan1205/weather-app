export type Units = "imperial" | "metric";

export type ConditionCode =
  | "CLEAR"
  | "CLOUDS"
  | "RAIN"
  | "DRIZZLE"
  | "THUNDER"
  | "SNOW"
  | "FOG"
  | "WIND"
  | "EXTREME";

export type LocationDTO = {
  id: string;
  name: string;
  lat: number;
  lon: number;
  timezone?: string;
  countryCode?: string;
  adminArea?: string;
  postalCode?: string;
};

export type WeatherCurrentDTO = {
  temp: number;
  feelsLike?: number;
  humidity?: number;
  windSpeed: number;
  windDir?: number;
  conditionCode: ConditionCode;
  intensity: number; // 0..1
  isDay: boolean;
};

export type HourlyForecastPointDTO = {
  time: string; // ISO datetime
  temp: number;
  precipProb?: number;   // 0..1
  precipAmount?: number; // unit depends on Units
  precipType?: "rain" | "snow" | "sleet" | "hail" | "none";
  windSpeed?: number;
  windDir?: number;
  conditionCode: ConditionCode;
  intensity?: number; // 0..1
};

export type DailyForecastPointDTO = {
  date: string; // ISO date
  tempMin: number;
  tempMax: number;
  sunrise?: string; // ISO datetime
  sunset?: string;  // ISO datetime
  precipProb?: number; // 0..1
  precipTotal?: number;
  conditionCode: ConditionCode;
};

export type AlertDTO = {
  id: string;
  title: string;
  severity?: string;
  effective?: string;
  expires?: string;
  description?: string;
  instruction?: string;
  source?: string;
};

export type WeatherMetaDTO = {
  fetchedAt: string;  // ISO
  expiresAt?: string; // ISO
  timezone?: string;
  isStale?: boolean;
  requestId?: string;
  provider?: string;
};

export type WeatherResponseDTO = {
  current: WeatherCurrentDTO;
  hourly: HourlyForecastPointDTO[];
  daily: DailyForecastPointDTO[];
  alerts: AlertDTO[];
  meta: WeatherMetaDTO;
};
