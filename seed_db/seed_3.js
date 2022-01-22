let db;

let request = window.indexedDB.open('seedDB_autoincrement', 1);
request.onupgradeneeded = function(event) {
    // handle the upgradeneeded event
    db = event.target.result;
    db.createObjectStore('packets', {keyPath:"pktId", autoIncrement: true});
};

request.onsuccess = function(event) {
    db = event.target.result;
    db.onerror = function(event) {
        // Generic error handler for all errors targeted at this database's requests!
        console.error("Database error: " + event.target.errorCode);
      };
    
    let transaction = db.transaction('packets', 'readwrite');
    let store = transaction.objectStore('packets');
    store.put({
        metadata: {
            name: ""
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
            name: ""
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
            name: ""
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
            name: ""
            ,recordtype: "seedpacket"
            ,QRcode:""
        }
        ,variety: "Carrots"
        ,store: "Coldroom"
        ,weight: 5
        ,tag: ["vegetable"]
    });
    store.put({
        metadata: {
            name: ""
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
            name: ""
            ,recordtype: "Seed Groups"
            ,QRcode:""
        }
        ,seedGroups: ["Vegetables", "Flowers", "Herbs", "Fruits"]
        ,description: "Groups for all the seeds kept"
        ,tag: ["groups"]
    });
    transaction.oncomplete = ()=>{
        db.close();
    }

}