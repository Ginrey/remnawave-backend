import 'dotenv/config';

import type { PrismaConfig } from 'prisma';

import path from 'node:path';

export default {
    schema: path.join('prisma', 'schema.prisma'),
    migrations: {
        path: path.join('prisma', 'migrations'),
        seed: 'node -r ./prisma/seed/register-paths.cjs dist/prisma/prisma/seed/config.seed.js',
    },
} satisfies PrismaConfig;
