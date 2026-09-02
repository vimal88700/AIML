import { describe, expect, it, afterEach } from "vitest";
import { passwordsMatch } from "./adminAuth";

describe("admin password authentication", () => {
  const original = process.env.ADMIN_PASSWORD;
  afterEach(() => { process.env.ADMIN_PASSWORD = original; });

  it("accepts only the configured password", () => {
    process.env.ADMIN_PASSWORD = "test-admin-password";
    expect(passwordsMatch("test-admin-password")).toBe(true);
    expect(passwordsMatch("wrong-password")).toBe(false);
    expect(passwordsMatch("")).toBe(false);
  });
});

it("validates the configured ADMIN_PASSWORD secret", () => {
  const configured = process.env.ADMIN_PASSWORD;
  expect(configured).toBeTruthy();
  expect(passwordsMatch(configured || "")).toBe(true);
});
