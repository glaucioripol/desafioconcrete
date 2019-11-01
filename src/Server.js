const http = require("http")
const express = require("express")
const mongoose = require("mongoose");
const cors = require("cors")
const compression = require('compression')
const os = require("os")
const cookieParser = require("cookie-parser")

const { port, uriDB } = require("./configs/config")
const Routes = require("./routes")

mongoose.connect(uriDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch(err => {
    console.log(err)
});

const app = express()

app
    // eslint-disable-next-line no-undef
    .use(cors())
    .use(compression())
    .disable('x-powered-by')
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    .use(cookieParser())
    .use("/api", Routes)
    .get("/", (req, res) => res.json({
        Application: "on",
        Homolog: true,
        statusServer: {
            uptime: ((os.uptime() / 60) / 60) / 24,
            freeMemoryMB: Math.round((os.freemem() / 1024) / 1024),
            totalMemoryMB: Math.round((os.totalmem() / 1024) / 1024),
            average: os.loadavg()
        }
    }))

app.listen(port, () => console.log(`API on in: http://127.0.0.1:${port}/api/v1`))
// const server = http.createServer(app)
// server.listen(port, () => console.log(`API on in: http://127.0.0.1:${port}/api/v1`))