const dns = require("dns");

const originalLookup = dns.lookup.bind(dns);
const originalPromisesLookup = dns.promises.lookup.bind(dns.promises);

function resolveLocalhost(options) {
    const all = typeof options === "object" && options && options.all;
    if (all) {
        return [{ address: "127.0.0.1", family: 4 }];
    }
    return { address: "127.0.0.1", family: 4 };
}

dns.lookup = function patchedLookup(hostname, options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = undefined;
    }

    if (hostname === "localhost") {
        const resolved = resolveLocalhost(options);
        process.nextTick(() => {
            if (Array.isArray(resolved)) {
                callback(null, resolved);
                return;
            }
            callback(null, resolved.address, resolved.family);
        });
        return;
    }

    return originalLookup(hostname, options, callback);
};

dns.promises.lookup = async function patchedLookupPromise(hostname, options) {
    if (hostname === "localhost") {
        return resolveLocalhost(options);
    }

    return originalPromisesLookup(hostname, options);
};
