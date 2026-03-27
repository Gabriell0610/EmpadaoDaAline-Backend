import { AddressRepository } from "@/repository/prisma/address/address.prisma";
import { UserRepository } from "../../repository/prisma/user/user.prisma";
import { UserService } from "../../service/user/user.service";
import { UserController } from "./User.controller";

const userRepository = new UserRepository();
const userAddress = new AddressRepository()
const userService = new UserService(userRepository, userAddress);
const userController = new UserController(userService);

export { userController };
