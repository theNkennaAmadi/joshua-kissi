let textLinkL = [...document.querySelectorAll("a[text-link-l]")];
textLinkL.map((link) => {
  let tlLinkL = gsap.timeline();
  link.addEventListener("mouseenter", () => {
    tlLinkL.fromTo(
      link.querySelector(".link-line"),
      {
        width: "0%"
      },
      {
        width: "100%",
        duration: 0.5
      }
    );
  });
  link.addEventListener("mouseleave", () => {
    tlLinkL.to(link.querySelector(".link-line"), {
      x: "110%",
      duration: 0.5
    });
    tlLinkL.to(
      link.querySelector(".link-line"),
      {
        x: "0%",
        width: "0%",
        opacity: 0,
        duration: 0
      },
      ">0.2"
    );
    tlLinkL.to(
      link.querySelector(".link-line"),
      {
        width: "100%",
        opacity: 1,
        duration: 0.5
      },
      ">"
    );
  });
});

let textLinks = [...document.querySelectorAll("[textlink]")];

textLinks.map((link) => {
  let tlLink = gsap.timeline();
  link.addEventListener("mouseenter", () => {
    tlLink.fromTo(
      link.querySelector(".text-mask"),
      {
        width: "0%",
        x: "0%",
        duration: 0.5
      },
      {
        width: "100%",
        x: "0%",
        duration: 0.5
      }
    );
  });
  link.addEventListener("mouseleave", () => {
    tlLink.to(link.querySelector(".text-mask"), {
      width: "100%",
      x: "110%",
      duration: 0.5
    });
  });
});
