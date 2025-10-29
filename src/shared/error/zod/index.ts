import { ZodError } from "zod";

const isZodError = (error: Error) => {
  return error instanceof ZodError;
};

const formatZodErroMessage = (error: ZodError) => {
  if (!(error instanceof ZodError)) return "";

  return error.issues
    .map((issue) => {
      const { path, message } = issue;
      const messageError = formatMessage(message);
      return `${path.join(".")}${':' + messageError }`;
    })
    .join(", ");
};

function formatMessage(message: string): string {
  const expectedObject = message.includes("Expected object");
  const expectedArray = message.includes("Expected array");

  if (expectedObject) {
    return "Campo formatado errado era esperado um objeto";
  } else if (expectedArray) {
    return "Campo formatado errado era esperado um array";
  } else {
    return message || "Campo obrigatório ou mal formatado";
  }
}

export { isZodError, formatZodErroMessage };
