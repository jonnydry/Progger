import { describe, it, expect, beforeEach, vi } from "vitest";
import express from "express";
import request from "supertest";

const mockGenerateChordProgression = vi.hoisted(() => vi.fn());
const mockAnalyzeCustomProgression = vi.hoisted(() => vi.fn());
const mockCreateAIGenerationLimiter = vi.hoisted(() =>
  vi.fn(async () => (req: any, _res: any, next: any) => next()),
);
const mockCsrfProtection = vi.hoisted(() =>
  vi.fn((req: any, _res: any, next: any) => next()),
);
const mockGenerateCsrfToken = vi.hoisted(() => vi.fn(() => "test-csrf-token"));
const mockGetRateLimitStatus = vi.hoisted(() =>
  vi.fn(() => ({
    storeType: "memory",
    connected: true,
  })),
);
const mockStorage = vi.hoisted(() => ({
  getUserStashItems: vi.fn(),
  createStashItem: vi.fn(),
  deleteStashItem: vi.fn(),
}));
const mockSetupAuth = vi.hoisted(() => vi.fn());
const mockIsAuthenticated = vi.hoisted(
  () => vi.fn((req: any, _res: any, next: any) => next()),
);

// Mock dependencies
vi.mock("../xaiService", () => ({
  generateChordProgression: mockGenerateChordProgression,
  analyzeCustomProgression: mockAnalyzeCustomProgression,
}));
vi.mock("../storage", () => ({
  storage: mockStorage,
}));
vi.mock("../replitAuth", () => ({
  setupAuth: mockSetupAuth,
  isAuthenticated: mockIsAuthenticated,
}));
vi.mock("../rateLimit", () => ({
  createAIGenerationLimiter: mockCreateAIGenerationLimiter,
  getRateLimitStatus: mockGetRateLimitStatus,
}));
vi.mock("csrf-sync", () => ({
  csrfSync: () => ({
    csrfSynchronisedProtection: mockCsrfProtection,
    generateToken: mockGenerateCsrfToken,
  }),
}));

describe("API Routes", () => {
  let app: express.Express;
  let registerRoutes: typeof import("../routes").registerRoutes;

  beforeEach(async () => {
    vi.clearAllMocks();
    app = express();
    app.use(express.json());

    ({ registerRoutes } = await import("../routes"));

    // Mock authentication middleware
    mockSetupAuth.mockResolvedValue(undefined);
    mockIsAuthenticated.mockImplementation(
      (req, res, next) => {
        // Mock authenticated user for stash routes
        if (req.path.includes("/stash")) {
          (req as any).user = {
            claims: { sub: "test-user-id" },
          };
        }
        next();
      },
    );

    await registerRoutes(app);
  });

  describe("POST /api/generate-progression", () => {
    it("should validate request body", async () => {
      const response = await request(app)
        .post("/api/generate-progression")
        .send({ invalid: "data" });

      expect(response.status).toBe(400);
    });

    it("should accept valid progression request", async () => {
      const mockResult = {
        progression: [
          { chordName: "C", musicalFunction: "Tonic", relationToKey: "I" },
        ],
        scales: [{ name: "C Major", rootNote: "C" }],
      };

      mockGenerateChordProgression.mockResolvedValue(mockResult as any);

      const response = await request(app)
        .post("/api/generate-progression")
        .send({
          key: "C",
          mode: "major",
          includeTensions: false,
          numChords: 4,
          selectedProgression: "auto",
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
    });
  });

  describe("POST /api/analyze-custom-progression", () => {
    it("should validate chords array", async () => {
      const response = await request(app)
        .post("/api/analyze-custom-progression")
        .send({ chords: "not an array" });

      expect(response.status).toBe(400);
    });

    it("should accept valid custom progression", async () => {
      const mockResult = {
        progression: [
          { chordName: "C", musicalFunction: "Tonic", relationToKey: "I" },
          {
            chordName: "Am",
            musicalFunction: "Submediant",
            relationToKey: "vi",
          },
        ],
        scales: [{ name: "C Major", rootNote: "C" }],
      };

      mockAnalyzeCustomProgression.mockResolvedValue(mockResult as any);

      const response = await request(app)
        .post("/api/analyze-custom-progression")
        .send({ chords: ["C", "Am", "F", "G"] });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockResult);
    });
  });

  describe("GET /api/stash", () => {
    it("should require authentication", async () => {
      // Without authentication, should return 401
      mockIsAuthenticated.mockImplementation((req, res) => {
        res.status(401).json({ message: "Unauthorized" });
        return;
      });

      const response = await request(app).get("/api/stash");
      expect(response.status).toBe(401);
    });

    it("should return stash items for authenticated user", async () => {
      const mockItems = [
        {
          id: "1",
          userId: "test-user-id",
          name: "Test Progression",
          key: "C",
          mode: "major",
          progressionData: {},
          createdAt: new Date(),
        },
      ];

      mockStorage.getUserStashItems.mockResolvedValue(mockItems as any);

      const response = await request(app).get("/api/stash");
      expect(response.status).toBe(200);
      expect(response.body).toEqual([
        { ...mockItems[0], createdAt: mockItems[0].createdAt.toISOString() },
      ]);
    });
  });

  describe("POST /api/stash", () => {
    it("should validate stash item data", async () => {
      const response = await request(app)
        .post("/api/stash")
        .send({ invalid: "data" });

      expect(response.status).toBe(400);
    });

    it("should create stash item with valid data", async () => {
      const mockItem = {
        id: "1",
        userId: "test-user-id",
        name: "Test Progression",
        key: "C",
        mode: "major",
        progressionData: {
          progression: [],
          scales: [],
        },
        createdAt: new Date(),
      };

      mockStorage.createStashItem.mockResolvedValue(mockItem as any);

      const response = await request(app)
        .post("/api/stash")
        .send({
          name: "Test Progression",
          key: "C",
          mode: "major",
          progressionData: {
            progression: [],
            scales: [],
          },
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe("Test Progression");
    });
  });
});
