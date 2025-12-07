import { render, screen } from "@testing-library/react";
import Menu from "../Menu";
import { waitFor } from "@testing-library/react";

test("fetches and displays menu items from API", async () => {
  render(<Menu />);

  // Check loading happens
  expect(screen.getByText(/menu/i)).toBeInTheDocument();

  // Wait for API data to load
  const burger = await waitFor(() =>
    screen.getByText("Burger")
  );

  const pizza = screen.getByText("Pizza");

  expect(burger).toBeInTheDocument();
  expect(pizza).toBeInTheDocument();
});
