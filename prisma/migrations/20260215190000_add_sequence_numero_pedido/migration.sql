CREATE SEQUENCE IF NOT EXISTS "pedidos_numero_pedido_seq";

ALTER TABLE "pedidos"
ALTER COLUMN "numeroPedido" SET DEFAULT nextval('"pedidos_numero_pedido_seq"'::regclass);

SELECT setval(
  '"pedidos_numero_pedido_seq"',
  COALESCE((SELECT MAX("numeroPedido") FROM "pedidos"), 0) + 1,
  false
);
