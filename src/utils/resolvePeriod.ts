import { DashboardQueryParams } from "./zod/schemas/params";


export function resolvePeriod(query: DashboardQueryParams) {
  console.log("periodo", query)
  const now = new Date();

  switch (query.period) {
    case 'today':
      return {
        start: new Date(now.setHours(0, 0, 0, 0)),
        end: new Date()
      };

    case '7d':
      return {
        start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        end: new Date()
      };

    case '1m':
     return {
      start:  new Date(now.getFullYear(), now.getMonth(), 1),
      end: new Date(now.getFullYear(), now.getMonth() + 1, 0)
    };

    default:
      throw new Error('Período inválido');
  }
}

export function toDateOnly(date: Date): string {
  return date.toISOString().split('T')[0];
}
