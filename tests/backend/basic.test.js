const request = require("supertest");
const app = require("../../backend/app");

describe("Basic API Tests", () => {
  test("GET / should return 200", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });
});
