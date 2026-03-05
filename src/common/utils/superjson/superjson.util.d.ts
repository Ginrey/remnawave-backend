import { ClassConstructor } from 'class-transformer';
export declare function serializeCustom<T>(data: T): string;
export declare function deserialize<T>(data: string, type: ClassConstructor<T>): T;
