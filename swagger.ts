import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "API",
    version: "1.0.0",
    description: "Documentação gerada automaticamente",
  },
  host: "localhost:1338",
  schemes: ["http", "https"],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "refreshToken",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Mensagem de erro" },
          statusCode: { type: "number", example: 400 },
        },
      },
    },
  },
};

const outputFile = "./src/swagger-output.json";
const endpointsFiles = [
  "./src/infra/server/routes/auth/auth.routes.ts",
  "./src/infra/server/routes/user/user.routes.ts",
  "./src/infra/server/routes/itens/itens.routes.ts",
  "./src/infra/server/routes/cart/cart.routes.ts",
  "./src/infra/server/routes/order/order.routes.ts",
  "./src/infra/server/routes/paymentMethods/route.ts",
  "./src/infra/server/routes/shipping/route.ts",
  "./src/infra/server/routes/dashboard/dashboard.route.ts",
];

swaggerAutogen({ openapi: "3.0.0" })(outputFile, endpointsFiles, doc);
