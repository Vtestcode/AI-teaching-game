import { describe, it, expect } from "vitest";
import { lsGet } from "../src/lib/storage";

describe("smoke", () => {
  it("lsGet fallback works", () => {
    const v = lsGet("definitely_not_real_key", { ok: true });
    expect(v.ok).toBe(true);
  });
});