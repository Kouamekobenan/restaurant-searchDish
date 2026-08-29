import { Prisma } from '@prisma/client';

export function toSafeNumber(value: number | Prisma.Decimal): number {
  return value instanceof Prisma.Decimal ? value.toNumber() : value;
}
