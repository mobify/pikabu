
module.exports = {
    'setUp': function(browser) {
        browser.get('http://localhost:3000').waitForPageToBeMobified();
    },

    'Header test': function(browser) {
        // Resuable component tests go here
        // Change to the selector for your header
        browser
            .verify.elementPresent('body')
            .end();
    }
}
