import z from 'zod';
export declare const ResponseRuleModificationsSchema: z.ZodOptional<z.ZodObject<{
    headers: z.ZodOptional<z.ZodArray<z.ZodObject<{
        key: z.ZodString;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        key: string;
        value: string;
    }, {
        key: string;
        value: string;
    }>, "many">>;
    applyHeadersToEnd: z.ZodOptional<z.ZodOptional<z.ZodBoolean>>;
    subscriptionTemplate: z.ZodOptional<z.ZodString>;
    ignoreHostXrayJsonTemplate: z.ZodOptional<z.ZodBoolean>;
    ignoreServeJsonAtBaseSubscription: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    headers?: {
        key: string;
        value: string;
    }[] | undefined;
    applyHeadersToEnd?: boolean | undefined;
    subscriptionTemplate?: string | undefined;
    ignoreHostXrayJsonTemplate?: boolean | undefined;
    ignoreServeJsonAtBaseSubscription?: boolean | undefined;
}, {
    headers?: {
        key: string;
        value: string;
    }[] | undefined;
    applyHeadersToEnd?: boolean | undefined;
    subscriptionTemplate?: string | undefined;
    ignoreHostXrayJsonTemplate?: boolean | undefined;
    ignoreServeJsonAtBaseSubscription?: boolean | undefined;
}>>;
