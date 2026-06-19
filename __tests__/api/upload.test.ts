import { POST } from "@/app/api/upload/route";
import { promises as fs } from "fs";

// Mock the fs module
jest.mock("fs", () => ({
  promises: {
    writeFile: jest.fn(),
  },
}));

// Mock NextResponse
jest.mock("next/server", () => {
  return {
    NextResponse: {
      json: (body: any, init?: any) => {
        return {
          status: init?.status || 200,
          json: async () => body,
        };
      },
    },
  };
});

describe("POST /api/upload - File Upload", () => {
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

  it("should save the file and return 200 with imageUrl if upload is successful", async () => {
    const req = {
      formData: async () => ({
        get: (key: string) => {
          if (key === "file") {
            return {
              name: "test-image.png",
              arrayBuffer: async () => Buffer.from("dummy content"),
            };
          }
          return null;
        },
      }),
    } as unknown as Request;

    // Ensure writeFile resolves successfully
    (fs.writeFile as jest.Mock).mockResolvedValueOnce(undefined);

    const res = await POST(req);
    const json = await res.json();

    expect(fs.writeFile).toHaveBeenCalledTimes(1);
    
    // Verify the URL format matches the expected output
    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(json.imageUrl).toMatch(/^\/uploads\/\d+-\d+\.png$/);
  });

  it("should return 500 if fs.writeFile throws an error", async () => {
    const req = {
      formData: async () => ({
        get: (key: string) => {
          if (key === "file") {
            return {
              name: "test-image.png",
              arrayBuffer: async () => Buffer.from("dummy content"),
            };
          }
          return null;
        },
      }),
    } as unknown as Request;

    // Simulate a filesystem error (e.g. permission denied)
    (fs.writeFile as jest.Mock).mockRejectedValueOnce(new Error("Permission denied"));

    // Temporarily suppress console.error to keep test output clean
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe("Gagal mengupload gambar");

    consoleSpy.mockRestore();
  });
});
