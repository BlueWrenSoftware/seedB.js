

let request = window.indexedDB.open('seedDB_tag', 1);
request.onupgradeneeded = event=>{
    // handle the upgradeneeded event
    let db = event.target.result;
    db.createObjectStore('packets', {
        keyPath: 'packetid'
    });
}
request.onsuccess = event=>{
    let db = event.target.result;
    db.onerror = error=>{
        console.log(error);
    }
    let transaction = db.transaction('packets', 'readwrite');
    let store = transaction.objectStore('packets');
    store.put({
        packetid: 1
        ,variety: "Curly Kale"
        ,store: "Coldroom"
        ,weight: 20
        ,tag: []
    });
    store.put({
        packetid: 2
        ,variety: "Curly Kale"
        ,store: "Coldroom"
        ,weight: 4
        ,tag: []
    });
    store.put({
        packetid: 3
        ,variety: "Carrots"
        ,store: "Coldroom"
        ,weight: 10
        ,tag: ["vegetable","Potting Shed"]
    });
    store.put({
        packetid: 4
        ,variety: "Carrots"
        ,store: "Coldroom"
        ,weight: 5
        ,tag: ["vegetable"]
    });
    store.put({
        packetid: 5
        ,variety: "Tulips"
        ,store: "Coldroom"
        ,weight: 100
        ,number: 100
        ,tag: ["flower"]
    });
    transaction.oncomplete = ()=>{
        db.close();
    }

}