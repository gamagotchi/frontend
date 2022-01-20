// Animation for introduction

gsap.from(".navigation", { duration: 1, y: "-100%" });

gsap.fromTo(
    ".redfrog", 
    { top: "-75%", right: "-80%", y: "-50%", x: "50%" },
    { top: "25%", right: "20%", duration: 1 }
);

gsap.fromTo(
    ".smokefrog", 
    { bottom: "-65%", right: "-80%", y: "50%", x: "50%" },
    { bottom: "35%", right: "20%", duration: 1}
);

gsap.fromTo(
    ".rocketfrog", 
    { top: "-75%", left: "-80%", y: "-50%", x:"-50%" },
    { top: "25%", left: "20%", duration: 1 }
);

gsap.fromTo(
    ".bluefrog", 
    { bottom: "-65%", left: "-80%", y: "50%", x: "-50%" },
    { bottom: "35%", left: "20%", duration: 1 }
);

gsap.fromTo(
    ".bigfrog", 
    {xPercent:-50, yPercent: 20, left:"50%", top:"50%"}, 
    {xPercent:-50, yPercent:-50, duration: 0.5}
);

gsap.fromTo(
  ".learnmore", 
  {xPercent:-50, yPercent: 20, left:"50%", top:"75%"}, 
  {xPercent:-50, yPercent:-50, duration: 0.5}
);



const tl = gsap.timeline({
	scrollTrigger: {
		trigger: ".intro-page",
		start: "top top",
		end: "bottom top",
		scrub: true
	}
});


gsap.utils.toArray(".parallax").forEach(layer => {
	const depth = layer.dataset.depth;
	const movement = -(layer.offsetHeight * depth)
	tl.to(layer, {y: movement, ease: "none"}, 0)
});


// Carousel Logic

  var carousel = document.querySelector('.carousel');
  var cellCount = 9;
  var selectedIndex = 0;
  
  function rotateCarousel() {
    var angle = selectedIndex / cellCount * -360;
    carousel.style.transform = 'translateZ(288px) rotateY(' + angle + 'deg)';
  }
  
  var prevButton = document.querySelector('.previous-button');
  prevButton.addEventListener( 'click', function() {
    selectedIndex--;
    rotateCarousel();
  });
  
  var nextButton = document.querySelector('.next-button');
  nextButton.addEventListener( 'click', function() {
    selectedIndex++;
    rotateCarousel();
  });


// Footstep logic
gsap.utils.toArray('.website-section').forEach(section => {
  const elems = section.querySelectorAll('.js-content-opacity');
  // Set starting params for sections
  gsap.set(elems, {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    overwrite: 'auto',
  });
  
  ScrollTrigger.create({
    trigger: section,
    start: 'top 60%',
    end: 'bottom 30%',
    markers: true,
    onEnter: () => gsap.to(elems, {
      y: 0,
      opacity: 1,
      stagger: 0.2,
    }),
    onLeave: () => gsap.to(elems, {
      y: -50,
      opacity: 0,
      stagger: 0.2,
    }),
    onEnterBack: () => gsap.to(elems, {
      y: 0,
      opacity: 1,
      stagger: -0.2,
    }),
    onLeaveBack: () => gsap.to(elems, {
      y: 50,
      opacity: 0,
      stagger: -0.2,
    }),
  });
})


// usage:
batch(".card", {
  interval: 0.4, // time window (in seconds) for batching to occur. The first callback that occurs (of its type) will start the timer, and when it elapses, any other similar callbacks for other targets will be batched into an array and fed to the callback. Default is 0.1
  batchMax: 3,   // maximum batch size (targets)
  onEnter: batch => gsap.to(batch, {autoAlpha: 1, overwrite: true}),
  onLeave: batch => gsap.set(batch, {autoAlpha: 0, overwrite: true}),
  onEnterBack: batch => gsap.to(batch, {autoAlpha: 1,  overwrite: true}),
  onLeaveBack: batch => gsap.set(batch, {autoAlpha: 0, overwrite: true})
  // you can also define things like start, end, etc.
});




// the magical helper function (no longer necessary in GSAP 3.3.1 because it was added as ScrollTrigger.batch())...
function batch(targets, vars) {
  let varsCopy = {},
      interval = vars.interval || 0.1,
      proxyCallback = (type, callback) => {
        let batch = [],
            delay = gsap.delayedCall(interval, () => {callback(batch); batch.length = 0;}).pause();
        return self => {
          batch.length || delay.restart(true);
          batch.push(self.trigger);
          vars.batchMax && vars.batchMax <= batch.length && delay.progress(1);
        };
      },
      p;
  for (p in vars) {
    varsCopy[p] = (~p.indexOf("Enter") || ~p.indexOf("Leave")) ? proxyCallback(p, vars[p]) : vars[p];
  }
  gsap.utils.toArray(targets).forEach(target => {
    let config = {};
    for (p in varsCopy) {
      config[p] = varsCopy[p];
    }
    config.trigger = target;
    ScrollTrigger.create(config);
  });
}