/* =========================================
   SHIVKUND YUVA SAH SEVA SAMITI
   JAVASCRIPT
========================================= */


/* =========================================
   MOBILE MENU
========================================= */

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

if (menuToggle && mainNav) {

    menuToggle.addEventListener("click", () => {

        mainNav.classList.toggle("open");

    });


    document.querySelectorAll(".main-nav a").forEach(link => {

        link.addEventListener("click", () => {

            mainNav.classList.remove("open");

        });

    });

}


/* =========================================
   SCROLL REVEAL ANIMATION
========================================= */

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.12
        }
    );


    revealElements.forEach(element => {

        observer.observe(element);

    });

} else {

    revealElements.forEach(element => {

        element.classList.add("visible");

    });

}


/* =========================================
   VIDEO AUTOPLAY SAFETY
========================================= */

const videos = document.querySelectorAll("video");

videos.forEach(video => {

    video.muted = true;

    const playVideo = () => {

        const promise = video.play();

        if (promise !== undefined) {

            promise.catch(() => {
                // Browser may block autoplay.
                // Controls remain available to the visitor.
            });

        }

    };

    playVideo();

});


/* =========================================
   CURRENT YEAR IN FOOTER
========================================= */

const footerYear = document.querySelector(".footer-bottom p");

if (footerYear) {

    const currentYear = new Date().getFullYear();

    footerYear.innerHTML =
        `© ${currentYear} Shivkund Yuva Sah Seva Samiti. All rights reserved.`;

}

// =====================================================
// COMPLETE ENGLISH ↔ HINDI LANGUAGE SWITCHER
// =====================================================
const keyedTranslations = {
    "about.intro": {
        en: "Shivkund Yuva Sah Seva Samiti works with the aim of encouraging students and young people through meaningful educational, cultural and community activities.",
        hi: "शिवकुंड युवा सह सेवा समिति सार्थक शैक्षणिक, सांस्कृतिक एवं सामुदायिक गतिविधियों के माध्यम से विद्यार्थियों एवं युवाओं को प्रोत्साहित करने के उद्देश्य से कार्य करती है।"
    },

    "about.programme": {
        en: "Our annual programme brings together academic excellence, sporting spirit, cultural expression and quiz-based learning in one shared celebration.",
        hi: "हमारा वार्षिक कार्यक्रम शैक्षणिक उत्कृष्टता, खेल भावना, सांस्कृतिक अभिव्यक्ति और प्रश्नोत्तरी आधारित सीखने को एक साझा आयोजन में एक साथ लाता है।"
    }
};
const languageToggle = document.getElementById("languageToggle");
const languageText = document.getElementById("languageText");

let hindiMode = false;

const hindiTranslations = {

    // Header
    "ESTABLISHED 2004": "स्थापना 2004",
    "EDUCATION": "शिक्षा",
    "SPORTS": "खेल",
    "Cultural Program":
    "सांस्कृतिक कार्यक्रम",
    "CULTURE": "संस्कृति",
    "YOUTH DEVELOPMENT": "युवा विकास",

    "Home": "मुख्य पृष्ठ",
    "About": "हमारे बारे में",
    "Programme": "कार्यक्रम",
    "Leadership": "नेतृत्व",
    "Host": "संचालक",
    "Contact": "संपर्क",

    // Hero
    "SHIVKUND • ESTABLISHED 2004": "शिवकुंड • स्थापना 2004",
    "Nurturing": "विकसित करते हुए",
    "Knowledge,": "ज्ञान,",
    "Character & Community": "चरित्र एवं समुदाय",
    "Explore Our Programme": "हमारा कार्यक्रम देखें",
    "Discover Our Mission": "हमारे उद्देश्य को जानें",

    "OUR ANNUAL PROGRAMME": "हमारा वार्षिक कार्यक्रम",
    "13 — 15 AUGUST": "13 — 15 अगस्त",
    "Three Days.": "तीन दिन।",
    "Three Dimensions.": "तीन आयाम।",
    "Sports, academic excellence and cultural": "खेल, शैक्षणिक उत्कृष्टता और सांस्कृतिक",
    "expression brought together.": "अभिव्यक्ति का एक साथ संगम।",
    "EXAMINATION": "परीक्षा",
    "03 / CULTURAL PROGRAM & QUIZ":
    "03 / सांस्कृतिक कार्यक्रम एवं प्रश्नोत्तरी",

    // Three Pillars
    "THREE PILLARS": "तीन आधार",
    "Learning Beyond the Classroom": "कक्षा से परे सीखने का अवसर",
    "Our annual programme gives students": "हमारा वार्षिक कार्यक्रम विद्यार्थियों को",
    "opportunities to learn, compete, express themselves and grow.":
        "सीखने, प्रतियोगिता में भाग लेने, अपनी प्रतिभा व्यक्त करने और आगे बढ़ने के अवसर प्रदान करता है।",

    "Encouraging teamwork, discipline, confidence": "टीम भावना, अनुशासन और आत्मविश्वास को",
    "and sporting spirit among students.": "प्रोत्साहित करना।",

    "Promoting knowledge, healthy competition and": "ज्ञान, स्वस्थ प्रतिस्पर्धा और",
    "a strong academic foundation.": "मजबूत शैक्षणिक आधार को बढ़ावा देना।",

    "Celebrating creativity, cultural expression,": "रचनात्मकता और सांस्कृतिक अभिव्यक्ति का",
   "confidence and quiz-based learning.": "उत्सव एवं प्रश्नोत्तरी आधारित सीखने को बढ़ावा देना।",
   "pillar.sports.title": {
    en: "Sports",
    hi: "खेल"
},

"pillar.sports.text": {
    en: "Encouraging teamwork, discipline, confidence and sporting spirit among students.",
    hi: "विद्यार्थियों में टीम भावना, अनुशासन, आत्मविश्वास और खेल भावना को प्रोत्साहित करना।"
},

"pillar.academic.title": {
    en: "Academic Excellence",
    hi: "शैक्षणिक उत्कृष्टता"
},

"pillar.academic.text": {
    en: "Promoting knowledge, healthy competition and a strong academic foundation.",
    hi: "ज्ञान, स्वस्थ प्रतिस्पर्धा और मजबूत शैक्षणिक आधार को बढ़ावा देना।"
},

"pillar.culture.title": {
    en: "Cultural Program & Quiz",
    hi: "सांस्कृतिक कार्यक्रम एवं प्रश्नोत्तरी"
},

"pillar.culture.text": {
    en: "Celebrating creativity, cultural expression, confidence and quiz-based learning.",
    hi: "रचनात्मकता, सांस्कृतिक अभिव्यक्ति, आत्मविश्वास और प्रश्नोत्तरी आधारित सीखने का उत्सव।"
},
// =====================================================

// ABOUT SECTION
// =====================================================
"culture.title": {
    en: "Cultural Program, Creativity & Quiz",
    hi: "सांस्कृतिक कार्यक्रम, रचनात्मकता एवं प्रश्नोत्तरी"
},

"culture.description": {
    en: "The celebration continues with our cultural programme and quiz, giving students a platform to express their creativity, confidence, knowledge and artistic talent.",
    hi: "यह उत्सव हमारे सांस्कृतिक कार्यक्रम और प्रश्नोत्तरी के साथ आगे बढ़ता है, जो विद्यार्थियों को अपनी रचनात्मकता, आत्मविश्वास, ज्ञान और कलात्मक प्रतिभा व्यक्त करने का मंच प्रदान करता है।"
},

"culture.messageTitle": {
    en: "Celebrating Culture, Creativity & Talent",
    hi: "संस्कृति, रचनात्मकता एवं प्रतिभा का उत्सव"
},

"culture.message": {
    en: "We sincerely appreciate every artist and participant whose dedication, enthusiasm and performance make this celebration memorable. Their contribution reminds us that education is not only about examinations, but also about nurturing creativity, culture and character.",
    hi: "हम प्रत्येक कलाकार और प्रतिभागी की हार्दिक सराहना करते हैं, जिनका समर्पण, उत्साह और प्रदर्शन इस उत्सव को यादगार बनाता है। उनका योगदान हमें याद दिलाता है कि शिक्षा केवल परीक्षाओं तक सीमित नहीं है, बल्कि रचनात्मकता, संस्कृति और चरित्र के विकास को भी बढ़ावा देती है।"
},
    // Impact
    "OUR IMPACT": "हमारा प्रभाव",
    "Encouraging Every Step Forward":
        "हर कदम को आगे बढ़ने के लिए प्रोत्साहित करना",

    "STUDENTS RECOGNISED": "सम्मानित विद्यार्थी",
    "Top performers are rewarded for their achievement.":
        "श्रेष्ठ प्रदर्शन करने वाले विद्यार्थियों को उनकी उपलब्धि के लिए पुरस्कृत किया जाता है।",

    "CLASSES PARTICIPATING": "भाग लेने वाली कक्षाएँ",
    "Students receive an opportunity to compete and learn.":
        "विद्यार्थियों को प्रतियोगिता में भाग लेने और सीखने का अवसर मिलता है।",

    "DAYS OF PROGRAMMES": "कार्यक्रमों के दिन",
    "Sports, academics, culture and quiz come together.":
        "खेल, शिक्षा, संस्कृति और प्रश्नोत्तरी एक साथ आते हैं।",

    "A continuing commitment to education and youth development.":
        "शिक्षा और युवा विकास के प्रति निरंतर प्रतिबद्धता।",

    // Leadership
    "Guided by Service & Commitment":
        "सेवा एवं प्रतिबद्धता से मार्गदर्शित",

    "The committee's activities are supported by":
        "समिति की गतिविधियों को",
    "dedicated members working for the development":
        "विद्यार्थियों और समुदाय के विकास के लिए समर्पित सदस्य",
    "of students and the community.":
        "सहयोग प्रदान करते हैं।",

    "CHAIRMAN": "अध्यक्ष",
    "CO-CHAIRMAN": "सह-अध्यक्ष",
    "CHIEF COORDINATOR": "मुख्य समन्वयक",

    "Providing leadership and direction to the committee.":
        "समिति को नेतृत्व और दिशा प्रदान करना।",

    "Supporting the committee's programmes and initiatives.":
        "समिति के कार्यक्रमों और पहलों में सहयोग प्रदान करना।",

    "Coordinating programmes and student activities.":
        "कार्यक्रमों और विद्यार्थी गतिविधियों का समन्वय करना।",

    // Host
    "MEET THE HOST": "संचालक से मिलें",

    "Host and presenter associated with the programmes":
        "शिवकुंड युवा सह सेवा समिति के कार्यक्रमों से जुड़े",
    "of Shivkund Yuva Sah Seva Samiti.":
        "संचालक एवं प्रस्तोता।",

    "Prince Roy also designed and developed this website":
        "प्रिंस रॉय ने इस वेबसाइट का डिजाइन और विकास भी किया है",
    "to present the committee's work, programmes and":
        "ताकि समिति के कार्यों, कार्यक्रमों और",
    "achievements in a professional digital format.":
        "उपलब्धियों को एक पेशेवर डिजिटल रूप में प्रस्तुत किया जा सके।",

    "Meet the Host": "संचालक से मिलें",
    "Discover Prince Roy's profile": "प्रिंस रॉय की प्रोफ़ाइल देखें",
    "HOST": "संचालक",

    // Location
    "OUR LOCATION": "हमारा स्थान",
    "Find Us at Shivkund": "शिवकुंड में हमसे मिलें",

    "Visit us at the heart of Shivkund, where our":
        "शिवकुंड के उस स्थान पर हमसे मिलें जहाँ हमारी",
    "educational, cultural and community activities":
        "शैक्षणिक, सांस्कृतिक और सामुदायिक गतिविधियाँ",
    "take place.": "आयोजित होती हैं।",

    "Get Directions": "दिशा-निर्देश प्राप्त करें",

    // Contact
    "GET IN TOUCH": "संपर्क करें",

    "For information regarding our programmes,":
        "हमारे कार्यक्रमों के संबंध में जानकारी के लिए,",
    "student activities and committee initiatives,":
        "विद्यार्थी गतिविधियों और समिति की पहलों के लिए,",
    "you can contact us through the details below.":
        "आप नीचे दिए गए संपर्क विवरण के माध्यम से हमसे संपर्क कर सकते हैं।",

    "EMAIL": "ईमेल",
    "ADDRESS": "पता",

    // Footer
    "Yuva Sah Seva Samiti": "युवा सह सेवा समिति",
    "Education • Culture • Sports • Youth Development":
        "शिक्षा • संस्कृति • खेल • युवा विकास",
    "All rights reserved.": "सर्वाधिकार सुरक्षित।"
};


// Store original text nodes
const languageNodes = [];

function prepareLanguageNodes() {
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT
    );

    let node;

    while (node = walker.nextNode()) {


        // Ignore script/style text
        if (
            node.parentElement &&
            !node.parentElement.closest("script, style") &&
            node.parentElement.id !== "languageText"
        ) {

            const original = node.nodeValue;

            if (original.trim() !== "") {

                languageNodes.push({
                    node: node,
                    original: original
                });

            }
        }
    }
}


// Change language
function changeWebsiteLanguage() {

    // Translate elements using stable data-translate keys
    document.querySelectorAll("[data-translate]").forEach(el => {

        const key = el.dataset.translate;
        const translation = keyedTranslations[key];

        if (translation) {
            el.textContent = hindiMode
                ? translation.hi
                : translation.en;
        }

    });


    // Translate normal text using the older dictionary
    languageNodes.forEach(item => {

        const originalText = item.original;

        // Preserve spaces and indentation
        const leadingSpaces =
            originalText.match(/^\s*/)?.[0] || "";

        const trailingSpaces =
            originalText.match(/\s*$/)?.[0] || "";

        const cleanText = originalText.trim();

        if (hindiMode && hindiTranslations[cleanText]) {

            item.node.nodeValue =
                leadingSpaces +
                hindiTranslations[cleanText] +
                trailingSpaces;

        } else {

            item.node.nodeValue = originalText;

        }

    });


    // Language button
    if (languageText) {

        languageText.textContent =
            hindiMode ? "English" : "हिन्दी";

    }

    document.documentElement.lang =
        hindiMode ? "hi" : "en";
}


// Prepare after page loads
prepareLanguageNodes();


// Language button
if (languageToggle) {

    languageToggle.addEventListener("click", function () {

        hindiMode = !hindiMode;

        changeWebsiteLanguage();

    });

}