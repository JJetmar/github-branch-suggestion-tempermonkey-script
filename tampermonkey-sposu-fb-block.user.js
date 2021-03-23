// ==UserScript==
// @name         Facebook - suggestions and sponsored posts blocker.
// @namespace    https://github.com/JJetmar/sposu-fb-block
// @version      1.0
// @description  blocks suggestions and sponsored links on Facebook
// @author       JJetmar
// @match        https://www.facebook.com/
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const language = document.documentElement.lang;

    // key: language, value: text used to determine Suggestion post.
    const blockSuggestions = {
        cs: "Návrhy pro vás"
    };

    // key: language, value: text used to determine Sponsored post.
    const blockSponsored = {
        cs: "ponzorováno" // Sponzorováno - missing first letter is not a typo, it is a facebook feature.
    };

    const blockSuggestionRegExp = new RegExp(blockSuggestions[language]);
    const blockSponsoredRegExp = new RegExp(blockSponsored[language]);

    setInterval(() => {
        for (const post of document.querySelectorAll("[data-pagelet]:not(.ad-checked)")) {
            const spans = [...post.querySelectorAll("span")];

            let adSuggestions = spans.filter(el => el.textContent.match(blockSuggestionRegExp));

            let adSponsored = spans.filter(a => [...a.children]
                .filter(a => !a.attributes.style)
                .map(a => a.textContent)
                .join("")
                .match(`^${blockSponsoredRegExp}$`)
            );

            if (adSuggestions.length + adSponsored.length > 0) {
                post.remove();
            } else {
                post.classList.add("ad-checked");
            }
        }
    }, 300);

})();
