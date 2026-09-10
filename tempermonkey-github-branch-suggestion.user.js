// ==UserScript==
// @name         Github Issue extension
// @namespace    http://tampermonkey.net/
// @version      0.9
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

            let rawIssueTitle = issueTitleElement.find('*').first().text().trim();
            
            // Matches bracketed prefixes like "[Login-Resolver] - " or "[Google Security Settings] - "
            const ACTOR_NAME_REGEXP = /^\s*\[([^\]]+)\]\s*-?\s*/;
            let actorMatch = rawIssueTitle.match(ACTOR_NAME_REGEXP);
            
            let rawActorName = actorMatch ? actorMatch[1] : '';
            let formattedActorScope = rawActorName ? formatText(rawActorName) : '<actor-name>';

            // Clean title by stripping the actor prefix
            let cleanIssueTitle = actorMatch ? rawIssueTitle.replace(ACTOR_NAME_REGEXP, '') : rawIssueTitle;

            // Combine actor prefix + clean title into full slug for the branch name
            let fullTitleSlug = formatText(rawIssueTitle);

            const issueNumber = $('[class^="HeaderViewer-module__issueNumberText__"]').text().replace(/[^\d]/g, '');
            const branchName = `fix/${issueNumber}-${fullTitleSlug}`;

            if (branchName && lastBranchName !== branchName) {
                $('#branch-name-suggestion, #commit-message-suggestion, br.suggestion-break').remove();
                
                const titleParentElement = issueTitleElement.parent().parent().parent();
                const commitMessage = `fix(${formattedActorScope}): #${issueNumber} - ${cleanIssueTitle}`;

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
