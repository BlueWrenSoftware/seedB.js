// Update object with Id = 1 in objectStore
// Use only in version 3
let db;
let request = window.indexedDB.open('seedB_3', 3);
request.onupgradeneeded = function(event) {
    // handle the upgradeneeded event
    db = event.target.result;
};    
request.onsuccess = function(event) {
    db = event.target.result;
    db.onerror = function(error) {
        // Generic error handler for all errors targeted at this database's requests!
        console.log(error)//("Database error: " + event.target.errorCode);
    };
    
    let transaction = db.transaction('entity', 'readwrite');
    let store = transaction.objectStore('entity');
    store.put({
        metadata: {
            name: ""
            ,recordtype: "seedpacket"
            ,ORcode: ""
        }
        ,Id : 1
        ,variety: "Curly Kale"
        ,store: "Coldroom"
        ,weight: 500
        ,tag: []
    });
    
    transaction.oncomplete = function() {
        db.close();
    };
};