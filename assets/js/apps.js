document.addEventListener('DOMContentLoaded', function () {
  var audio = document.getElementById('audio');
  var playPauseBtn = document.getElementById('playPauseBtn');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var fileInput = document.getElementById('fileInput');
  var progressBar = document.getElementById('progressBar');
  var progressRange = document.getElementById('progressRange');
  var muteBtn = document.getElementById('muteBtn');
  var playlistItems = document.getElementById('playlistItems');
  var playlist = [];
  var currentIndex = 0;
  var minimizeBtn = document.getElementById('minimizeBtn');
  var audioPlayerContainer = document.getElementById('audioPlayerContainer');
  var audioPlayer = document.getElementById('audioPlayer');

  // Tambahkan lagu ke playlist
  function addToPlaylist(files) {
    files.forEach(function (file) {
      playlist.push(file);
      var li = document.createElement("li");
      li.textContent = batasiKarakter(file.name, 40);

      // Tambahkan tombol hapus dengan ikon "X"
      var deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = "&times;";
      deleteBtn.classList.add("deleteBtn");
      deleteBtn.addEventListener("click", function (event) {
        event.stopPropagation(); // Mencegah memainkan audio saat mengklik tombol hapus
        var index = playlist.indexOf(file);
        if (index !== -1) {
          playlist.splice(index, 1);
          playlistItems.removeChild(li);
          if (index === currentIndex) {
            // Jika file yang sedang diputar dihapus, pindah ke file berikutnya jika ada
            if (index === playlist.length) {
              index = 0; // Jika sudah di akhir, putar dari awal
            }
            loadAndPlayAudio(index);
          } else if (index < currentIndex) {
            currentIndex--; // Menyesuaikan indeks saat file sebelumnya dihapus
          }
        }
      });
      li.appendChild(deleteBtn);

      li.addEventListener("click", function () {
        loadAndPlayAudio(playlist.indexOf(file));
      });
      playlistItems.appendChild(li);
    });
  }

  // Memuat dan memainkan file audio
  function loadAndPlayAudio(index) {
    if (index < 0 || index >= playlist.length) return;
    currentIndex = index;
    var file = playlist[index];
    audio.src = URL.createObjectURL(file);
    audio.load();
    audio.play();
    playPauseBtn.innerHTML = '<i class="fa-solid fa-pause  fa-2x"></i>';
    highlightCurrentAudio(index);
  }

  // Highlight file yang sedang diputar
  function highlightCurrentAudio(index) {
    var playlistItemElements = playlistItems.getElementsByTagName("li");
    for (var i = 0; i < playlistItemElements.length; i++) {
      if (i === index) {
        playlistItemElements[i].classList.add("current");
      } else {
        playlistItemElements[i].classList.remove("current");
      }
    }
  }

  // Play atau pause audio
  playPauseBtn.addEventListener("click", function () {
    if (audio.paused) {
      audio.play();
      playPauseBtn.innerHTML = '<i class="fa-solid fa-pause  fa-2x"></i>';
    } else {
      audio.pause();
      playPauseBtn.innerHTML = '<i class="fa-solid fa-play  fa-2x"></i>';
    }
  });

  minimizeBtn.addEventListener("click", function () {
    audioPlayerContainer.classList.toggle("minimized");
    cekMinimized();
  });
  function cekMinimized() {
    const iconWindow = document.getElementById("faWindow");
    if (audioPlayerContainer.classList.contains("minimized")) {
      iconWindow.classList.add("fa-window-maximize");
      iconWindow.classList.remove("fa-window-minimize");
      // audioPlayer.style.display = "block";
    } else {
      iconWindow.classList.remove("fa-window-maximize");
      iconWindow.classList.add("fa-window-minimize");
      // audioPlayer.style.display = "none";
    }
  }
  // Memuat dan memainkan file audio yang dipilih
  fileInput.addEventListener("change", function (e) {
    var files = e.target.files;
    if (files.length === 0) return;
    addToPlaylist(Array.from(files));
    loadAndPlayAudio(playlist.length - files.length); // Memainkan file yang pertama kali ditambahkan
  });

  // Perbarui progress bar dan posisi pemutaran saat input range diubah
  progressRange.addEventListener("input", function () {
    var progress = parseFloat(progressRange.value);
    var duration = audio.duration;
    var newPosition = (progress / 100) * duration;
    audio.currentTime = newPosition;
  });

  // Perbarui progress bar saat audio sedang dimainkan
  audio.addEventListener("timeupdate", function () {
    var value = (audio.currentTime / audio.duration) * 100;
    progressBar.value = value;
    progressRange.value = value; // Perbarui nilai input range sesuai dengan progres pemutaran
  });

  // Ketika file selesai diputar, putar file berikutnya
  audio.addEventListener("ended", function () {
    playNextAudio();
  });

  // Tombol Previous
  prevBtn.addEventListener("click", function () {
    var prevIndex = currentIndex - 1;
    if (prevIndex < 0) {
      prevIndex = playlist.length - 1;
    }
    loadAndPlayAudio(prevIndex);
  });

  // Tombol Next
  nextBtn.addEventListener("click", function () {
    playNextAudio();
  });

  // Tombol Mute
  muteBtn.addEventListener("click", function () {
    audio.muted = !audio.muted;
    if (audio.muted) {
      muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    } else {
      muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    }
  });

  volumeRange.addEventListener("input", function () {
    audio.volume = parseFloat(volumeRange.value);
    if (audio.volume === 0) {
      audio.muted = true;
      muteBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    } else {
      audio.muted = false;
      muteBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    }
  });

  // Memutarkan file berikutnya dalam daftar putar
  function playNextAudio() {
    var nextIndex = currentIndex + 1;
    if (nextIndex >= playlist.length) {
      nextIndex = 0; // Kembali ke awal jika sudah di akhir daftar putar
    }
    loadAndPlayAudio(nextIndex);
  }

  function batasiKarakter(string, jumlahKarakter) {
    if (string.length <= jumlahKarakter) {
      return string;
    } else {
      return string.substring(0, jumlahKarakter) + "...";
    }
  }

});
