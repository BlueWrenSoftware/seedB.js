// Create data for db version 1. However:
// seed_3v2.js will create db version 3 and the data
let db;
let request = window.indexedDB.open('seedB_3', 1);
request.onupgradeneeded = function(event) {
    // handle the upgradeneeded event
    db = event.target.result;
    //db.createObjectStore('packets', {keyPath:"Id", autoIncrement: true});
};

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