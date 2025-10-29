// ==UserScript==
// @name         Github Issue copy-paste
// @namespace    http://tampermonkey.net/
// @version      0.5
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

    setInterval(() => {
        if (/\/issues\//.test(location.href)) { // Evaluate only for issues (not PRs for example)
            const issueTitleElement = $('[data-component="PH_Title"]').eq(0);
            const issueTitle = issueTitleElement.find('*').first().text();
            const formattedIssueName = issueTitle.replace(/[^a-zA-Z\d]+/g, '-').replace(/-/g, '-').replace(/^-+|-+$/g, '').toLocaleLowerCase()
            const issueNumber = issueTitleElement.find('*').last().text().replace(/[^\d]/g, '');
            const breadCrumElements = $('[data-target="context-region-crumb.linkElement"]');
            const organization = breadCrumElements.eq(0).text().trim();
            const repository = breadCrumElements.eq(1).text().trim();
            const humanReadableRepository = repository.substring(0, 1).toUpperCase().concat(repository.substring(1).replace(/-+/g, ' '))
            const branchName = `fix/${issueNumber}-${formattedIssueName}`

            if (branchName && lastBranchName !== branchName) {
                //$('#branch-name-suggestion').remove();
                const titleParentElement = issueTitleElement.parent().parent().parent();
                titleParentElement.append(`Branch name suggestion: <input type="text" value="${branchName}" readonly id="branch-name-suggestion" size="100">`);
                titleParentElement.append(`<br>Commit message suggestion: <input type="text" value="fix($actorName): #${issueNumber} - ${issueTitle}" readonly id="branch-name-suggestion" size="100">`);
                titleParentElement.append(`<br>DailyBot Report:<br>`
                    + `<div><code>`
                    + `<strong>${humanReadableRepository}:</strong><br>`
                    + `• <a href="${location.href}">#${issueNumber} - ${issueTitle}</a>`
                    + `</code></div>`);
                lastBranchName = branchName;
            }

            // ==UserScript==
// @name         Github Issue copy-paste
// @namespace    http://tampermonkey.net/
// @version      0.5
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

    setInterval(() => {
        if (/\/issues\//.test(location.href)) { // Evaluate only for issues (not PRs for example)
            const issueTitleElement = $('[data-component="PH_Title"]').eq(0);
            const issueTitle = issueTitleElement.find('*').first().text();
            const formattedIssueName = issueTitle.replace(/[^a-zA-Z\d]+/g, '-').replace(/-/g, '-').replace(/^-+|-+$/g, '').toLocaleLowerCase()
            const issueNumber = issueTitleElement.find('*').last().text().replace(/[^\d]/g, '');
            const breadCrumElements = $('[data-target="context-region-crumb.linkElement"]');
            const organization = breadCrumElements.eq(0).text().trim();
            const repository = breadCrumElements.eq(1).text().trim();
            const humanReadableRepository = repository.substring(0, 1).toUpperCase().concat(repository.substring(1).replace(/-+/g, ' '))
            const branchName = `fix/${issueNumber}-${formattedIssueName}`

            if (branchName && lastBranchName !== branchName) {
                //$('#branch-name-suggestion').remove();
                const titleParentElement = issueTitleElement.parent().parent().parent();
                titleParentElement.append(`Branch name suggestion: <input type="text" value="${branchName}" readonly id="branch-name-suggestion" size="100">`);
                titleParentElement.append(`<br>Commit message suggestion: <input type="text" value="fix($actorName): #${issueNumber} - ${issueTitle}" readonly id="branch-name-suggestion" size="100">`);
                titleParentElement.append(`<br>DailyBot Report:<br>`
                    + `<div><code>`
                    + `<strong>${humanReadableRepository}:</strong><br>`
                    + `• <a href="${location.href}">#${issueNumber} - ${issueTitle}</a>`
                    + `</code></div>`);
                lastBranchName = branchName;
            }
        }

        // Open all GH external links in new window
        const unprocessedLinks = [...document.querySelectorAll('a[href*="://"]:not(*[data-gh-extension])')];
        for (const unprocessedLink of unprocessedLinks) {
            unprocessedLink.setAttribute('target', '_blank');
            unprocessedLink.setAttribute('data-gh-extension', 'true');
        }
    }, 1000)
})();
