export const loadState = (key) => {
    try {
        const serializedState = localStorage.getItem(key);
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (e) {
        return undefined;
    }
};

export const saveState = (key, state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(key, serializedState);
    } catch (e) {
        // Ignore write errors;
    }
};

export const removeState = (key) => {
    try {
        const serializedState = localStorage.getItem(key);
        if (serializedState !== null) {
            localStorage.removeItem(key);
        }
        return undefined;
    } catch (e) {
        return undefined;
    }
}