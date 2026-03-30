import { CqrsModule } from '@nestjs/cqrs';
import { Module } from '@nestjs/common';

<<<<<<< HEAD
=======
import { NodesSystemCacheService } from './nodes-system-cache.service';
>>>>>>> upstream/main
import { NodesRepository } from './repositories/nodes.repository';
import { NodesController } from './nodes.controller';
import { NodesConverter } from './nodes.converter';
import { NodesService } from './nodes.service';
import { COMMANDS } from './commands';
import { QUERIES } from './queries';
import { EVENTS } from './events';

@Module({
    imports: [CqrsModule],
    controllers: [NodesController],
<<<<<<< HEAD
    providers: [NodesRepository, NodesConverter, NodesService, ...EVENTS, ...QUERIES, ...COMMANDS],
=======
    providers: [
        NodesRepository,
        NodesConverter,
        NodesService,
        NodesSystemCacheService,
        ...EVENTS,
        ...QUERIES,
        ...COMMANDS,
    ],
>>>>>>> upstream/main
    exports: [NodesRepository],
})
export class NodesModule {}
