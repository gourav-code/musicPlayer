const player = document.getElementById("player");
const songName = player.dataset.song.trimEnd();

const playBtn = document.getElementById('play');
const audio1 = new Audio();
audio1.src = `/stream/${songName}`;

playBtn.addEventListener('click', ()=> {
    audio1.play();
});

const stopBtn = document.getElementById('stop');

stopBtn.addEventListener('click', ()=>{
    audio1.pause();
});

async function get_metaData(){
    const response = await fetch(`/songs/${songName}`);
    const res_json = await response.json();
    console.log(res_json.cover);
    if (res_json.cover) {
        document.getElementById("cover").src = res_json.cover;
    } else {
        document.getElementById("cover").src = "defaultMusicIcon.jpg";
    }
}

get_metaData();