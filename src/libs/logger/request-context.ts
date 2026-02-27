import { AsyncLocalStorage } from "node:async_hooks";

interface RequestContext {
  requestId: string;
  userId?: string;
}

const requestContextStorage = new AsyncLocalStorage<RequestContext>();

function runWithRequestContext<T>(context: RequestContext, callback: () => T): T {
  return requestContextStorage.run(context, callback);
}

function getRequestContext() {
  return requestContextStorage.getStore();
}

function setRequestContextUserId(userId: string) {
  const context = requestContextStorage.getStore();

  if (context) {
    context.userId = userId;
  }
}

export { runWithRequestContext, getRequestContext, setRequestContextUserId };
