

export function getProp(object, keys, defaultVal) {
    keys = Array.isArray(keys) ? keys : keys.split('.')
    object = object[keys[0]]
    if (object && keys.length > 1) {
        return getProp(object, keys.slice(1))
    }
    return object === undefined ? defaultVal : object
}

export const camelCaseToSpaces = (literal) => {
    return literal.replace(/([A-Z]+)/g, " $1").replace(/([A-Z][a-z])/g, " $1")
}
