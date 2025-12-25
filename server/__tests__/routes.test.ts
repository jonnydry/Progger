import { describe, it, expect, beforeEach, vi } from "vitest";
import express from "express";
import request from "supertest";
import { registerRoutes } from "../routes";
import * as xaiService from "../xaiService";
import * as storage from "../storage";
import * as replitAuth from "../replitAuth";

// Mock dependencies
vi.mock("../xaiService");
vi.mock("../storage");
vi.mock("../replitAuth");

describe("API Routes", () => {
  let app: express.Express;
  let server: any;

  beforeEach(async () => {
    app = express();
    app.use(express.json());

    // Mock authentication middleware
    vi.mocked(replitAuth.setupAuth).mockResolvedValue(undefined);
    vi.mocked(replitAuth.isAuthenticated).mockImplementation(
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

    server = await registerRoutes(app);
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

      vi.mocked(xaiService.generateChordProgression).mockResolvedValue(
        mockResult as any,
      );

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

      vi.mocked(xaiService.analyzeCustomProgression).mockResolvedValue(
        mockResult as any,
      );

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
      vi.mocked(replitAuth.isAuthenticated).mockImplementation((req, res) => {
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

      vi.mocked(storage.storage.getUserStashItems).mockResolvedValue(
        mockItems as any,
      );

      const response = await request(app).get("/api/stash");
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockItems);
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

      vi.mocked(storage.storage.createStashItem).mockResolvedValue(
        mockItem as any,
      );

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
