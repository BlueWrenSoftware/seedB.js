

let request = window.indexedDB.open('seedDB_autoincrement', 1);
request.onupgradeneeded = event=>{
    // handle the upgradeneeded event
    let db = event.target.result;
    db.createObjectStore('packets', 
        {autoIncrement: true}
    );
}
request.onsuccess = event=>{
    let db = event.target.result;
    db.onerror = error=>{
        console.log(error);
    }
    let transaction = db.transaction('packets', 'readwrite');
    let store = transaction.objectStore('packets');
    store.put({
        name: "",
        recordtype: "seedpacket",
        variety: "Curly Kale"
        ,store: "Coldroom"
        ,weight: 20
        ,tag: []
    });
    store.put({
       variety: "Curly Kale"
        ,store: "Coldroom"
        ,weight: 4
        ,tag: []
    });
    store.put({
        variety: "Carrots"
        ,store: "Coldroom"
        ,weight: 10
        ,tag: ["vegetable","Potting Shed"]
    });
    store.put({
        variety: "Carrots"
        ,store: "Coldroom"
        ,weight: 5
        ,tag: ["vegetable"]
    });
    store.put({
        variety: "Tulips"
        ,store: "Coldroom"
        ,weight: 100
        ,number: 100
        ,tag: ["flower"]
    });
    transaction.oncomplete = ()=>{
        db.close();
    }

}