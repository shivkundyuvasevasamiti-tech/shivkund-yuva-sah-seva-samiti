/* =========================================
   SHIVKUND YUVA SAH SEVA SAMITI
   GALLERY JAVASCRIPT
========================================= */

const galleryData = {

    "2026": [

        {
            type: "image",
            category: "culture",
            src: "images/gallery/2026/2026-cultural.jpeg",
            title: "Cultural Celebration",
            subtitle: "Culture • 2026"
        },
{
    type: "image",
    category: "culture",
    src: "images/gallery/2026/2026-cultural2.jpg",
    title: "Cultural Celebration",
    subtitle: "Culture • 2026"
},
        {
            type: "video",
            category: "culture",
            src: "images/gallery/2026/2026-cultural-video.mp4",
            title: "Cultural Programme",
            subtitle: "Culture • 2026"
        },

        {
            type: "video",
            category: "culture",
            src: "images/gallery/2026/2026-cultural-video2.mp4",
            title: "Cultural Programme Highlights",
            subtitle: "Culture • 2026"
        },

        {
            type: "image",
            category: "examination",
            src: "images/gallery/2026/2026-exam.jpg",
            title: "Preliminary Examination",
            subtitle: "Examination • 2026"
        },

        {
            type: "video",
            category: "sports",
            src: "images/gallery/2026/2026-sports.mp4",
            title: "Sports Excellence",
            subtitle: "Sports • 2026"
        }

    ],

  "2025": [

    {
        type: "video",
        category: "culture",
        src: "images/gallery/2025/2025-cultural-video.mp4",
        title: "Cultural Programme",
        subtitle: "Culture • 2025"
    },

    {
        type: "image",
        category: "examination",
        src: "images/gallery/2025/2025-examination-photos.jpeg",
        title: "Examination Programme",
        subtitle: "Examination • 2025"
    },

    {
        type: "video",
        category: "examination",
        src: "images/gallery/2025/2025-exam-video.mp4",
        title: "Preliminary Examination",
        subtitle: "Examination • 2025"
    },

    {
        type: "image",
        category: "culture",
        src: "images/gallery/2025/2025-host-photos2.jpeg",
        title: "Host & Programme",
        subtitle: "Culture • 2025"
    }

],
"2024": [

    {
        type: "image",
        category: "culture",
        src: "images/gallery/2024/2024-cultural photos.jpeg",
        title: "Cultural Programme",
        subtitle: "Culture • 2024"
    },

    {
        type: "video",
        category: "sports",
        src: "images/gallery/2024/2024-sports-video.mp4",
        title: "Sports Programme",
        subtitle: "Sports • 2024"
    }

],

"2023": [

    {
        type: "video",
        category: "culture",
        src: "images/gallery/2023/2023-cultural-video.mp4",
        title: "Cultural Programme",
        subtitle: "Culture • 2023"
    },

    {
        type: "image",
        category: "culture",
        src: "images/gallery/2023/2023-host pic.jpeg",
        title: "Host & Programme",
        subtitle: "Culture • 2023"
    }

]

}




/* =========================================
   ELEMENTS
========================================= */

const lightbox =
    document.getElementById("galleryLightbox");

const lightboxImage =
    document.getElementById("lightboxImage");

const lightboxVideo =
    document.getElementById("lightboxVideo");

const lightboxTitle =
    document.getElementById("lightboxTitle");

const closeButton =
    document.querySelector(".lightbox-close");

const filterButtons =
    document.querySelectorAll(".gallery-filter");

const yearButtons =
    document.querySelectorAll(".gallery-year-filter");


let selectedYear = "all";
let selectedCategory = "all";


/* =========================================
   CREATE IMAGE CARD
========================================= */

function createImageCard(item) {

    const card = document.createElement("div");

    card.className = "gallery-card";

    card.setAttribute(
        "data-category",
        item.category
    );

    card.setAttribute(
        "data-type",
        "image"
    );

    const media =
        document.createElement("div");

    media.className = "gallery-media";

    const image =
        document.createElement("img");

    image.src = item.src;
    image.alt = item.title;
    image.loading = "lazy";

    media.appendChild(image);


    const info =
        document.createElement("div");

    info.className = "gallery-info";


    const title =
        document.createElement("h3");

    title.textContent = item.title;


    const subtitle =
        document.createElement("p");

    subtitle.textContent = item.subtitle;


    info.appendChild(title);
    info.appendChild(subtitle);

    card.appendChild(media);
    card.appendChild(info);


    card.addEventListener(
        "click",
        function() {
            openLightbox(item);
        }
    );


    return card;
}


/* =========================================
   CREATE VIDEO CARD
========================================= */

function createVideoCard(item) {

    const card = document.createElement("div");

    card.className = "gallery-card";

    card.setAttribute(
        "data-category",
        item.category
    );

    card.setAttribute(
        "data-type",
        "video"
    );


    const media =
        document.createElement("div");

    media.className = "gallery-media";


    const video =
        document.createElement("video");

    video.src = item.src;
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";


    media.appendChild(video);


    const badge =
        document.createElement("span");

    badge.className =
        "gallery-video-badge";

    badge.textContent =
        "▶ VIDEO";


    media.appendChild(badge);


    const info =
        document.createElement("div");

    info.className =
        "gallery-info";


    const title =
        document.createElement("h3");

    title.textContent =
        item.title;


    const subtitle =
        document.createElement("p");

    subtitle.textContent =
        item.subtitle;


    info.appendChild(title);
    info.appendChild(subtitle);


    card.appendChild(media);
    card.appendChild(info);


    card.addEventListener(
        "click",
        function() {
            openLightbox(item);
        }
    );


    return card;
}


/* =========================================
   CREATE CARD
========================================= */

function createCard(item) {

    if (item.type === "video") {
        return createVideoCard(item);
    }

    return createImageCard(item);
}


/* =========================================
   EMPTY YEAR
========================================= */

function showEmptyYear(
    container,
    year
) {

    const empty =
        document.createElement("div");

    empty.className =
        "gallery-empty";

    empty.innerHTML =
        "<strong>" +
        year +
        "</strong><br>" +
        "More memories from " +
        year +
        " will be added soon.";

    container.appendChild(empty);
}


/* =========================================
   LOAD GALLERY
========================================= */

function loadGallery() {

    const years = [
        "2026",
        "2025",
        "2024",
        "2023"
    ];


    years.forEach(
        function(year) {

            const container =
                document.getElementById(
                    "gallery-" + year
                );


            if (!container) {
                return;
            }


            container.innerHTML = "";


            const items =
                galleryData[year];


            if (
                !items ||
                items.length === 0
            ) {

                showEmptyYear(
                    container,
                    year
                );

                return;
            }


            items.forEach(
                function(item) {

                    const card =
                        createCard(item);

                    container.appendChild(card);

                }
            );

        }
    );


    applyFilters();
}


/* =========================================
   APPLY YEAR + CATEGORY FILTER
========================================= */

function applyFilters() {

    const years = [
        "2026",
        "2025",
        "2024",
        "2023"
    ];


    years.forEach(
        function(year) {

            const block =
                document.querySelector(
                    '.gallery-year-block[data-year="' +
                    year +
                    '"]'
                );


            const container =
                document.getElementById(
                    "gallery-" + year
                );


            if (!block || !container) {
                return;
            }


            /* YEAR FILTER */

            const showYear =
                selectedYear === "all" ||
                selectedYear === year;


            block.style.display =
                showYear ? "" : "none";


            if (!showYear) {
                return;
            }


            /* CATEGORY FILTER */

            const cards =
                container.querySelectorAll(
                    ".gallery-card"
                );


            cards.forEach(
                function(card) {

                    const category =
                        card.getAttribute(
                            "data-category"
                        );


                    const type =
                        card.getAttribute(
                            "data-type"
                        );


                    let showCard = true;


                    if (
                        selectedCategory !==
                        "all"
                    ) {

                        if (
                            selectedCategory ===
                            "video"
                        ) {

                            showCard =
                                type === "video";

                        } else {

                            showCard =
                                category ===
                                selectedCategory;

                        }

                    }


                    card.style.display =
                        showCard ? "" : "none";

                }
            );

        }
    );
}


/* =========================================
   YEAR BUTTONS
========================================= */

yearButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                yearButtons.forEach(
                    function(item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                selectedYear =
                    button.getAttribute(
                        "data-year-filter"
                    );


                applyFilters();

            }
        );

    }
);


/* =========================================
   CATEGORY BUTTONS
========================================= */

filterButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                filterButtons.forEach(
                    function(item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                selectedCategory =
                    button.getAttribute(
                        "data-filter"
                    );


                applyFilters();

            }
        );

    }
);


/* =========================================
   LIGHTBOX
========================================= */

function openLightbox(item) {

    if (!lightbox) {
        return;
    }


    lightbox.classList.add(
        "show"
    );


    lightboxTitle.textContent =
        item.title;


    if (item.type === "video") {

        lightboxImage.style.display =
            "none";

        lightboxVideo.style.display =
            "block";

        lightboxVideo.src =
            item.src;

        lightboxVideo.play();

    } else {

        lightboxVideo.pause();

        lightboxVideo.removeAttribute(
            "src"
        );

        lightboxVideo.load();


        lightboxVideo.style.display =
            "none";

        lightboxImage.style.display =
            "block";

        lightboxImage.src =
            item.src;

        lightboxImage.alt =
            item.title;

    }
}


/* =========================================
   CLOSE LIGHTBOX
========================================= */

function closeLightbox() {

    if (!lightbox) {
        return;
    }


    lightbox.classList.remove(
        "show"
    );


    if (lightboxVideo) {

        lightboxVideo.pause();

        lightboxVideo.removeAttribute(
            "src"
        );

        lightboxVideo.load();

    }


    if (lightboxImage) {

        lightboxImage.removeAttribute(
            "src"
        );

    }
}


/* =========================================
   CLOSE BUTTON
========================================= */

if (closeButton) {

    closeButton.addEventListener(
        "click",
        closeLightbox
    );

}


/* =========================================
   CLICK OUTSIDE
========================================= */

if (lightbox) {

    lightbox.addEventListener(
        "click",
        function(event) {

            if (
                event.target ===
                lightbox
            ) {

                closeLightbox();

            }

        }
    );

}


/* =========================================
   ESCAPE KEY
========================================= */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Escape") {
            closeLightbox();
        }

    }
);


/* =========================================
   START
========================================= */

loadGallery();