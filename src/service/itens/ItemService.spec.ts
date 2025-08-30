/* eslint-disable @typescript-eslint/no-explicit-any */
import { InMemoryItensRepository } from "@/repository/in-memory/itens";
import { ItensService } from "./itens.service";
import { ItemCreateDto } from "@/domain/dto/itens/ItensDto";
import { Decimal } from "@prisma/client/runtime/library";
import { ItemSize, StatusCart, statusItem } from "@prisma/client";

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
      available: statusItem.ATIVO,
      size: ItemSize.M,
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
      await itemMemoryRepository.create(createItemDto({ price: new Decimal(100) }));
      const result = await itemService.listAll();

      expect(result).toHaveLength(2);
      expect(result[0].preco).toEqual(new Decimal(50));
      expect(result[1].preco).toEqual(new Decimal(100));
    });
    it("should list acitves items", async () => {
      await itemMemoryRepository.create(createItemDto());
      await itemMemoryRepository.create(createItemDto({ price: new Decimal(100), available: statusItem.INATIVO }));
      const result = await itemService.listActiveItensDescription();
      console.log("RESULTADOOOO", result);
      expect(result).toHaveLength(1);
      expect(result[0].disponivel).toEqual(StatusCart.ATIVO);
    });
  });

  describe.only("update method", () => {
    it("should be able update item", async () => {
      const item = await itemMemoryRepository.create(createItemDto());
      const updatedItemDto = createItemDto({ price: new Decimal(100) });
      const updatedItem = await itemService.update(updatedItemDto, item.id);
      console.log("Item updated successfully", updatedItem)
      expect(updatedItem.preco).toEqual(new Decimal(100));
    });

    it("should not be able update item if item not exist", async () => {
      await expect(itemService.update(createItemDto(), "invalid-id")).rejects.toThrow("Item não encontrado");
    });
  });

  describe("inactiveItem method", () => {
    it("should be able inactive item", async () => {
      const item = await itemMemoryRepository.create(createItemDto());
      const itemInactive = await itemService.inactiveItemDescription(item.itemDescriptionId!);
      //const updatedItem = await itemMemoryRepository.inactiveItem(item.id);
      expect(itemInactive.disponivel).toEqual(statusItem.INATIVO);
    });
  });
});
