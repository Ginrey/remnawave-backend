"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserForConfigEntity = void 0;
class UserForConfigEntity {
    trojanPassword;
    vlessUuid;
    ssPassword;
    tags;
    tId;
    constructor(data) {
        this.trojanPassword = data.trojanPassword;
        this.vlessUuid = data.vlessUuid;
        this.ssPassword = data.ssPassword;
        this.tags = data.tags;
        this.tId = data.tId;
    }
}
exports.UserForConfigEntity = UserForConfigEntity;
//# sourceMappingURL=users-for-config.js.map