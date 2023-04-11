/**
 * Grade Js
 */
(function (f) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = f();
  } else if (typeof define === "function" && define.amd) {
    define([], f);
  } else {
    var g;
    if (typeof window !== "undefined") {
      g = window;
    } else if (typeof global !== "undefined") {
      g = global;
    } else if (typeof self !== "undefined") {
      g = self;
    } else {
      g = this;
    }
    g.Grade = f();
  }
})(function () {
  var define, module, exports;
  return (function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;
          if (!u && a) return a(o, !0);
          if (i) return i(o, !0);
          var f = new Error("Cannot find module '" + o + "'");
          throw ((f.code = "MODULE_NOT_FOUND"), f);
        }
        var l = (n[o] = { exports: {} });
        t[o][0].call(
          l.exports,
          function (e) {
            var n = t[o][1][e];
            return s(n ? n : e);
          },
          l,
          l.exports,
          e,
          t,
          n,
          r
        );
      }
      return n[o].exports;
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s;
  })(
    {
      1: [
        function (require, module, exports) {
          "use strict";

          var _createClass = (function () {
            function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
              }
            }
            return function (Constructor, protoProps, staticProps) {
              if (protoProps)
                defineProperties(Constructor.prototype, protoProps);
              if (staticProps) defineProperties(Constructor, staticProps);
              return Constructor;
            };
          })();

          function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
            }
          }

          var prefixes = ["webkit"];

          var Grade = (function () {
            function Grade(container, img_selector, callback) {
              _classCallCheck(this, Grade);

              this.callback = callback || null;
              this.container = container;
              this.image =
                this.container.querySelector(img_selector) ||
                this.container.querySelector("img");
              this.gradientData = [];
              if (!this.image || !this.container) {
                return;
              }
              this.canvas = document.createElement("canvas");
              this.ctx = this.canvas.getContext("2d");
              this.imageDimensions = {
                width: 0,
                height: 0
              };
              this.imageData = [];
              this.readImage();
            }

            _createClass(Grade, [
              {
                key: "readImage",
                value: function readImage() {
                  this.imageDimensions.width = this.image.width * 0.1;
                  this.imageDimensions.height = this.image.height * 0.1;
                  this.render();
                }
              },
              {
                key: "getImageData",
                value: function getImageData() {
                  var imageData = this.ctx.getImageData(
                    0,
                    0,
                    this.imageDimensions.width,
                    this.imageDimensions.height
                  ).data;
                  this.imageData = Array.from(imageData);
                }
              },
              {
                key: "getChunkedImageData",
                value: function getChunkedImageData() {
                  var perChunk = 4;

                  var chunked = this.imageData.reduce(function (ar, it, i) {
                    var ix = Math.floor(i / perChunk);
                    if (!ar[ix]) {
                      ar[ix] = [];
                    }
                    ar[ix].push(it);
                    return ar;
                  }, []);

                  var filtered = chunked.filter(function (rgba) {
                    return (
                      rgba.slice(0, 2).every(function (val) {
                        return val < 250;
                      }) &&
                      rgba.slice(0, 2).every(function (val) {
                        return val > 0;
                      })
                    );
                  });
                  return filtered;
                }
              },
              {
                key: "getRGBAGradientValues",
                value: function getRGBAGradientValues(top) {
                  /*
                  console.log(
                    top
                      .map(function (color, index) {
                        return (
                          "rgb(" +
                          color.rgba.slice(0, 3).join(",") +
                          ") " +
                          (index == 0 ? "100%" : "100%")
                        );
                      })
                      .join(", rgb(0,0,0) 44% ,")
                  );
                  */
                  let end = top
                    .map(function (color, index) {
                      return (
                        "rgb(" +
                        color.rgba.slice(0, 3).join(",") +
                        ") " +
                        (index == 0 ? "100%" : "100%")
                      );
                    })
                    .join(",");
                  let black = "rgb(0,0,0) 44%,";
                  //console.log(black.concat(end));
                  return black.concat(end);
                }
              },
              {
                key: "getCSSGradientProperty",
                value: function getCSSGradientProperty(top) {
                  var val = this.getRGBAGradientValues(top);
                  return prefixes
                    .map(function (prefix) {
                      return (
                        "background-image: -" +
                        prefix +
                        "-linear-gradient(\n                        180deg,\n                        " +
                        val +
                        "\n                    )"
                      );
                    })
                    .concat([
                      "background-image: linear-gradient(\n                    180deg,\n                    " +
                        val +
                        "\n                )"
                    ])
                    .join(";");
                }
              },
              {
                key: "getMiddleRGB",
                value: function getMiddleRGB(start, end) {
                  var w = 0.5 * 2 - 1;
                  var w1 = (w + 1) / 2.0;
                  var w2 = 1 - w1;
                  var rgb = [
                    parseInt(start[0] * w1 + end[0] * w2),
                    parseInt(start[1] * w1 + end[1] * w2),
                    parseInt(start[2] * w1 + end[2] * w2)
                  ];
                  //console.log(`rgb: ${rgb}`);
                  return rgb;
                }
              },
              {
                key: "getSortedValues",
                value: function getSortedValues(uniq) {
                  var occurs = Object.keys(uniq)
                    .map(function (key) {
                      var rgbaKey = key;
                      var components = key.split("|"),
                        brightness =
                          (components[0] * 299 +
                            components[1] * 587 +
                            components[2] * 114) /
                          1000;
                      return {
                        rgba: rgbaKey.split("|"),
                        occurs: uniq[key],
                        brightness: brightness
                      };
                    })
                    .sort(function (a, b) {
                      return a.occurs - b.occurs;
                    })
                    .reverse()
                    .slice(0, 10);
                  return occurs
                    .sort(function (a, b) {
                      return a.brightness - b.brightness;
                    })
                    .reverse();
                }
              },
              {
                key: "getTextProperty",
                value: function getTextProperty(top) {
                  var rgb = this.getMiddleRGB(
                    top[0].rgba.slice(0, 3),
                    top[1].rgba.slice(0, 3)
                  );
                  var o = Math.round(
                    (parseInt(rgb[0]) * 299 +
                      parseInt(rgb[1]) * 587 +
                      parseInt(rgb[2]) * 114) /
                      1000
                  );
                  if (o > 125) {
                    return "color: #000";
                  } else {
                    return "color: #fff";
                  }
                }
              },
              {
                key: "getTopValues",
                value: function getTopValues(uniq) {
                  var sorted = this.getSortedValues(uniq);
                  return [sorted[0], sorted[sorted.length - 1]];
                }
              },
              {
                key: "getUniqValues",
                value: function getUniqValues(chunked) {
                  return chunked.reduce(function (accum, current) {
                    var key = current.join("|");
                    if (!accum[key]) {
                      accum[key] = 1;
                      return accum;
                    }
                    accum[key] = ++accum[key];
                    return accum;
                  }, {});
                }
              },
              {
                key: "renderGradient",
                value: function renderGradient() {
                  var ls = window.localStorage;
                  var item_name = "grade-" + this.image.getAttribute("src");
                  var top = null;

                  if (ls && ls.getItem(item_name)) {
                    top = JSON.parse(ls.getItem(item_name));
                  } else {
                    var chunked = this.getChunkedImageData();
                    top = this.getTopValues(this.getUniqValues(chunked));

                    if (ls) {
                      ls.setItem(item_name, JSON.stringify(top));
                    }
                  }

                  if (this.callback) {
                    this.gradientData = top;
                    return;
                  }

                  var gradientProperty = this.getCSSGradientProperty(top);

                  var textProperty = this.getTextProperty(top);

                  var style =
                    (this.container.getAttribute("style") || "") +
                    "; " +
                    gradientProperty +
                    "; " +
                    textProperty;
                  this.container.setAttribute("style", style);
                }
              },
              {
                key: "render",
                value: function render() {
                  this.canvas.width = this.imageDimensions.width;
                  this.canvas.height = this.imageDimensions.height;
                  this.ctx.drawImage(
                    this.image,
                    0,
                    0,
                    this.imageDimensions.width,
                    this.imageDimensions.height
                  );
                  this.getImageData();
                  this.renderGradient();
                }
              }
            ]);

            return Grade;
          })();

          module.exports = function (containers, img_selector, callback) {
            var init = function init(container, img_selector, callback) {
              var grade = new Grade(container, img_selector, callback),
                gradientData = grade.gradientData;
              if (!gradientData.length) {
                return null;
              }
              return {
                element: container,
                gradientData: gradientData
              };
            };
            var results = (NodeList.prototype.isPrototypeOf(containers)
              ? Array.from(containers).map(function (container) {
                  return init(container, img_selector, callback);
                })
              : [init(containers, img_selector, callback)]
            ).filter(Boolean);

            if (results.length) {
              return callback(results);
            }
          };
        },
        {}
      ]
    },
    {},
    [1]
  )(1);
});
/**
 * Grade Images
 */
const allItems = [...document.querySelectorAll(".hp-cc-item")];
window.addEventListener("load", function () {
  /*
      A NodeList of all your image containers (Or a single Node).
      The library will locate an <img /> within each
      container to create the gradient from.
   */

  Grade(document.querySelectorAll(".m-img"));
  allItems.map((section) => {
    if (section.querySelector(".m-img")) {
      section.querySelector(
        ".hp-section-bg"
      ).style.backgroundImage = section.querySelector(
        ".m-img"
      ).style.backgroundImage;
    }
  });
});

/**
 * Hero Slider
 */
const swiper = new Swiper(".swiper", {
  speed: 600,
  loop: true,
  autoHeight: false,
  centeredSlides: true,
  followFinger: true,
  mousewheelControl: true,
  freeMode: true,
  slideToClickedSlide: false,
  slidesPerView: 2,
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
      slidesPerView: 2,
      spaceBetween: "4%"
    },
    // tablet
    768: {
      slidesPerView: 3,
      spaceBetween: "4%"
    },
    // desktop
    992: {
      slidesPerView: "auto",
      spaceBetween: "3%"
    }
  }
});
const hVideos = [...document.querySelectorAll(".hp-carousel video")];
const sliderDetails = () => {
  if (
    document.querySelector(".swiper-slide-active").querySelector("[p-type]")
      .textContent === "Motion"
  ) {
    document
      .querySelector(".swiper-slide-active")
      .querySelector("video")
      .play();
  } else {
    hVideos.map((video) => {
      video.currentTime = 0;
      video.pause();
    });
  }
  document.querySelector("[c-type]").textContent = document
    .querySelector(".swiper-slide-active")
    .querySelector("[p-type]").textContent;
  document.querySelector("[c-title]").textContent = document
    .querySelector(".swiper-slide-active")
    .querySelector("[p-title]").textContent;
  document.querySelector("[c-index]").textContent = document
    .querySelector(".swiper-slide-active")
    .querySelector("[p-index]").textContent;
  let scrollProgress =
    (parseFloat(
      document.querySelector(".swiper-slide-active").querySelector("[p-index]")
        .textContent
    ) /
      8) *
    100;
  gsap.to(".hp-index-inner-container", {
    width: scrollProgress,
    ease: "expo.inOut",
    duration: 1
  });
};
window.addEventListener("DOMContentLoaded", () => {
  sliderDetails();
});
swiper.on("activeIndexChange", function () {
  setTimeout(() => {
    sliderDetails();
  }, 600);
});

/**
 * Sliding Sections
 */
let bgImage = document.querySelector(".bg-background");
let bgImageAfter = document.querySelector(".bg-background-after");

/*
gsap.set("[data-splitting], .text-link-wrapper", { opacity: 0 });
let firstItem = [
  document.querySelector("[data-splitting]"),
  document.querySelector(".text-link-wrapper")
];
gsap.set(firstItem, { opacity: 1 });
*/

/*
let sections = [...document.querySelectorAll(".section.hero")];

sections.map((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: 0,
    end: "max",
    snap: true,
    onEnter: () => {}
  });
});
*/
/*
const sections = gsap.utils.toArray(".section.hero");

ScrollTrigger.create({
  trigger: ".section.hero.is-1",
  start: "top top",
  endTrigger: ".section.hero.is-7",
  end: "bottom bottom",

  //snap: 1 / (sections.length - 1)

  snap: {
    snapTo: 1 / (sections.length - 1),
    duration: { min: 0.25, max: 0.75 }, // the snap animation should be at least 0.25 seconds, but no more than 0.75 seconds (determined by velocity)
    ease: "power1.inOut" // the ease of the snap animation ("power3" by default)
  }
});
*/
let mm = gsap.matchMedia();

// add a media query. When it matches, the associated function will run
mm.add("(min-width: 480px)", () => {});
let indexNodes = [...document.querySelector(".hp-index-block").children];
let mSections = [...document.querySelectorAll(".section")];

const options = {
  root: document.querySelector(".main"),
  rootMargin: "0px 0px 0% 0px",
  threshold: 0.8
};

let callback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      let index = mSections.indexOf(entry.target);
      //console.log(entry.target, index);
      if (index < 1) {
        gsap.to(".index-main-wrapper, .sc-nav", { opacity: 0 });
        bgImageAfter.style.backgroundImage = "";
        bgImageAfter.style.opacity = 1;
        bgImage.style.backgroundImage = "";
        bgImageAfter.style.opacity = 0;
      } else {
        gsap.to(".index-main-wrapper, .sc-nav", { opacity: 1 });
        let allPrevious = indexNodes[index - 1].previousElementSibling;
        let allNext = indexNodes[index - 1].nextElementSibling;
        if (allPrevious) {
          gsap.to(allPrevious, { y: "-110%", ease: "expo.inOut" });
        }
        if (allNext) {
          gsap.to(allNext, { y: "110%", ease: "expo.inOut" });
        }
        gsap.to(indexNodes[index - 1], { y: "0%", ease: "expo.inOut" });
        bgImageAfter.style.backgroundImage = entry.target.querySelector(
          ".hp-section-bg"
        ).style.backgroundImage;
        bgImageAfter.style.opacity = 1;
        bgImage.style.backgroundImage = entry.target.querySelector(
          ".hp-section-bg"
        ).style.backgroundImage;
        bgImageAfter.style.opacity = 0;
      }
    } else {
      //entry.target
    }
  });
};
let observer = new IntersectionObserver(callback, options);
document.querySelectorAll(".section").forEach((section) => {
  observer.observe(section);
});

/**
 * Slider Navigation
 */

const navs = [...document.querySelectorAll(".sc-nav-content")];
const navImg = [...document.querySelectorAll("[img1]")];
const newImg = [];
let main = document.querySelector(".main");

navImg.map((img) => {
  let clone = img.cloneNode(true);
  clone.classList.add("thumbImg");
  //gsap.to(clone, { opacity: 0.5 });
  newImg.push(clone);
});

navs.map((nav) => {
  let index = navs.indexOf(nav);
  let distance = 0;
  nav.append(newImg[index]);
  nav.addEventListener("click", () => {
    let indexN = navs.indexOf(nav);
    console.log(indexN);
    allItems[indexN].scrollIntoView({ behavior: "smooth", block: "start" });
    /*
    seamless.scrollIntoView(allItems[indexN], {
      behavior: "smooth",
      block: "start"
    });
    */
  });
  nav.addEventListener("mouseenter", () => {
    //gsap.to(nav.querySelector(".thumbImg"), { opacity: 1, duration: 0.5 });
  });
  nav.addEventListener("mouseleave", () => {
    //gsap.to(nav.querySelector(".thumbImg"), { opacity: 0.5, duration: 0.5 });
  });
});

const scNav = document.querySelector(".sc-nav");
const scNavC = document.querySelector(".sc-nav-container");
scNav.addEventListener("mouseenter", () => {
  gsap.set(scNavC, { height: "auto", duration: 0 });
  scNav.classList.remove("closed");
  scNavC.classList.remove("closed");
  navs.map((nav) => {
    nav.classList.remove("closed");
  });
  gsap.to(".sc-nav-content-block", { opacity: 0 });
});

scNav.addEventListener("mouseleave", () => {
  scNav.classList.add("closed");
  navs.map((nav) => {
    nav.classList.add("closed");
  });
  setTimeout(() => {
    gsap.to(scNavC, { height: "1.5rem", duration: 0.2 });
  }, 700);
  setTimeout(() => {
    scNavC.classList.add("closed");
  }, 1000);
  gsap.to(".sc-nav-content-block", { opacity: 1 });
});
