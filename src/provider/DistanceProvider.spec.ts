/* eslint-disable @typescript-eslint/no-explicit-any */
import { BadRequestException } from "@/shared/error/exceptions/badRequest-exception";
import { InternalServerException } from "@/shared/error/exceptions/internalServer-exception";
import { ExternalServiceUnauthorizedException } from "@/shared/error/exceptions/unauthorizedInternal-exception";
import { DistanceProvider } from "./DistanceProvider";

describe("Unit test - DistanceProvider", () => {
  const originalFetch = global.fetch;
  const originalApiKey = process.env.KEY_DISTANCEMATRIX;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.KEY_DISTANCEMATRIX = "test-key";
  });

  afterEach(() => {
    global.fetch = originalFetch;
    if (originalApiKey) {
      process.env.KEY_DISTANCEMATRIX = originalApiKey;
    } else {
      delete process.env.KEY_DISTANCEMATRIX;
    }
  });

  it("should throw ExternalServiceUnauthorizedException when provider returns REQUEST_DENIED", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        status: "REQUEST_DENIED",
        rows: [{ elements: [{ status: "REQUEST_DENIED" }] }],
      }),
    } as any);

    const provider = new DistanceProvider();

    await expect(provider.getDistance("origin", "destination")).rejects.toBeInstanceOf(
      ExternalServiceUnauthorizedException,
    );
  });

  it("should throw BadRequestException when provider returns INVALID_REQUEST", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        status: "INVALID_REQUEST",
        rows: [{ elements: [{ status: "NOT_FOUND" }] }],
      }),
    } as any);

    const provider = new DistanceProvider();

    await expect(provider.getDistance("origin", "destination")).rejects.toBeInstanceOf(BadRequestException);
  });

  it("should throw InternalServerException when API key is missing", async () => {
    delete process.env.KEY_DISTANCEMATRIX;

    const provider = new DistanceProvider();

    await expect(provider.getDistance("origin", "destination")).rejects.toBeInstanceOf(InternalServerException);
  });

  it("should throw InternalServerException on network failure", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("network down"));

    const provider = new DistanceProvider();

    await expect(provider.getDistance("origin", "destination")).rejects.toBeInstanceOf(InternalServerException);
  });
});
