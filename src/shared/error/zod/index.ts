import { ZodError } from "zod";

const isZodError = (error: Error) => {
  return error instanceof ZodError;
};

const formatZodErroMessage = (error: ZodError) => {
  return {
    errors: error.issues.map((issue) => ({
      field: issue.path.join("."),
      message: formatMessage(issue.message),
    })),
  };
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
