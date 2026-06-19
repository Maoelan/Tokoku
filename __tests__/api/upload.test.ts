import { POST } from "@/app/api/upload/route";

// Mock Supabase
jest.mock("@/lib/supabase", () => {
  return {
    supabase: {
      storage: {
        from: jest.fn().mockReturnValue({
          upload: jest.fn(),
          getPublicUrl: jest.fn().mockReturnValue({ data: { publicUrl: "https://mock-supabase.com/image.png" } }),
        }),
      },
    },
  };
});

// Import after mocking
import { supabase } from "@/lib/supabase";

// Mock NextResponse
jest.mock("next/server", () => {
  return {
    NextResponse: {
      json: (body: unknown, init?: unknown) => {
        return {
          status: init?.status || 200,
          json: async () => body,
        };
      },
    },
  };
});

describe("POST /api/upload - Supabase Storage", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if no file is provided in formData", async () => {
    const req = {
      formData: async () => ({
        get: () => null,
      }),
    } as unknown as Request;

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe("File tidak ditemukan");
  });

  it("should upload to Supabase and return 200 with imageUrl if successful", async () => {
    const req = {
      formData: async () => ({
        get: (key: string) => {
          if (key === "file") {
            return {
              name: "test-image.png",
              type: "image/png",
              arrayBuffer: async () => Buffer.from("dummy content"),
            };
          }
          return null;
        },
      }),
    } as unknown as Request;

    // Ensure upload resolves successfully
    const mockUpload = supabase.storage.from("products").upload as jest.Mock;
    mockUpload.mockResolvedValueOnce({ data: { path: "test.png" }, error: null });

    const res = await POST(req);
    const json = await res.json();

    expect(mockUpload).toHaveBeenCalledTimes(1);
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.imageUrl).toBe("https://mock-supabase.com/image.png");
  });

  it("should return 500 if Supabase upload fails", async () => {
    const req = {
      formData: async () => ({
        get: (key: string) => {
          if (key === "file") {
            return {
              name: "test-image.png",
              type: "image/png",
              arrayBuffer: async () => Buffer.from("dummy content"),
            };
          }
          return null;
        },
      }),
    } as unknown as Request;

    // Simulate Supabase error
    const mockUpload = supabase.storage.from("products").upload as jest.Mock;
    mockUpload.mockResolvedValueOnce({ data: null, error: new Error("Upload limit reached") });

    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Gagal mengupload gambar ke cloud");

    consoleSpy.mockRestore();
  });
});
