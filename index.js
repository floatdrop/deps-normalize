var toString = Object.prototype.toString,
    isArray = Array.isArray,
    isObject = function(o) {
        return toString.call(o) === '[object Object]';
    };

module.exports = function normalizeDeps(deps) {
    if(isArray(deps)) return deps.map(normalize);
    return normalize(deps);
};

function normalize(deps) {
    if(!isObject(deps)) {
        throw new Error('invalid declaration ' + deps);
    }

    var result = [],
        cache = {};

    if(deps.blocks) {
        var blocks = deps.blocks;
        if(!isArray(blocks)) blocks = [blocks];
        pushBlocks(blocks);
    }

    var block = deps.block,
        elem = deps.elem;

    walk(deps.elems, pushElems);

    // XXX: workaround for bem/bem-tool#401
    if(isArray(deps.elem)) {
        walk(deps.elem, function(block, elem, elems) {
            pushElems(block, null, elems, true);
        });
    }

    walk(deps.mods, pushMods);

    if(!result.length) {
        push(extendDecl({}, deps));
    }

    return result;

    function walk(items, cb) {
        if(!items) return;
        if(!isArray(items)) items = [items];

        var i = 0,
            slen = result.length,
            decl;

        do {
            decl = result[i] || {};

            if(decl.block) block = decl.block;
            if(decl.elem) elem = decl.elem;

            cb(block, elem, items);
        } while(++i < slen);
    }

    function push(decl) {
        if(isArray(decl)) {
            decl.forEach(push);
            return;
        }

        var key = identify(decl);

        if(cache[key]) return;
        cache[key] = true;

        result.push(decl);
    }

    function pushOne(block, elem) {
        if(block) {
            var d = {
                block : block
            };
            if(elem) d.elem = elem;
            push(d);
        }
    }

    function pushBlocks(blocks) {
        blocks.reduce(function(decls, block) {
            pushOne(block);
            push(extendDecl({ block : block }, deps));

            return decls;
        }, []);
    }

    function pushElems(block, _, elems, single) {
        single || pushOne(block);

        elems.forEach(function(elem) {
            var d = {};

            if(block) d.block = block;
            d.elem = elem;

            push(extendDecl(d, deps));
        });
    }

    function pushMods(block, elem, mods) {
        pushOne(block, elem);

        mods.forEach(function(mod) {
            Object.keys(mod).forEach(function(name) {
                var d = { mod :  name };
                if(block) {
                    d.block = block;
                    if(elem) d.elem = elem;
                }

                push(extendDecl({}, d));

                var vals = mod[name];
                if(!vals) {
                    return;
                }

                if(!isArray(vals)) vals = [vals];

                vals.forEach(function(val) {
                    push(extendDecl({ val : val }, d));
                });
            });
        });
    }
}

function extendDecl(decl, src) {
    extend('block', decl, src);
    extend('elem', decl, src);
    extend('mod', decl, src);
    extend('val', decl, src);
    return decl;
}

function extend(type, decl, src) {
    if(decl[type]) return decl;
    if(src[type]) decl[type] = src[type];
    return decl;
}

function identify(decl) {
    return decl.block +
        (decl.elem? '__' + decl.elem : '') +
        (decl.mod? '_' + decl.mod + (decl.val? '_' + decl.val : '') : '');
}
