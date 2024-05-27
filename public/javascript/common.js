// Base API URL
const BASE_API_URL = 'http://localhost:3000';

/**
 * Constants object containing various configurations and settings.
 */
const constants = {
    LOADED_PAGE_EVENT: "DOMContentLoaded",
    urls: {
        HOME_PAGE: '/',
        ADMIN_PAGE: '/admin',
        LOGIN_PAGE: '/login',
        CREATE_AD_PAGE: '/createAd',
    },
    session: {
        LOGGED_IN_USER_SESSION_KEY: 'loggedInUser',
        ACCESS_TOKEN_SESSION_KEY: 'accessToken',
    },
    cookies: {
        LAST_POST_INFO: "LAST_POST_INFO",
        COOKIE_EXP_DAYS: 10,
    },
    classNames: {
        INPUT_INVALID_CLASSNAME: "is-invalid",
        DISPLAY_CLASSNAME: "d-none",
    },
    validation: {
        DESCRIPTION_MAX_CHAR: 200,
        TITLE_MAX_CHAR: 20,
        MIN_LENGTH: 0,
        MIN_PRICE: 0,
        EMAIL_REGEX_PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        PHONE_NUMBER_REGEX_PATTERN: /^\d{2,3}-\d{7}$/,
    },
    texts: {
        AD_APPROVAL_MESSAGE: "AdCreationApproval",
    },
    elementsIds: {
        // Login
        USERNAME_ELEMENT_ID: "UsernameInput",
        PASSWORD_ELEMENT_ID: "PasswordInput",
        FORM_ELEMENT_ID: "Form",
        LOGIN_FORM_ID: "loginForm",
        LOGIN_ERROR_MESSAGE_ID: "loginErrorMessage",
        LOGIN_FORM_SPINNER_ID: "spinnerForLoginForm",

        // Show Ads List
        ADS_CONTAINER_ID: "showAds",
        SEARCH_INPUT_ID: "searchInput",

        // Navbar
        LOGIN_BUTTON_ID: "loginButton",
        LOGOUT_BUTTON_ID: "logoutButton",
        ADMIN_BUTTON_ID: "adminButton",

        // Create Ad
        TITLE_ELEMENT_ID: "AdTitle",
        DESCRIPTION_ELEMENT_ID: "AdDescription",
        PRICE_ELEMENT_ID: "AdPrice",
        EMAIL_ELEMENT_ID: "Email",
        PHONE_NUMBER_ELEMENT_ID: "PhoneNumber",
        FORM_ELEMENT_ID: "Form",
        AD_FORM_SPINNER_ID: "spinnerForAdCreate",
        AD_FORM_ID: "adForm",
    }
}

/**
 * Navigation functions to redirect to different pages.
 */
const navigate = {
    homePage: () => { window.location.href = constants.urls.HOME_PAGE; },
    adminPage: () => { window.location.href = constants.urls.ADMIN_PAGE; },
    loginPage: () => { window.location.href = constants.urls.LOGIN_PAGE; },
    createAdPage: () => { window.location.href = constants.urls.CREATE_AD_PAGE; },
}

/**
 * Object containing functions to generate API URLs.
 */
const getApiUrl = {
    getAds: (searchValue = '') => {
        let url = `${BASE_API_URL}/ads`
        url += `?titleSearch=${searchValue}`
        if (!isInAdminPage) {
            url += `&approved=true`
        }
        return url;
    },
    approveAd: (id) => `${BASE_API_URL}/ads/${id}/approve`,
    deleteAd: (id) => `${BASE_API_URL}/ads/${id}`,
    login: () => `${BASE_API_URL}/users/login`,
}

// Detect if the current page is the admin page
const isInAdminPage = window.location.pathname === '/admin';

// Check if the user is an admin by looking at the session storage
const isAdmin = JSON.parse(sessionStorage.getItem(constants.session.LOGGED_IN_USER_SESSION_KEY) || '{}').isAdmin === true;

// Cached API results and elements
const cachedApiResults = {};
const cachedElements = {};

/**
 * Function to send API requests with basic caching logic.
 * @param {Object} options - Options for the API request.
 * @param {string} options.url - API URL.
 * @param {string} options.method - HTTP method.
 * @param {Object} options.body - Request body.
 * @returns {Promise<Response>} - API response.
 */
const sendApiRequest = async ({ url, method, body }) => {
    if (!cachedApiResults[`${method}-${url}`]) {
        const accessToken = sessionStorage.getItem(constants.session.ACCESS_TOKEN_SESSION_KEY);
        const options = {
            method,
            headers: {
                Authorization: accessToken,
                "Content-Type": "application/json",
            }
        }
        if (body) {
            options.body = JSON.stringify(body)
        }
        cachedApiResults[url] = await fetch(url, options);
    }
    return cachedApiResults[url];
}

/**
 * Function to get a DOM element with caching.
 * @param {string} elementId - ID of the DOM element.
 * @returns {HTMLElement} - DOM element.
 */
const getElementCached = (elementId) => {
    if (!cachedElements[elementId]) {
        cachedElements[elementId] = document.getElementById(elementId);
    }

    return cachedElements[elementId];
}

/**
 * Function to get the trimmed value of a form element.
 * @param {string} elementId - ID of the form element.
 * @returns {string} - Trimmed value of the form element.
 */
const getElementValue = (elementId) => {
    return getElementCached(elementId).value.trim();
}

/**
 * Function to introduce a delay using a promise.
 * @param {number} secondsToSleep - Number of seconds to sleep.
 * @returns {Promise<void>} - Promise resolved after sleeping.
 */
const sleep = async (secondsToSleep) => {
    return await new Promise(resolve => setTimeout(resolve, secondsToSleep * 1000));
}

/**
 * Function to set the validity state of an input element.
 * @param {string} elementId - ID of the form element.
 * @param {boolean} isValid - Validity state.
 */
function setInputValidState(elementId, isValid) {
    const element = getElementCached(elementId);
    if (isValid) {
        element.classList.remove(constants.classNames.INPUT_INVALID_CLASSNAME);
    } else {
        element.classList.add(constants.classNames.INPUT_INVALID_CLASSNAME);
    }
}

/**
 * Function to display an API error message.
 */
const showApiErrorMessage = () => {
    window.alert('Something went wrong.. please try again later');
}
