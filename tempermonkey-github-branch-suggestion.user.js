// ==UserScript==
// @name         Github Issue extension
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  try to take over the world!
// @author       https://github.com/JJetmar/
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @require      https://code.jquery.com/jquery-3.6.3.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    let lastBranchName;

    function formatText(text) {
        return text.replace(/[^a-zA-Z\d]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
    }

    setInterval(() => {
        if (/\/issues\//.test(location.href)) {
            const issueTitleElement = $('[data-component="PH_Title"]').eq(0);

            let issueTitle = issueTitleElement.find('*').first().text().trim();
            const ACTOR_NAME_REGEXP = /^\s*\[([^\]]+)\]\s*-?\s*/;
            let actorMatch = issueTitle.match(ACTOR_NAME_REGEXP);
            let rawActorName = actorMatch ? actorMatch[1] : '';

            // Clean actor name for commit scope (e.g., "Google Security Settings" -> "google-security-settings")
            let formattedActorScope = rawActorName ? formatText(rawActorName) : '<actor-name>';

            // Strip the actor prefix from the issue title body
            let branchSuggestionIssueName = actorMatch ? issueTitle.replace(ACTOR_NAME_REGEXP, '') : issueTitle;
            const formattedBranchSuggestionIssueName = formatText(branchSuggestionIssueName);

            const issueNumber = $('[class^="HeaderViewer-module__issueNumberText__"]').text().replace(/[^\d]/g, '');
            const branchName = `fix/${issueNumber}-${formattedBranchSuggestionIssueName}`;

            if (branchName && lastBranchName !== branchName) {
                $('#branch-name-suggestion, #commit-message-suggestion, br.suggestion-break').remove();

                const titleParentElement = issueTitleElement.parent().parent().parent();

                const commitMessage = `fix(${formattedActorScope}): #${issueNumber} - ${branchSuggestionIssueName}`;

                titleParentElement.append(`Branch name suggestion: <input type="text" value="${branchName}" readonly id="branch-name-suggestion" size="100">`);
                titleParentElement.append(`<br class="suggestion-break">Commit message suggestion: <input type="text" value="${commitMessage}" readonly id="commit-message-suggestion" size="100">`);

                lastBranchName = branchName;
            }
        }

        // Open all GH external links in new window
        const unprocessedLinks = [...document.querySelectorAll('a[href*="://"]:not([data-gh-extension])')];
        for (const unprocessedLink of unprocessedLinks) {
            unprocessedLink.setAttribute('target', '_blank');
            unprocessedLink.setAttribute('data-gh-extension', 'true');
        }
    }, 1000);
})();
