(async () => {
    let storageCache = {};

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        chrome.storage.local.get(null, (items) => {
            storageCache = { ...items };
            if (storageCache.token || request.token) {
                switch (request.action) {
                    case 'token': {
                        authenticateUser(
                            storageCache.baseURL,
                            storageCache.token,
                            sendResponse
                        );
                        break;
                    }
                    case 'login': {
                        authenticateUser(
                            request.baseURL,
                            request.token,
                            sendResponse
                        );
                        break;
                    }
                    case 'credentials': {
                        sendResponse({
                            status: true,
                            ...storageCache
                        });
                        break;
                    }
                }
            } else {
                sendResponse({
                    status: false,
                    message: 'No Credentials'
                });
            }
        })
        return true;
    });

    function authenticateUser(baseURL, token, sendResponse) {
        fetch(`${baseURL}/api/v4/user?private_token=${token}`, {
            method: 'GET'
        })
            .then(response => {
                if (response.status !== 200) {
                    chrome.storage.local.clear();
                    throw 'Invalid credentials';
                } else {
                    storageCache = { token, baseURL };
                    chrome.storage.local.set(storageCache);
                    sendResponse({
                        status: true,
                        ...storageCache
                    });
                }
            })
            .catch(error =>
                sendResponse({
                    status: false,
                    message: error
                })
            );
    }
})();