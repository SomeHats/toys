module.exports = {
    content: ["./src/**/*.{html,js,ts,tsx,rs}"],
    theme: {
        extend: {
            transitionTimingFunction: {
                "in-back": "cubic-bezier(0.36, 0, 0.66, -0.56)",
                "out-back": "cubic-bezier(0.34, 1.56, 0.64, 1)",
            },
        },
    },
};
