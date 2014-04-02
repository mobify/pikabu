
module.exports = {
    'setUp': function(browser) {
        browser.get('http://localhost:3000').waitForPageToBeMobified();
    },

    'Primary sidebar test': function(browser) {
        // Workflows such as a shopping cart checkout go here
        browser
            .verify.elementPresent('.m-pikabu-left')
            .end();
    }
}
