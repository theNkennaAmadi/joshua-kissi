/**
 * Horizontal Scroll
 */
gsap.registerPlugin(ScrollTrigger);

let sections = gsap.utils.toArray(".item");
let getTotalWidth = () => {
  let width = 0;
  let s2 = sections.slice(0, -2);
  s2.forEach((el) => (width += el.offsetWidth));
  return width;
};
/*
gsap.to(sections, {
  xPercent: -100 * (sections.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".contain",
    pin: true,
    start: "top top",
    //horizontal: true,
    scrub: 1,
    snap: 1 / (sections.length - 1),
    // base vertical scrolling on how wide the container is so it feels more natural.
    end: () => "+=" + document.querySelector(".contain").offsetWidth
  }
});
*/

gsap.to(sections, {
  x: () => -getTotalWidth(),
  ease: "none",
  scrollTrigger: {
    trigger: ".contain",
    pin: true,
    start: "top top",
    //horizontal: true,
    scrub: 1,
    //snap: 1 / (sections.length - 1),
    // base vertical scrolling on how wide the container is so it feels more natural.
    end: () =>
      "+=" +
      (document.querySelector(".contain").scrollWidth - window.innerWidth),
    invalidateOnRefresh: true,
    onRefresh() {
      let totalWidth = getTotalWidth(),
        accumulatedWidth = 0,
        progressArray = sections.map((el) => {
          accumulatedWidth += el.offsetWidth;
          return accumulatedWidth / totalWidth;
        });
      progressArray.unshift(0);
    }
  }
});
