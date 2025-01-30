import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../../frontend/src/App";

test("renders the welcome message", () => {
  render(<App />);
  const welcomeElement = screen.getByText(/Welcome to Training Manager/i);
  expect(welcomeElement).toBeInTheDocument();
});
