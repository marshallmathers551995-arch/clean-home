import { afterEach, describe, expect, it, vi } from "vitest";
import { generateOrderNumber } from "./order-number";
import { paymentProvider } from "./payments";
import { siteUrl } from "./site";

afterEach(() => vi.unstubAllEnvs());

describe("order numbers", () => {
  it("looks like CH- plus 8 readable characters", () => {
    expect(generateOrderNumber()).toMatch(/^CH-[2-9A-HJ-NP-Z]{8}$/);
  });
  it("does not repeat or count upwards", () => {
    const numbers = new Set(Array.from({ length: 2000 }, generateOrderNumber));
    expect(numbers.size).toBe(2000);
  });
});

describe("payment provider", () => {
  it("uses Stripe whenever a secret key is configured", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_123");
    expect(paymentProvider()).toBe("stripe");
  });
  it("never offers the mock page in production, even if asked to", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    vi.stubEnv("PAYMENT_PROVIDER", "mock");
    expect(paymentProvider()).toBe("none");
  });
  it("switches online payment off in production when Stripe is not configured", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    vi.stubEnv("PAYMENT_PROVIDER", "");
    expect(paymentProvider()).toBe("none");
  });
  it("uses the mock page in development without keys", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    vi.stubEnv("PAYMENT_PROVIDER", "mock");
    expect(paymentProvider()).toBe("mock");
  });
  it("does not silently fall back to mock when Stripe is requested but has no key", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    vi.stubEnv("PAYMENT_PROVIDER", "stripe");
    expect(paymentProvider()).toBe("none");
  });
});

describe("site url", () => {
  it("prefers APP_URL, then Vercel's production URL, then localhost", () => {
    vi.stubEnv("APP_URL", "https://cleanhome.my/");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "cleanhome.vercel.app");
    expect(siteUrl()).toBe("https://cleanhome.my");
    vi.stubEnv("APP_URL", "");
    expect(siteUrl()).toBe("https://cleanhome.vercel.app");
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "");
    vi.stubEnv("VERCEL_URL", "");
    expect(siteUrl()).toBe("http://localhost:3000");
  });
});
