import { z } from 'zod';

import { PasswordAuthSettingsSchema } from './password-auth-settings.schema';
import { BrandingSettingsSchema } from './branding-settings.schema';
import { PasskeySettingsSchema } from './passkey-settings.schema';
<<<<<<< HEAD
import { TgAuthSettingsSchema } from './tg-auth-settings.schema';
=======
>>>>>>> upstream/main
import { Oauth2SettingsSchema } from './oauth2-settings.schema';

export const RemnawaveSettingsSchema = z.object({
    passkeySettings: z.nullable(PasskeySettingsSchema),
    oauth2Settings: z.nullable(Oauth2SettingsSchema),
<<<<<<< HEAD
    tgAuthSettings: z.nullable(TgAuthSettingsSchema),
=======
>>>>>>> upstream/main
    passwordSettings: z.nullable(PasswordAuthSettingsSchema),
    brandingSettings: z.nullable(BrandingSettingsSchema),
});

export type TRemnawaveSettings = z.infer<typeof RemnawaveSettingsSchema>;
