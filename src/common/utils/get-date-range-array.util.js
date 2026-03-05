"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateRangeArrayUtil = getDateRangeArrayUtil;
const relativeTime_1 = __importDefault(require("dayjs/plugin/relativeTime"));
const timezone_1 = __importDefault(require("dayjs/plugin/timezone"));
const utc_1 = __importDefault(require("dayjs/plugin/utc"));
const dayjs_1 = __importDefault(require("dayjs"));
dayjs_1.default.extend(utc_1.default);
dayjs_1.default.extend(relativeTime_1.default);
dayjs_1.default.extend(timezone_1.default);
function getDateRangeArrayUtil(start, end) {
    const startDate = dayjs_1.default.utc(start).startOf('day');
    const endDate = dayjs_1.default.utc(end).endOf('day');
    const days = endDate.diff(startDate, 'day') + 1;
    return {
        startDate: startDate.toDate(),
        endDate: endDate.toDate(),
        dates: Array.from({ length: days }, (_, i) => startDate.add(i, 'day').format('YYYY-MM-DD')),
    };
}
//# sourceMappingURL=get-date-range-array.util.js.map