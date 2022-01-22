let request = window.indexedDB.open('seedDB', 1);
request.onupgradeneeded = event=>{
    // handle the upgradeneeded event
    let db = event.target.result;
    db.createObjectStore('seedData', {
        keyPath: 'seedobjectid'
    });
}
request.onsuccess = event=>{
    let db = event.target.result;
    db.onerror = error=>{
        console.log(error);
    }
    let transaction = db.transaction('seedData', 'readwrite');
    let store = transaction.objectStore('seedData');
    store.put({
        seedobjectid: "seedgroup_Vegetables", 
        name: "Vegetables",
        recordtype: "seedgroup"
    });
    store.put({
        seedobjectid: "variety_CurlyKale", 
        name: "CurlyKale",
        recordtype: "variety", 
        seedgroup: "Vegetables"
    });
    store.put({
        seedobjectid: "seedpacket_1", 
        name: "1",
        recordtype: "seedpacket", 
        variety: "variety_CurlyKale",
        weight: 120
    });
    transaction.oncomplete = ()=>{
        db.close();
    }

}