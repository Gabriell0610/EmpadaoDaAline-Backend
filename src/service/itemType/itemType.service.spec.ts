import { ItemTypeService } from "./itemType.service";
import { IItemTypeRepository } from "@/repository/interfaces/itemType.type";

describe("Units Test - ItemType", () => {
  let itemTypeRepository: jest.Mocked<IItemTypeRepository>;
  let itemTypeService: ItemTypeService;

  beforeEach(() => {
    itemTypeRepository = {
      create: jest.fn(),
      listAll: jest.fn(),
      findByName: jest.fn(),
    };

    itemTypeService = new ItemTypeService(itemTypeRepository);
  });

  describe("create method", () => {
    it("should normalize the name and create item type", async () => {
      itemTypeRepository.findByName.mockResolvedValue(null);
      itemTypeRepository.create.mockResolvedValue({
        id: "item-type-id",
        nome: "SALGADO",
      });

      const result = await itemTypeService.create({ nome: "  salgado  " });

      expect(itemTypeRepository.findByName).toHaveBeenCalledWith("SALGADO");
      expect(itemTypeRepository.create).toHaveBeenCalledWith({ nome: "SALGADO" });
      expect(result).toEqual({
        id: "item-type-id",
        nome: "SALGADO",
      });
    });

    it("should throw conflict exception when item type already exists", async () => {
      itemTypeRepository.findByName.mockResolvedValue({
        id: "existing-item-type-id",
        nome: "SALGADO",
      });

      await expect(itemTypeService.create({ nome: "salgado" })).rejects.toThrow("Tipo de item");
      expect(itemTypeRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("listAll method", () => {
    it("should list all item types", async () => {
      itemTypeRepository.listAll.mockResolvedValue([
        { id: "1", nome: "SALGADO" },
        { id: "2", nome: "DOCE" },
      ]);

      const result = await itemTypeService.listAll();

      expect(itemTypeRepository.listAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([
        { id: "1", nome: "SALGADO" },
        { id: "2", nome: "DOCE" },
      ]);
    });
  });
});
