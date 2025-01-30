const request = require("supertest");
const { app } = require("../../backend/app");

describe("E2E Authentication Tests", () => {
  test("User can register and login", async () => {
    const registerRes = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Test",
        email: "test@example.com",
        password: "password",
        role: "athlete",
      });

    expect(registerRes.statusCode).toBe(201);

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password" });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.token).toBeDefined();
  });
});
