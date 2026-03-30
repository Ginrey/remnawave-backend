import { ExternalSquadEntity } from '@modules/external-squads/entities/external-squad.entity';
import { HostWithRawInbound } from '@modules/hosts/entities/host-with-inbound-tag.entity';
import { ISRRContext } from '@modules/subscription-response-rules/interfaces';
import { UserEntity } from '@modules/users/entities/user.entity';

export interface IGenerateSubscription {
    srrContext: ISRRContext;
    user: UserEntity;
    hosts: HostWithRawInbound[];
    hostsOverrides?: ExternalSquadEntity['hostOverrides'];
<<<<<<< HEAD
    /** Raw proxy lines from external import sources, to be appended verbatim to XRAY_BASE64 output */
    extraRawLines?: string[];
=======
>>>>>>> upstream/main
    fallbackOptions?: {
        showHwidMaxDeviceRemarks?: boolean;
        showHwidNotSupportedRemarks?: boolean;
    };
}
