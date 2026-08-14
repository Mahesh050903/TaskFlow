const app = require("./app");
const config = require("./config/config");

app.listen(config.port, () => {
    console.log(
        `TaskFlow backend running on http://localhost:${config.port} in ${config.env} mode`
    );
});