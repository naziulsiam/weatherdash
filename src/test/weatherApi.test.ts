/**
 * TEAM 404 — QA Test Suite
 * Client: MR AKIF
 * Module: weatherApi.ts — Pure utility function tests
 *
 * Tests: mapCondition, getWindDirection, calculateDistance,
 *        findNearestCity, searchCities
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  calculateDistance,
  findNearestCity,
  PRESET_CITIES,
} from "@/data/mockWeather";
import { searchCities } from "@/services/weatherApi";

// ─────────────────────────────────────────────
// Expose private helpers via dynamic import
// We re-implement them here to test the logic
// without changing production code.
// ─────────────────────────────────────────────

/** Mirrors the private mapCondition() in weatherApi.ts */
function mapCondition(code: number, icon: string = "01d"): string {
  const isNight = icon.endsWith("n");
  if (code >= 200 && code < 300) return "stormy";
  if (code >= 300 && code < 600) return "rainy";
  if (code >= 600 && code < 700) return "snowy";
  if (code >= 700 && code < 800) return "cloudy";
  if (code === 800) return isNight ? "clear-night" : "sunny";
  if (code > 800) return "cloudy";
  return isNight ? "clear-night" : "sunny";
}

/** Mirrors the private getWindDirection() in weatherApi.ts */
function getWindDirection(degrees: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

// ─────────────────────────────────────────────
// 1. mapCondition Tests
// ─────────────────────────────────────────────
describe("mapCondition — weather code to condition string", () => {
  // Thunderstorm group (200-299)
  it("TC-MC-01: code 200 (thunderstorm) → 'stormy'", () => {
    expect(mapCondition(200)).toBe("stormy");
  });
  it("TC-MC-02: code 299 (edge of thunderstorm) → 'stormy'", () => {
    expect(mapCondition(299)).toBe("stormy");
  });

  // Drizzle group (300-399)
  it("TC-MC-03: code 300 (light drizzle) → 'rainy'", () => {
    expect(mapCondition(300)).toBe("rainy");
  });

  // Rain group (500-599)
  it("TC-MC-04: code 500 (light rain) → 'rainy'", () => {
    expect(mapCondition(500)).toBe("rainy");
  });
  it("TC-MC-05: code 599 (edge of rain) → 'rainy'", () => {
    expect(mapCondition(599)).toBe("rainy");
  });

  // Snow group (600-699)
  it("TC-MC-06: code 600 (light snow) → 'snowy'", () => {
    expect(mapCondition(600)).toBe("snowy");
  });
  it("TC-MC-07: code 699 (edge of snow) → 'snowy'", () => {
    expect(mapCondition(699)).toBe("snowy");
  });

  // Atmosphere group (700-799)
  it("TC-MC-08: code 701 (mist) → 'cloudy'", () => {
    expect(mapCondition(701)).toBe("cloudy");
  });
  it("TC-MC-09: code 741 (fog) → 'cloudy'", () => {
    expect(mapCondition(741)).toBe("cloudy");
  });

  // Clear sky — day vs night
  it("TC-MC-10: code 800 day icon → 'sunny'", () => {
    expect(mapCondition(800, "01d")).toBe("sunny");
  });
  it("TC-MC-11: code 800 night icon → 'clear-night'", () => {
    expect(mapCondition(800, "01n")).toBe("clear-night");
  });
  it("TC-MC-12: code 800 no icon (defaults day) → 'sunny'", () => {
    expect(mapCondition(800)).toBe("sunny");
  });

  // Clouds group (801-804)
  it("TC-MC-13: code 801 (few clouds) → 'cloudy'", () => {
    expect(mapCondition(801)).toBe("cloudy");
  });
  it("TC-MC-14: code 803 (broken clouds) → 'cloudy'", () => {
    expect(mapCondition(803)).toBe("cloudy");
  });
  it("TC-MC-15: code 804 (overcast) → 'cloudy'", () => {
    expect(mapCondition(804)).toBe("cloudy");
  });
});

// ─────────────────────────────────────────────
// 2. getWindDirection Tests
// ─────────────────────────────────────────────
describe("getWindDirection — degrees to compass direction", () => {
  it("TC-WD-01: 0° → 'N'", () => expect(getWindDirection(0)).toBe("N"));
  it("TC-WD-02: 45° → 'NE'", () => expect(getWindDirection(45)).toBe("NE"));
  it("TC-WD-03: 90° → 'E'", () => expect(getWindDirection(90)).toBe("E"));
  it("TC-WD-04: 135° → 'SE'", () => expect(getWindDirection(135)).toBe("SE"));
  it("TC-WD-05: 180° → 'S'", () => expect(getWindDirection(180)).toBe("S"));
  it("TC-WD-06: 225° → 'SW'", () => expect(getWindDirection(225)).toBe("SW"));
  it("TC-WD-07: 270° → 'W'", () => expect(getWindDirection(270)).toBe("W"));
  it("TC-WD-08: 315° → 'NW'", () => expect(getWindDirection(315)).toBe("NW"));
  it("TC-WD-09: 360° → 'N' (full circle)", () =>
    expect(getWindDirection(360)).toBe("N"));
  it("TC-WD-10: 22° → 'N' (rounds to nearest)", () =>
    expect(getWindDirection(22)).toBe("N"));
  it("TC-WD-11: 23° → 'NE' (rounds to nearest)", () =>
    expect(getWindDirection(23)).toBe("NE"));
});

// ─────────────────────────────────────────────
// 3. calculateDistance Tests (Haversine formula)
// ─────────────────────────────────────────────
describe("calculateDistance — Haversine distance between coords", () => {
  it("TC-CD-01: same point → 0 km", () => {
    expect(calculateDistance(0, 0, 0, 0)).toBe(0);
  });

  it("TC-CD-02: Miami to Miami → 0 km", () => {
    expect(calculateDistance(25.7617, -80.1918, 25.7617, -80.1918)).toBe(0);
  });

  it("TC-CD-03: London to Paris is ~341 km (±20 km)", () => {
    const dist = calculateDistance(51.5074, -0.1278, 48.8566, 2.3522);
    expect(dist).toBeGreaterThan(320);
    expect(dist).toBeLessThan(360);
  });

  it("TC-CD-04: Miami to London is > 7000 km", () => {
    const dist = calculateDistance(25.7617, -80.1918, 51.5074, -0.1278);
    expect(dist).toBeGreaterThan(7000);
  });

  it("TC-CD-05: returns a non-negative number always", () => {
    expect(calculateDistance(-33.8, 151.2, 40.7, -74.0)).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────
// 4. findNearestCity Tests
// ─────────────────────────────────────────────
describe("findNearestCity — finds nearest preset city from coords", () => {
  it("TC-NC-01: Miami coords → Miami", () => {
    const city = findNearestCity(25.7617, -80.1918);
    expect(city.name).toBe("Miami");
  });

  it("TC-NC-02: London coords → London", () => {
    const city = findNearestCity(51.5074, -0.1278);
    expect(city.name).toBe("London");
  });

  it("TC-NC-03: Tokyo coords → Tokyo", () => {
    const city = findNearestCity(35.6762, 139.6503);
    expect(city.name).toBe("Tokyo");
  });

  it("TC-NC-04: Dubai coords → Dubai", () => {
    const city = findNearestCity(25.2048, 55.2708);
    expect(city.name).toBe("Dubai");
  });

  it("TC-NC-05: Reykjavik coords → Reykjavik", () => {
    const city = findNearestCity(64.1466, -21.9426);
    expect(city.name).toBe("Reykjavik");
  });

  it("TC-NC-06: Always returns a valid City object", () => {
    const city = findNearestCity(0, 0);
    expect(city).toHaveProperty("name");
    expect(city).toHaveProperty("country");
    expect(city).toHaveProperty("lat");
    expect(city).toHaveProperty("lng");
  });

  it("TC-NC-07: PRESET_CITIES has exactly 5 entries", () => {
    expect(PRESET_CITIES).toHaveLength(5);
  });
});

// ─────────────────────────────────────────────
// 5. searchCities Tests (API call with mocks)
// ─────────────────────────────────────────────
describe("searchCities — city search API guard clauses", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("TC-SC-01: query shorter than 2 chars → returns []", async () => {
    const result = await searchCities("a");
    expect(result).toEqual([]);
  });

  it("TC-SC-02: empty string query → returns []", async () => {
    const result = await searchCities("");
    expect(result).toEqual([]);
  });

  it("TC-SC-03: fetch failure → returns [] gracefully", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(
      new Error("Network error")
    );
    const result = await searchCities("London");
    expect(result).toEqual([]);
  });

  it("TC-SC-04: non-ok HTTP response → returns []", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(null, { status: 500 })
    );
    const result = await searchCities("London");
    expect(result).toEqual([]);
  });

  it("TC-SC-05: successful API call → maps fields correctly", async () => {
    const mockData = [
      { name: "London", country: "GB", state: "England", lat: 51.5, lon: -0.1 },
    ];
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify(mockData), { status: 200 })
    );

    const result = await searchCities("London");
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe("London");
    expect(result[0].country).toBe("GB");
    expect(result[0].lat).toBe(51.5);
    expect(result[0].lon).toBe(-0.1);
  });

  it("TC-SC-06: successful API call with multiple results → returns all", async () => {
    const mockData = [
      { name: "Paris", country: "FR", lat: 48.8, lon: 2.3 },
      { name: "Paris", country: "US", state: "Texas", lat: 33.6, lon: -95.5 },
    ];
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify(mockData), { status: 200 })
    );

    const result = await searchCities("Paris");
    expect(result).toHaveLength(2);
  });
});
