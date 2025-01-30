import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CoachView from "../../frontend/CoachView";
import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const mock = new MockAdapter(axios);

describe("CoachView Component", () => {
  beforeEach(() => {
    mock.reset();
  });

  test("renders CoachView without crashing", async () => {
    render(<CoachView />);
    expect(screen.getByText("Manage Athletes")).toBeInTheDocument();
  });

  test("fetches and displays athletes", async () => {
    mock
      .onGet("http://localhost:3000/api/users?role=athlete")
      .reply(200, [{ id: "1", name: "Gosz" }]);

    render(<CoachView />);
    expect(await screen.findByText("Gosz")).toBeInTheDocument();
  });

  test("handles API error", async () => {
    mock.onGet("http://localhost:3000/api/users?role=athlete").reply(500);

    render(<CoachView />);
    expect(
      await screen.findByText("Failed to fetch athletes.")
    ).toBeInTheDocument();
  });
});
