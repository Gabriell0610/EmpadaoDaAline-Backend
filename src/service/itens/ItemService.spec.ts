/* eslint-disable @typescript-eslint/no-explicit-any */
import { InMemoryItensRepository } from "@/repository/in-memory/itens";
import { ItensService } from "./itens.service";
import { ItemCreateDto } from "@/domain/dto/itens/ItensDto";
import { Decimal } from "@prisma/client/runtime/library";
import { ItemSize, StatusCart, StatusItem } from "@prisma/client";
import { randomUUID } from "node:crypto";

describe("Units Test - Item", () => {
  let itemMemoryRepository: InMemoryItensRepository;
  let itemService: ItensService;

  beforeEach(() => {
    itemMemoryRepository = new InMemoryItensRepository();
    itemService = new ItensService(itemMemoryRepository);
  });

  const createItemDto = (overrides: Partial<ItemCreateDto> = {}) => {
    return {
      price: new Decimal(50),
      name: "Empadão de frango",
      description: "Delicioso empadão de frango",
      image: "https://exemplo.com/imagem.jpg",
      available: StatusItem.ATIVO,
      size: ItemSize.M,
      itemTypeId: randomUUID(),
      ...overrides,
    };
  };

  describe("Create method", () => {
    it("should be able create a new item", async () => {
      const itemDto = createItemDto();
      const item = await itemService.create(itemDto);

      expect(item.id).toBeTruthy();
      expect(item.preco).toEqual(new Decimal(50));
      expect(item.tamanho).toEqual(ItemSize.M);
    });
    it("should throw BadRequestException if item is not correctly saved", async () => {
      jest.spyOn(itemMemoryRepository, "create").mockResolvedValue(null as any);
      const itemDto = createItemDto();
      await expect(itemService.create(itemDto)).rejects.toThrow("Erro ao criar item");
    });
  });

  describe("List's method", () => {
    it("should list all items", async () => {
      await itemMemoryRepository.create(createItemDto());
      await itemMemoryRepository.create(createItemDto({ available: StatusItem.INATIVO }));
      const result = await itemService.listAllItems();

      expect(result).toHaveLength(2);
      expect(result[0].disponivel).toEqual(StatusItem.ATIVO);
      expect(result[1].disponivel).toEqual(StatusItem.INATIVO);
    });
    it("should list activies items", async () => {
      await itemMemoryRepository.create(createItemDto());
      await itemMemoryRepository.create(createItemDto({ price: new Decimal(100), available: StatusItem.INATIVO }));
      const result = await itemService.listActiveItensDescription();
      expect(result).toHaveLength(1);
      expect(result[0].disponivel).toEqual(StatusCart.ATIVO);
    });
  });

  describe("update method", () => {
    it("should be able update item", async () => {
      const item = await itemMemoryRepository.create(createItemDto());
      const updatedItemDto = createItemDto({ price: new Decimal(100) });
      const updatedItem = await itemService.update(updatedItemDto, item.id);
      expect(updatedItem.preco).toEqual(new Decimal(100));
    });

    it("should not be able update item if item not exist", async () => {
      await expect(itemService.update(createItemDto(), "invalid-id")).rejects.toThrow("Item não encontrado");
    });
  });

  describe("inactiveItem method", () => {
    it("should be able inactive item", async () => {
      const item = await itemMemoryRepository.create(createItemDto());
      const itemInactive = await itemService.changeStatusItem(item.itemDescriptionId!, "INATIVO");
      //const updatedItem = await itemMemoryRepository.inactiveItem(item.id);
      expect(itemInactive.id).toEqual(item.id);
    });

    it("should be able active item", async () => {
      const item = await itemMemoryRepository.create(createItemDto({ available: StatusItem.INATIVO }));
      const itemActive = await itemService.changeStatusItem(item.itemDescriptionId!, "ATIVO");

      expect(itemActive.id).toEqual(item.id);
    });

    it("should throw when status update fails", async () => {
      const item = await itemMemoryRepository.create(createItemDto());
      jest.spyOn(itemMemoryRepository, "changeStatusItem").mockResolvedValue(null as any);

      await expect(itemService.changeStatusItem(item.itemDescriptionId!, "INATIVO")).rejects.toThrow(
        "Erro ao alterar status do item, tente novamente",
      );
    });
  });

  describe("findItemById method", () => {
    it("should return item with real weight", async () => {
      const item = await itemMemoryRepository.create(createItemDto({ size: ItemSize.M }));
      const result = await itemService.findItemById(item.id);

      expect(result.id).toEqual(item.id);
      expect(result.pesoReal).toBeTruthy();
    });

    it("should throw when item is not found", async () => {
      await expect(itemService.findItemById("invalid-id")).rejects.toThrow("Item");
    });
  });
});
