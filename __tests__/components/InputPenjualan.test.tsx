import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InputPenjualan from "@/app/dashboard/penjualan/page";

// Mock fetch
const mockProducts = [
  {
    id: 1,
    name: "Gula Pasir 1kg",
    unit: "kg",
    stock: 10,
    priceSell: 15000,
    isActive: true,
  },
  {
    id: 2,
    name: "Kopi Hitam",
    unit: "pcs",
    stock: 2,
    priceSell: 5000,
    isActive: true,
  },
];

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(mockProducts),
  })
) as jest.Mock;

describe("InputPenjualan Component - Strict Stock Validation", () => {
  beforeEach(() => {
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should prevent adding to cart if quantity exceeds stock on initial add", async () => {
    render(<InputPenjualan />);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText("Gula Pasir 1kg")).toBeInTheDocument();
    });

    // Find the '+' button for Gula Pasir
    const addButtons = screen.getAllByText("+", { selector: 'button[title="Tambah ke struk"]' });
    const addGulaButton = addButtons[0]; // Gula Pasir is first

    // Add 10 times (should succeed)
    for (let i = 0; i < 10; i++) {
      fireEvent.click(addGulaButton);
    }

    // Try to add the 11th time
    fireEvent.click(addGulaButton);

    // Verify alert was called
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining("Stok tidak cukup")
    );

    // Verify cart quantity is still 10, not 11
    const qtyText = screen.getByText("10", { selector: ".qtyText" });
    expect(qtyText).toBeInTheDocument();
  });

  it("should prevent incrementing quantity in cart if it exceeds stock", async () => {
    render(<InputPenjualan />);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText("Kopi Hitam")).toBeInTheDocument();
    });

    const addButtons = screen.getAllByText("+", { selector: 'button[title="Tambah ke struk"]' });
    const addKopiButton = addButtons[1]; // Kopi Hitam is second

    // Add once to get it into the cart
    fireEvent.click(addKopiButton);

    // Now find the increment button inside the cart list
    const cartIncrementButton = screen.getByText("+", { selector: ".qtyButton" });

    // Increment to 2 (should succeed, stock is 2)
    fireEvent.click(cartIncrementButton);

    // Try to increment to 3 (should fail)
    fireEvent.click(cartIncrementButton);

    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining("Stok tidak cukup")
    );

    // Verify cart quantity is still 2
    const qtyText = screen.getByText("2", { selector: ".qtyText" });
    expect(qtyText).toBeInTheDocument();
  });
});
