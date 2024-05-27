// Attach the showAds function to the LOADED_PAGE_EVENT
document.addEventListener(constants.LOADED_PAGE_EVENT, showAds);

/**
 * Fetches and displays ads based on the search input.
 */
async function showAds() {
    // Get the search input value
    const searchValue = getElementValue(constants.elementsIds.SEARCH_INPUT_ID);

    // Construct the API URL for fetching ads
    const url = getApiUrl.getAds(searchValue);

    // Send a GET request to the API
    const res = await sendApiRequest({ url, method: 'GET' });

    // Check if the request was successful
    if (!res.ok) {
        // Display an error message if the request failed
        showApiErrorMessage();
    }

    // Parse the JSON response
    const result = await res.json();

    // Generate HTML for each ad and append it to the ads container
    let allAdsHtml = "";
    result.forEach((ad) => {
        allAdsHtml += `
            <div class="col-md-4 mb-4 bg-light border border-warning" id="${ad.id}">
                <div class="container my-4 text-center">
                    <div> Title: ${ad.title} </div>
                    <div> Description: ${ad.desc} </div>
                    <div> Price: ${ad.price}</div>
                    <div> Contact number: ${ad.phone} </div>
                    <div> Contact email: ${ad.email}</div>
                    ${isAdmin && !ad.approved ? `<button id="${ad.id}-approve" class="btn btn-success mx-1 my-2" type="button" onclick=approveAdViaApi(${ad.id}) >Approve</button>` : ""}
                    ${isAdmin && !ad.approved ? `<button id="${ad.id}-delete" class="btn btn-danger mx-1 my-2" type="button" onclick=deleteAdViaApi(${ad.id}) > Delete</button > ` : ""}
                </div>
            </div>
        `;
    });

    // Get the ads container and update its HTML content
    const adsContainer = getElementCached(constants.elementsIds.ADS_CONTAINER_ID);
    adsContainer.innerHTML = allAdsHtml;
}

/**
 * Approve an ad via API and update the UI.
 * @param {number} id - The ID of the ad to be approved.
 */
async function approveAdViaApi(id) {
    // Send a POST request to approve the ad
    const res = await sendApiRequest({
        url: getApiUrl.approveAd(id),
        method: 'POST',
    });

    // Check if the request was successful
    if (res.ok) {
        // Remove the approve and delete buttons from the UI
        getElementCached(`${id}-approve`).remove();
        getElementCached(`${id}-delete`).remove();
    } else {
        // Display an error message if the request failed
        showApiErrorMessage();
    }
}

/**
 * Delete an ad via API and update the UI.
 * @param {number} id - The ID of the ad to be deleted.
 */
async function deleteAdViaApi(id) {
    // Send a DELETE request to delete the ad
    const res = await sendApiRequest({
        url: getApiUrl.deleteAd(id),
        method: 'DELETE',
    });

    // Check if the request was successful
    if (res.ok) {
        // Remove the ad element from the UI
        getElementCached(id).remove();
    } else {
        // Display an error message if the request failed
        showApiErrorMessage();
    }
}
