const request = require("supertest");
const { app } = require("../../backend/app");
const { User } = require("../../backend/models");

jest.mock("../../backend/models");

describe("Users API", () => {
  test("GET /api/users returns list of users", async () => {
    User.findAll.mockResolvedValue([
      { id: 1, name: "Lukasz", email: "lukasz@example.com" },
    ]);

    const res = await request(app).get("/api/users");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([
      { id: 1, name: "Lukasz", email: "lukasz@example.com" },
    ]);
  });

  test("GET /api/users returns error on failure", async () => {
    User.findAll.mockRejectedValue(new Error("DB Error"));

    const res = await request(app).get("/api/users");

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe("Failed to fetch users;-[");
  });
});
