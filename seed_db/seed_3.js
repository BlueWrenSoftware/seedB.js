// Create IndexedDB schema with db name seedB_3

let db;

let request = window.indexedDB.open('seedB_3', 1);
request.onupgradeneeded = function(event) {
    // handle the upgradeneeded event
    db = event.target.result;
    db.createObjectStore('entity', {keyPath:"Id", autoIncrement: true});
    db.onerror = function(event) {
        // Generic error handler for all errors targeted at this database's requests!
        console.error("Database error: " + event.target.errorCode);
      };
    db.close()
};