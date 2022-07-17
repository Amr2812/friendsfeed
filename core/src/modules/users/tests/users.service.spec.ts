import { NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ConfigService } from "@nestjs/config";
import { CloudStorageService } from "@common/providers";
import { UserRepository } from "../user.repository";
import { UsersService } from "../users.service";
import { UserSafeData } from "../types";

const mockConfigService: ConfigService = {
  get: jest.fn().mockReturnValue({
    storage: {
      usersFolder: "users"
    }
  })
} as unknown as ConfigService;

const mockUser = (): Partial<UserSafeData> => ({
  id: 1,
  email: "t@test.com",
  picture: "picture.jpg"
});

const mockUserId = (): number => 1;

describe("UsersService", () => {
  let usersService: UsersService;
  let userRepository: UserRepository;
  let storageService: CloudStorageService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UserRepository, useValue: {} },
        { provide: CloudStorageService, useValue: {} },
        { provide: ConfigService, useValue: mockConfigService }
      ]
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
    storageService = module.get<CloudStorageService>(CloudStorageService);
  });

  describe("getUserById", () => {
    it("should return user", async () => {
      userRepository.findSafeUserById = jest.fn().mockResolvedValue(mockUser());

      const user = await usersService.getUserById(mockUserId());

      expect(user).toEqual(mockUser());
      expect(userRepository.findSafeUserById).toHaveBeenCalledWith(
        mockUserId()
      );
    });

    it("should throw error if user not found", () => {
      userRepository.findSafeUserById = jest.fn().mockResolvedValue(null);

      expect(usersService.getUserById(mockUserId())).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe("updatePicture", () => {
    beforeEach(() => {
      userRepository.updateUser = jest.fn().mockResolvedValue({ affected: 1 });
      storageService.deleteFile = jest.fn();
    });

    it("should update user picture", async () => {
      const user = mockUser();
      user.picture = null;
      userRepository.findUserById = jest.fn().mockResolvedValue({
        picture: user.picture
      });

      const result = await usersService.updatePicture(mockUserId(), {
        publicUrl: mockUser().picture
      });

      expect(result).toEqual({
        picture: mockUser().picture
      });
      expect(userRepository.findUserById).toHaveBeenCalledWith(mockUserId(), [
        "picture"
      ]);
      expect(userRepository.updateUser).toHaveBeenCalledWith(mockUserId(), {
        picture: mockUser().picture
      });
      expect(storageService.deleteFile).not.toHaveBeenCalled();
    });

    it("should delete old picture before updating it", async () => {
      const user = mockUser();
      user.picture = "oldPicture.jpg";
      userRepository.findUserById = jest.fn().mockResolvedValue({
        picture: user.picture
      });

      const result = await usersService.updatePicture(mockUserId(), {
        publicUrl: mockUser().picture
      });

      expect(result).toEqual({
        picture: mockUser().picture
      });
      expect(userRepository.findUserById).toHaveBeenCalledWith(user.id, [
        "picture"
      ]);
      expect(storageService.deleteFile).toHaveBeenCalledWith(
        mockConfigService.get("storage.usersFolder"),
        "oldPicture.jpg"
      );
      expect(userRepository.updateUser).toHaveBeenCalledWith(mockUserId(), {
        picture: mockUser().picture
      });
    });
  });
});
