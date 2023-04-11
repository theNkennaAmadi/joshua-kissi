let tlMain = gsap.timeline();
tlMain.to(
  ".logo-text.film",
  { opacity: 1, ease: "expo.inOut", duration: 0.7 },
  "<"
);
tlMain.to(".logo-text.film", {
  opacity: 0,
  ease: "expo.inOut",
  duration: 0.7,
  delay: 1
});
const lottie = Webflow.require("lottie").lottie;

let isEven = (number) => {
  return number % 2 === 0;
};

let video = document.querySelector("video"),
  canvas = document.querySelector("#canvas-element");
let dLine = [...document.querySelectorAll(".d-line")];

video.addEventListener("loadedmetadata", () => {
  console.log("hello");
  let duration = video.duration;
  let number = Math.round(
    (document.querySelector(".video-duration-wrapper").clientWidth * 0.4) / 2
  );
  if (isEven(number) === false) {
    number += 1;
  }

  let groupItemNumber = Math.ceil(number / duration);
  //console.log(duration, number, groupItemNumber);
  for (let i = 0; i < number; i++) {
    let div = document.createElement("div");
    div.classList.add("d-line");
    document.querySelector(".duration-lines-wrapper").append(div);
  }
  dLine = [...document.querySelectorAll(".d-line")];
  for (let i = 0; i < number; i++) {
    let durationIndex = (duration / number) * (i + 1);
    //console.log(durationIndex);
    dLine[i].setAttribute(`duration`, `${durationIndex}`);
  }
  gsap.to(".duration-wrapper", { opacity: 1 });
});

let minutes;
let seconds;
let vTime = document.querySelector(".duration-wrapper").firstElementChild;

video.addEventListener("timeupdate", () => {
  minutes = Math.floor(video.currentTime / 60, 10);
  seconds = Math.floor(video.currentTime % 60);
  let vTimeText = `${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  vTime.textContent = vTimeText;
  let vWidth = document.querySelector(".duration-lines-wrapper").clientWidth;
  let vPos = (video.currentTime / video.duration) * vWidth;
  gsap.to(vTime.parentElement, { x: vPos });
  const result = dLine.find((line) => {
    return line.getAttribute("duration") >= video.currentTime;
  });
  gsap.to(dLine, { scaleY: 1 });
  gsap.to(result, { scaleY: 1.4 });
  gsap.to(result.nextElementSibling, { scaleY: 1.2 });
  gsap.to(result.previousElementSibling, { scaleY: 1.2 });
  // console.log(result);
});
document.querySelector("video").addEventListener("click", () => {
  //console.log("playing");
});

let sounds = [...document.querySelectorAll(".sound-s")];

let soundWrapper = document.querySelector(".sound-wrapper");
soundWrapper.addEventListener("click", () => {
  soundWrapper.classList.toggle("muted");
  if (soundWrapper.classList.contains("muted")) {
    video.muted = true;
    sounds.map((sound) => {
      if (sound.classList.contains("on")) {
        sound.classList.remove("on");
      }
    });
    gsap.to(".sound-cross", { height: "50%" });
  } else {
    video.muted = false;
    //video.removeAttribute("muted");
    gsap.to(".sound-cross", { height: "0%" });
    sounds.map((sound) => {
      if (!sound.classList.contains("on")) {
        sound.classList.add("on");
      }
    });
  }
});
video.addEventListener("pause", () => {
  lottie.stop();
  sounds.map((sound) => {
    if (sound.classList.contains("on")) {
      sound.classList.remove("on");
    }
  });
});

video.addEventListener("play", () => {
  lottie.play();
  if (!video.muted) {
    sounds.map((sound) => {
      if (!sound.classList.contains("on")) {
        sound.classList.add("on");
      }
    });
  }
});

let thumbs = [];

/*
video.addEventListener("loadeddata", function () {
  const duration = Math.floor(video.duration);
  console.log(duration);
  for (let i = 0; i <= duration; i++) {
    let canvas = document.createElement("canvas");
    // Set canvas dimensions same as video dimensions
    canvas.width = video.offsetWidth / 14;
    canvas.height = video.offsetHeight / 14;

    video.currentTime = i;
    let canvas_ctx = canvas.getContext("2d");
    // Placing the current frame image of the video in the canvas
    canvas_ctx.drawImage(
      video,
      0,
      0,
      video.offsetWidth / 14,
      video.offsetHeight / 14
    );
    let imageUrl = canvas.toDataURL("image/webp");
    let image = document.createElement("img");
    image.src = imageUrl;
    console.log(image);
    thumbs.push(image);
    video.removeEventListener("canplay", event);
  }
});
*/
/*
video.addEventListener("loadeddata", function () {
  const duration = Math.floor(video.duration);
  console.log(duration);
  for (let i = 0; i <= duration; i++) {
    let canvas = document.createElement("canvas");
    // Set canvas dimensions same as video dimensions
    canvas.width = video.offsetWidth / 14;
    canvas.height = video.offsetHeight / 14;

    video.currentTime = i;
    let canvas_ctx = canvas.getContext("2d");
    // Placing the current frame image of the video in the canvas
    canvas_ctx.drawImage(
      video,
      0,
      0,
      video.offsetWidth / 14,
      video.offsetHeight / 14
    );
    let imageUrl = canvas.toDataURL("image/webp");
    let image = document.createElement("img");
    image.src = imageUrl;
    console.log(image);
    thumbs.push(image);
    video.removeEventListener("canplay", event);
  }
});
*/

video.addEventListener(
  "loadeddata",
  async function () {
    video.crossOrigin = "anonymous";
    const duration = Math.floor(video.duration);
    //console.log(duration);
    video.muted = true;
    for (let i = 0; i <= duration; i++) {
      const canvas = document.createElement("canvas");
      canvas.width = video.offsetWidth / 14;
      canvas.height = video.offsetHeight / 14;
      const context = canvas.getContext("2d");
      video.currentTime = i;
      console.log(i, canvas);
      await new Promise(function (rsv) {
        const event = function () {
          context.drawImage(
            video,
            0,
            0,
            video.offsetWidth / 14,
            video.offsetHeight / 14
          );
          console.log(context);
          let imageUrl = canvas.toDataURL("image/webp");
          let imageContainer = document.createElement("div");
          imageContainer.classList.add("thumb-container");
          imageContainer.setAttribute("duration", i);
          imageContainer.addEventListener("click", () => {
            video.currentTime = i;
          });
          let image = document.createElement("img");
          image.src = imageUrl;
          imageContainer.append(image);
          thumbs.push(imageContainer);
          video.removeEventListener("canplay", event);
          rsv(null);
        };
        video.addEventListener("canplay", event);
      });
    }
    console.log("thumbnails loaded");
    gsap.to(".loader-wrapper", { opacity: 0 });
    gsap.to(".loader-wrapper", { display: "none" });
    document.querySelector(".thumbnails-wrapper").replaceChildren(...thumbs);
    console.log(
      document.querySelector(".thumbnails-wrapper").getBoundingClientRect()
    );
    console.log(
      document.querySelector(".duration-lines-wrapper").getBoundingClientRect()
    );
    video.currentTime = 0;
    //video.play();
    video.muted = false;
    timeUpdate();
    const playButton = document.querySelector(".lottie-wrapper");
    playButton.addEventListener("click", () => {
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
    });
  },
  false
);

const chars = [...document.querySelectorAll(".char")];
chars.map((char) => {
  // create wrapper container
  var wrapper = document.createElement("span");
  wrapper.classList.add("char-wrapper");
  // insert wrapper before el in the DOM tree
  char.parentNode.insertBefore(wrapper, char);
  // move el into wrapper
  wrapper.appendChild(char);
});
let mm = gsap.matchMedia();
let tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".section.ft-about",
    pin: ".ft-hero-grid",
    start: "top bottom",
    end: "top 30%",
    scrub: 1,
    onUpdate: () => {
      if (Math.round(tl.progress() * 100) > 30) {
        let hasBeenPaused = document
          .querySelector(".ft-hero-grid")
          .classList.contains("paused");
        //console.log(hasBeenPaused);
        if (!hasBeenPaused) {
          console.log("hello");
          video.pause();
          document.querySelector(".ft-hero-grid").classList.add("paused");
        }
      } else {
        video.play();
        document.querySelector(".ft-hero-grid").classList.remove("paused");
      }
    },
    invalidateOnRefresh: true
  }
});

tl.to(".char", { x: "-110%", opacity: 0, display: "none", ease: "expo.inOut" });
mm.add("(min-width: 479px)", () => {
  tl.to(".ft-main-title", { fontSize: "5.75rem", ease: "expo.inOut" });
});
mm.add("(max-width: 479px)", () => {
  tl.to(".ft-main-title", { fontSize: "3.5rem", ease: "expo.inOut" });
});
tl.to("[ftLink]", { opacity: 0, ease: "expo.inOut", duration: 0.1 }, "<");
tl.to(
  ".video-controls",
  { opacity: 0, ease: "expo.inOut", duration: 0.1 },
  "<"
);
tl.to(
  ".ft-next-wrapper",
  { opacity: 0, ease: "expo.inOut", duration: 0.1 },
  "<"
);
mm.add("(min-width: 479px)", () => {
  tl.to(".ft-video-utility-wrapper", { y: "-77vh", ease: "expo.inOut" }, "<");
});
mm.add("(max-width: 479px)", () => {
  tl.to(".ft-video-utility-wrapper", { y: "-55vh", ease: "expo.inOut" }, "<");
});
tl.to(".ft-video-wrapper", { scale: 0.6, ease: "expo.inOut" }, "<");

const filmCredits = document.querySelector("#film-credits");
filmCredits.addEventListener("click", () => {
  lenis.scrollTo(filmCredits);
});

const nextBtn = document.querySelector(".ft-next-btn");
const nextVideoWrapper = document.querySelector(".ft-next-video-wrapper");
const nextWrapper = document.querySelector(".ft-next-wrapper");
const videoControls = document.querySelector(".video-controls");
const nextHeader = document.querySelector(".ft-next-header-wrapper");
nextBtn.addEventListener("click", () => {
  if (!nextVideoWrapper.classList.contains("open")) {
    gsap.to(nextVideoWrapper.querySelector(".ft-next-video-cc-list-wrapper"), {
      x: "0%"
    });
    gsap.to(nextHeader, {
      opacity: 1
    });
    gsap.to(".ft-next-btn-cross-v", { height: "0rem" });
    gsap.to(videoControls, {
      opacity: 0
    });
    gsap.to(video, {
      opacity: 0.5
    });
  } else {
    gsap.to(nextVideoWrapper.querySelector(".ft-next-video-cc-list-wrapper"), {
      x: "105%"
    });
    gsap.to(".ft-next-btn-cross-v", { height: "1.5rem" });
    gsap.to(nextHeader, {
      opacity: 0
    });
    gsap.to(videoControls, {
      opacity: 1
    });
    gsap.to(video, {
      opacity: 1
    });
  }
  nextWrapper.classList.toggle("open");
  nextVideoWrapper.classList.toggle("open");

  if (
    video.currentTime > 0 &&
    !video.paused &&
    !video.ended &&
    video.readyState > 2
  ) {
    video.pause();
  }
});

const nextVideos = [...document.querySelectorAll(".ft-next-cc-item")];
let selector = document.querySelector(".ft-thumb-indicator");
nextVideos.map((video) => {
  video.addEventListener("mouseenter", () => {
    selector.style.display = "block";
    let state = Flip.getState(selector);
    video.append(selector);
    Flip.from(state, {
      duration: 0.4,
      ease: "power2.Out"
    });
    nextHeader.querySelector(".title").textContent = video.querySelector(
      ".title"
    ).textContent;
    video.querySelector("video").play();
  });
  video.addEventListener("mouseleave", () => {
    selector.style.display = "none";
    nextHeader.querySelector(".title").textContent = "";
    video.querySelector("video").pause();
    video.querySelector("video").currentTime = 0;
    //video.removeAttribute("autoplay");
  });
});

video.addEventListener("ended", () => {
  gsap.to(nextVideoWrapper.querySelector(".ft-next-video-cc-list-wrapper"), {
    x: "0%"
  });
  gsap.to(nextHeader, {
    opacity: 1
  });
  gsap.to(".ft-next-btn-cross-v", { height: "0rem" });
  gsap.to(videoControls, {
    opacity: 0
  });
  gsap.to(video, {
    opacity: 0.5
  });
  nextWrapper.classList.toggle("open");
  nextVideoWrapper.classList.toggle("open");
});

const timeUpdate = () => {
  const thumbWrapper = document.querySelector(".thumbnails-wrapper")
    .clientWidth;
  const thumbMainWrapper = document.querySelector(".thumbnails-main-wrapper")
    .clientWidth;

  video.addEventListener("timeupdate", () => {
    let duration = video.duration;
    let currentTime = video.currentTime;
    let currentPercentage = currentTime / duration;
    const totalMove = (thumbMainWrapper / thumbWrapper) * 100;
    let accPercentage = -currentPercentage * (100 - totalMove);
    gsap.to(document.querySelector(".thumbnails-wrapper"), {
      x: `${accPercentage}%`
    });
  });
};

let isSafari =
  navigator.vendor.match(/apple/i) &&
  !navigator.userAgent.match(/crios/i) &&
  !navigator.userAgent.match(/fxios/i) &&
  !navigator.userAgent.match(/Opera|OPT\//);

if (isSafari) {
  document.querySelector(".loader-wrapper").style.display = "none";
  soundWrapper.click();
  const playButton = document.querySelector(".lottie-wrapper");
  playButton.addEventListener("click", () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });
} else {
  document
    .querySelector(".video-duration-wrapper")
    .addEventListener("mouseenter", () => {
      gsap.fromTo(
        ".duration-indicator",
        { opacity: 0, height: "0rem" },
        { opacity: 1, height: "3rem" }
      );
      gsap.fromTo(".duration-lines-wrapper", { opacity: 1 }, { opacity: 0 });
      gsap.fromTo(".thumbnails-main-wrapper", { opacity: 0 }, { opacity: 1 });
    });

  document
    .querySelector(".video-duration-wrapper")
    .addEventListener("mouseleave", () => {
      gsap.fromTo(
        ".duration-indicator",
        { opacity: 1, height: "3rem" },
        { opacity: 0, height: "0rem" }
      );
      gsap.fromTo(".duration-lines-wrapper", { opacity: 0 }, { opacity: 1 });
      gsap.fromTo(".thumbnails-main-wrapper", { opacity: 1 }, { opacity: 0 });
    });
  //console.log("not safari");
}
