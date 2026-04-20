export interface ISubscriptionImportSourceGroup {
    name: string;
    importGroup: string | null;
    sourceNames: string[];
    rawLines: string[];
}
