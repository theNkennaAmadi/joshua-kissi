/*
let mm = gsap.matchMedia();
let tlMain = gsap.timeline();
tlMain.to(".nav-logo", {
  scale: "1.2",
  y: "1.5rem",
  ease: "expo.inOut",
  duration: 1
});
mm.add("(min-width: 992px)", () => {
  tlMain.to(
    ".nav-logo-embed-wrapper",
    { scale: "3.5", ease: "expo.inOut", duration: 1 },
    "<"
  );
});
mm.add("(max-width: 991px)", () => {
  tlMain.to(
    ".nav-logo-embed-wrapper",
    { scale: "2.5", ease: "expo.inOut", duration: 1 },
    "<"
  );
});
mm.add("(max-width: 767px)", () => {
  tlMain.to(
    ".nav-logo-embed-wrapper",
    { scale: "2", ease: "expo.inOut", duration: 1 },
    "<"
  );
});
mm.add("(max-width: 479px)", () => {
  tlMain.to(
    ".nav-logo-embed-wrapper",
    { scale: "1.5", ease: "expo.inOut", duration: 1 },
    "<"
  );
});
tlMain.to(
  ".logo-text.connect",
  { opacity: 1, ease: "expo.inOut", duration: 1 },
  "<"
);

gsap.utils.toArray(".section.hero").forEach((panel, i) => {
  let tl = gsap.timeline({
    scrollTrigger: {
      trigger: panel,
      start: "top top",
      scrub: true,
      onUpdate: (self) => {
        if (self.progress > 0.9) {
          if (
            !document
              .querySelector(".connect-info-wrapper")
              .classList.contains("set")
          ) {
            document
              .querySelector(".connect-info-wrapper")
              .classList.add("set");
            gsap.fromTo(
              ".connect-info-wrapper",
              { opacity: 0 },
              { opacity: 1 }
            );
          }
        }
        if (self.progress < 0.9) {
          if (
            document
              .querySelector(".connect-info-wrapper")
              .classList.contains("set")
          ) {
            document
              .querySelector(".connect-info-wrapper")
              .classList.remove("set");
            //gsap.to(".connect-info-wrapper", { opacity: 0 });
          }
        }
      },
      pin: true,
      pinSpacing: false
    }
  });
  tl.to(".connect-image", { opacity: 0 });
  tl.to(".connect-about", { opacity: 0 }, "<");
});
*/
let copyButtons = [...document.querySelectorAll(".copy-wrapper")];
const copyContent = async (copy) => {
  try {
    await navigator.clipboard.writeText(copy);
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};
copyButtons.map((copy) => {
  copy.addEventListener("click", () => {
    let copyText = copy.previousElementSibling.textContent;
    copyContent(copyText);
    gsap.to(copy.querySelector(".copy-message"), { opacity: 1 });
    gsap.to(copy.querySelector(".copy-message"), { opacity: 0, delay: 1.75 });
    gsap.to(copy.querySelector(".copy-text"), { opacity: 0 });
    gsap.to(copy.querySelector(".copied-text"), { opacity: 1 });
    gsap.to(copy.querySelector(".copy-text"), { opacity: 1, delay: 1.75 });
    gsap.to(copy.querySelector(".copied-text"), { opacity: 0, delay: 1.75 });
  });
  copy.addEventListener("mouseenter", () => {
    gsap.to(copy.querySelector(".copy-tag.is-2"), { x: "-10%", y: "17%" });
    gsap.to(copy.querySelector(".copy-message"), { opacity: 1 });
    gsap.to(copy.querySelector(".copy-message"), { opacity: 0, delay: 1.75 });
  });
  copy.addEventListener("mouseleave", () => {
    gsap.to(".copy-message", { opacity: 0 });
    gsap.to(copy.querySelector(".copy-tag.is-2"), { x: "0%", y: "0%" });
  });
});

/*
function myFunction() {
  // Get the text field
  var copyText = document.getElementById("myInput");

  // Select the text field
  copyText.select();
  copyText.setSelectionRange(0, 99999); // For mobile devices

  // Copy the text inside the text field
  navigator.clipboard.writeText(copyText.value);

  // Alert the copied text
  alert("Copied the text: " + copyText.value);
}
*/
