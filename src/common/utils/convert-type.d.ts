import { Prisma } from '@prisma/client';
export declare function wrapBigInt(value: number | bigint | string | undefined): bigint | undefined;
export declare function wrapBigIntNullable(value: number | bigint | undefined | null): bigint | undefined | null;
export declare function wrapDbNull<T>(value: T, filterEmptyObj?: boolean): T | typeof Prisma.DbNull;
export declare function mapDefined<T, R>(value: T | undefined, fn: (v: T) => R): R | undefined;
export declare function hasContent<T>(value: T | undefined | null): value is NonNullable<T>;
