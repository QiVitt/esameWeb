const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const db = require("./db");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:2999',
    credentials: true
}))
app.use(require("./route"));


app.use('/', express.static('client', {
    maxAge: "30d",
    etag: true,
    lastModified: true,
    extensions: ['htm', 'html'],
    index: 'index.html',
    setHeaders: function (res, path, stat) {
        res.header('Cache-Control', 'public, max-age=1d');
    }
}));
(async function(){
    await db.connect();
    app.listen(3000, () => {
        console.log('Listening on port 3000');
    })
})()
