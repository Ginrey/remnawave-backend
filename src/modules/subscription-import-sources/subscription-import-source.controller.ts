import {
    ApiBearerAuth,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, HttpStatus, Param, UseFilters, UseGuards } from '@nestjs/common';

import { HttpExceptionFilter } from '@common/exception/http-exception.filter';
import { JwtDefaultGuard } from '@common/guards/jwt-guards/def-jwt-guard';
import { Endpoint } from '@common/decorators/base-endpoint/base-endpoint';
import { errorHandler } from '@common/helpers/error-handler.helper';
import { Roles } from '@common/decorators/roles/roles';
import { RolesGuard } from '@common/guards/roles';
import {
    CreateSubscriptionImportSourceCommand,
    DeleteSubscriptionImportSourceCommand,
    FetchNowSubscriptionImportSourceCommand,
    GetSubscriptionImportSourceByUuidCommand,
    GetSubscriptionImportSourcesCommand,
    UpdateSubscriptionImportSourceCommand,
} from '@libs/contracts/commands';
import {
    CONTROLLERS_INFO,
    SUBSCRIPTION_IMPORT_SOURCES_CONTROLLER,
} from '@libs/contracts/api';
import { ROLE } from '@libs/contracts/constants';

import {
    CreateSubscriptionImportSourceRequestDto,
    CreateSubscriptionImportSourceResponseDto,
    DeleteSubscriptionImportSourceRequestDto,
    DeleteSubscriptionImportSourceResponseDto,
    FetchNowSubscriptionImportSourceRequestDto,
    FetchNowSubscriptionImportSourceResponseDto,
    GetSubscriptionImportSourceByUuidResponseDto,
    GetSubscriptionImportSourcesResponseDto,
    UpdateSubscriptionImportSourceRequestDto,
    UpdateSubscriptionImportSourceResponseDto,
} from './dtos';
import { SubscriptionImportSourceService } from './subscription-import-source.service';

@ApiBearerAuth('Authorization')
@ApiTags(CONTROLLERS_INFO.SUBSCRIPTION_IMPORT_SOURCES.tag)
@Roles(ROLE.ADMIN, ROLE.API)
@UseGuards(JwtDefaultGuard, RolesGuard)
@UseFilters(HttpExceptionFilter)
@Controller(SUBSCRIPTION_IMPORT_SOURCES_CONTROLLER)
export class SubscriptionImportSourceController {
    constructor(private readonly service: SubscriptionImportSourceService) {}

    @ApiOkResponse({
        type: GetSubscriptionImportSourcesResponseDto,
        description: 'Subscription import sources retrieved successfully',
    })
    @Endpoint({
        command: GetSubscriptionImportSourcesCommand,
        httpCode: HttpStatus.OK,
    })
    async getAll(): Promise<GetSubscriptionImportSourcesResponseDto> {
        const result = await this.service.getAll();
        const data = errorHandler(result);
        return { response: data };
    }

    @ApiOkResponse({
        type: GetSubscriptionImportSourceByUuidResponseDto,
        description: 'Subscription import source retrieved successfully',
    })
    @ApiNotFoundResponse({ description: 'Import source not found' })
    @Endpoint({
        command: GetSubscriptionImportSourceByUuidCommand,
        httpCode: HttpStatus.OK,
    })
    async getByUuid(
        @Param('uuid') uuid: string,
    ): Promise<GetSubscriptionImportSourceByUuidResponseDto> {
        const result = await this.service.getByUuid(uuid);
        const data = errorHandler(result);
        return { response: data };
    }

    @ApiCreatedResponse({
        type: CreateSubscriptionImportSourceResponseDto,
        description: 'Subscription import source created successfully',
    })
    @ApiConflictResponse({ description: 'Import source name already exists' })
    @Endpoint({
        command: CreateSubscriptionImportSourceCommand,
        httpCode: HttpStatus.CREATED,
    })
    async create(
        @Body() dto: CreateSubscriptionImportSourceRequestDto,
    ): Promise<CreateSubscriptionImportSourceResponseDto> {
        const result = await this.service.create(dto);
        const data = errorHandler(result);
        return { response: data };
    }

    @ApiOkResponse({
        type: UpdateSubscriptionImportSourceResponseDto,
        description: 'Subscription import source updated successfully',
    })
    @ApiNotFoundResponse({ description: 'Import source not found' })
    @Endpoint({
        command: UpdateSubscriptionImportSourceCommand,
        httpCode: HttpStatus.OK,
    })
    async update(
        @Param('uuid') uuid: string,
        @Body() dto: UpdateSubscriptionImportSourceRequestDto,
    ): Promise<UpdateSubscriptionImportSourceResponseDto> {
        const result = await this.service.update({ ...dto, uuid });
        const data = errorHandler(result);
        return { response: data };
    }

    @ApiOkResponse({
        type: DeleteSubscriptionImportSourceResponseDto,
        description: 'Subscription import source deleted successfully',
    })
    @ApiNotFoundResponse({ description: 'Import source not found' })
    @Endpoint({
        command: DeleteSubscriptionImportSourceCommand,
        httpCode: HttpStatus.OK,
    })
    async delete(
        @Param('uuid') uuid: DeleteSubscriptionImportSourceRequestDto['uuid'],
    ): Promise<DeleteSubscriptionImportSourceResponseDto> {
        const result = await this.service.delete(uuid);
        const data = errorHandler(result);
        return { response: data };
    }

    @ApiOkResponse({
        type: FetchNowSubscriptionImportSourceResponseDto,
        description: 'Fetch triggered successfully',
    })
    @ApiNotFoundResponse({ description: 'Import source not found' })
    @Endpoint({
        command: FetchNowSubscriptionImportSourceCommand,
        httpCode: HttpStatus.OK,
    })
    async fetchNow(
        @Param('uuid') uuid: FetchNowSubscriptionImportSourceRequestDto['uuid'],
    ): Promise<FetchNowSubscriptionImportSourceResponseDto> {
        const result = await this.service.fetchNow(uuid);
        const data = errorHandler(result);
        return { response: data };
    }
}
