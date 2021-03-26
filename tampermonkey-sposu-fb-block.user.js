// ==UserScript==
// @name         Facebook - suggestions and sponsored posts blocker.
// @namespace    https://github.com/JJetmar/sposu-fb-block
// @version      1.0.2
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
        cs: "^(Návrhy pro vás|Navrhované události)$"
    };

    // key: language, value: text used to determine Sponsored post.
    const blockSponsored = {
        cs: "Sponzorováno"
    };

    const blockSuggestionRegExp = new RegExp(blockSuggestions[language]);
    const blockSponsoredRegExp = new RegExp(blockSponsored[language]);

    setInterval(() => {
        for (const post of document.querySelectorAll("[data-pagelet]:not(.ad-checked)")) {
            for (const heading of post.querySelectorAll("h4")) {
                const spans = [...heading.parentNode.parentNode.parentNode.querySelectorAll("span")];

                // Suggestions
                let suggestionsRootEl = heading.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.previousElementSibling;
                if (suggestionsRootEl.textContent.match(blockSuggestions[language])) {
                    post.remove();
                    console.log("Deleted Suggestion")
                    continue;
                }

                // Sponsored
                const sponsoredText = blockSponsored[language];
                const sponsoredWrapper = heading.parentNode.parentNode.nextSibling;
                if (sponsoredWrapper) {
                    let sponsored = heading.parentNode.parentNode.nextSibling.querySelectorAll("a")[0]
                    .textContent.split("")
                    .reduce((accumulator, currentValue, currentIndex, sourceArray) => currentValue === sponsoredText[accumulator] ? accumulator + 1 : accumulator, 0) === sponsoredText.length;

                    if (sponsored) {
                        post.remove();
                        console.log("Deleted Sponsored")
                        continue;
                    }
                }
                post.classList.add("ad-checked");
            }
        }
    }, 300);

})();
