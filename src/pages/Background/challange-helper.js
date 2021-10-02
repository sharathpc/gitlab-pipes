function dec2hex(dec) {
    return ("0" + dec.toString(16)).substr(-2);
}

function sha256(plain) {
    let encoder = new TextEncoder();
    let data = encoder.encode(plain);
    return crypto.subtle.digest("SHA-256", data);
}

function base64urlencode(a) {
    let str = "";
    let bytes = new Uint8Array(a);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        str += String.fromCharCode(bytes[i]);
    }
    return btoa(str)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

export function generateCodeVerifier() {
    let array = new Uint32Array(56 / 2);
    crypto.getRandomValues(array);
    return Array.from(array, dec2hex).join("");
}

export async function generateCodeChallengeFromVerifier(v) {
    let hashed = await sha256(v);
    let base64encoded = base64urlencode(hashed);
    return base64encoded;
}

export default { generateCodeVerifier, generateCodeChallengeFromVerifier }