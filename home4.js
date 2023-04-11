//lenis.kill();
console.log("hello");
const firstElem = document.querySelector(".section.hero");

function goToSection(i, anim) {
  gsap.to(window, {
    scrollTo: { y: i * innerHeight + firstElem.offsetTop, autoKill: false },
    duration: 1
  });

  if (anim) {
    anim.restart();
  }
}

gsap.utils.toArray(".section.hero").forEach((panel, i) => {
  ScrollTrigger.create({
    trigger: panel,
    markers: true,
    onEnter: () => goToSection(i)
  });

  ScrollTrigger.create({
    trigger: panel,
    markers: true,
    start: "bottom bottom",
    onEnterBack: () => goToSection(i)
  });
});
