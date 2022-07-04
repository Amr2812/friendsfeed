import * as bcrypt from "bcrypt";
import { User } from "../User.entity";

const mockUserPassword = (): string => "testPassword";

describe("UserEntity", () => {
  let user: User;

  beforeEach(() => {
    user = new User();
    user.password = mockUserPassword();
  });

  describe("hashPassword", () => {
    it("should hash the password", async () => {
      const salt = await bcrypt.genSalt();
      jest.spyOn(bcrypt, "genSalt").mockImplementation(() => salt);
      jest.spyOn(bcrypt, "hash");

      await user.hashPassword();

      expect(bcrypt.genSalt).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserPassword(), salt);
      expect(user.password).not.toBe(mockUserPassword());
    });
  });

  describe("validatePassword", () => {
    it("should return true if the password is valid", async () => {
      jest.spyOn(bcrypt, "compare").mockImplementation(() => true);

      const result = await user.validatePassword(mockUserPassword());
      expect(result).toBe(true);
    });

    it("should return false if the password is invalid", async () => {
      jest.spyOn(bcrypt, "compare").mockImplementation(() => false);

      const result = await user.validatePassword("wrongPassword");

      expect(bcrypt.compare).toHaveBeenCalledWith(
        "wrongPassword",
        user.password
      );
      expect(result).toBe(false);
    });
  });
});
