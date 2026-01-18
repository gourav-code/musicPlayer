// const player = document.getElementById("player");
const songName = player.dataset.song.trimEnd();


// // const playBtn = document.getElementById('play');
// let currentUrl;
// let duration;
// let artistName;
// let album;

const cover_img = document.getElementById("cover");
cover_img.src = `/cover/${songName}`;
cover_img.onerror = () => {
  cover_img.src = "/defaultMusicIcon.jpg";
};

class MusicPlayer{
  constructor(){
    this.audio = new Audio();
    this.audio.src = `/stream/${songName}`;
    this.isPlaying = false;
    this.currentTrack = 0;
    this.isShuffled = false;
    this.isRepeating = false;
    

    this.initializeElements();
    this.bindEvents();
  }

  initializeElements() {
    this.playPauseBtn = document.getElementById('playPauseBtn');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.shuffleBtn = document.getElementById('shuffleBtn');
    this.repeatBtn = document.getElementById('repeatBtn');
    
    this.playIcon = document.getElementById('playIcon');
    this.pauseIcon = document.getElementById('pauseIcon');
    
    this.progressBar = document.getElementById('progressBar');
    this.progressFill = document.getElementById('progressFill');
    this.progressHandle = document.getElementById('progressHandle');
    
    // this.volumeBar = document.getElementById('volumeBar');
    // this.volumeFill = document.getElementById('volumeFill');
    // this.volumeHandle = document.getElementById('volumeHandle');
    
    this.currentTimeEl = document.getElementById('currentTime');
    this.totalTimeEl = document.getElementById('totalTime');
    // this.trackTitleEl = document.getElementById('trackTitle');
    // this.artistNameEl = document.getElementById('artistName');
    // this.albumArtEl = document.getElementById('albumArt');
    
    // this.vinylRecord = document.querySelector('.vinyl-record');
    // this.playlist = document.getElementById('playlist');
    // this.playlistItems = document.querySelectorAll('.playlist-item');
    // this.equalizer = document.querySelector('.equalizer');
  }

  bindEvents() {
    // Control buttons
    this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
    // this.prevBtn.addEventListener('click', () => this.previousTrack());
    // this.nextBtn.addEventListener('click', () => this.nextTrack());
    // this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
    // this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
    
    // Progress bar
    this.progressBar.addEventListener('click', (e) => {
      // console.log("hello progressBar");
      this.seekTo(e);
    });
    this.progressHandle.addEventListener('mousedown', (e) => {
      // console.log("hello progress handle")
      this.startProgressDrag(e)
    });
    
    // Volume bar
    // this.volumeBar.addEventListener('click', (e) => this.setVolumeFromClick(e));
    // this.volumeHandle.addEventListener('mousedown', (e) => this.startVolumeDrag(e));
    
    // Audio events
    this.audio.addEventListener('timeupdate', () => this.updateProgress());
    this.audio.addEventListener('ended', () => this.handleTrackEnd());
    this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
    
    // Playlist
    // this.playlistItems.forEach((item, index) => {
    //   item.addEventListener('click', () => this.selectTrack(index));
    // });
    
    // Keyboard controls
    // document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    this.audio.play().then(() => {
      this.isPlaying = true;
      // this.playPauseBtn.textContent = '⏸';
      this.playIcon.style.display = 'none';
      this.pauseIcon.style.display = 'block';
      // this.vinylRecord.classList.add('playing');
      // this.animateEqualizer(true);
    }).catch(error => {
      console.log('Playback failed:', error);
      // Simulate playback for demo
      this.simulatePlayback();
    });
  }
  pause() {
    this.audio.pause();
    this.isPlaying = false;
    // this.playPauseBtn.textContent = '▶️';
    this.playIcon.style.display = 'block';
    this.pauseIcon.style.display = 'none';
    // this.vinylRecord.classList.remove('playing');
    // this.animateEqualizer(false);
  }

  simulatePlayback() {
    this.isPlaying = true;
    // this.playPauseBtn.textContent = '⏸';
    this.playIcon.style.display = 'none';
    this.pauseIcon.style.display = 'block';
    // this.vinylRecord.classList.add('playing');
    // this.animateEqualizer(true);
    
    // Simulate progress
    this.simulateProgress();
  }

  simulateProgress() {
    if (!this.isPlaying) return;
    
    // const duration = this.parseDuration(this.tracks[this.currentTrack].duration);
    const currentProgress = parseFloat(this.progressFill.style.width) || 0;
    const increment = (100 / this.audio.duration) * 0.1; // Update every 100ms
    
    if (currentProgress < 100) {
      const newProgress = Math.min(currentProgress + increment, 100);
      this.updateProgressDisplay(newProgress);
      setTimeout(() => this.simulateProgress(), 100);
    } else {
      this.handleTrackEnd();
    }
  }

  // parseDuration(timeString) {
  //   const [minutes, seconds] = timeString.split(':').map(Number);
  //   return minutes * 60 + seconds;
  // }
  
  updateProgress() {
    
    if (this.audio.duration) {
      const progress = (this.audio.currentTime / this.audio.duration) * 100;
      this.updateProgressDisplay(progress);
    }
  }
  
  updateProgressDisplay(progress) {
    this.progressFill.style.width = `${progress}%`;
    this.progressHandle.style.left = `${progress}%`;
    // console.log(progress);
    // const currentTime = (progress / 100) * this.audio.duration;
    this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
  }
  
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  seekTo(e) {
    const rect = this.progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const clampedPercent = Math.max(0, Math.min(1, percent));
    // console.log(`clamped%: ${clampedPercent}`);
    if (this.audio.duration) {
      this.audio.currentTime = clampedPercent * this.audio.duration;
    } else {
      // For demo mode
      this.updateProgressDisplay(clampedPercent * 100);
    }
  }
  
  startProgressDrag(e) {
    e.preventDefault();
    const handleDrag = (e) => this.seekTo(e);
    const stopDrag = () => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', stopDrag);
    };
    
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
  }

  toggleShuffle() {
    this.isShuffled = !this.isShuffled;
    this.shuffleBtn.classList.toggle('active', this.isShuffled);
  }
  
  toggleRepeat() {
    this.isRepeating = !this.isRepeating;
    this.repeatBtn.classList.toggle('active', this.isRepeating);
  }
  
  handleTrackEnd() {
    if (this.isRepeating) {
      this.resetProgress();
      this.play();
    } else {
      this.nextTrack();
      if (this.isPlaying) {
        this.play();
      }
    }
  }

  updateDuration() {
    if (this.audio.duration) {
      this.totalTimeEl.textContent = this.formatTime(this.audio.duration);
    }
    this.updateProgress();
  }


}

document.addEventListener('DOMContentLoaded', () => {
  new MusicPlayer();
});

// const audio1 = new Audio();
// audio1.src = `/stream/${songName}`;

// playBtn.addEventListener('click', ()=> {
//     audio1.play();
// });

// const stopBtn = document.getElementById('stop');

// stopBtn.addEventListener('click', ()=>{
//     audio1.pause();
// });
///////////////////////image//////////////////////////////////////


// async function get_metaData(){
//     const response = await fetch(`/cover/${songName}`);
//     const res_json = await response.json();
//     console.log(res_json.cover);
//     if (res_json.cover) {
//         document.getElementById("cover").src = res_json.cover;
//     } else {
//         document.getElementById("cover").src = "defaultMusicIcon.jpg";
//     }
// }

// get_metaData();


