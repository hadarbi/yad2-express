/**
 * Function to handle form submission when the "Login" button is clicked.
 */
async function onSubmit() {
    // Gather form input values
    const input = {
        title: getElementValue(constants.elementsIds.TITLE_ELEMENT_ID),
        desc: getElementValue(constants.elementsIds.DESCRIPTION_ELEMENT_ID),
        price: getElementValue(constants.elementsIds.PRICE_ELEMENT_ID),
        email: getElementValue(constants.elementsIds.EMAIL_ELEMENT_ID),
        phone: getElementValue(constants.elementsIds.PHONE_NUMBER_ELEMENT_ID),
    }

    // Validate form inputs
    const isValid = validateForm(input);

    // If form inputs are valid, proceed with form submission
    if (isValid) {
        // Display loading spinner
        displaySpinner();

        // Simulate a delay for 2 seconds
        await sleep(2);

        // Create ad via API and check for success
        const isSuccess = await createAdViaApi(input);

        // If ad creation is successful, display success message, save cookie, and navigate home
        if (isSuccess) {
            displayMessage();
            await sleep(2);
            saveLastPostInfoCookie(input.email);
            navigate.homePage();
        } else {
            // If ad creation fails, show API error message
            showApiErrorMessage();
        }
    }
}

/**
 * Function to create an ad via API.
 * @param {Object} adToCreate - Ad information to be created.
 * @returns {boolean} - Success state of the API request.
 */
async function createAdViaApi(adToCreate) {
    try {
        // Make API request to create ad
        const res = await sendApiRequest({
            url: getApiUrl.getAds(),
            method: 'POST',
            body: adToCreate,
        });

        // Check if ad creation was successful based on status code
        return res.status === 201;
    } catch (error) {
        // Handle unexpected errors during API request
        console.error('Error creating ad via API:', error);
        return false;
    }
}

/**
 * Save information about the last posted ad in a cookie.
 * @param {string} email - Email associated with the last posted ad.
 */
const saveLastPostInfoCookie = (email) => {
    const cname = constants.cookies.LAST_POST_INFO;
    const d = new Date(Date.now() + constants.cookies.COOKIE_EXP_DAYS * 24 * 60 * 60 * 1000);
    const data = {
        email,
        date: new Date().toDateString(),
    }
    const strigifiedData = JSON.stringify(data);
    document.cookie = `${cname}=${strigifiedData}; expires=${d.toUTCString()}; path=/`;
};

/**
 * Function to validate form inputs.
 * @param {Object} input - Form input values.
 * @returns {boolean} - Validity state of the form.
 */
function validateForm(input) {
    // Clear existing form validation states
    clearFormValidation();

    let isValid = true;

    // Check title length
    if (input.title.length <= constants.validation.MIN_LENGTH || input.title.length > constants.validation.TITLE_MAX_CHAR) {
        isValid = false;
        setInputValidState(constants.elementsIds.TITLE_ELEMENT_ID, false);
    }

    // Check description length
    if (input.desc > constants.validation.DESCRIPTION_MAX_CHAR) {
        isValid = false;
        setInputValidState(constants.elementsIds.DESCRIPTION_ELEMENT_ID, false);
    }

    // Check price
    if (input.price <= constants.validation.MIN_PRICE) {
        isValid = false;
        setInputValidState(constants.elementsIds.PRICE_ELEMENT_ID, false);
    }

    // Check email format
    if (!constants.validation.EMAIL_REGEX_PATTERN.test(input.email)) {
        isValid = false;
        setInputValidState(constants.elementsIds.EMAIL_ELEMENT_ID, false);
    }

    // Check phone number format
    if (!constants.validation.PHONE_NUMBER_REGEX_PATTERN.test(input.phone) && input.phone.length > constants.validation.MIN_LENGTH) {
        isValid = false;
        setInputValidState(constants.elementsIds.PHONE_NUMBER_ELEMENT_ID, false);
    }

    return isValid;
}

/**
 * Function to clear form validation states.
 */
function clearFormValidation() {
    const inputsIds = [
        constants.elementsIds.TITLE_ELEMENT_ID,
        constants.elementsIds.DESCRIPTION_ELEMENT_ID,
        constants.elementsIds.PRICE_ELEMENT_ID,
        constants.elementsIds.EMAIL_ELEMENT_ID,
        constants.elementsIds.PHONE_NUMBER_ELEMENT_ID
    ];

    // Reset validation state for each form input
    inputsIds.forEach(key => {
        setInputValidState(key, true);
    })
}

/**
 * Function to display a loading spinner during form submission.
 */
function displaySpinner() {
    const spinnerForAdCreate = getElementCached(constants.elementsIds.AD_FORM_SPINNER_ID);
    const adForm = getElementCached(constants.elementsIds.AD_FORM_ID);

    // Show loading spinner and hide the ad form
    spinnerForAdCreate.classList.remove(constants.classNames.DISPLAY_CLASSNAME);
    adForm.classList.add(constants.classNames.DISPLAY_CLASSNAME);
}

/**
 * Function to display a success message after ad creation.
 */
function displayMessage() {
    const AdCreationApproval = getElementCached(constants.texts.AD_APPROVAL_MESSAGE);
    const spinnerForAdCreate = getElementCached(constants.elementsIds.AD_FORM_SPINNER_ID);

    // Show success message and hide the loading spinner
    AdCreationApproval.classList.remove(constants.classNames.DISPLAY_CLASSNAME);
    spinnerForAdCreate.classList.add(constants.classNames.DIS);
}