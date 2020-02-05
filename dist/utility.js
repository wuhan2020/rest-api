"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const leanengine_1 = require("leanengine");
async function queryPage(model, { size = 10, index = 1, equal, less, greater, contains, exists = [], ascend = [], descend = ['updatedAt', 'createdAt'], select = [], include = [], auth }) {
    const query = new leanengine_1.Query(model);
    for (const key in equal)
        if (equal[key] != null)
            query.equalTo(key, equal[key]);
    for (const key in less)
        if (less[key] != null)
            query.lessThanOrEqualTo(key, less[key]);
    for (const key in greater)
        if (greater[key] != null)
            query.greaterThanOrEqualTo(key, greater[key]);
    for (const key in contains)
        if (contains[key] != null)
            query.contains(key, contains[key]);
    for (const key of exists)
        query.exists(key);
    const count = await query.count(auth);
    if (!count)
        return { data: [], count };
    for (const key of ascend)
        query.addAscending(key);
    for (const key of descend)
        query.addDescending(key);
    query.limit(size).skip(size * --index);
    if (select[0])
        query.select(...select);
    if (include[0])
        query.include(...include);
    const data = (await query.find(auth)).map(item => item.toJSON());
    return { data, count };
}
exports.queryPage = queryPage;
//# sourceMappingURL=utility.js.map