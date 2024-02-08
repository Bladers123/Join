const STORAGE_TOKEN = "HEBY7BJY7CQ0IQVYI4ONXU7EY6B8UWVM7BGO8RTP";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

async function setItem(key, value){
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload)}).then(response => response.json());
}

async function getItem(key){
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(response => response.json()).then(responseAsJson => responseAsJson.data.value);
}