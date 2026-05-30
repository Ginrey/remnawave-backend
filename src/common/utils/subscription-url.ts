export function buildSubscriptionUrl(subPublicDomain: string, subscriptionToken: string): string {
    const normalizedDomain = subPublicDomain.trim().replace(/\/+$/, '');

    if (/^https?:\/\//i.test(normalizedDomain)) {
        return `${normalizedDomain}/${subscriptionToken}`;
    }

    return `https://${normalizedDomain}/${subscriptionToken}`;
}
