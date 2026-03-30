<<<<<<< HEAD
import { RawBuilder, sql } from 'kysely';
=======
import { RawBuilder, sql, type SelectQueryBuilder } from 'kysely';
>>>>>>> upstream/main

export function getKyselyUuid(uuid: string): RawBuilder<string> {
    return sql`${uuid}::uuid`;
}
<<<<<<< HEAD
=======

export async function paginateQuery<DB, TB extends keyof DB, O>(
    query: SelectQueryBuilder<DB, TB, O>,
    options: { offset: number; limit: number },
) {
    const { offset, limit } = options;

    const countResult = await query
        .clearSelect()
        .clearLimit()
        .clearOffset()
        .clearOrderBy()
        .select(sql<number>`COUNT(*)`.as('count'))
        .$castTo<{ count: number }>()
        .executeTakeFirst();

    const count = Number(countResult?.count ?? 0);
    const rows = await query.limit(limit).offset(offset).execute();

    return { rows, count };
}
>>>>>>> upstream/main
