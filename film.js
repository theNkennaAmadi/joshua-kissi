gsap.registerPlugin(ScrollTrigger);
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

window.addEventListener("DOMContentLoaded", () => {
  document.querySelector(".p-mask").style.display = "none";
});

let videos1 = [...document.querySelectorAll("video")];
videos1.map((video) => {
  video.muted = true;
  video.addEventListener("canplay", () => {
    //video.play();
  });
});

const swiper = new Swiper(".swiper", {
  speed: 600,
  loop: true,
  autoHeight: false,
  centeredSlides: true,
  followFinger: true,
  //freeMode: false,
  slideToClickedSlide: false,
  slidesPerView: 1,
  spaceBetween: "4%",
  rewind: false,
  mousewheel: {
    //forceToAxis: true
  },
  keyboard: {
    enabled: true,
    onlyInViewport: true
  },
  breakpoints: {
    // mobile landscape
    480: {
      slidesPerView: 1,
      spaceBetween: "4%"
    },
    // tablet
    768: {
      slidesPerView: 2,
      spaceBetween: "4%"
    },
    // desktop
    992: {
      slidesPerView: 2.5,
      spaceBetween: "4%"
    }
  }
});
const videos = [...document.querySelectorAll(".f-video-wrapper")];
const swiperChange = () => {
  let index = videos.indexOf(
    document
      .querySelector(".swiper-slide-active")
      .querySelector(".f-video-wrapper")
  );
  // console.log(index);
  document.querySelector("[page-title]").textContent = document
    .querySelector(".swiper-slide-active")
    .querySelector("[title]").textContent;
  document.querySelector(
    "[page-subtitle]"
  ).textContent = document
    .querySelector(".swiper-slide-active")
    .querySelector("[subtitle]").textContent;
  videos.map((video) => {
    if (videos.indexOf(video) !== index) {
      video.querySelector("video").currentTime = 0;
      video.querySelector("video").pause();
    } else {
      //console.log(index);
      video.querySelector("video").play();
    }
  });
  //videos1[index].play();
};
swiper.on("activeIndexChange", function () {
  //console.log(swiper.activeIndex);
  setTimeout(() => {
    swiperChange();
  }, 600);
});

window.addEventListener("DOMContentLoaded", () => {
  swiperChange();
});

/**
 * List View
 */

const listInit = () => {
  gsap.fromTo(
    ".fp-list-line",
    { width: "0%" },
    {
      width: "100%",
      stagger: 0.15,
      ease: "circ.inOut"
    }
  );
};

const listItems = [...document.querySelectorAll(".fp-list-cc-item")];
listItems.map((item) => {
  item.addEventListener("mouseenter", () => {
    let vElements = [
      item.querySelector(".ply-btn"),
      item.querySelector(".fp-list-video")
    ];
    gsap.to(vElements, {
      opacity: 1,
      ease: "circ.inOut"
    });
  });
  item.addEventListener("mouseleave", () => {
    let vElements = [
      item.querySelector(".ply-btn"),
      item.querySelector(".fp-list-video")
    ];
    gsap.to(vElements, {
      opacity: 0,
      ease: "circ.inOut"
    });
  });
});

const switches = [...document.querySelectorAll(".switch-wrapper")];
switches.map((swich) => {
  swich.addEventListener("click", () => {
    switches.map((swich) => {
      swich.classList.toggle("viewing");
    });
    if (document.querySelector("#film-display").classList.contains("viewing")) {
      gsap.to(".fp-list-wrapper", { opacity: 0, duration: 1.2 });
      gsap.set(".fp-list-wrapper", { display: "none" });
      gsap.set(".fp-wrapper", { display: "flex" });
      gsap.fromTo(
        ".fp-wrapper",
        { opacity: 0, duration: 0.5 },
        { opacity: 1, duration: 0.5 }
      );
    }
    if (document.querySelector("#film-list").classList.contains("viewing")) {
      gsap.to(".fp-wrapper", { opacity: 0, duration: 1.2 });
      gsap.set(".fp-wrapper", { display: "none" });
      gsap.set(".fp-list-wrapper", { display: "flex" });
      gsap.fromTo(
        ".fp-list-wrapper",
        { opacity: 0, duration: 0.5 },
        { opacity: 1, duration: 0.5 }
      );
      listInit();
    }
  });
});
