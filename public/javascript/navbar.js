// Add event listeners for page load
document.addEventListener(constants.LOADED_PAGE_EVENT, createNavbar);
document.addEventListener(constants.LOADED_PAGE_EVENT, displayElement);

// Navigation functions
function navigateToLandingPage() {
    navigate.homePage();
}

function navigateToAdminPage() {
    navigate.adminPage();
}

function navigateToLoginPage() {
    navigate.loginPage();
}

function navigateToCreateAdPage() {
    navigate.createAdPage();
}

// Navbar creation function
function createNavbar() {
    const navbarHtml = `
        <div class="container">
            <div class="row">
                <div class="col-1  mt-4">
                    <a class="navbar-brand" href="#">
                        <img src="/images/navBar_image_better.png" alt="logo" class="img-fluid">
                    </a>
                </div>
                <div class="col-10">
                    <nav class="navbar bg-light border border-warning mt-3 ">
                        <div class="container">
                            <div class="d-flex align-items-center">
                                <div>
                                    <button class="btn btn-outline-warning" type="button" onclick="navigateToLandingPage()">Home</button>
                                    <button class="btn btn-outline-warning mx-1" id="loginButton" type="button" onclick="navigateToLoginPage()">Login</button>
                                    <button class="btn btn-outline-warning mx-1 d-none" id="logoutButton" type="button" onclick="onLogout()">Logout</button>
                                    <button class="btn btn-outline-warning d-none" type="button" id="adminButton" onclick="navigateToAdminPage()">View Pending Ads</button>
                                </div>
                            </div>
                            <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                <button class="btn btn-success rounded-circle" type="button" onclick="navigateToCreateAdPage()">+add</button>
                            </div>
                        </div>
                    </nav>
                </div>
                <div class="col-1"></div>
            </div>
        </div>
    `;
    document.body.innerHTML = navbarHtml + document.body.innerHTML;
}

// Logout function
function onLogout() {
    // Remove user session data and navigate to the landing page
    sessionStorage.removeItem(constants.session.LOGGED_IN_USER_SESSION_KEY);
    sessionStorage.removeItem(constants.session.ACCESS_TOKEN_SESSION_KEY);
    navigateToLandingPage();
}

// Function to conditionally display elements based on user role
function displayElement() {
    // Get references to DOM elements
    const logoutButton = getElementCached(constants.elementsIds.LOGOUT_BUTTON_ID);
    const loginButton = getElementCached(constants.elementsIds.LOGIN_BUTTON_ID);
    const adminButton = getElementCached(constants.elementsIds.ADMIN_BUTTON_ID);

    // Check if the user is an admin
    if (isAdmin) {
        // Show logout and admin buttons , hide login button
        loginButton.classList.add(constants.classNames.DISPLAY_CLASSNAME);
        logoutButton.classList.remove(constants.classNames.DISPLAY_CLASSNAME);
        adminButton.classList.remove(constants.classNames.DISPLAY_CLASSNAME);
    } else {
        // Show login button, hide logout and admin buttons
        logoutButton.classList.add(constants.classNames.DISPLAY_CLASSNAME);
        adminButton.classList.add(constants.classNames.DISPLAY_CLASSNAME);
        loginButton.classList.remove(constants.classNames.DISPLAY_CLASSNAME);
    }
}
