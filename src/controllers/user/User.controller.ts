import { IUserService } from "../../service/user/IUserService.type";
import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "@/shared/constants/index";
import { authorizationBodySchema } from "@/utils/zod/schemas/token";
import { updateUserBodySchema } from "@/domain/dto/user/UpdateUserDto";
import { addressBodySchema, updateAddressBodySchema } from "@/domain/dto/address/AddressDto";

export class UserController {
  constructor(private userService: IUserService) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.userService.list();
      res.status(HttpStatus.OK).json({ message: "Listando usuários", data: data });
    } catch (error) {
      next(error);
    }
  };

  listLoggedUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requesterId } = authorizationBodySchema.parse(req.body);
      const data = await this.userService.listLoggedUser(requesterId);
      res.status(HttpStatus.OK).json({ message: "Listando usuário logado com sucesso!", data: data });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requesterId: userId, requesterEmail: userEmail } = authorizationBodySchema.parse(req.body);
      const dto = updateUserBodySchema.parse(req.body);
      const data = await this.userService.updateUser(dto, userId, userEmail);

      res.status(HttpStatus.OK).json({ message: "Usuário atualizado com sucesso!", data: data });
    } catch (error) {
      next(error);
    }
  };

  addAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requesterId: userId } = authorizationBodySchema.parse(req.body);
      const dto = addressBodySchema.parse(req.body);
      await this.userService.addAddress(dto, userId);
      res.status(HttpStatus.CREATED).json({ message: "Endereço adicionado com sucesso!" });
    } catch (error) {
      next(error);
    }
  };

  listAddressByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requesterId: userId } = authorizationBodySchema.parse(req.body);
      const data = await this.userService.listAddressByUserId(userId);
      res.status(HttpStatus.OK).json({ message: "Listando endereços do usuário com sucesso!", data: data });
    } catch (error) {
      next(error);
    }
  };

  removeAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requesterId: userId } = authorizationBodySchema.parse(req.body);
      const { idAddress } = req.params;
      await this.userService.removeAddress(userId, idAddress);
      res.status(HttpStatus.CREATED).json({ message: "Endereço removido com sucesso!" });
    } catch (error) {
      next(error);
    }
  };

  updateUserAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requesterId: userId } = authorizationBodySchema.parse(req.body);
      const { idAddress } = req.params;

      const dto = updateAddressBodySchema.parse(req.body);

      await this.userService.updateUserAddress(dto, userId, idAddress);
      res.status(HttpStatus.OK).json({ message: "Endereçoo atualizado com sucesso!" });
    } catch (error) {
      next(error);
    }
  };
}
