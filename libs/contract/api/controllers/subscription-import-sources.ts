export const SUBSCRIPTION_IMPORT_SOURCES_CONTROLLER = 'subscription-import-sources' as const;

const ACTIONS_ROUTE = 'actions' as const;

export const SUBSCRIPTION_IMPORT_SOURCES_ROUTES = {
    GET: '', // Get list of all import sources // get
    CREATE: '', // Create new import source // post
    UPDATE: (uuid: string) => `${uuid}`, // Update import source by uuid // patch
    GET_BY_UUID: (uuid: string) => `${uuid}`, // Get import source by uuid // get
    DELETE: (uuid: string) => `${uuid}`, // Delete import source by uuid // delete

    ACTIONS: {
        FETCH_NOW: (uuid: string) => `${uuid}/${ACTIONS_ROUTE}/fetch-now`, // Trigger immediate fetch // post
    },
} as const;
