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
const mediaQuery = window.matchMedia("(min-width: 992px)");
// Check if the media query is true

const insertion = () => {
  $(".p-projects-cc-list > div:nth-child(2n)")
    .after(`<div class="p-title-block" img-block>
<div class="p-title-wrapper">
  <div class="p-title-index">
    <div class="p-medium p-proj-index" img-index>01</div>
    <div class="p-medium">/</div>
    <div class="p-medium p-proj-count">24</div>
  </div>
  <div class="p-proj-title">
    <h2 class="h2-small" title>All Projects</h2>
  </div>
</div>
</div>
`);
};
if (mediaQuery.matches) {
  // Then trigger
  insertion();
}

window.addEventListener("load", () => {
  document.querySelector(".p-mask").style.display = "none";
});

let photos = [...document.querySelectorAll(".p-projects-cc-item")];
let allItems = [...document.querySelectorAll(".p-projects-cc-item")];
let imgBlocks = [...document.querySelectorAll("[img-block]")];

let count = () => {
  photos = [...document.querySelectorAll(".p-projects-cc-item")];
  photos.map((photo) => {
    let index = (photos.indexOf(photo) + 1).toString();
    photo.querySelector("[img-index]").textContent = index.padStart(2, "0");
  });
  let gridColumns = 5;
  imgBlocks = [...document.querySelectorAll("[img-block]")];
  let length = imgBlocks.length;
  let counters = [...document.querySelectorAll(".p-proj-count")];
  counters.map((counter) => {
    counter.textContent = photos.length.toString().padStart(2, "0");
  });
  let groups = Math.ceil(length / gridColumns);

  for (let i = 1; i <= groups; i++) {
    const group = imgBlocks.filter((block) => {
      return Math.ceil((imgBlocks.indexOf(block) + 1) / gridColumns) === i;
    });
    group.map((item) => {
      item.setAttribute(`group`, `group${i}`);
    });
    //console.log(group);
    if (group.length < 2) {
      group.map((item) => {
        item.remove();
      });
    }
    //console.log(group);
  }

  let allItems = [...document.querySelectorAll(".p-projects-cc-item")];
  allItems.map((item) => {
    item.addEventListener("mouseenter", () => {
      let itemGroup = item.getAttribute("group");
      //console.log(itemGroup);
      let titleBlocks = [
        ...document.querySelectorAll(`.p-title-block[group=${itemGroup}]`)
      ];
      if (titleBlocks.length === 1) {
        titleBlocks[0].querySelector(
          "[title]"
        ).textContent = item.querySelector("[title]").textContent;
        titleBlocks[0].querySelector(
          "[img-index]"
        ).textContent = item.querySelector("[img-index]").textContent;
      } else {
        titleBlocks.map((block) => {
          if (item.nextElementSibling === block) {
            block.querySelector("[title]").textContent = item.querySelector(
              "[title]"
            ).textContent;
            block.querySelector("[img-index]").textContent = item.querySelector(
              "[img-index]"
            ).textContent;
          }
          if (item.previousElementSibling === block) {
            block.querySelector("[title]").textContent = item.querySelector(
              "[title]"
            ).textContent;
            block.querySelector("[img-index]").textContent = item.querySelector(
              "[img-index]"
            ).textContent;
          }
        });
      }
      //console.log(titleBlocks);
    });
  });
};
count();

/**
 * Characters
 */
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

/**
 * Filter
 */
let filterLinks = [...document.querySelectorAll("[filter]")];
let allFilters = [...document.querySelectorAll(".filter-link-block")];

filterLinks.map((filter) => {
  filter.addEventListener("click", () => {
    let filterText = filter.textContent;
    //console.log(filterText);
    const filterResult = allItems.filter((project) => {
      return (
        project.querySelector(".p-project-category").textContent == filterText
      );
    });
    document.querySelector(".section-bg").style.backgroundImage = "";
    document
      .querySelector(".p-projects-cc-list")
      .replaceChildren(...filterResult);
    if (mediaQuery.matches) {
      // Then trigger
      insertion();
    }
    count();
    gsap.fromTo(
      ".p-title-block, .p-projects-cc-item",
      { opacity: 0 },
      { opacity: 1, stagger: 0.2 }
    );
  });
});

document.querySelector("[filterReset]").addEventListener("click", () => {
  gsap.fromTo(
    ".p-title-block, .p-projects-cc-item",
    { opacity: 0 },
    { opacity: 1, stagger: 0.2 }
  );
  document.querySelector(".p-projects-cc-list").replaceChildren(...allItems);
  document.querySelector(".section-bg").style.backgroundImage = "";
  if (mediaQuery.matches) {
    // Then trigger
    insertion();
  }
  count();
});

allFilters.map((filter) => {
  filter.addEventListener("click", () => {
    allFilters.map((filter) => {
      filter.classList.remove("selected");
    });
    filter.classList.add("selected");
  });
});

/**
 * Grade Js
 */
let test;
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
  Grade(document.querySelectorAll(".p-projects-cc-item"));
});

let selector = document.querySelector(".p-selector");
photos.map((photo) => {
  photo.addEventListener("mouseenter", () => {
    selector.style.display = "block";
    let state = Flip.getState(selector);
    photo.append(selector);
    Flip.from(state, {
      duration: 0.4,
      ease: "power2.Out"
    });
    document.querySelector(".section-bg").style.backgroundImage =
      photo.style.backgroundImage;
    //filter
  });
  photo.addEventListener("mouseleave", () => {
    selector.style.display = "none";
  });
});
