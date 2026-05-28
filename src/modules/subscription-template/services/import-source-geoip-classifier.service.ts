import { CityResponse, CountryResponse, Reader, open } from 'maxmind';
import { isIP } from 'node:net';

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type GeoIpResponse = CityResponse | CountryResponse;

@Injectable()
export class ImportSourceGeoIpClassifierService implements OnModuleInit {
    private readonly logger = new Logger(ImportSourceGeoIpClassifierService.name);
    private reader: null | Reader<GeoIpResponse> = null;

    constructor(private readonly configService: ConfigService) {}

    public async onModuleInit(): Promise<void> {
        const databasePath = this.configService
            .get<string>('IMPORT_SOURCES_GEOIP_MMDB_PATH')
            ?.trim();

        if (!databasePath) {
            this.logger.log(
                'ImportSources GeoIP classifier is disabled: IMPORT_SOURCES_GEOIP_MMDB_PATH is not set',
            );
            return;
        }

        try {
            this.reader = await open<GeoIpResponse>(databasePath);
            this.logger.log(`ImportSources GeoIP classifier loaded MMDB database: ${databasePath}`);
        } catch (error) {
            this.reader = null;
            this.logger.warn(
                `ImportSources GeoIP classifier disabled: failed to load MMDB database "${databasePath}": ${String(
                    error,
                )}`,
            );
        }
    }

    public lookupCountryCode(ipAddress: string): null | string {
        if (!this.reader || isIP(ipAddress) === 0) {
            return null;
        }

        try {
            const response = this.reader.get(ipAddress);
            const countryCode =
                response?.country?.iso_code ??
                response?.registered_country?.iso_code ??
                response?.represented_country?.iso_code ??
                null;

            return countryCode?.toUpperCase() ?? null;
        } catch {
            return null;
        }
    }
}
