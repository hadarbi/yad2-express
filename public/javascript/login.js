/**
 * Handles the login process.
 */
async function onLogin() {
    // Get user input from form elements
    const userInput = {
        username: getElementValue(constants.elementsIds.USERNAME_ELEMENT_ID),
        password: getElementValue(constants.elementsIds.PASSWORD_ELEMENT_ID),
    };

    // Validate the form input
    const isValid = validateForm(userInput);

    if (isValid) {
        // Attempt to log in via API
        const result = await loginViaAPI(userInput);
        const isUserExists = result.status === 201;

        if (isUserExists) {
            // Display spinner during login process
            displaySpinner();

            // Simulate a delay for 2 seconds
            await sleep(2);

            // Extract user and access token from the API response
            result.json().then((res) => {
                const { user, accessToken } = res;

                // Store user and access token in session storage
                sessionStorage.setItem(constants.session.LOGGED_IN_USER_SESSION_KEY, JSON.stringify(user));
                sessionStorage.setItem(constants.session.ACCESS_TOKEN_SESSION_KEY, accessToken);
            });

            // Navigate to the admin page upon successful login
            navigate.adminPage();
        } else {
            // Display login error message if login attempt fails
            displayLoginErrorMessage();
        }
    }
}

/**
 * Initiates a login request via API.
 * @param {Object} userInput - User input with username and password.
 * @returns {Promise<Response>} - Result of the API request.
 */
function loginViaAPI(userInput) {
    return sendApiRequest({
        url: getApiUrl.login(),
        method: 'POST',
        body: userInput,
    });
}

/**
 * Validates form inputs.
 * @param {Object} userInput - User input with username and password.
 * @returns {boolean} - Validity state of the form.
 */
function validateForm(userInput) {
    // Function to validate Form inputs
    clearFormValidation();

    let isValid = true;

    // Check if all values are filled

    if (!userInput.username) {
        isValid = false;
        setInputValidState(constants.elementsIds.USERNAME_ELEMENT_ID, false);
    }
    if (!userInput.password) {
        isValid = false;
        setInputValidState(constants.elementsIds.PASSWORD_ELEMENT_ID, false);
    }
    return isValid;
}

/**
 * Clears form validation states.
 */
function clearFormValidation() {
    // Function to clear form validation states
    const inputIds = [constants.elementsIds.PASSWORD_ELEMENT_ID, constants.elementsIds.USERNAME_ELEMENT_ID];
    inputIds.forEach(key => {
        setInputValidState(key, true);
    });
}

/**
 * Displays a spinner during login.
 */
function displaySpinner() {
    const spinnerForLoginForm = getElementCached(constants.elementsIds.LOGIN_FORM_SPINNER_ID);
    const loginForm = getElementCached(constants.elementsIds.LOGIN_FORM_ID);

    // Show spinner and hide the login form
    spinnerForLoginForm.classList.remove(constants.classNames.DISPLAY_CLASSNAME);
    loginForm.classList.add(constants.classNames.DISPLAY_CLASSNAME);
}

/**
 * Displays a login error message.
 */
function displayLoginErrorMessage() {
    const loginErrorMessage = getElementCached(constants.elementsIds.LOGIN_ERROR_MESSAGE_ID);
    loginErrorMessage.classList.remove(constants.classNames.DISPLAY_CLASSNAME);
}
