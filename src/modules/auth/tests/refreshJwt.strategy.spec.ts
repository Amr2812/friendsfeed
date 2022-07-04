import { UnauthorizedException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { UserSafeData } from "@modules/users/types";
import { UserRepository } from "../../users/user.repository";
import { RefreshJwtStrategy } from "../strategies/refreshJwt.strategy";
import { JwtPayload } from "../types/JwtPayload.interface";

const mockUser = (): Partial<UserSafeData> => ({
  id: 1,
  email: "test@test.com",
  name: "Test User",
  picture: null,
  bio: null
});

const mockJwtPayload = (): JwtPayload => ({
  sub: 1,
  email: "test@test.com",
  exp: Date.now() / 1000 + 15 * 60,
  iat: Date.now() / 1000
});

const mockRequest = (): Request =>
  ({
    cookies: {
      refresh_token: "refresh_token"
    }
  } as Request);

describe("RefreshJwtStrategy", () => {
  let refreshJwtStrategy: RefreshJwtStrategy;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RefreshJwtStrategy,
        { provide: UserRepository, useValue: {} },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === "jwt.refreshToken.secret") {
                return "secret";
              }
            })
          }
        }
      ]
    }).compile();

    refreshJwtStrategy = module.get<RefreshJwtStrategy>(RefreshJwtStrategy);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe("validate", () => {
    it("validates and returns the user", async () => {
      userRepository.findSafeUserById = jest.fn().mockResolvedValue(mockUser());

      const result = await refreshJwtStrategy.validate(
        mockRequest(),
        mockJwtPayload()
      );
      expect(result).toEqual({
        ...mockUser(),
        refreshToken: mockRequest().cookies.refresh_token
      });
    });

    it("throws an error if user is not found", () => {
      userRepository.findSafeUserById = jest.fn().mockResolvedValue(null);

      expect(
        refreshJwtStrategy.validate(mockRequest(), mockJwtPayload())
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
