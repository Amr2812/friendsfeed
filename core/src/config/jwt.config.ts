import { registerAs } from "@nestjs/config";

export const jwtConfig = registerAs("jwt", () => ({
  accessToken: {
    secret: process.env.JWT_ACCESS_SECRET,
    expiresIn:
      process.env.NODE_ENV == "development"
        ? 1000 * 60 * 60 * 2 // 2 hours
        : 1000 * 60 * 15 // 15 minutes
  },
  refreshToken: {
    secret: process.env.JWT_REFRESH_SECRET,
    expiresIn: 1000 * 60 * 60 * 24 * 7 * 2 // 2 weeks
  }
}));
