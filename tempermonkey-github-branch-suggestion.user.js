// ==UserScript==
// @name         Github Issue copy-paste
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
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
            const issueTitle = $('.js-issue-title').eq(0).text();
            const formattedIssueName = issueTitle.replace(/[^a-zA-Z\d]+/g, '-').replace(/-/g, '-').replace(/^-+|-+$/g, '').toLocaleLowerCase()
            const issueNumber = $('.js-issue-title + span').eq(0).text().replace(/[^\d]/g, '');
            const projectPath = $('nav[aria-label="Page context"]').text().replace(/\s+/mg, '');
            const [organization, repository] = projectPath.split('/');

            const branchName = `fix/${issueNumber}-${formattedIssueName}`

            if (branchName && lastBranchName !== branchName) {
                $('#branch-name-suggestion').remove();
                $('.gh-header-meta').parent().append(`Branch name suggestion: <input type="text" value="${branchName}" readonly id="branch-name-suggestion" size="100">`);
                $('.gh-header-meta').parent().append(`<br>Commit message suggestion: <input type="text" value="fix($actorName): #${issueNumber} - ${issueTitle}" readonly id="branch-name-suggestion" size="100">`);
                $('.gh-header-meta').parent().append(`<br>DailyBot Report:<br>`
                                                     + `<div><code>`
                                                     + `<strong>${repository}</strong><br>`
                                                     + `• <a href="${location.href}">#${issueNumber} - ${issueTitle}</a>`
                                                     + `</code></div>`);
                lastBranchName = branchName;
            }
        }
    }, 1000)
})();
