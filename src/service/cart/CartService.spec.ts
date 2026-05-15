import { InMemoryCartRepository } from "@/repository/in-memory/cart";
import { InMemoryItensRepository } from "@/repository/in-memory/itens";
import { CartService } from "@/service/cart/Cart.service";
import { ItemCreateDto } from "@/domain/dto/itens/ItensDto";
import { CreateUserDto } from "@/domain/dto/auth/CreateUserDto";
import { AccessProfile } from "@/shared/constants";
import { Item, ItemSize, StatusCart, StatusItem, TypeItem, Usuario } from "@prisma/client";
import { InMemoryUserRepository } from "@/repository/in-memory/user";
import { CreateCartDto } from "@/domain/dto/cart/CreateCartDto";
import { randomUUID } from "node:crypto";
import { Decimal } from "@prisma/client/runtime/library";

describe("Unit test - cartService", () => {
  let cartRepositoryInMemory: InMemoryCartRepository;
  let itensRepositoryInMemory: InMemoryItensRepository;
  let userRepositoryInMemory: InMemoryUserRepository;
  let cartService: CartService;

  let user: Partial<Usuario>;
  let item: Partial<Item>;
  const quantityCart = 1;
  const preco = new Decimal(50)! || null;

  const createUserDto = (overrides: Partial<CreateUserDto> = {}) => ({
    id: randomUUID(),
    name: "Gabriel",
    email: "user@example.com",
    password: "1234",
    cellphone: "00000000000",
    role: AccessProfile.CLIENT,
    ...overrides,
  });

  const createItemDto = (overrides: Partial<ItemCreateDto> = {}) => ({
    id: randomUUID(),
    name: "Empadão de Frango",
    price: preco,
    description: "delicioso empadão de frango",
    image: "https://exemplo.com/imagem.jpg",
    available: StatusItem.ATIVO,
    size: ItemSize.M,
    type: TypeItem.EMPADAO,
    ...overrides,
  });

  beforeEach(async () => {
    cartRepositoryInMemory = new InMemoryCartRepository();
    itensRepositoryInMemory = new InMemoryItensRepository();
    cartService = new CartService(cartRepositoryInMemory, itensRepositoryInMemory);

    userRepositoryInMemory = new InMemoryUserRepository();
    user = await userRepositoryInMemory.create(createUserDto());
    item = await itensRepositoryInMemory.create(createItemDto());
  });

  const createCartDto = (overrides: Partial<CreateCartDto> = {}) => ({
    status: StatusCart.ATIVO,
    itemId: item.id!,
    quantity: quantityCart,
    ...overrides,
  });

  describe("testing method createCart", () => {
    it("should create a new Cart", async () => {
      const cartDto = createCartDto();

      const result = await cartService.createCart(cartDto, user.id as string);
      const idCart = cartRepositoryInMemory.cartDb[0].id;
      expect(result).toHaveProperty("id");
      expect(result.carrinhoId).toEqual(idCart);
    });

    it("should not be able create cart if item not exist", async () => {
      const cartDto = createCartDto({ itemId: "2" });
      await expect(cartService.createCart(cartDto, user.id as string)).rejects.toThrow(
        "Item não encontrado ou Inativo!",
      );
    });

    it("should be able add new item to cart alredy exist", async () => {
      cartRepositoryInMemory.createCart(createCartDto(), item.preco!, user.id as string);
      const newItem = await itensRepositoryInMemory.create(
        createItemDto({
          description: "Empadão de camarão",
          image: "",
          available: StatusCart.ATIVO,
          name: "Empadão de camarão",
          price: new Decimal(50),
          type: TypeItem.EMPADAO,
        }),
      );
      const cartDto = createCartDto({ itemId: newItem.id, quantity: 2 });

      const result = await cartService.createCart(cartDto, user.id as string);
      const userId = cartRepositoryInMemory.cartDb[0].usuarioId;

      expect(userId).toEqual(user.id);
      expect(result.itemId).toEqual(newItem.id);
      expect(result.quantidade).toEqual(2);
      expect(result.precoAtual).toEqual(new Decimal(50));
    });

    it("should update quantity if item already exists in cart", async () => {
      const cart = await cartRepositoryInMemory.createCart(createCartDto(), item.preco!, user.id as string);

      const cartDto = createCartDto({ itemId: cart.itemId, quantity: 3 });

      const result = await cartService.createCart(cartDto, user.id as string);

      expect(result.quantidade).toBe(4);
    });
  });

  describe("listCartWithTotal method", () => {
    it("should return cart with total price", async () => {
      await cartRepositoryInMemory.createCart(createCartDto(), item.preco!, user.id as string);

      const result = await cartService.listCartWithTotalPrice(user.id as string);

      expect(result?.usuarioId).toEqual(user.id);
      expect(result?.valorTotal).toEqual(50);
    });

    it("should NOT return cart with total price if user does not have an active cart", async () => {
      const result = await cartService.listCartWithTotalPrice(user.id as string);
      expect(result).toBeUndefined();
    });
  });
  describe("changeItemQuantity method", () => {
    it("should be able incremnet item quantity", async () => {
      await cartRepositoryInMemory.createCart(createCartDto(), item.preco!, user.id as string);

      const result = await cartService.changeItemQuantity(item.id!, user.id as string, "increment");

      expect(result?.quantidade).toBe(2);
    });
    it("should be able decrement item quantity", async () => {
      await cartService.createCart(createCartDto(), user.id as string);
      await cartService.createCart(createCartDto(), user.id as string);
      const result = await cartService.changeItemQuantity(item.id!, user.id as string, "decrement");
      expect(result?.quantidade).toBe(1);
    });

    it("should remove item when decrement reaches zero", async () => {
      await cartService.createCart(createCartDto(), user.id as string);

      const result = await cartService.changeItemQuantity(item.id!, user.id as string, "decrement");
      const itemStillInCart = cartRepositoryInMemory.cartItemDb.find((cartItem) => cartItem.itemId === item.id);

      expect(result).toBeUndefined();
      expect(itemStillInCart).toBeUndefined();
    });
  });
  describe("removeItemCart", () => {
    it("should remove item by cart", async () => {
      await cartRepositoryInMemory.createCart(createCartDto(), item.preco!, user.id as string);
      await cartService.removeItemCart(item.id!, user.id as string);

      const itemStillInCart = cartRepositoryInMemory.cartItemDb.find((cartItem) => cartItem.itemId === item.id);
      expect(itemStillInCart).toBeUndefined();
    });
    it("should not remove item by cart if user does not have any cart", async () => {
      await expect(cartService.removeItemCart(item.id!, "2")).rejects.toThrow(
        "Usuário nao possui carrinho ativo no momento",
      );
    });
    it("should not remove item by cart if item not exist in cart", async () => {
      cartRepositoryInMemory.createCart(createCartDto(), item.preco!, user.id as string);
      await expect(cartService.removeItemCart("2", user.id as string)).rejects.toThrow(
        "Item nao encontrado no carrinho ativo",
      );
    });
  });
  describe("listAllCartByUser method", () => {
    it("should return all cart items by user", async () => {
      cartRepositoryInMemory.createCart(createCartDto(), item.preco!, user.id as string);
      cartRepositoryInMemory.createCart(createCartDto({ quantity: 3 }), item.preco!, user.id as string);
      const result = await cartService.listAllCartByUser(user.id as string);
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty("id");
      expect(result[0].usuarioId).toBe(user.id);
    });

    it("should throw an error if user does not have any cart", async () => {
      await expect(cartService.listAllCartByUser(user.id as string)).rejects.toThrow("Usuário nao possui carrinho");
    });
  });
});
