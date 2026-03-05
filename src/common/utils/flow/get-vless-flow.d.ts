import { InboundObject } from '@common/helpers/xray-config/interfaces/protocols.config';
import { ConfigProfileInboundEntity } from '@modules/config-profiles/entities';
interface VlessSettingsWithFlow {
    settings: {
        flow: 'xtls-rprx-vision' | '' | 'none';
    };
}
export declare const hasVlessSettingsWithFlow: (obj: unknown) => obj is VlessSettingsWithFlow;
export declare const getVlessFlow: (inbound: InboundObject) => "xtls-rprx-vision" | "" | undefined;
export declare function getVlessFlowFromDbInbound(inbound: ConfigProfileInboundEntity): 'xtls-rprx-vision' | '';
export {};
