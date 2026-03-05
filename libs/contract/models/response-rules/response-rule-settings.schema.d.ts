import z from 'zod';
export declare const ResponseRuleSettingsSchema: z.ZodOptional<z.ZodObject<{
    disableSubscriptionAccessByPath: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    disableSubscriptionAccessByPath?: boolean | undefined;
}, {
    disableSubscriptionAccessByPath?: boolean | undefined;
}>>;
