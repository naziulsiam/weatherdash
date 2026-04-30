/**
 * TEAM 404 — QA Test Suite
 * Client: MR AKIF
 * Module: mockWeather.ts — Data integrity and structure tests
 */

import { describe, it, expect } from "vitest";
import {
  PRESET_CITIES,
  weatherScenarios,
  calculateDistance,
  findNearestCity,
  type WeatherData,
  type City,
} from "@/data/mockWeather";

// ─────────────────────────────────────────────
// 1. PRESET_CITIES — Structure Validation
// ─────────────────────────────────────────────
describe("PRESET_CITIES — data integrity", () => {
  it("TC-PC-01: contains exactly 5 preset cities", () => {
    expect(PRESET_CITIES).toHaveLength(5);
  });

  it("TC-PC-02: contains Miami", () => {
    expect(PRESET_CITIES.some((c) => c.name === "Miami")).toBe(true);
  });

  it("TC-PC-03: contains London", () => {
    expect(PRESET_CITIES.some((c) => c.name === "London")).toBe(true);
  });

  it("TC-PC-04: contains Tokyo", () => {
    expect(PRESET_CITIES.some((c) => c.name === "Tokyo")).toBe(true);
  });

  it("TC-PC-05: contains Dubai", () => {
    expect(PRESET_CITIES.some((c) => c.name === "Dubai")).toBe(true);
  });

  it("TC-PC-06: contains Reykjavik", () => {
    expect(PRESET_CITIES.some((c) => c.name === "Reykjavik")).toBe(true);
  });

  it("TC-PC-07: every city has required fields (name, country, timezone, lat, lng)", () => {
    PRESET_CITIES.forEach((city: City) => {
      expect(city).toHaveProperty("name");
      expect(city).toHaveProperty("country");
      expect(city).toHaveProperty("timezone");
      expect(city).toHaveProperty("lat");
      expect(city).toHaveProperty("lng");
    });
  });

  it("TC-PC-08: all latitudes are in valid range [-90, 90]", () => {
    PRESET_CITIES.forEach((c) => {
      expect(c.lat).toBeGreaterThanOrEqual(-90);
      expect(c.lat).toBeLessThanOrEqual(90);
    });
  });

  it("TC-PC-09: all longitudes are in valid range [-180, 180]", () => {
    PRESET_CITIES.forEach((c) => {
      expect(c.lng).toBeGreaterThanOrEqual(-180);
      expect(c.lng).toBeLessThanOrEqual(180);
    });
  });
});

// ─────────────────────────────────────────────
// 2. weatherScenarios — Data Completeness
// ─────────────────────────────────────────────
describe("weatherScenarios — mock data completeness", () => {
  const cityNames = ["Miami", "London", "Tokyo", "Dubai", "Reykjavik"];

  it("TC-WS-01: has a scenario for all 5 preset cities", () => {
    cityNames.forEach((name) => {
      expect(weatherScenarios).toHaveProperty(name);
    });
  });

  cityNames.forEach((city) => {
    describe(`${city} scenario`, () => {
      const scenario: WeatherData = weatherScenarios[city];

      it(`TC-WS-${city}-01: has current weather object`, () => {
        expect(scenario.current).toBeDefined();
      });

      it(`TC-WS-${city}-02: current temp is a number`, () => {
        expect(typeof scenario.current.temp).toBe("number");
      });

      it(`TC-WS-${city}-03: current condition is a valid WeatherCondition`, () => {
        const valid = ["sunny", "clear-night", "cloudy", "rainy", "snowy", "stormy"];
        expect(valid).toContain(scenario.current.condition);
      });

      it(`TC-WS-${city}-04: humidity is between 0 and 100`, () => {
        expect(scenario.current.humidity).toBeGreaterThanOrEqual(0);
        expect(scenario.current.humidity).toBeLessThanOrEqual(100);
      });

      it(`TC-WS-${city}-05: windSpeed is non-negative`, () => {
        expect(scenario.current.windSpeed).toBeGreaterThanOrEqual(0);
      });

      it(`TC-WS-${city}-06: hourly forecast has 24 entries`, () => {
        expect(scenario.hourly).toHaveLength(24);
      });

      it(`TC-WS-${city}-07: daily forecast has 5 entries`, () => {
        expect(scenario.daily).toHaveLength(5);
      });

      it(`TC-WS-${city}-08: sparklines object has all 6 keys`, () => {
        const keys = ["wind", "humidity", "pressure", "uv", "visibility", "temp"];
        keys.forEach((key) => {
          expect(scenario.sparklines).toHaveProperty(key);
          expect(Array.isArray(scenario.sparklines[key as keyof typeof scenario.sparklines].values)).toBe(true);
        });
      });

      it(`TC-WS-${city}-09: alerts is an array`, () => {
        expect(Array.isArray(scenario.alerts)).toBe(true);
      });
    });
  });

  it("TC-WS-02: Miami has storm alerts", () => {
    expect(weatherScenarios["Miami"].alerts.length).toBeGreaterThan(0);
  });

  it("TC-WS-03: Tokyo has no alerts", () => {
    expect(weatherScenarios["Tokyo"].alerts).toHaveLength(0);
  });

  it("TC-WS-04: Dubai condition is sunny (extreme heat)", () => {
    expect(weatherScenarios["Dubai"].current.condition).toBe("sunny");
  });

  it("TC-WS-05: Reykjavik condition is snowy (arctic)", () => {
    expect(weatherScenarios["Reykjavik"].current.condition).toBe("snowy");
  });

  it("TC-WS-06: London condition is rainy (classic London)", () => {
    expect(weatherScenarios["London"].current.condition).toBe("rainy");
  });

  it("TC-WS-07: Miami is stormy", () => {
    expect(weatherScenarios["Miami"].current.condition).toBe("stormy");
  });
});

// ─────────────────────────────────────────────
// 3. hourly data integrity
// ─────────────────────────────────────────────
describe("hourly forecast data integrity", () => {
  const hourly = weatherScenarios["Miami"].hourly;

  it("TC-HR-01: each hourly entry has time, temp, condition, precipitation", () => {
    hourly.forEach((h) => {
      expect(h).toHaveProperty("time");
      expect(h).toHaveProperty("temp");
      expect(h).toHaveProperty("condition");
      expect(h).toHaveProperty("precipitation");
    });
  });

  it("TC-HR-02: precipitation values are 0-100", () => {
    hourly.forEach((h) => {
      expect(h.precipitation).toBeGreaterThanOrEqual(0);
      expect(h.precipitation).toBeLessThanOrEqual(100);
    });
  });

  it("TC-HR-03: all conditions are valid WeatherCondition strings", () => {
    const valid = ["sunny", "clear-night", "cloudy", "rainy", "snowy", "stormy"];
    hourly.forEach((h) => {
      expect(valid).toContain(h.condition);
    });
  });
});

// ─────────────────────────────────────────────
// 4. daily data integrity
// ─────────────────────────────────────────────
describe("daily forecast data integrity", () => {
  const daily = weatherScenarios["London"].daily;

  it("TC-DL-01: each daily entry has day, date, high, low, condition, precipitation, humidity, wind", () => {
    daily.forEach((d) => {
      expect(d).toHaveProperty("day");
      expect(d).toHaveProperty("date");
      expect(d).toHaveProperty("high");
      expect(d).toHaveProperty("low");
      expect(d).toHaveProperty("condition");
      expect(d).toHaveProperty("precipitation");
      expect(d).toHaveProperty("humidity");
      expect(d).toHaveProperty("wind");
    });
  });

  it("TC-DL-02: high temp is always >= low temp", () => {
    daily.forEach((d) => {
      expect(d.high).toBeGreaterThanOrEqual(d.low);
    });
  });

  it("TC-DL-03: humidity is between 0 and 100", () => {
    daily.forEach((d) => {
      expect(d.humidity).toBeGreaterThanOrEqual(0);
      expect(d.humidity).toBeLessThanOrEqual(100);
    });
  });

  it("TC-DL-04: wind speed is non-negative", () => {
    daily.forEach((d) => {
      expect(d.wind).toBeGreaterThanOrEqual(0);
    });
  });
});

// ─────────────────────────────────────────────
// 5. Temperature conversion logic
// ─────────────────────────────────────────────
describe("Temperature conversion (F → C formula)", () => {
  const toC = (f: number) => Math.round((f - 32) * 5 / 9);

  it("TC-TC-01: 32°F → 0°C (freezing point)", () => {
    expect(toC(32)).toBe(0);
  });

  it("TC-TC-02: 212°F → 100°C (boiling point)", () => {
    expect(toC(212)).toBe(100);
  });

  it("TC-TC-03: 98.6°F → 37°C (body temperature)", () => {
    expect(toC(98.6)).toBe(37);
  });

  it("TC-TC-04: 88°F (Miami) → ~31°C", () => {
    expect(toC(88)).toBe(31);
  });

  it("TC-TC-05: 30°F (Reykjavik) → -1°C", () => {
    expect(toC(30)).toBe(-1);
  });

  it("TC-TC-06: 112°F (Dubai) → ~44°C", () => {
    expect(toC(112)).toBe(44);
  });

  it("TC-TC-07: 52°F (London) → 11°C", () => {
    expect(toC(52)).toBe(11);
  });
});
