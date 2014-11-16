var props = ['block', 'elem', 'modName', 'modVal'];

function extend(target, source) {
    for (var i = 0; i < props.length; i++) {
        var prop = props[i];
        if (target[prop]) { break; }
        if (source[prop]) { target[prop] = source[prop]; }
    }
    return target;
}

function normalize(dep) {
    var res = [];

    if (typeof dep === 'string') dep = { block: dep };

    if (Object.keys(dep).length === 0) {
        throw new Error(dep + ' is empty deps object');
    }

    if (typeof dep.elems === 'string') { dep.elems = [ dep.elems ]; }

    if (dep.elem !== undefined && dep.elems !== undefined) {
        throw new Error('Cannot have `elem` and `elems` in its dependencies');
    }

    if (dep.mod !== undefined) {
        dep.modName = dep.mod;
        delete dep.mod;
    }

    if (dep.val !== undefined) {
        dep.modVal = dep.val;
        delete dep.val;
    }

    if (dep.modName !== undefined && dep.mods !== undefined) {
        throw new Error('Cannot have `mod` and `mods` in dependencies');
    }

    if (Array.isArray(dep.elem)) {
        dep.elems = dep.elem;
        delete dep.elem;
    }

    if (dep.elems) {
        dep.elems.forEach(function(elem) {
            res.push(extend({ elem: elem }, dep));
        });
    }

    if (dep.mods) {
        Object.keys(dep.mods).forEach(function(mod) {
            if (typeof dep.mods[mod] === 'string') {
                dep.mods[mod] = [dep.mods[mod]];
            }

            dep.mods[mod].forEach(function(value) {
                res.push(extend({ modName: mod, modVal: value }, dep));
            });
        });
    }

    if (!dep.elems && !dep.mods) {
        res.push(dep);
    }

    return res;
}

module.exports = function (deps) {
    if (!deps) { return []; }
    if (!Array.isArray(deps)) { deps = [ deps ]; }

    return deps.reduce(function (previous, current) {
        return previous.concat(normalize(current));
    }, []);
};
