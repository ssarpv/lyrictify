const loadFont = (name, url) => {
  let fontFace = new FontFace(name, `url(${url})`);
  fontFace
    .load()
    .then((font) => {
      document.fonts.add(font);
    })
    .catch((e) => {
      throw e;
    });
};

document.addEventListener("DOMContentLoaded", () => {
  loadFont("Plus Jakarta Sans ExtraBold", "./ExtraBold.ttf");
  loadFont("Plus Jakarta Sans SemiBold", "./SemiBold.ttf");

  const canvas = document.getElementById("CardCanvas");
  const modal = document.getElementById("ResultModal");

  document.getElementById("CardForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const track = document.getElementById("TrackNameInput").value;
    const author = document.getElementById("AuthorInput").value;
    const cover = document.getElementById("ImageInput").files[0];
    const lyrics = document.getElementById("LyricsInput").value.split("\n");
    const bg = document.getElementById("BackgroundColorPicker").value;
    const fg = document.getElementById("ForegroundColorPicker").value;
    const txt = document.getElementById("TextColorPicker").value;

    if (cover) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target.result;
        renderCanvas(track, author, lyrics, url, bg, fg, txt);
      };
      reader.readAsDataURL(cover);
    } else {
      renderCanvas(track, author, lyrics, "./fallback.png", bg, fg, txt);
    }
    modal.style.display = "flex";
  });

  function renderCanvas(track, author, lyrics, cover, bg, fg, txt) {
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.closePath();
    ctx.beginPath();
    ctx.roundRect(
      40,
      (1920 - (420 + (lyrics.length - 1) * 80)) / 2,
      1000,
      420 + (lyrics.length - 1) * 80,
      50
    );

    ctx.fillStyle = fg;
    ctx.fill();

    ctx.font = "50px Plus Jakarta Sans ExtraBold";
    ctx.fillStyle = txt;
    ctx.fillText(
      track,
      238,
      103 + (1920 - (420 + (lyrics.length - 1) * 80)) / 2
    );

    ctx.font = "40px Plus Jakarta Sans SemiBold";
    ctx.fillText(
      author,
      238,
      160 + (1920 - (420 + (lyrics.length - 1) * 80)) / 2
    );

    lyrics.forEach((lyric, index) => {
      ctx.font = "50px Plus Jakarta Sans ExtraBold";
      ctx.fillText(
        lyric,
        95,
        260 + (1920 - (420 + (lyrics.length - 1) * 80)) / 2 + index * 80
      );
    });

    const coverImg = new Image();
    coverImg.onload = () => {
      ctx.drawImage(
        coverImg,
        90,
        50 + (1920 - (420 + (lyrics.length - 1) * 80)) / 2,
        128,
        128
      );
    };
    coverImg.src = cover;

    const lyrictifyImg = new Image();
    lyrictifyImg.onload = () => {
      ctx.drawImage(
        lyrictifyImg,
        90,
        310 + (1920 - (420 - (lyrics.length - 1) * 80)) / 2,
        236,
        70
      );
    };
    lyrictifyImg.src = "./lyrictify.png";
  }

  document.querySelector(".CloseButton").onclick = (e) => {
    modal.style.display = "none";
  };

  window.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  };

  document.querySelector(".AddToStory").onclick = async (e) => {
    e.preventDefault();

    canvas.toBlob(
      async (blob) => {
        let file = new File([blob], "yeah.png", { type: "image/png" });
        if (!navigator.canShare) {
          alert(
            "This browser does not support web sharing. Please try another browser."
          );
          return;
        }
        if (navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({ files: [file] });
          } catch (err) {
            alert(err);
          }
        } else {
          alert("This Lyrictify could not be shared.");
        }
      },
      "image/png",
      "1.00"
    );
  };

  document.querySelector(".SaveImage").onclick = async (e) => {
    e.preventDefault();
    downloadImage(canvas);
  };
});

function downloadImage(canvas) {
  let a = document.createElement("a");
  a.style.display = "none";
  a.href = canvas.toDataURL("image/png");
  a.download = `lyrictify-${Date.now()}.png`;
  document.body.appendChild(a);
  a.click();
  document.body.remove(a);
  window.location.reload();
}
