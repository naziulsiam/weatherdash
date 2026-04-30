/**
 * TEAM 404 — QA Test Suite
 * Client: MR AKIF
 * Module: WeatherContext.tsx — Context logic and state management tests
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import React from "react";
import { WeatherProvider, useWeather } from "@/context/WeatherContext";
import { weatherScenarios } from "@/data/mockWeather";

// Wrapper to provide the context
const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(WeatherProvider, null, children);

// ─────────────────────────────────────────────
// Setup: mock timers and API key env
// ─────────────────────────────────────────────
beforeEach(() => {
  vi.useFakeTimers();
  // Ensure no API key so we always use mock data
  vi.stubEnv("VITE_OPENWEATHER_API_KEY", "");
  // Mock localStorage
  const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] ?? null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { store = {}; },
    };
  })();
  Object.defineProperty(globalThis, "localStorage", { value: localStorageMock, writable: true });
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

// ─────────────────────────────────────────────
// 1. Initial State
// ─────────────────────────────────────────────
describe("WeatherContext — initial state", () => {
  it("TC-CTX-01: starts with unit = 'F'", async () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    expect(result.current.unit).toBe("F");
  });

  it("TC-CTX-02: starts loading = true", () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    expect(result.current.loading).toBe(true);
  });

  it("TC-CTX-03: starts with selectedCity = 'Miami'", () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    expect(result.current.selectedCity).toBe("Miami");
  });

  it("TC-CTX-04: starts with no dismissed alerts", () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    expect(result.current.dismissedAlerts).toEqual([]);
  });

  it("TC-CTX-05: starts with empty saved cities", () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    expect(result.current.savedCities).toEqual([]);
  });
});

// ─────────────────────────────────────────────
// 2. Unit Toggle
// ─────────────────────────────────────────────
describe("WeatherContext — unit toggle (°F / °C)", () => {
  it("TC-CTX-06: setUnit('C') changes unit to 'C'", () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    act(() => { result.current.setUnit("C"); });
    expect(result.current.unit).toBe("C");
  });

  it("TC-CTX-07: setUnit('F') changes unit back to 'F'", () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    act(() => { result.current.setUnit("C"); });
    act(() => { result.current.setUnit("F"); });
    expect(result.current.unit).toBe("F");
  });
});

// ─────────────────────────────────────────────
// 3. convertTemp function
// ─────────────────────────────────────────────
describe("WeatherContext — convertTemp()", () => {
  it("TC-CTX-08: unit=F → returns raw Fahrenheit value", () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    act(() => { result.current.setUnit("F"); });
    expect(result.current.convertTemp(88)).toBe(88);
  });

  it("TC-CTX-09: unit=C → converts 88°F to 31°C", () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    act(() => { result.current.setUnit("C"); });
    expect(result.current.convertTemp(88)).toBe(31);
  });

  it("TC-CTX-10: unit=C → converts 32°F to 0°C", () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    act(() => { result.current.setUnit("C"); });
    expect(result.current.convertTemp(32)).toBe(0);
  });

  it("TC-CTX-11: unit=C → converts 212°F to 100°C", () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    act(() => { result.current.setUnit("C"); });
    expect(result.current.convertTemp(212)).toBe(100);
  });
});

// ─────────────────────────────────────────────
// 4. Alert Dismissal
// ─────────────────────────────────────────────
describe("WeatherContext — alert dismissal", () => {
  it("TC-CTX-12: dismissAlert adds the id to dismissedAlerts", () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    act(() => { result.current.dismissAlert("a1"); });
    expect(result.current.dismissedAlerts).toContain("a1");
  });

  it("TC-CTX-13: dismissing multiple alerts accumulates ids", () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    act(() => { result.current.dismissAlert("a1"); });
    act(() => { result.current.dismissAlert("a2"); });
    expect(result.current.dismissedAlerts).toContain("a1");
    expect(result.current.dismissedAlerts).toContain("a2");
    expect(result.current.dismissedAlerts).toHaveLength(2);
  });
});

// ─────────────────────────────────────────────
// 5. Saved Cities
// ─────────────────────────────────────────────
describe("WeatherContext — saved cities", () => {
  it("TC-CTX-14: addSavedCity adds a city", () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    act(() => { result.current.addSavedCity({ name: "Berlin" }); });
    expect(result.current.savedCities).toHaveLength(1);
    expect(result.current.savedCities[0].name).toBe("Berlin");
  });

  it("TC-CTX-15: addSavedCity does not add duplicates", () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    act(() => { result.current.addSavedCity({ name: "Berlin" }); });
    act(() => { result.current.addSavedCity({ name: "Berlin" }); });
    expect(result.current.savedCities).toHaveLength(1);
  });

  it("TC-CTX-16: removeSavedCity removes the city", () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    act(() => { result.current.addSavedCity({ name: "Berlin" }); });
    act(() => { result.current.removeSavedCity("Berlin"); });
    expect(result.current.savedCities).toHaveLength(0);
  });

  it("TC-CTX-17: cannot save more than 5 cities (limit enforced)", () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    const cities = ["A", "B", "C", "D", "E", "F"];
    act(() => {
      cities.forEach((name) => result.current.addSavedCity({ name }));
    });
    expect(result.current.savedCities).toHaveLength(5);
  });

  it("TC-CTX-18: removeSavedCity on non-existent city leaves list unchanged", () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    act(() => { result.current.addSavedCity({ name: "Berlin" }); });
    act(() => { result.current.removeSavedCity("Tokyo"); });
    expect(result.current.savedCities).toHaveLength(1);
  });
});

// ─────────────────────────────────────────────
// 6. useWeather hook guard
// ─────────────────────────────────────────────
describe("useWeather — guard clause", () => {
  it("TC-CTX-19: throws error when used outside WeatherProvider", () => {
    // Suppress console.error for this test
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useWeather())).toThrow(
      "useWeather must be used within WeatherProvider"
    );
    spy.mockRestore();
  });
});

// ─────────────────────────────────────────────
// 7. City selection (mock data path)
// ─────────────────────────────────────────────
describe("WeatherContext — selectCity (mock data path)", () => {
  it("TC-CTX-20: selectCity changes selectedCity immediately", async () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    act(() => { result.current.selectCity("London"); });
    expect(result.current.selectedCity).toBe("London");
  });

  it("TC-CTX-21: selectCity resets dismissedAlerts", () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    act(() => { result.current.dismissAlert("a1"); });
    act(() => { result.current.selectCity("Tokyo"); });
    expect(result.current.dismissedAlerts).toEqual([]);
  });

  it("TC-CTX-22: selectedCity is updated correctly when switching cities", () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    act(() => { result.current.selectCity("London"); });
    expect(result.current.selectedCity).toBe("London");
    act(() => { result.current.selectCity("Tokyo"); });
    expect(result.current.selectedCity).toBe("Tokyo");
  });

  it("TC-CTX-23: selectCity sets loading=true immediately on city switch", () => {
    const { result } = renderHook(() => useWeather(), { wrapper });
    // After initial mount loading may be true or false; select a new city
    act(() => { result.current.selectCity("Dubai"); });
    // loading resets to true when a new city is selected
    expect(result.current.loading).toBe(true);
  });
});
