import { InMemoryAddressRepository } from "@/repository/in-memory/address";
import { InMemoryUserRepository } from "@/repository/in-memory/user";
import { UserService } from "./user.service";
import { AccessProfile } from "@/shared/constants/accessProfile";
import { randomUUID } from "crypto";

describe("Unit test - UserService", () => {
  let userRepositoryInMemory: InMemoryUserRepository;
  let addressRepositoryInMemory: InMemoryAddressRepository;
  let userService: UserService;

  const createUserDto = () => ({
    name: "Gabriel",
    email: "user@example.com",
    password: "ValidPass123!",
    cellphone: "11999999999",
    role: AccessProfile.CLIENT,
  });

  beforeEach(() => {
    userRepositoryInMemory = new InMemoryUserRepository();
    addressRepositoryInMemory = new InMemoryAddressRepository();
    userService = new UserService(userRepositoryInMemory, addressRepositoryInMemory);
  });

  it("should list users", async () => {
    await userRepositoryInMemory.create(createUserDto());

    const result = await userService.list();

    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty("email", "user@example.com");
  });

  it("should update user when requester is same user", async () => {
    const user = await userRepositoryInMemory.create(createUserDto());

    const result = await userService.updateUser({ name: "Novo Nome" }, user.id!, user.email!);

    expect(result.nome).toBe("Novo Nome");
  });

  it("should throw error when trying to edit another user", async () => {
    const user = await userRepositoryInMemory.create(createUserDto());

    await expect(userService.updateUser({ name: "Novo Nome" }, user.id!, "other@email.com")).rejects.toThrow(
      "Sem permisão para editar dados",
    );
  });

  it("should throw error when user does not exist", async () => {
    await expect(userService.updateUser({ name: "Novo Nome" }, "invalid-id", "user@example.com")).rejects.toThrow(
      "Usuário não encontrado",
    );
  });

  it("should add user address", async () => {
    const user = await userRepositoryInMemory.create(createUserDto());

    await userService.addAddress(
      {
        street: "Rua A",
        zipCode: "12345678",
        number: "10",
        neighborhood: "Centro",
        city: "Niteroi",
        state: "RJ",
        complement: "Casa",
      },
      user.id!,
    );

    const addresses = await userRepositoryInMemory.listAddressByUserId(user.id!);
    expect(addresses).toHaveLength(1);
  });

  it("should list logged user", async () => {
    const user = await userRepositoryInMemory.create(createUserDto());

    const result = await userService.listLoggedUser(user.id!);

    expect(result?.id).toBe(user.id);
  });

  it("should update, list and remove address", async () => {
    const user = await userRepositoryInMemory.create(createUserDto());

    await userService.addAddress(
      {
        street: "Rua A",
        zipCode: "12345678",
        number: "10",
        neighborhood: "Centro",
        city: "Niteroi",
        state: "RJ",
        complement: "Casa",
      },
      user.id!,
    );

    const address = (await userRepositoryInMemory.listAddressByUserId(user.id!))[0];

    console.log("address", address);

    await userService.updateUserAddress({ city: "Rio de Janeiro" }, user.id!, address.enderecoId);

    const listed = await userService.listLoggedUser(user.id!);
    console.log("listed", listed?.enderecos);
    const findAddress = listed!.enderecos.find((data) => data.endereco.id === address.endereco.id);
    console.log("address encontrado", findAddress);
    expect(findAddress!.endereco.cidade).toBe("Rio de Janeiro");

    await userService.removeAddress(address.enderecoId);
    const afterRemove = await userService.listAddressByUserId(user.id!);
    expect(afterRemove).toHaveLength(0);
  });

  it("should not add duplicated address", async () => {
    const userId = randomUUID();
    const addressId = randomUUID();

    addressRepositoryInMemory.addressDb.push({
      id: addressId,
      rua: "Rua A",
      numero: "10",
      bairro: "Centro",
      cidade: "Niteroi",
      estado: "RJ",
      cep: "12345678",
      complemento: "Casa",
    });
    addressRepositoryInMemory.userAddressLink.push({ usuarioId: userId, enderecoId: addressId });

    await expect(
      userService.addAddress(
        {
          street: "Rua A",
          zipCode: "12345678",
          number: "10",
          neighborhood: "Centro",
          city: "Niteroi",
          state: "RJ",
          complement: "Casa",
        },
        userId,
      ),
    ).rejects.toThrow("Você já possui esse endereço cadastrado");
  });
});
