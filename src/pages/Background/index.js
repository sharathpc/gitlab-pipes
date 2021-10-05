import { generateCodeVerifier, generateCodeChallengeFromVerifier } from './challange-helper';

(async () => {
    //saras
    const BASE_URL = 'https://gitlab.sarasanalytics.com';
    const CLIENT_ID = encodeURIComponent('3a6044c50a6f459cee50a78444e1330f1f5b2b6b81bebe64d3e5d80bbd0e8a1f');
    const CLIENT_SECRET = encodeURIComponent('b0cff03bc795a3824745f2793cb6a1f78dac3103867d518b323a23d77975d3e4');

    const REDIRECT_URI = encodeURIComponent(chrome.identity.getRedirectURL());
    const RESPONSE_TYPE = encodeURIComponent('code');
    const STATE = encodeURIComponent(`meet${Math.random().toString(36).substring(2, 15)}`);
    const SCOPE = encodeURIComponent('openid read_api');
    const CODE_VERIFIER = generateCodeVerifier();
    const CODE_CHALLENGE = await generateCodeChallengeFromVerifier(CODE_VERIFIER);
    const CODE_CHALLENGE_METHOD = encodeURIComponent('S256');

    function create_auth_endpoint() {
        return `${BASE_URL}/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&state=${STATE}&scope=${SCOPE}&code_challenge=${CODE_CHALLENGE}&code_challenge_method=${CODE_CHALLENGE_METHOD}`;
    }

    function create_token_endpoint(code) {
        const GRANT_TYPE = encodeURIComponent('authorization_code');
        return `${BASE_URL}/oauth/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${code}&grant_type=${GRANT_TYPE}&redirect_uri=${REDIRECT_URI}&code_verifier=${CODE_VERIFIER}`;
    }

    function refresh_token_endpoint(refreshToken) {
        const GRANT_TYPE = encodeURIComponent('refresh_token');
        return `${BASE_URL}/oauth/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&refresh_token=${refreshToken}&grant_type=${GRANT_TYPE}&redirect_uri=${REDIRECT_URI}&code_verifier=${CODE_VERIFIER}`;
    }

    let storageCache = {};

    function is_user_signed_in() {
        return storageCache.user_signed_in && storageCache.token_data && tokenValid(storageCache.token_data);
    }

    function tokenValid(token = {}) {
        const now = Date.now() / 1000;
        const expiry = token.created_at + token.expires_in;
        return now < expiry;
    }

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        chrome.storage.local.get(null, (items) => {
            storageCache = { ...items };
            switch (request.action) {
                case 'token': {
                    //setTimeout(() => {
                    if (is_user_signed_in()) {
                        sendResponse({
                            status: true,
                            token: storageCache.token_data.access_token,
                            baseUrl: BASE_URL
                        })
                    } else {
                        sendResponse({ status: false, token: null });
                    }
                    //}, 1000)
                    break;
                }
                case 'login': {
                    is_user_signed_in() ? sendResponse({
                        status: true,
                        token: storageCache.token_data.access_token
                    }) : authenticateUser(sendResponse);
                    break;
                }
                case 'refresh': {
                    fetch(refresh_token_endpoint(storageCache.token_data.refresh_token), {
                        method: 'POST'
                    })
                        .then(response => response.json())
                        .then(jsondata => {
                            if (jsondata.error === 'invalid_grant') {
                                authenticateUser(sendResponse);
                            } else {
                                storageCache = {
                                    user_signed_in: true,
                                    token_data: jsondata
                                }
                                chrome.storage.local.set(storageCache);
                                sendResponse({
                                    status: true,
                                    token: storageCache.token_data.access_token,
                                    baseUrl: BASE_URL
                                });
                            }
                        })
                        .catch(err => console.log(err));
                    break;
                }
                case 'logout': {
                    logoutUser();
                    sendResponse({ status: true });
                    break;
                }
            }
        })
        return true;
    });

    function authenticateUser(sendResponse) {
        chrome.identity.launchWebAuthFlow({
            'url': create_auth_endpoint(),
            'interactive': true
        }, (redirect_url) => {
            if (chrome.runtime.lastError) {
                sendResponse({ status: false, error: chrome.runtime.lastError });
            } else {
                const redirectUrlParams = new URL(redirect_url).searchParams;
                fetch(create_token_endpoint(redirectUrlParams.get('code')), {
                    method: 'POST'
                })
                    .then(response => response.json())
                    .then(jsondata => {
                        storageCache = {
                            user_signed_in: true,
                            token_data: jsondata
                        }
                        chrome.storage.local.set(storageCache);
                        //setTimeout(() => {
                        sendResponse({
                            status: true,
                            token: storageCache.token_data.access_token,
                            baseUrl: BASE_URL
                        });
                        //}, 5000)
                    })
                    .catch(err => console.log(err));
            }
        });
    }

    function logoutUser() {
        storageCache = {};
        chrome.storage.local.set({
            user_signed_in: false,
            token_data: null
        });
    }
})();