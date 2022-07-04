import { ForbiddenException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { User } from "@modules/users/User.entity";
import { JwtStrategy } from "../strategies/jwt.strategy";
import { JwtPayload } from "../types/JwtPayload.interface";

const mockUser = (): User =>
  ({
    id: 1,
    email: "test@test.com"
  } as User);

const mockJwtPayload = (): JwtPayload => ({
  sub: 1,
  email: "test@test.com",
  exp: Date.now() / 1000 + 15 * 60,
  iat: Date.now() / 1000
});

describe("JwtStrategy", () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === "jwt.accessToken.secret") {
                return "secret";
              }
            })
          }
        }
      ]
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  describe("validate", () => {
    it("validates and returns the user", async () => {
      const result = await jwtStrategy.validate(mockJwtPayload());
      expect(result).toEqual(mockUser());
    });

    it("throws an error if token has expired", async () => {
      expect(
        jwtStrategy.validate({ ...mockJwtPayload(), exp: 1 })
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
