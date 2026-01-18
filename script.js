const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const metaM = require("music-metadata");

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: true}));
const songsFolderPath = '/home/gourav/Music';
const PORT = 3000;



app.get("/favicon.ico", (req, res) => res.status(204));
app.get('/cover/:songName', async (req, res) => {
    // console.log("kingsley conman");
    try{
        const songName = req.params.songName;
        const filePath = path.join(songsFolderPath, songName);
        const metaData = await metaM.parseFile(filePath);
        // console.log(metaData);
        const pic = metaData.common.picture?.[0];
        // console.log(pic);
        // let cover = null;
        if (pic) {
            res.set({
                "Content-Type": pic.format,
                "duration": metaData.format.duration,
                'artists': metaData.common.artist,
                'album': metaData.common.album
            });
            res.send(Buffer.from(pic.data));
            // const base64 = buffer.toString("base64");
            // cover = `data:image/jpeg;base64,${base64}`;
        }
        else {
            return res.sendStatus(404);
        }

        // console.log("i am outside pic ");
        
    } catch (err) {
        // console.log("not happening");
        res.status(500).json({ error: "Metadata read failed" });
    }
})
app.use(express.static(path.join(__dirname + '/public')));

app.get('/', (req, res) => {
    fs.readdir(songsFolderPath, (err, file_name)=> {
        // console.log(typeof(file_name))
        res.render('index', {files: file_name});
    })
});

app.get("/stream/:songName", (req, res) => {
    const songName = req.params.songName;
    const filePath = path.join(songsFolderPath, songName);
    // console.log(fs.statSync(filePath));
    const stat = fs.statSync(filePath);
    const range = req.headers.range;
    // console.log(req.headers.range);
    if (!range) {
        res.writeHead(200, {
            "Content-Length": stat.size,
            "Content-Type": "audio/mpeg",
            "Accept-Ranges": "bytes"
        });
        fs.createReadStream(filePath).pipe(res);
        return;
    }
    const chunkSize = 1024 * 1024; // 1MB chunks
    const start = Number(range.replace(/\D/g, "")); //converting string and getting number
    const end = Math.min(start + chunkSize, stat.size - 1);

    const stream = fs.createReadStream(filePath, { start, end });
    
    res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${stat.size}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Content-Type": "audio/mpeg"
    });

    stream.pipe(res);
    
});

app.post('/songPlayer', (req, res) => {
    let songName = req.body.itemId;
    // songName = songName.split(".mp3")[0];
    res.redirect(`/songPlayer/${encodeURIComponent(songName)}`);
})

app.get('/songPlayer/:songName', (req, res) => {
    let songName = req.params.songName;
    // songName = songName.concat("", ".mp3");
    res.render("songPlay", {
        songName, path: songsFolderPath
    });
});

app.listen(PORT);