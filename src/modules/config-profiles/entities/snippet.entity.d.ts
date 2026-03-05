import { ConfigProfileSnippets, Prisma } from '@prisma/client';
export declare class SnippetEntity implements ConfigProfileSnippets {
    name: string;
    snippet: Prisma.JsonArray;
    createdAt: Date;
    constructor(snippet: Partial<ConfigProfileSnippets>);
}
