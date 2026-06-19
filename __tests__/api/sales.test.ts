import { POST } from "@/app/api/sales/route";
import { db } from "@/db";

// Mock NextResponse
jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: (body: unknown, init?: unknown) => {
        return {
          status: (init as unknown)?.status || 200,
          json: async () => body,
        };
      },
    },
  };
});

// Mock the db
jest.mock("@/db", () => ({
  db: {
    transaction: jest.fn(),
  },
}));

describe("POST /api/sales - Stock Validation", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fail and return 400 if payload is invalid", async () => {
    const req = new Request("http://localhost/api/sales", {
      method: "POST",
      body: JSON.stringify({ userId: "1", items: [] }), // Empty items
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("Invalid data");
  });

  it("should return 500 and the error message if transaction throws due to insufficient stock", async () => {
    // Mock the transaction to throw an error (simulating the inner check failing)
    (db.transaction as jest.Mock).mockRejectedValueOnce(
      new Error("Stok Gula Pasir 1kg tidak mencukupi. Sisa: 10, diminta: 11")
    );

    const req = new Request("http://localhost/api/sales", {
      method: "POST",
      body: JSON.stringify({
        userId: "1",
        items: [{ productId: 1, quantity: 11, price: 15000 }],
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Stok Gula Pasir 1kg tidak mencukupi. Sisa: 10, diminta: 11");
  });

  it("should return success and saleId if transaction succeeds", async () => {
    // Mock the transaction to succeed and return an ID
    (db.transaction as jest.Mock).mockResolvedValueOnce(99);

    const req = new Request("http://localhost/api/sales", {
      method: "POST",
      body: JSON.stringify({
        userId: "1",
        items: [{ productId: 1, quantity: 5, price: 15000 }],
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.saleId).toBe(99);
  });
});
