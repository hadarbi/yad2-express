// Add event listener for page load
document.addEventListener(constants.LOADED_PAGE_EVENT, onPageLoad);

/**
 * Function executed on page load.
 */
function onPageLoad() {
    // Retrieve last post information from the cookie
    const lastPostInfo = getCookie(constants.cookies.LAST_POST_INFO);

    if (lastPostInfo) {
        // Parse the last post information
        const { email, date } = JSON.parse(lastPostInfo);

        // Create a new div element with a welcome message
        const newDiv = document.createElement("div");
        newDiv.innerHTML = `
            <div class="container text-center bg-body rounded-pill border border-warning p-3 mt-2 w-50 mb-5">
            Welcome back <b>${email}</b>, your previous ad was posted on <b>${date}</b> 
            </div>
        `;

        // Insert the new div element after the first child of the body
        document.body.insertBefore(newDiv, document.body.children[1]);
    }
}

/**
 * Function to get the value of a cookie by name.
 * @param {string} cname - Cookie name.
 * @returns {string} - Cookie value.
 */
const getCookie = cname => {
    return document.cookie
        .split("; ")
        .find(cookie => cookie.startsWith(cname + "="))
        ?.split("=")[1] || "";
};
