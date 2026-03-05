/**
 * Registers tsconfig path aliases for the compiled seed script.
 *
 * The seed itself is compiled by `build:seed` (tsconfig.seed.json) into
 * dist/prisma/.  Its imports from @common/*, @modules/* etc. are compiled by
 * `nest build` into dist/src/ — so we point those aliases at dist/src/.
 * Libs are compiled by build:seed into dist/prisma/libs/.
 */
const { register } = require('tsconfig-paths');
const path = require('path');

const distRoot = path.resolve(__dirname, '../..');

register({
    baseUrl: distRoot,
    paths: {
        // Resolved from nest build (dist/src/)
        '@common/*': ['dist/src/common/*'],
        '@modules/*': ['dist/src/modules/*'],
        '@integration-modules/*': ['dist/src/integration-modules/*'],
        '@queue/*': ['dist/src/queue/*'],
        '@scheduler/*': ['dist/src/scheduler/*'],
        // Resolved from build:seed (dist/prisma/libs/)
        '@libs/contracts/*': ['dist/prisma/libs/contract/*'],
        '@libs/hashed-set/*': ['dist/prisma/libs/hashed-set/*'],
        '@libs/subscription-page/*': ['dist/prisma/libs/subscription-page/*'],
    },
});

