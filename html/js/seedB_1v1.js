// Create IndexedDB schema based on seedB_3
// Implement version 3 as the current version
let request = window.indexedDB.open('seedB-test-1', 1);
request.onupgradeneeded = function (event) {
  let db = event.target.result; 
  db.onerror = function (event) {
    console.error('Database error: ' + event.target.errorCode);
  };
  if (event.oldVersion < 1) {
    // Create schema if db does not exist
    let store = db.createObjectStore('entity', { keyPath: 'Id', autoIncrement: true });
    store.createIndex('variety', 'variety', { unique: false });
    store.createIndex('store', 'store', { unique: false });
    store.createIndex('seedGroup', 'seedGroup', { unique: false });
    store.createIndex('recordType', 'recordType', { unique: false });
  };
};

// Create data for db
request.onsuccess = function (event) {
  db = event.target.result;
  db.onerror = function (event) {
    // Generic error handler for all errors targeted at this database's requests!
    console.error("Database error: " + event.target.errorCode);
  };

  let transaction = db.transaction('entity', 'readwrite');
  let store = transaction.objectStore('entity');
  store.put({
    seedGroup: "Vegetables"
    , recordType: "seedpacket"
    , ORcode: ""
    , variety: "Curly Kale"
    , store: "Coldroom"
    , seedWeight: 20
    , seedNumber: null
    , tag: []
  });
  store.put({
    seedGroup: "Vegetables"
    , recordType: "seedpacket"
    , ORcode: ""
    , variety: "Curly Kale"
    , store: "Coldroom"
    , seedWeight: 30
    , seedNumber: 100
    , tag: []
  }); 
  store.put({
    seedGroup: "Vegetables"
    , recordType: "seedpacket"
    , ORcode: ""
    , variety: "Carrots"
    , store: "Coldroom"
    , seedWeight: null
    , seedNumber: 1000
    , tag: []
  });  
  transaction.oncomplete = () => {
    db.close();
  }

};