let isSafari =
  navigator.vendor.match(/apple/i) &&
  !navigator.userAgent.match(/crios/i) &&
  !navigator.userAgent.match(/fxios/i) &&
  !navigator.userAgent.match(/Opera|OPT\//);

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
      section.style.backgroundImage = section.querySelector(
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
      slidesPerView: 5,
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
  //console.log(swiper.activeIndex);
  setTimeout(() => {
    sliderDetails();
  }, 600);
});
let currTranslate = 0;
if (isSafari) {
  document.querySelector(".swiper.hp-c._2").style.opacity = 1;
} else {
  window.addEventListener("load", () => {
    setTimeout(() => {
      const curr = document
        .querySelector(".swiper-wrapper")
        .getBoundingClientRect().x;
      const store = {
        ww: window.innerWidth,
        wh: window.innerHeight,
        isDevice:
          navigator.userAgent.match(/Android/i) ||
          navigator.userAgent.match(/webOS/i) ||
          navigator.userAgent.match(/iPhone/i) ||
          navigator.userAgent.match(/iPad/i) ||
          navigator.userAgent.match(/iPod/i) ||
          navigator.userAgent.match(/BlackBerry/i) ||
          navigator.userAgent.match(/Windows Phone/i)
      };

      class Slider {
        constructor(el, opts = {}) {
          this.bindAll();

          this.el = el;
          //console.log(this.el);

          this.opts = Object.assign(
            {
              speed: 2,
              threshold: 20,
              ease: 0.075
            },
            opts
          );

          this.ui = {
            items: this.el.querySelectorAll(".hp-carousel")
            // titles: document.querySelectorAll(".js-title"),
            // lines: document.querySelectorAll(".js-progress-line")
          };

          this.state = {
            target: 0,
            current: 0,
            currentRounded: 0,
            y: 0,
            on: {
              x: 0,
              y: 0
            },

            off: 0,
            progress: 0,
            diff: 0,
            max: 0,
            min: 0,
            snap: {
              points: []
            },

            flags: {
              dragging: false
            }
          };

          this.items = [];

          this.events = {
            move: store.isDevice ? "touchmove" : "mousemove",
            up: store.isDevice ? "touchend" : "mouseup",
            down: store.isDevice ? "touchstart" : "mousedown"
          };

          this.init();
        }

        bindAll() {
          ["onDown", "onMove", "onUp"].forEach(
            (fn) => (this[fn] = this[fn].bind(this))
          );
        }

        init() {
          return gsap.utils.pipe(this.setup(), this.on());
        }

        destroy() {
          this.off();
          this.state = null;
          this.items = null;
          this.opts = null;
          this.ui = null;
        }

        on() {
          const { move, up, down } = this.events;

          window.addEventListener(down, this.onDown);
          window.addEventListener(move, this.onMove);
          window.addEventListener(up, this.onUp);
        }

        off() {
          const { move, up, down } = this.events;

          window.removeEventListener(down, this.onDown);
          window.removeEventListener(move, this.onMove);
          window.removeEventListener(up, this.onUp);
        }

        setup() {
          const { ww } = store;
          const state = this.state;
          const { items } = this.ui;

          const {
            width: wrapWidth,
            left: wrapDiff
          } = this.el.getBoundingClientRect();

          // Set bounding
          state.max = -(
            items[items.length - 3].getBoundingClientRect().right -
            wrapWidth -
            wrapDiff
          );

          state.min = 0;

          // Global timeline
          this.tl = gsap.timeline({
            paused: true,
            defaults: {
              duration: 1,
              ease: "linear"
            }
          });

          // Cache stuff
          for (let i = 0; i < items.length; i++) {
            const el = items[i];
            const { left, right, width } = el.getBoundingClientRect();

            // Create webgl plane
            const plane = new Plane();
            plane.init(el);
            //console.log(plane);

            // Timeline that plays when visible
            const tl = gsap.timeline({ paused: true }).fromTo(
              plane.mat.uniforms.uScale,
              {
                value: 1
              },
              {
                value: 0.5,
                duration: 1,
                ease: "linear"
              }
            );

            // Push to cache
            this.items.push({
              el,
              plane,
              left,
              right,
              width,
              min: 0,
              max: state.max + 0.775,
              /*
        min: left < ww ? ww * 0.775 : -(ww * 0.225 - wrapWidth * 0.2),
        max:
          left > ww
            ? state.max - ww * 0.775
            : state.max + (ww * 0.225 - wrapWidth * 0.2),
            */
              tl,
              out: false
            });
          }
        }

        calc() {
          const state = this.state;
          state.current += (state.target - state.current) * this.opts.ease;
          state.currentRounded = Math.round(state.current * 100) / 100;
          state.diff = (state.target - state.current) * 0.001;
          state.progress = gsap.utils.wrap(
            0,
            1,
            state.currentRounded / state.max
          );
          this.tl && this.tl.progress(state.progress);
        }

        render() {
          this.calc();
          this.transformItems();
        }

        transformItems() {
          const { flags } = this.state;

          for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            const { translate, isVisible, progress } = this.isVisible(item);

            item.plane.updateX(translate);
            swiper.translateTo(translate + curr, 2);
            if (currTranslate !== translate) {
              swiper.update();
              currTranslate = translate;
            }

            item.plane.mat.uniforms.uVelo.value = this.state.diff;

            if (!item.out && item.tl) {
              item.tl.progress(progress);
            }

            if (isVisible || flags.resize) {
              item.out = false;
            } else if (!item.out) {
              item.out = true;
            }
          }
        }

        isVisible({ left, right, width, min, max }) {
          const { ww } = store;
          const { currentRounded } = this.state;
          const translate = gsap.utils.wrap(min, max, currentRounded);
          const threshold = this.opts.threshold;
          const start = left + translate;
          const end = right + translate;
          const isVisible = start < threshold + ww && end > -threshold;
          const progress = gsap.utils.clamp(
            0,
            1,
            1 - (translate + left + width) / (ww + width)
          );
          //console.log(progress);

          return {
            translate,
            isVisible,
            progress
          };
        }

        clampTarget() {
          const state = this.state;

          state.target = gsap.utils.clamp(state.max, 0, state.target);
        }

        getPos({ changedTouches, clientX, clientY, target }) {
          const x = changedTouches ? changedTouches[0].clientX : clientX;
          const y = changedTouches ? changedTouches[0].clientY : clientY;

          return {
            x,
            y,
            target
          };
        }

        onDown(e) {
          const { x, y } = this.getPos(e);
          const { flags, on } = this.state;

          flags.dragging = true;
          on.x = x;
          on.y = y;
        }

        onUp() {
          const state = this.state;

          state.flags.dragging = false;
          state.off = state.target;
        }

        onMove(e) {
          const { x, y } = this.getPos(e);
          const state = this.state;

          if (!state.flags.dragging) return;

          const { off, on } = state;
          const moveX = x - on.x;
          const moveY = y - on.y;

          if (Math.abs(moveX) > Math.abs(moveY) && e.cancelable) {
            e.preventDefault();
            e.stopPropagation();
          }

          state.target = off + moveX * this.opts.speed;
          /*
    const { x, y } = this.getPos(e);
    const { flags, on } = this.state;
    const state = this.state;
    flags.dragging = true;
    const moveX = x - on.x;
    const moveY = y - on.y;
  
    if (Math.abs(moveX) > Math.abs(moveY) && e.cancelable) {
      e.preventDefault();
      e.stopPropagation();
    }
  
    state.target = moveX * this.opts.speed;
    */
        }
      }

      const backgroundCoverUv = `
  vec2 backgroundCoverUv(vec2 screenSize, vec2 imageSize, vec2 uv) {
  float screenRatio = screenSize.x / screenSize.y;
  float imageRatio = imageSize.x / imageSize.y;
  
  vec2 newSize = screenRatio < imageRatio 
      ? vec2(imageSize.x * screenSize.y / imageSize.y, screenSize.y)
      : vec2(screenSize.x, imageSize.y * screenSize.x / imageSize.x);
  
  vec2 newOffset = (screenRatio < imageRatio 
      ? vec2((newSize.x - screenSize.x) / 2.0, 0.0) 
      : vec2(0.0, (newSize.y - screenSize.y) / 2.0)) / newSize;
  
  return uv * screenSize / newSize + newOffset;
  }
  `;

      const vertexShader = `
  precision mediump float;
  
  uniform float uVelo;
  
  varying vec2 vUv;
  
  #define M_PI 3.1415926535897932384626433832795
  
  void main(){
  vec3 pos = position;
  pos.x = pos.x + ((sin(uv.y * M_PI) * uVelo) * 0.125);
  
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.);
  }
  `;

      const fragmentShader = `
  precision mediump float;
  
  ${backgroundCoverUv}
  
  uniform sampler2D uTexture;
  
  uniform vec2 uMeshSize;
  uniform vec2 uImageSize;
  
  uniform float uVelo;
  uniform float uScale;
  
  varying vec2 vUv;
  
  void main() {
  vec2 uv = vUv;
  
  vec2 texCenter = vec2(0.5);
  vec2 texUv = backgroundCoverUv(uMeshSize, uImageSize, uv);
  vec2 texScale = (texUv - texCenter) * uScale + texCenter;
  vec4 texture = texture2D(uTexture, texScale);
  
  texScale.x += 0.005 * uVelo;
  if(uv.x < 1.) texture.g = texture2D(uTexture, texScale).g;
  
  texScale.x += 0.001 * uVelo;
  if(uv.x < 1.) texture.b = texture2D(uTexture, texScale).b;
  
  gl_FragColor = texture;
  }
  `;
      /**
       * 0.125 and 0.10
       */
      const loader = new THREE.TextureLoader();
      loader.crossOrigin = "anonymous";

      class Gl {
        constructor() {
          this.scene = new THREE.Scene();

          this.camera = new THREE.OrthographicCamera(
            store.ww / -2,
            store.ww / 2,
            store.wh / 2,
            store.wh / -2,
            1,
            10
          );

          this.camera.lookAt(this.scene.position);
          this.camera.position.z = 1;

          this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
          });

          this.renderer.setPixelRatio(1.5);
          this.renderer.setSize(store.ww, store.wh);
          this.renderer.setClearColor(0xffffff, 0);

          this.init();
        }

        render() {
          this.renderer.render(this.scene, this.camera);
        }

        init() {
          const domEl = this.renderer.domElement;
          domEl.classList.add("dom-gl");
          document.body.appendChild(domEl);
          window.dispatchEvent(new Event("resize"));
          document
            .querySelector(".dom-gl")
            .addEventListener("mouseenter", () => {
              gsap.fromTo(
                ".cursor-drag",
                { opacity: 0, scale: 0.2, ease: "expo.inOut" },
                { opacity: 1, scale: 0.8, ease: "expo.inOut" }
              );
            });
          document
            .querySelector(".dom-gl")
            .addEventListener("mouseleave", () => {
              gsap.fromTo(
                ".cursor-drag",
                { opacity: 1, scale: 0.8, ease: "expo.inOut" },
                { opacity: 0, scale: 0.2, ease: "expo.inOut" }
              );
            });
        }
      }

      class GlObject extends THREE.Object3D {
        init(el) {
          this.el = el;

          this.resize();
        }

        resize() {
          this.rect = this.el.getBoundingClientRect();
          const { left, top, width, height } = this.rect;

          this.pos = {
            x: left + width / 2 - store.ww / 2,
            y: height + top / 1.5 - store.wh / 2
          };
          //console.log(this.pos);
          this.position.y = this.pos.y;
          this.position.x = this.pos.x;

          this.updateX();
        }

        updateX(current) {
          current && (this.position.x = current + this.pos.x);
        }
      }

      const planeGeo = new THREE.PlaneBufferGeometry(1, 1, 32, 32);
      const planeMat = new THREE.ShaderMaterial({
        transparent: true,
        fragmentShader,
        vertexShader
      });

      class Plane extends GlObject {
        init(el) {
          super.init(el);

          this.geo = planeGeo;
          this.mat = planeMat.clone();

          this.mat.uniforms = {
            uTime: { value: 0 },
            uTexture: { value: 0 },
            uMeshSize: {
              value: new THREE.Vector2(this.rect.width, this.rect.height)
            },
            uImageSize: { value: new THREE.Vector2(0, 0) },
            uScale: { value: 0.75 },
            uVelo: { value: 0 }
          };
          if (this.el.querySelector("img")) {
            //console.log(this.el.querySelector("img").parentElement);
            this.img = this.el.querySelector("img");
            this.texture = loader.load(this.img.src, (texture) => {
              texture.minFilter = THREE.LinearFilter;
              texture.generateMipmaps = false;

              this.mat.uniforms.uTexture.value = texture;
              this.mat.uniforms.uImageSize.value = [
                this.img.naturalWidth,
                this.img.naturalHeight
              ];
            });
          } else if (this.el.querySelector("video")) {
            //console.log("hello");
            this.img = this.el.querySelector("video");
            this.img.muted = true;
            this.texture = new THREE.VideoTexture(this.img);
            //console.log(this.texture);
            //this.texture.minFilter = THREE.LinearFilter;
            //console.log(this.texture);
            this.texture.image.currentTime = 0;
            this.texture.format = THREE.RGBAFormat;
            this.texture.minFilter = THREE.LinearFilter;
            this.texture.magFilter = THREE.LinearFilter;
            this.texture.generateMipmaps = false;
            //console.log(this.texture.image);
            this.texture.image.oncanplaythrough = () => {
              this.texture.image.muted = true;
              //console.log(this.texture);
              //this.texture.image.play();
              const { videoWidth, videoHeight } = this.texture.image;
              const { u_size, u_texture } = this.mat.uniforms;
              this.mat.uniforms.uTexture.value = this.texture;
              this.mat.uniforms.uImageSize.value = [videoWidth, videoHeight];
              //u_size.value.x = videoWidth;
              //u_size.value.y = videoHeight;
              this.texture.needsUpdate = true;
            };
          }
          this.mesh = new THREE.Mesh(this.geo, this.mat);
          this.mesh.scale.set(this.rect.width, this.rect.height, 1);
          this.add(this.mesh);
          gl.scene.add(this);
        }
      }

      const gl = new Gl();
      const slider = new Slider(document.querySelector(".swiper"));

      const tick = () => {
        gl.render();
        slider.render();
      };

      gsap.ticker.add(tick);
    }, 100);
  });
}

/**
 * Sliding Sections
 */
let bgImage = document.querySelector(".bg-background");
gsap.set("[data-splitting], .text-link-wrapper", { zIndex: 100 });

gsap.set("[data-splitting], .text-link-wrapper", { opacity: 0 });
let firstItem = [
  document.querySelector("[data-splitting]"),
  document.querySelector(".text-link-wrapper")
];
gsap.set(firstItem, { opacity: 1 });

/*
let tlNav = gsap.timeline({ paused: true });
tlNav.to(".l-hide", { x: "-100%", duration: 0.4 });
tlNav.to(".l-hide", { opacity: 0, duration: 0.2 }, "<");
tlNav.to(".l-k", { x: "-530%", duration: 0.7 }, "<");
document.querySelector(".nav-logo").addEventListener("mouseenter", () => {
  tlNav.play();
});
document.querySelector(".nav-logo").addEventListener("mouseleave", () => {
  tlNav.reverse();
});
*/

let sections = [...document.querySelectorAll(".section.hero")];
sections.map((section) => {
  gsap.set(section, { opacity: 0 });
});
gsap.set(sections[0], { opacity: 1 });
sections.map((section) => {
  ScrollTrigger.create({
    trigger: section,
    start: "top top",
    pin: true,
    pinSpacing: false,
    onLeave: () => {
      if (
        section.parentElement.nextElementSibling.classList.contains(
          "pin-spacer"
        )
      ) {
        let img = [
          section.querySelector("[img1]"),
          section.querySelector("[img2]")
        ];
        let imgn = [
          section.parentElement.nextElementSibling.firstElementChild.querySelector(
            "[img1]"
          ),
          section.parentElement.nextElementSibling.firstElementChild.querySelector(
            "[img2]"
          )
        ];
        gsap.to(section, { opacity: 0 });
        gsap.to(section.parentElement.nextElementSibling.firstElementChild, {
          opacity: 1,
          duration: 1
        });
        let items = [
          section.querySelectorAll("[data-splitting]"),
          section.querySelectorAll(".text-link-wrapper")
        ];
        gsap.to(items, {
          opacity: 0
        });
        let itemsN = [
          section.parentElement.nextElementSibling.firstElementChild.querySelectorAll(
            "[data-splitting]"
          ),
          section.parentElement.nextElementSibling.firstElementChild.querySelectorAll(
            ".text-link-wrapper"
          )
        ];
        gsap.to(itemsN, {
          opacity: 1,
          duration: 1
        });
        let state = Flip.getState(img);
        //console.log(state);
        Flip.from(state, {
          targets: imgn,
          duration: 1.5,
          //fade: true,
          absolute: true,
          ease: "power3.inOut"
        });
        /*
        bgImage.style.backgroundImage = section.querySelector(
          ".m-img"
        ).style.backgroundImage;
        */
        /*
        console.log(
          section.querySelector("h2").textContent,
          section.parentElement.nextElementSibling.firstElementChild.querySelector(
            "h2"
          ).textContent
        );
        */
      }
    },
    onLeaveBack: () => {
      if (section.parentElement.previousElementSibling) {
        let img = [
          section.querySelector("[img1]"),
          section.querySelector("[img2]")
        ];
        let imgP = [
          section.parentElement.previousElementSibling.firstElementChild.querySelector(
            "[img1]"
          ),
          section.parentElement.previousElementSibling.firstElementChild.querySelector(
            "[img2]"
          )
        ];
        gsap.to(section, { opacity: 0 });
        gsap.to(
          section.parentElement.previousElementSibling.firstElementChild,
          { opacity: 1 }
        );
        let items = [
          section.querySelectorAll("[data-splitting]"),
          section.querySelectorAll(".text-link-wrapper")
        ];
        gsap.to(items, {
          opacity: 0
        });
        let itemsP = [
          section.parentElement.previousElementSibling.firstElementChild.querySelectorAll(
            "[data-splitting]"
          ),
          section.parentElement.previousElementSibling.firstElementChild.querySelectorAll(
            ".text-link-wrapper"
          )
        ];
        gsap.to(itemsP, {
          opacity: 1
        });
        let state = Flip.getState(img);
        //console.log(state);
        Flip.from(state, {
          targets: imgP,
          duration: 1.5,
          //fade: true,
          absolute: true,
          ease: "power3.inOut"
        });
        /*
        bgImage.style.backgroundImage = section.querySelector(
          ".m-img"
        ).style.backgroundImage;
        */
        /*
        console.log(
          section.querySelector("h2").textContent,
          section.parentElement.previousElementSibling.firstElementChild.querySelector(
            "h2"
          ).textContent
        );*/
      }
    }
  });
});

/*
allSections.map((section) => {
  section.addEventListener("click", () => {
    console.log(section);
    let img = [
      section.querySelector("[img1]"),
      section.querySelector("[img2]")
    ];
    //console.log(img);
    let imgn = [
      section.nextElementSibling.querySelector("[img1]"),
      section.nextElementSibling.querySelector("[img2]")
    ];
    console.log(imgn);
    section.style.zIndex = 0;
    //gsap.to(section, { opacity: 0 });
    let state = Flip.getState(img);
    console.log(state);
    Flip.from(state, {
      targets: imgn,
      duration: 1.5,
      fade: true,
      absolute: true,
      ease: "power3.inOut"
    });
  });
});
*/

//lenis.infinite = true;

const options2 = {
  //root: document.querySelector(),
  rootMargin: "0px 0% 0px 0%",
  threshold: 1
};

let callback2 = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      /*
      if (entry.target.querySelector(".m-img")) {
        bgImage.style.backgroundImage = entry.target.querySelector(
          ".m-img"
        ).style.backgroundImage;
      }
      */
    } else {
    }
  });
};
let observer2 = new IntersectionObserver(callback2, options2);
document.querySelectorAll(".section.hero").forEach((img) => {
  observer2.observe(img);
});

/**
 * Slider Navigation
 */

const navs = [...document.querySelectorAll(".sc-nav-content")];
const navImg = [...document.querySelectorAll("[img1]")];
const newImg = [];

navImg.map((img) => {
  let clone = img.cloneNode(true);
  clone.classList.add("thumbImg");
  gsap.to(clone, { opacity: 0.5 });
  newImg.push(clone);
});

navs.map((nav) => {
  let index = navs.indexOf(nav);
  nav.append(newImg[index]);
  nav.addEventListener("click", () => {
    let index = navs.indexOf(nav);
    console.log(index);
    lenis.scrollTo(allItems[index], { immediate: true });
  });
  nav.addEventListener("mouseenter", () => {
    console.log(nav);
    gsap.to(nav.querySelector(".thumbImg"), { opacity: 1, duration: 0.5 });
  });
  nav.addEventListener("mouseleave", () => {
    gsap.to(nav.querySelector(".thumbImg"), { opacity: 0.5, duration: 0.5 });
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
