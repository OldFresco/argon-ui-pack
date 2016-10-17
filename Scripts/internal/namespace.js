;
(function (root, undefined) {
    'use strict';

    var toString = Object.prototype.toString;

    if (toString.call(root.namespace) === '[object Function]') {
        return;
    }

    root.namespace = function (ns, parent) {
        var parts,
            index,
            length;

        if (toString.call(ns) !== '[object String]') {
            throw new Error('Invalid namespace: ' + ns);
        }

        parts = ns.split('.');
        parent = parent || root;

        for (index = 0, length = parts.length; index < length; index += 1) {
            if (typeof parent[parts[index]] === 'undefined') {
                parent[parts[index]] = {};
            }

            parent = parent[parts[index]];
        }

        return parent;
    };
})(this);