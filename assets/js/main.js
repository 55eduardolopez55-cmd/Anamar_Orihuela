// QR de la página actual + reproductor con barra de progreso
(function () {
    // QR
    var qrEl = document.getElementById("qrcode");
    if (qrEl && typeof QRCode !== "undefined") {
        var url = window.location.href;
        new QRCode(qrEl, {
            text: url,
            width: 132,
            height: 132,
            colorDark: "#2a160d",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
        });
        var urlEl = document.getElementById("qr-url");
        if (urlEl) urlEl.textContent = url;
    }

    // Reproductor
    var player = document.querySelector(".player");
    if (!player) return;
    var audio = player.querySelector("audio");
    var btn = player.querySelector(".play-btn");
    var fill = player.querySelector(".progress-fill");
    var bar = player.querySelector(".progress");
    var cur = player.querySelector(".time-current");
    var dur = player.querySelector(".time-duration");

    function fmt(s) {
        if (!isFinite(s)) return "0:00";
        var m = Math.floor(s / 60);
        var ss = Math.floor(s % 60);
        return m + ":" + (ss < 10 ? "0" : "") + ss;
    }

    btn.addEventListener("click", function () {
        if (audio.paused) {
            // Pausar cualquier otro reproductor de la página
            document.querySelectorAll(".player.playing audio").forEach(function (a) {
                if (a !== audio) a.pause();
            });
            audio.play();
        } else {
            audio.pause();
        }
    });

    audio.addEventListener("play", function () { player.classList.add("playing"); });
    audio.addEventListener("pause", function () { player.classList.remove("playing"); });
    audio.addEventListener("ended", function () { player.classList.remove("playing"); });

    audio.addEventListener("loadedmetadata", function () {
        dur.textContent = fmt(audio.duration);
    });
    audio.addEventListener("timeupdate", function () {
        if (audio.duration) {
            fill.style.width = (audio.currentTime / audio.duration * 100) + "%";
        }
        cur.textContent = fmt(audio.currentTime);
    });

    bar.addEventListener("click", function (e) {
        if (!audio.duration) return;
        var rect = bar.getBoundingClientRect();
        var ratio = (e.clientX - rect.left) / rect.width;
        audio.currentTime = Math.max(0, Math.min(1, ratio)) * audio.duration;
    });
})();
