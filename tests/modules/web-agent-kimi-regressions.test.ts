import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const source = () =>
  readFileSync(resolve(process.cwd(), "web-agent/agent.mjs"), "utf8");

describe("Kimi Web regressions", () => {
  it("persists the canonical URL after a legacy route migrates", () => {
    const agent = source();
    expect(agent).toContain(
      'new URL(session.conversationUrl).pathname.startsWith("/chat/p")',
    );
    expect(agent).toMatch(
      /migratedKimiConversation[\s\S]*?session\.conversationUrl = page\.url\(\)[\s\S]*?saveConversationBinding\(session\.slot,[\s\S]*?url: session\.conversationUrl/,
    );
  });

  it("waits briefly for Kimi's client-side canonical redirect", () => {
    expect(source()).toMatch(
      /adapter\.host === "www\.kimi\.com"[\s\S]*?pathname\.startsWith\("\/chat\/p"\)[\s\S]*?continue/,
    );
  });
});
