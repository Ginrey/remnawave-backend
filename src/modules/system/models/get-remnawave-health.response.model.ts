<<<<<<< HEAD
export class GetRemnawaveHealthResponseModel {
    pm2Stats: {
        name: string;
        memory: string;
        cpu: string;
    }[];

    constructor(data: GetRemnawaveHealthResponseModel) {
        this.pm2Stats = data.pm2Stats;
=======
import { RuntimeMetric } from '@common/runtime-metrics/interfaces';

export class GetRemnawaveHealthResponseModel {
    runtimeMetrics: RuntimeMetric[];

    constructor(data: RuntimeMetric[]) {
        this.runtimeMetrics = data;
>>>>>>> upstream/main
    }
}
