/* =========================================================
   SHIVKUND EXAMINATION PAGE
   INTERACTION & ANIMATION
========================================================= */


/* =========================================================
   SCROLL REVEAL
========================================================= */

const revealElements = document.querySelectorAll(
    ".arena-section-heading, " +
    ".about-arena-grid, " +
    ".date-arena-card, " +
    ".score-rule, " +
    ".subject-card, " +
    ".round-card, " +
    ".journey-step, " +
    ".exam-team-card, " +
    ".paper-arena-card, " +
    ".arena-contact-grid a"
);


const revealObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (entry.isIntersecting) {

                entry.target.classList.add("exam-visible");

                revealObserver.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.12
    }
);


revealElements.forEach((element) => {

    element.classList.add("exam-reveal");

    revealObserver.observe(element);

});



/* =========================================================
   COUNTER
========================================================= */

const counters = document.querySelectorAll("[data-counter]");


const counterObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach((entry) => {

            if (!entry.isIntersecting) return;

            const element = entry.target;

            const target = Number(
                element.dataset.counter
            );

            let current = 0;

            const duration = 1400;

            const startTime = performance.now();


            function updateCounter(currentTime) {

                const progress =
                    Math.min(
                        (currentTime - startTime) / duration,
                        1
                    );


                const eased =
                    1 - Math.pow(1 - progress, 3);


                current =
                    Math.floor(target * eased);


                element.textContent =
                    current + "+";


                if (progress < 1) {

                    requestAnimationFrame(
                        updateCounter
                    );

                }

            }


            requestAnimationFrame(
                updateCounter
            );


            counterObserver.unobserve(element);

        });

    },
    {
        threshold: 0.7
    }
);


counters.forEach((counter) => {

    counterObserver.observe(counter);

});



/* =========================================================
   APPLY BUTTON
========================================================= */

const applyButtons =
    document.querySelectorAll(
        ".arena-primary-button, .main-apply-button"
    );


applyButtons.forEach((button) => {

    button.addEventListener(
        "click",
        function (event) {

            const target =
                this.getAttribute("href");


            if (
                target === "#" ||
                !target
            ) {

                event.preventDefault();

                const applySection =
                    document.querySelector("#apply");

                if (applySection) {

                    applySection.scrollIntoView({
                        behavior: "smooth"
                    });

                }

            }

        }
    );

});



/* =========================================================
   SCORE CARD TILT
========================================================= */

const scoreCards =
    document.querySelectorAll(
        ".score-rule"
    );


scoreCards.forEach((card) => {

    card.addEventListener(
        "mousemove",
        (event) => {

            const rect =
                card.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;


            const rotateX =
                ((y / rect.height) - .5) * -5;

            const rotateY =
                ((x / rect.width) - .5) * 5;


            card.style.transform =
                `perspective(800px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-8px)`;

        }
    );


    card.addEventListener(
        "mouseleave",
        () => {

            card.style.transform = "";

        }
    );

});