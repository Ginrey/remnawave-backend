import { createZodDto } from 'nestjs-zod';

<<<<<<< HEAD
import { FetchIpsCommand, FetchIpsResultCommand, DropConnectionsCommand } from '@contract/commands';
=======
import {
    FetchIpsCommand,
    FetchIpsResultCommand,
    DropConnectionsCommand,
    FetchUsersIpsResultCommand,
    FetchUsersIpsCommand,
} from '@contract/commands';
>>>>>>> upstream/main

export class FetchIpsRequestDto extends createZodDto(FetchIpsCommand.RequestSchema) {}

export class FetchIpsResponseDto extends createZodDto(FetchIpsCommand.ResponseSchema) {}

export class FetchIpsResultRequestDto extends createZodDto(FetchIpsResultCommand.RequestSchema) {}

export class FetchIpsResultResponseDto extends createZodDto(FetchIpsResultCommand.ResponseSchema) {}

export class DropConnectionsRequestDto extends createZodDto(DropConnectionsCommand.RequestSchema) {}

export class DropConnectionsResponseDto extends createZodDto(
    DropConnectionsCommand.ResponseSchema,
) {}
<<<<<<< HEAD
=======

export class FetchUsersIpsRequestDto extends createZodDto(FetchUsersIpsCommand.RequestSchema) {}

export class FetchUsersIpsResponseDto extends createZodDto(FetchUsersIpsCommand.ResponseSchema) {}

export class FetchUsersIpsResultRequestDto extends createZodDto(
    FetchUsersIpsResultCommand.RequestSchema,
) {}

export class FetchUsersIpsResultResponseDto extends createZodDto(
    FetchUsersIpsResultCommand.ResponseSchema,
) {}
>>>>>>> upstream/main
