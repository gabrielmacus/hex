module.exports = {
    apps : [
        {
            name: "hex",
            script: "./www",
            watch: true,
            env: {
                "PORT": 80,
                "NODE_ENV": "development"
            }
        }
    ]
}
