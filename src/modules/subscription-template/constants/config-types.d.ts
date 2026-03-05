import { TResponseRulesResponseType } from '@libs/contracts/constants';
export declare const SUBSCRIPTION_CONFIG_TYPES: Record<TResponseRulesResponseType, {
    CONTENT_TYPE: string;
    isBase64: boolean;
}>;
export type TSubscriptionConfigTypes = [keyof typeof SUBSCRIPTION_CONFIG_TYPES][number];
export declare const SUBSCRIPTION_CONFIG_TYPES_VALUES: {
    CONTENT_TYPE: string;
    isBase64: boolean;
}[];
