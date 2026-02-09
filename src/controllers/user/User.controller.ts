import { IUserService } from "../../service/user/IUserService.type";
import { NextFunction, Request, Response } from "express";
import { HttpStatus } from "@/shared/constants/index";
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
      const id = req.user?.id || "";
      console.log("id está vindo", id);
      const data = await this.userService.listLoggedUser(id);
      res.status(HttpStatus.OK).json({ message: "Listando usuário logado com sucesso!", data: data });
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = req.user?.email || "";
      const id = req.user?.id || "";
      const dto = updateUserBodySchema.parse(req.body);
      const data = await this.userService.updateUser(dto, id, email);

      res.status(HttpStatus.OK).json({ message: "Usuário atualizado com sucesso!", data: data });
    } catch (error) {
      next(error);
    }
  };

  addAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.user?.id || "";
      const dto = addressBodySchema.parse(req.body);
      await this.userService.addAddress(dto, id);
      res.status(HttpStatus.CREATED).json({ message: "Endereço adicionado com sucesso!" });
    } catch (error) {
      next(error);
    }
  };

  listAddressByUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.user?.id || "";
      const data = await this.userService.listAddressByUserId(id);
      res.status(HttpStatus.OK).json({ message: "Listando endereços do usuário com sucesso!", data: data });
    } catch (error) {
      next(error);
    }
  };

  removeAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.user?.id || "";
      const { idAddress } = req.params;
      await this.userService.removeAddress(id, idAddress);
      res.status(HttpStatus.CREATED).json({ message: "Endereço removido com sucesso!" });
    } catch (error) {
      next(error);
    }
  };

  updateUserAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.user?.id || "";
      const { idAddress } = req.params;

      const dto = updateAddressBodySchema.parse(req.body);

      await this.userService.updateUserAddress(dto, id, idAddress);
      res.status(HttpStatus.OK).json({ message: "Endereço atualizado com sucesso!" });
    } catch (error) {
      next(error);
    }
  };
}
