let tlMain = gsap.timeline();
tlMain.to(
  ".logo-text.photo",
  { opacity: 1, ease: "expo.inOut", duration: 0.7 },
  "<"
);
tlMain.to(".logo-text.photo", {
  opacity: 0,
  ease: "expo.inOut",
  duration: 0.7,
  delay: 1
});

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
window.addEventListener("load", function () {
  /*
      A NodeList of all your image containers (Or a single Node).
      The library will locate an <img /> within each
      container to create the gradient from.
   */
  Grade(document.querySelectorAll(".pt-main-img"));
  Grade(document.querySelectorAll(".pt-img-cc-wrapper"));
  Grade(document.querySelectorAll(".pt-next-img-wrapper"));
});

const allImages = [...document.querySelectorAll("img")];
allImages.map((img) => {
  //img.style.opacity = 0;
});

/**
 * Code
 */

const sectionWrapper = document.querySelector(".pt-wrapper");

const info = document.querySelector(".pt-end-info");
const infoText = [...document.querySelectorAll("[infoText]")];
const thumbnailWrapper = document.querySelector(".pt-images-thumbnail");
const thumbIndicator = document.querySelector(".pt-thumb-indicator");
const otherImages = [...document.querySelectorAll(".pt-img-cc-wrapper")];
gsap.to(thumbIndicator, { opacity: 1 });

const thumbnails = [...document.querySelectorAll(".pt-thumb-cc-item")];

let tl = gsap.timeline({ paused: true });
tl.to(infoText, { y: "120%", ease: "expo.out", opacity: 0, duration: 0.6 });
tl.to(
  ".pt-name",
  {
    x: "15vw",
    y: "2rem",
    scale: 0.9,
    ease: "expo.out",
    duration: 1
  },
  "<"
);
tl.to(".pt-client-name", { x: "0vw", ease: "expo.out", duration: 1 }, "<");
tl.to(".pt-about-wrapper", { y: "-110%" });
function convertRemToPixels(rem) {
  return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

let panels = gsap.utils.toArray("div[panel-item]");
let getTotalWidth = () => {
  let width = 0;
  let s2 = panels.slice(0, -1);
  panels.forEach((el) => (width += el.offsetWidth));
  return width - window.innerWidth * 0.9;
};
let mainTl = gsap.timeline({});
mainTl.to(panels, {
  x: () => -getTotalWidth(),
  ease: "none",
  scrollTrigger: {
    trigger: ".section.hero",
    start: "top top",
    pin: true,
    anticipatePin: 1,
    scrub: 1,
    //markers: true,
    onEnter: () => {
      //console.log("hello");
    },
    invalidateOnRefresh: true,
    //markers: true,
    onUpdate: (self) => {
      //console.log(self);
      let progress = Math.round(self.progress * 100);
      //console.log(progress);
      if (progress > 0 && progress < 5) {
        /*
        gsap.to(".pt-about-wrapper [infoText]", {
          opacity: 0,
          ease: "expo.out",
          duration: 0.2
        });
        */
        tl4.reverse();
        tl.reverse();
        sectionWrapper.classList.remove("end");
      }
      if (progress > 5) {
        if (!info.classList.contains("scrolled")) {
          tl.play();
          sectionWrapper.classList.add("end");
        }
      } else {
        tl.reverse();
        sectionWrapper.classList.remove("end");
      }
      // if (elem.classList.contains("hp-video-collection-item")) {
      //  console.log(elem);
      //}
      // console.log($(elem).parent());
    },
    // base vertical scrolling on how wide the container is so it feels more natural.
    end: () =>
      "+=" +
      (document.querySelector(".pt-images-content").scrollWidth -
        window.innerWidth)
  },
  onRefresh() {
    let totalWidth = getTotalWidth(),
      accumulatedWidth = 0,
      //s2 = panels.slice(0, -1),
      progressArray = panels.map((el) => {
        accumulatedWidth += el.offsetWidth;
        return accumulatedWidth / totalWidth;
      });
    progressArray.unshift(0);
  }
});

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

const options = {
  root: sectionWrapper,
  rootMargin: "0px -30% 0px 0%",
  threshold: 1
};

let callback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      let index = otherImages.indexOf(entry.target);
      if (!thumbnailWrapper.classList.contains("clicked")) {
        thumbnails[index + 1].append(thumbIndicator);
      }
      setTimeout(() => {}, 300);
      //entry.target.style.border = "thick solid white";
      sectionWrapper.style.backgroundImage = entry.target.style.backgroundImage;
    } else {
      //entry.target.style.border = "";
    }
  });
};
let observer = new IntersectionObserver(callback, options);
document.querySelectorAll(".pt-img-cc-wrapper").forEach((img) => {
  observer.observe(img);
});

const options2 = {
  root: sectionWrapper,
  rootMargin: "0px 45% 0px 45%",
  threshold: 1
};

let callback2 = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      sectionWrapper.style.backgroundImage = entry.target.style.backgroundImage;
    } else {
      tl5.reverse();
      textLinkInfo.classList.remove("viewing");
    }
  });
};
let observer2 = new IntersectionObserver(callback2, options2);
document.querySelectorAll(".pt-main-img").forEach((img) => {
  observer2.observe(img);
});

const options3 = {
  root: sectionWrapper,
  rootMargin: "0px 0% 0px 0%",
  threshold: 0.1
};

let callback3 = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      sectionWrapper.style.backgroundImage = entry.target.style.backgroundImage;
      tl5.reverse();
      textLinkInfo.classList.remove("viewing");
    } else {
      //sectionWrapper.classList.remove("end");
    }
  });
};
let observer3 = new IntersectionObserver(callback3, options3);
document.querySelectorAll(".pt-next-img-wrapper").forEach((img) => {
  observer3.observe(img);
});

/**
 * Animating out project title
 */

let title1 = document.querySelectorAll(".pt-name .char");
let title2 = document.querySelectorAll(".pt-client-name .char");
let textLinkInfo = document.querySelector(".text-link-wrapper.info");
let tl4 = gsap.timeline({ paused: true });
tl4.to(title1, {
  y: "120%",
  stagger: 0.05,
  ease: "expo.out",
  duration: 1
});
tl4.to(
  title2,
  { y: "120%", stagger: 0.05, ease: "expo.out", duration: 1 },
  "<"
);
const options4 = {
  root: sectionWrapper,
  rootMargin: "0px 0% 0px 0%",
  threshold: 0.15
};
let tl5 = gsap.timeline({ paused: true });
tl5.to(".text-link.view", { y: "-110%", ease: "power4.inOut" });
tl5.to(".text-link.close", { y: "0%", ease: "power4.inOut" });

let callback4 = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      tl4.play();
      gsap.to(".text-link-wrapper.info", { display: "flex", opacity: 1 });
    } else {
      gsap.to(".text-link-wrapper.info", { display: "none", opacity: 0 });
      tl4.play();
      if (!sectionWrapper.classList.contains("end")) {
        tl4.reverse();
      } else {
        gsap.to(".pt-about-wrapper [infoText]", {
          y: "120%",
          opacity: 0,
          ease: "expo.out",
          duration: 0.6
        });
      }
    }
  });
};
let observer4 = new IntersectionObserver(callback4, options4);
document.querySelectorAll(".pt-img-cc-list-wrapper").forEach((img) => {
  observer4.observe(img);
});

textLinkInfo.addEventListener("click", () => {
  if (textLinkInfo.classList.contains("viewing")) {
    tl5.reverse();
    tl4.play();
    textLinkInfo.classList.remove("viewing");
    gsap.to(".pt-about-wrapper [infoText]", {
      y: "120%",
      opacity: 0,
      ease: "expo.out",
      duration: 0.6
    });
  } else {
    tl5.play();
    tl4.reverse();
    gsap.to(".pt-about-wrapper [infoText]", {
      y: "0%",
      opacity: 1,
      ease: "expo.out",
      duration: 0.6,
      delay: 1
    });
    textLinkInfo.classList.add("viewing");
  }
});

const otherImg = [...document.querySelectorAll(".pt-img-cc-item")];
otherImg.map((img) => {
  let index = otherImg.indexOf(img) + 1;
  img.setAttribute("id", `img${index}`);
});

const controller = mainTl._recent.scrollTrigger;
//controller.scroll(controller.start + 0.2 * (controller.end - controller.start))
let thumbPosition = [];
thumbnails.map((thumbnail) => {
  let xPosition = thumbnail.getBoundingClientRect().x;
  thumbPosition.push(xPosition);
});

thumbnails.map((thumbnail) => {
  thumbnail.addEventListener("click", () => {
    thumbnail.append(thumbIndicator);
    thumbnailWrapper.classList.add("clicked");
    setTimeout(() => {
      thumbnailWrapper.classList.remove("clicked");
    }, 300);
    let thumbIndex = thumbnails.indexOf(thumbnail);
    let projectImg = `#img${thumbIndex}`;
    if (thumbIndex > 0) {
      let xPosition = document.querySelector(projectImg).getBoundingClientRect()
        .x;
      let currPos = controller.scroll();
      controller.scroll(currPos + xPosition - window.innerWidth / 10);
    } else {
      controller.scroll(0);
    }

    //gsap.to(window, { duration: 2, scrollTo: { y: xPosition * 0.75, x: 0 } });
  });
});

//img3.getBoundingClientRect().x
//gsap.to(window, {duration: 2, scrollTo: {y: 0, x: -572}});

const options5 = {
  root: sectionWrapper,
  rootMargin: "0px 0% 0px 0%",
  threshold: 0.1
};

let callback5 = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      //console.log(entry);
      if (!textLinkInfo.classList.contains("viewing")) {
        gsap.to(".pt-images-thumbnail", { opacity: 1 });
        //thumbnailWrapper.classList.add("viewing");
      }
    } else {
      gsap.to(".pt-images-thumbnail", { opacity: 0 });
      //thumbnailWrapper.classList.remove("viewing");
    }
  });
};
let observer5 = new IntersectionObserver(callback5, options5);
document.querySelectorAll(".pt-img-cc-list-wrapper").forEach((img) => {
  observer5.observe(img);
});
gsap.set(".pt-img-cc-wrapper", { opacity: 0 });
const options6 = {
  root: sectionWrapper,
  rootMargin: "0px 0% 0px 0%",
  threshold: 0.6
};

let callback6 = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      //console.log(entry.target);
      gsap.to(entry.target, { opacity: 1, duration: 1, ease: "expo.inOut" });
    } else {
    }
  });
};
let observer6 = new IntersectionObserver(callback6, options6);
document.querySelectorAll(".pt-img-cc-wrapper").forEach((img) => {
  observer6.observe(img);
});
