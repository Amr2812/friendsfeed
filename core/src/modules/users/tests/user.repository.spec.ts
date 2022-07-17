import { ConflictException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { User } from "../User.entity";
import { UserRepository } from "../user.repository";

const mockUser = (): Partial<User> => ({
  id: 1,
  name: "Test user",
  email: "test@test.com",
  picture: null,
  bio: null
});

const mockUserCredintials = (): Partial<User> => ({
  email: "test@test.com",
  password: "password"
});

describe("UserRepository", () => {
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository]
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
    userRepository.create = jest.fn().mockResolvedValue(mockUser());
  });

  describe("createUser", () => {
    it("creates a user", async () => {
      userRepository.insert = jest.fn().mockResolvedValue(mockUser());

      const user = await userRepository.createUser(mockUserCredintials());

      expect(user).toEqual(mockUser());
    });

    it("throws an error if email already exists", () => {
      userRepository.insert = jest.fn().mockRejectedValue({ code: "23505" });

      expect(userRepository.createUser(mockUserCredintials())).rejects.toThrow(
        ConflictException
      );
    });
  });

  describe("findSafeUserById", () => {
    it("returns a user", async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(mockUser());

      const user = await userRepository.findSafeUserById(mockUser().id);

      expect(user).toEqual(mockUser());
      expect(userRepository.findOne).toHaveBeenCalledWith(mockUser().id, {
        select: ["id", "name", "email", "picture", "bio"]
      });
    });
  });

  describe("findUserById", () => {
    it("returns a user id", async () => {
      userRepository.findOne = jest.fn().mockResolvedValue({ id: mockUser().id });

      const user = await userRepository.findUserById<{ id: number }>(
        mockUser().id,
        ["id"]
      );

      expect(user).toEqual({
        id: mockUser().id
      });
      expect(userRepository.findOne).toHaveBeenCalledWith(mockUser().id, {
        select: ["id"]
      });
    });
  });

  describe("updateUser", () => {
    beforeEach(() => {
      userRepository.update = jest.fn().mockResolvedValue({
        affected: 1
      });
      userRepository.findSafeUserById = jest
        .fn()
        .mockResolvedValue({ ...mockUser(), name: "New name", bio: "New bio" });
    });

    it("updates a user", async () => {
      const result = await userRepository.updateUser(mockUser().id, {
        name: "New name",
        bio: "New bio"
      });

      expect(result).toEqual({ affected: 1 });
      expect(userRepository.update).toHaveBeenCalledWith(mockUser().id, {
        name: "New name",
        bio: "New bio"
      });
      expect(userRepository.findSafeUserById).not.toHaveBeenCalled();
    });

    it("updates a user and returns it", async () => {
      const result = await userRepository.updateUser(
        mockUser().id,
        {
          name: "New name",
          bio: "New bio"
        },
        true
      );

      expect(result).toEqual({
        ...mockUser(),
        name: "New name",
        bio: "New bio"
      });
      expect(userRepository.update).toHaveBeenCalledWith(mockUser().id, {
        name: "New name",
        bio: "New bio"
      });
      expect(userRepository.findSafeUserById).toHaveBeenCalledWith(mockUser().id);
    });
  });

  describe("validateUserPassword", () => {
    let user: Partial<User>;

    beforeEach(() => {
      user = mockUser();
      userRepository.findOne = jest.fn().mockResolvedValue(user);
    });

    it("returns user if password is valid", async () => {
      user.validatePassword = jest.fn().mockResolvedValue(true);

      const result = await userRepository.validateUserPassword(
        mockUserCredintials()
      );

      expect(user.validatePassword).toBeCalledWith(
        mockUserCredintials().password
      );
      expect(result).toEqual(user);
    });

    it("returns null if password is invalid", async () => {
      user.validatePassword = jest.fn().mockResolvedValue(false);

      const result = await userRepository.validateUserPassword(
        mockUserCredintials()
      );

      expect(user.validatePassword).toBeCalledWith(
        mockUserCredintials().password
      );
      expect(result).toBeNull();
    });

    it("returns null if user doesn't exist", async () => {
      userRepository.findOne = jest.fn().mockResolvedValue(null);
      user.validatePassword = jest.fn().mockResolvedValue(false);

      const result = await userRepository.validateUserPassword(
        mockUserCredintials()
      );

      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
});
