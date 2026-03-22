/* eslint-disable @typescript-eslint/no-explicit-any */
import { InMemoryAddressRepository } from "@/repository/in-memory/address";
import { ShippingService } from "./Shipping.service";
import { randomUUID } from "crypto";

describe("Unit test - ShippingService", () => {
  let addressRepositoryInMemory: InMemoryAddressRepository;
  let shippingService: ShippingService;

  const distanceProviderMock = {
    getDistance: jest.fn(),
  };

  beforeEach(() => {
    addressRepositoryInMemory = new InMemoryAddressRepository();
    distanceProviderMock.getDistance.mockReset();
    shippingService = new ShippingService(addressRepositoryInMemory, distanceProviderMock as any);
  });

  it("should calculate shipping with minimum value when distance < 1km", async () => {
    const addressId = randomUUID();
    const userId = randomUUID();

    addressRepositoryInMemory.addressDb.push({
      id: addressId,
      rua: "Rua A",
      numero: "123",
      bairro: "Centro",
      cidade: "Niteroi",
      estado: "RJ",
      cep: "12345678",
      complemento: null,
    });

    addressRepositoryInMemory.userAddressLink.push({
      usuarioId: userId,
      enderecoId: addressId,
    });

    distanceProviderMock.getDistance.mockResolvedValue({
      rows: [{ elements: [{ distance: { value: 900 } }] }],
    });

    const result = await shippingService.calculateShippingByAddressUser(addressId, userId);

    expect(Number(result)).toBe(8);
  });

  it("should calculate shipping proportional value when distance >= 1km", async () => {
    const addressId = randomUUID();
    const userId = randomUUID();

    addressRepositoryInMemory.addressDb.push({
      id: addressId,
      rua: "Rua B",
      numero: "10",
      bairro: "Centro",
      cidade: "Niteroi",
      estado: "RJ",
      cep: "12345678",
      complemento: null,
    });

    addressRepositoryInMemory.userAddressLink.push({
      usuarioId: userId,
      enderecoId: addressId,
    });

    distanceProviderMock.getDistance.mockResolvedValue({
      rows: [{ elements: [{ distance: { value: 2000 } }] }],
    });

    const result = await shippingService.calculateShippingByAddressUser(addressId, userId);

    expect(Number(result)).toBe(8);
  });

  it("should throw error when address does not belong to user", async () => {
    const addressId = randomUUID();
    const userId = randomUUID();

    await expect(shippingService.calculateShippingByAddressUser(addressId, userId)).rejects.toThrow(
      "Endereco nao encontrado para este usuario",
    );
  });

  it("should throw error when distance is not available", async () => {
    const addressId = randomUUID();
    const userId = randomUUID();

    addressRepositoryInMemory.addressDb.push({
      id: addressId,
      rua: "Rua C",
      numero: "99",
      bairro: "Centro",
      cidade: "Niteroi",
      estado: "RJ",
      cep: "12345678",
      complemento: null,
    });

    addressRepositoryInMemory.userAddressLink.push({
      usuarioId: userId,
      enderecoId: addressId,
    });

    distanceProviderMock.getDistance.mockResolvedValue({
      rows: [{ elements: [{ distance: undefined }] }],
    });

    await expect(shippingService.calculateShippingByAddressUser(addressId, userId)).rejects.toThrow(
      "Distância não disponível para o endereco informado",
    );
  });
});
