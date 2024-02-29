/**
 * Constant token for storage access authorization.
 * @type {string}
 */
const STORAGE_TOKEN = "HEBY7BJY7CQ0IQVYI4ONXU7EY6B8UWVM7BGO8RTP";

/**
 * Base URL of the remote storage API.
 * @type {string}
 */
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

/**
 * Asynchronously stores a key-value pair in remote storage.
 * The data is sent as a JSON payload in a POST request to the storage API.
 *
 * @param {string} key - The key under which the value is stored.
 * @param {string|object} value - The value to store, which can be a string or any object (object must be serializable to JSON).
 * @returns {Promise<object>} A promise that resolves with the response from the storage API.
 * @async
 * @example
 * await setItem('user', JSON.stringify({ name: 'Jane Doe', email: 'jane.doe@example.com' }));
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    try {
        return fetch(STORAGE_URL, { method: "POST", body: JSON.stringify(payload) }).then((response) => response.json());
    } catch (error) {
        console.error("Fehler beim Setzen des Items:", error);
    }
}

/**
 * Asynchronously retrieves the value associated with a given key from remote storage.
 * The request is made by appending the key and token as query parameters to the GET request.
 *
 * @param {string} key - The key for which to retrieve the associated value.
 * @returns {Promise<string|object>} A promise that resolves with the value associated with the specified key.
 * @async
 * @example
 * const user = await getItem('user');
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    try {
        return fetch(url)
            .then((response) => response.json())
            .then((responseAsJson) => responseAsJson.data.value);
    } catch (error) {
        console.error("Fehler beim Abrufen des Items:", error);
    }
}
