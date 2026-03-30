import { z } from 'zod';

import {
    Oauth2SettingsSchema,
    PasskeySettingsSchema,
<<<<<<< HEAD
    TgAuthSettingsSchema,
=======
>>>>>>> upstream/main
    PasswordAuthSettingsSchema,
    BrandingSettingsSchema,
} from '@libs/contracts/models';

declare global {
    namespace PrismaJson {
        type PasskeySettings = z.infer<typeof PasskeySettingsSchema>;
        type Oauth2Settings = z.infer<typeof Oauth2SettingsSchema>;
<<<<<<< HEAD
        type TgAuthSettings = z.infer<typeof TgAuthSettingsSchema>;
        type PasswordAuthSettings = z.infer<typeof PasswordAuthSettingsSchema>;
        type BrandingSettings = z.infer<typeof BrandingSettingsSchema>;
        type FetchHeaders = Record<string, string>;
=======
        type PasswordAuthSettings = z.infer<typeof PasswordAuthSettingsSchema>;
        type BrandingSettings = z.infer<typeof BrandingSettingsSchema>;
>>>>>>> upstream/main
    }
}

export {};
