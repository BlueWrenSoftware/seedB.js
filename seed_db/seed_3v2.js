// Create IndexedDB schema with db name seedB_3
// Implement version 3 as the current version
let request = window.indexedDB.open('seedB_3', 3);
request.onupgradeneeded = function (event) {
    let db = event.target.result;
    db.onerror = function(event) {
        console.error('Database error: ' + event.target.errorCode);
    };
    if (event.oldVersion < 1) {
        // Create schema if db does not exist
        let store = db.createObjectStore('entity', { keyPath: 'Id', autoIncrement: true });
        store.createIndex('variety', 'variety', { unique: false });
        store.createIndex('store', 'store', { unique: false });
        store.createIndex('seedGroup', 'metadata.group', { unique: false });
    };
    if (event.oldVersion < 2) {
        // Create an additional key on objectStore created in version 1
        request.transaction.objectStore('entity').createIndex('recordType', 'metadata.recordtype');
    };
};

// Create data for db
request.onsuccess = function(event) {
    db = event.target.result;
    db.onerror = function(event) {
        // Generic error handler for all errors targeted at this database's requests!
        console.error("Database error: " + event.target.errorCode);
      };
    
    let transaction = db.transaction('entity', 'readwrite');
    let store = transaction.objectStore('entity');
    store.put({
        metadata: {
            group: "Vegetables"
            ,recordtype: "seedpacket"
            ,ORcode: ""
        }
        ,variety: "Curly Kale"
        ,store: "Coldroom"
        ,weight: 20
        ,tag: []
    });
    store.put({
        metadata: {
            group: "Vegetables"
            ,recordtype: "seedpacket"
            ,QRcode: ""
        }
       ,variety: "Curly Kale"
        ,store: "Coldroom"
        ,weight: 4
        ,tag: []
    });
    store.put({
        metadata: {
            group: "Vegetables"
            ,recordtype: "seedpacket"
            ,QRcode:""
        }
        ,variety: "Carrots"
        ,store: "Coldroom"
        ,weight: 10
        ,tag: ["vegetable","Potting Shed"]
    });
    store.put({
        metadata: {
            group: "Vegetables"
            ,recordtype: "seed packet"
            ,QRcode:""
        }
        ,variety: "Carrots"
        ,store: "Coldroom"
        ,weight: 5
        ,tag: ["vegetable"]
    });
    store.put({
        metadata: {
            group: "Bulbs"
            ,recordtype: "bulbs"
            ,QRcode:""
        }
        ,variety: "Tulips"
        ,store: "Coldroom"
        ,weight: 100
        ,number: 100
        ,tag: ["flower"]
    });
    store.put({
        metadata: {
            group: "seeds"
            ,recordtype: "seed group"
            ,QRcode:""
        }
        ,seedGroup: "Vegetables"
        ,description: "Groups for all the seeds kept"
        ,tag: [""]
    });
    transaction.oncomplete = ()=>{
        db.close();
    }

};