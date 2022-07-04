import { Test } from "@nestjs/testing";
import { UserSafeData } from "../types";
import { UsersController } from "../users.controller";
import { UsersService } from "../users.service";

const mockUser = (): Partial<UserSafeData> => ({
  id: 1,
  email: "test",
  picture: "http://test.com/picture.jpg"
});

const mockUserId = (): number => 1;

const mockFile = () => ({
  publicUrl: "http://test.com/picture.jpg"
});

describe("UsersController", () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: {} }]
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
    usersService.getUserById = jest.fn().mockResolvedValue(mockUser());
  });

  describe("getProfile", () => {
    it("should return user profile", async () => {
      const result = await usersController.getProfile(mockUserId());

      expect(result).toEqual(mockUser());
      expect(usersService.getUserById).toHaveBeenCalledWith(mockUserId());
    });
  });

  describe("getUserById", () => {
    it("should return user profile", async () => {
      const result = await usersController.getUserById(mockUserId());

      expect(result).toEqual(mockUser());
      expect(usersService.getUserById).toHaveBeenCalledWith(mockUserId());
    });
  });

  describe("updatePicture", () => {
    it("should return updated user", async () => {
      usersService.updatePicture = jest.fn().mockResolvedValue({
        picture: mockFile().publicUrl
      });

      const result = await usersController.updatePicture(
        mockUserId(),
        mockFile()
      );

      expect(result).toEqual({ picture: mockFile().publicUrl });
      expect(usersService.updatePicture).toHaveBeenCalledWith(
        mockUserId(),
        mockFile()
      );
    });
  });
});
