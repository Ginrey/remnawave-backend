export const SUBSCRIPTION_CONTROLLER = 'sub' as const;

export const SUBSCRIPTION_ROUTES = {
    GET: '',
<<<<<<< HEAD
    GET_OUTLINE: '/outline',
=======
>>>>>>> upstream/main
    GET_INFO: (shortUuid: string) => `${shortUuid}/info`,
} as const;
