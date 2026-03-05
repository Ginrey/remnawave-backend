import { createZodDto } from 'nestjs-zod';

import {
    CreateSubscriptionImportSourceCommand,
    DeleteSubscriptionImportSourceCommand,
    FetchNowSubscriptionImportSourceCommand,
    GetSubscriptionImportSourceByUuidCommand,
    GetSubscriptionImportSourcesCommand,
    UpdateSubscriptionImportSourceCommand,
} from '@libs/contracts/commands';

export class CreateSubscriptionImportSourceRequestDto extends createZodDto(
    CreateSubscriptionImportSourceCommand.RequestSchema,
) {}
export class CreateSubscriptionImportSourceResponseDto extends createZodDto(
    CreateSubscriptionImportSourceCommand.ResponseSchema,
) {}

export class UpdateSubscriptionImportSourceRequestDto extends createZodDto(
    UpdateSubscriptionImportSourceCommand.RequestSchema,
) {}
export class UpdateSubscriptionImportSourceResponseDto extends createZodDto(
    UpdateSubscriptionImportSourceCommand.ResponseSchema,
) {}

export class DeleteSubscriptionImportSourceRequestDto extends createZodDto(
    DeleteSubscriptionImportSourceCommand.RequestSchema,
) {}
export class DeleteSubscriptionImportSourceResponseDto extends createZodDto(
    DeleteSubscriptionImportSourceCommand.ResponseSchema,
) {}

export class GetSubscriptionImportSourceByUuidRequestDto extends createZodDto(
    GetSubscriptionImportSourceByUuidCommand.RequestSchema,
) {}
export class GetSubscriptionImportSourceByUuidResponseDto extends createZodDto(
    GetSubscriptionImportSourceByUuidCommand.ResponseSchema,
) {}

export class GetSubscriptionImportSourcesResponseDto extends createZodDto(
    GetSubscriptionImportSourcesCommand.ResponseSchema,
) {}

export class FetchNowSubscriptionImportSourceRequestDto extends createZodDto(
    FetchNowSubscriptionImportSourceCommand.RequestSchema,
) {}
export class FetchNowSubscriptionImportSourceResponseDto extends createZodDto(
    FetchNowSubscriptionImportSourceCommand.ResponseSchema,
) {}
