// ==UserScript==
// @name         Github Issue copy-paste
// @namespace    http://tampermonkey.net/
// @version      0.1
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
        const issueTitle = $('.js-issue-title').eq(0).text();
        const formattedIssueName = issueTitle.replace(/[^a-zA-Z\d]+/g, '-').replace(/-/g, '-').replace(/^-+|-+$/g, '').toLocaleLowerCase()
        const issueNumber = $('.js-issue-title + span').eq(0).text().replace(/[^\d]/g, '');

        const branchName = `fix/${issueNumber}-${formattedIssueName}`

        if (branchName && lastBranchName !== branchName) {
            $('#branch-name-suggestion').remove();
            $('.gh-header-meta').parent().append(`Branch name suggestion: <input type="text" value="${branchName}" readonly id="branch-name-suggestion" size="100">`);
            lastBranchName = branchName;
        }
    }, 1000)
})();
