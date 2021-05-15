const debounce = (fn, delay = 1000) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);

        timeoutId = setTimeout(() => {
            fn.apply(null, args);
        }, delay);
    }
}
