var parseBemId = require('parse-bem-identifier');

module.exports = function (deps) {
    var res = [];

    if (typeof deps === 'string') { deps = parseBemId(deps, { short: true }); }

    if (Object.keys(deps).length === 0) {
        throw new Error(this.block + ' have empty deps object');
    }

    if (typeof deps.elems === 'string') { deps.elems = [ deps.elems ]; }

    if (deps.elem !== undefined && deps.elems !== undefined) {
        throw new Error('Cannot have `elem` and `elems` in its dependencies');
    }

    if (deps.mod !== undefined && deps.mods !== undefined) {
        throw new Error('Cannot have `mod` and `mods` in dependencies');
    }

    if (deps.elems) {
        deps.elems.forEach(function(elem) {
            res.push({ elem: elem });
        });
    }

    if (deps.mods) {
        Object.keys(deps.mods).forEach(function(mod) {
            if (typeof deps.mods[mod] === 'string') {
                deps.mods[mod] = [deps.mods[mod]];
            }
            deps.mods[mod].forEach(function(value) {
                res.push({ mod: mod, value: value });
            });
        });
    }

    if (!deps.elems && !deps.mods) {
        res.push(deps);
    }

    return res;
};
