let db;

let request = window.indexedDB.open('seedDB_autoincrement', 1);
request.onupgradeneeded = function(event) {
    // handle the upgradeneeded event
    db = event.target.result;
    //db.createObjectStore('packets', {autoIncrement: true});
};
request.onsuccess = function(event) {
    db = event.target.result;
    db.onerror = function(error) {
        // Generic error handler for all errors targeted at this database's requests!
        console.log(error)//("Database error: " + event.target.errorCode);
      };
    
    let transaction = db.transaction('packets', 'readwrite');
    let store = transaction.objectStore('packets');
    store.put({
        metadata: {
            name: ""
            ,recordtype: "seedpacket"
            ,ORcode: ""
        }
        ,pktId : 1
        ,variety: "Curly Kale"
        ,store: "Coldroom"
        ,weight: 500
        ,tag: []
    });
    transaction.oncomplete = ()=>{
        db.close();
    }
}