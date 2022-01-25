// Create IndexedDB schema with db name seedB_3
// Only create version 1 or instead:
// Can use seed_3v2.js to create all three version and populate with data
let db;
let request = window.indexedDB.open('seedB_3', 1);
request.onupgradeneeded = function(event) {
    // handle the upgradeneeded event
    db = event.target.result;
    let store = db.createObjectStore('entity', {keyPath:"Id", autoIncrement: true});
    store.createIndex("variety", "variety", {unique: false});
    store.createIndex("store", "store", {unique: false});
    store.createIndex("seedGroup", "metadata.group", {unique: false});
    db.onerror = function(event) {
        // Generic error handler for all errors targeted at this database's requests!
        console.error("Database error: " + event.target.errorCode);
      };
    db.close()
};