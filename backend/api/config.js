// config.js
module.exports = {
    jwtSecret: "verysecretpasswordthatsdefinatelynotinthesource",
    jwtSession: {
        session: false
    },
    expire: (60 * 60 * 24 * 7)
};
