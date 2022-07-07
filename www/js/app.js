// Seed Class: Represents a Seed Packet
class Seed {
  constructor(seedGroup, variety, pktId, seedNumbers, seedWeight, seedDatePacked, seedNotes, timeStamp) {
    this.seedGroup = seedGroup;
    this.variety = variety;
    this.pktId = pktId;
    this.seedNumbers = seedNumbers;
    this.seedWeight = seedWeight;
    this.seedDatePacked = seedDatePacked;
    this.seedNotes = seedNotes;
    this.timeStamp = timeStamp;
  }
}

// UI Class: Handle UI Tasks
class UI {

  // Delete rows first before entering updated data
  static displaySeeds(seedTable) {
      const table = document.querySelector('#seed-list');
    while (table.rows.length > 0) {
      table.deleteRow(0);
    };
    seedTable.forEach((row) => UI.addSeedToTable(row));
  }

  static addSeedToTable(seedPkt) {
    const list = document.querySelector('#seed-list');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${seedPkt.seedGroup}</td>
      <td>${seedPkt.variety}</td>
      <td>${seedPkt.pktId}</td>
      <td class="table-seeds__col--center">${(seedPkt.seedDatePacked).substring(2)}</td>
      <td class="table-seeds__col--center">${seedPkt.seedNumbers}</td>
      <td class="table-seeds__col--center">${seedPkt.seedWeight}</td>
      <td class="edit" onclick="editSeedPkt('${seedPkt.pktId}')"></td>
    `;
    list.appendChild(row);
  }

  static showAlert(message, className, idMessage, idLocation) {
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    const messages = document.querySelector(`${idMessage}`);
    const section = document.querySelector(`${idLocation}`);
    section.insertBefore(div, messages);
    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#seedGroup').value = '';
    document.querySelector('#variety').value = '';
    document.querySelector('#pktId').value = '';
    document.querySelector('#seedNumbers').value = '';
    document.querySelector('#seedWeight').value = '';
    document.querySelector('#seedDatePacked').value = '';
    document.querySelector('#timeStamp').value = '';
    document.querySelector('#seedNotes').value = '';

  }

  static selectPages(pageSelected) {
    if (pageSelected === "homePage") {
      loadData('variety');
      document.title = "SeedB Blue Wren";
      document.querySelector("#home-page").style.display = "";
      document.querySelector("#edit-page").style.display = "none";
      document.querySelector("#read-write-page").style.display = "none";
      document.querySelector("#instructions-page").style.display = "none";
    }
    else if (pageSelected === "editSeedPkt") {
      UI.clearFields();
      document.title = "Edit Seed Pkt";
      document.querySelector("#edit-pkt-buttons").style.display = "";
      document.querySelector("#new-pkt-buttons").style.display = "none";
      document.querySelector("#home-page").style.display = "none";
      document.querySelector("#edit-page").style.display = "";
      document.querySelector("#read-write-page").style.display = "none";
      document.querySelector("#instructions-page").style.display = "none";
    }
    else if (pageSelected === "newPktPage") {
      UI.clearFields();
      document.title = "New Seed Pkt";
      document.querySelector("#new-pkt-buttons").style.display = "";
      document.querySelector("#edit-pkt-buttons").style.display = "none";
      document.querySelector("#home-page").style.display = "none";
      document.querySelector("#edit-page").style.display = "";
      document.querySelector("#read-write-page").style.display = "none";
      document.querySelector("#instructions-page").style.display = "none";
      //document.querySelector("#dbError").style.display = "none"
    }
    else if (pageSelected === "readWritePage") {
      document.title = "Backup";
      document.querySelector("#js-db-error").style.display = "none";
      document.querySelector("#retrieve-data-button").style.display = "";
      document.querySelector("#home-page").style.display = "none";
      document.querySelector("#edit-page").style.display = "none";
      document.querySelector("#read-write-page").style.display = "";
      document.querySelector("#instructions-page").style.display = "none";
      //document.querySelector("#dbError").style.display = "none"
    }
    else if (pageSelected === "instructionsPage") {
      document.title = "Instructions";
      document.querySelector("#home-page").style.display = "none";
      document.querySelector("#edit-page").style.display = "none";
      document.querySelector("#read-write-page").style.display = "none";
      document.querySelector("#instructions-page").style.display = "";
      //document.querySelector("#dbError").style.display = "none"
    }
    else if (pageSelected === "dbError") {
      document.title = "Error";
      document.querySelector("#retrieve-data-button").style.display = "none";
      document.querySelector("#home-page").style.display = "none";
      document.querySelector("#edit-page").style.display = "none";
      document.querySelector("#read-write-page").style.display = "none";
      document.querySelector("#instructions-page").style.display = "none";
      document.querySelector("#read-write-page").style.display = "";
      
    }
  }

  static menu() {
    let getMenu = document.querySelector(".js-menu-hamburger--closed");
    getMenu.classList.toggle("js-menu-hamburger--opened");
  }

  static scrollToBottom() {
    if (document.documentElement.scrollHeight > document.documentElement.clientHeight) {
      //tobottom.style.display = "200none"
      // get the scroll height of the window
      const scrollHeight = document.documentElement.scrollHeight;
      // scroll to the bottom of webpage
      window.scrollTo(0, scrollHeight);
    }
  }

  static scrollToTop() {
    tobottom = document.getElementById("js-page--to-bottom");
    tobottom.style.display = "block"
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  static scrollEvent() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      totop.style.display = "block";
    } else {
      totop.style.display = "none";
      //tobottom.style.display = "block";
    }
  }

  static refreshTable(sortOn) {
    let invertSort = sortOn === oldSortOn;
    let sortOrder = 'next';
    if ((oldSortOrder === sortOrder) && invertSort) {
      sortOrder = 'prev';
    }
    oldSortOn = sortOn;
    oldSortOrder = sortOrder;
    const table = document.getElementById('seed-list');
    loadData(sortOn, sortOrder);
    sortState[0] = sortOn;
    sortState[1] = sortOrder;
    console.log(sortState);
  }

  // Should be in Store Class?
  static editSeed(record, editPage) {
    UI.clearFields();
    UI.selectPages(editPage);
    Object.keys(record).forEach(field => {
      console.log(field);
      console.log(record[field]);
      document.querySelector('#' + field).value = record[field];
    });
  }
}

// Store Class: Handles Storage 
class Store {
  static corruptDB() {
    const req = indexedDB.deleteDatabase('seedB');
    req.onsuccess = function () {
      console.log("Deleted database successfully");
      const msg = document.getElementById('js-msg');
      msg.insertAdjacentHTML('beforeend',
      '<br>Deleted database successfully');
      Store.openDB();
    };
    req.onerror = function () {
      console.log("Couldn't delete database");
      const msg = document.getElementById('js-msg');
      msg.insertAdjacentHTML('beforeend',
      '<br>Could not delete database');
    };
    req.onblocked = function () {
      console.log("Couldn't delete database due to the operation being blocked");
      const msg = document.getElementById('js-msg');
      msg.insertAdjacentHTML('beforeend',
      '<br>Could not delete database due to the operation being blocked');
    };
  }

  static openDB() {
    const request = window.indexedDB.open('seedB', 1);
    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      const store = db.createObjectStore('entity', { keyPath: 'pktId' });
      store.createIndex('variety', 'variety', { unique: false });
      store.createIndex('seedGroup', 'seedGroup', { unique: false });
      store.createIndex('seedDatePacked', 'seedDatePacked', { unique: false });
      store.createIndex('timeStamp', 'timeStamp', { unique: false });
      console.log('Index Creation Successful');
      console.log('The new database version number is = ' + event.newVersion);
      const msg = document.getElementById('js-msg');
      msg.insertAdjacentHTML('beforeend',
      '<br>SeedB created');
      const version = ('The new database version number is = ' + event.newVersion);
      msg.insertAdjacentHTML('beforeend',
      '<br>' + version);
    }
  }
 
  static editAddRecord(mode) {
    console.log(mode);
    // Get form values
    const seedGroup = document.querySelector('#seedGroup').value;
    const variety = document.querySelector('#variety').value;
    const pktId = document.querySelector('#pktId').value;
    const seedNumbers = document.querySelector('#seedNumbers').value;
    const seedWeight = document.querySelector('#seedWeight').value;
    const seedDatePacked = document.querySelector('#seedDatePacked').value;
    const seedNotes = document.querySelector('#seedNotes').value;

    // Validate
    if (seedGroup === '' || variety === '' || pktId === '' || seedNumbers === '' || seedWeight === '' || seedDatePacked === '') {

      UI.showAlert('Please fill in all fields', 'warning', '#pkt-message', '#insert-form-alerts');

    }
    else {
      // Instantiate seed
      const timeStamp = Date.now();
      const seed = new Seed(seedGroup, variety, pktId, seedNumbers, seedWeight, seedDatePacked, seedNotes, timeStamp);
      const id = new Seed(pktId);
      console.log(seed);
      console.log(seed['pktId']);
      // Add SeedPkt to IndexedDB
      const request = window.indexedDB.open('seedB', 1);
      request.onsuccess = (event) => {
        console.log('request success');
        const db = event.target.result;
        db.onerror = function (event) {
          // Generic error handler for all errors targeted at this database's requests!
          console.log("Database error: " + event.target.errorCode);
        };
        const transaction = db.transaction('entity', 'readwrite');
        const store = transaction.objectStore('entity');
        store.put(seed);
      };

      // Show success message
      UI.showAlert('Seed Packet Added', 'success', '#pkt-message', '#insert-form-alerts');
      // Clear form fields
      UI.clearFields();
      if (mode === 'editSeedPkt') {
        UI.selectPages('homePage');
      } else if (mode === 'newPktPage') {
        UI.selectPages('newPktPage');
      };
    };
  }

  static deleteRecord() {
    const pktId = document.querySelector('#pktId').value;
    const request = window.indexedDB.open('seedB', 1);
    request.onsuccess = (event) => {
      console.log('request success');
      const db = event.target.result;
      const transaction = db.transaction('entity', 'readwrite');
      const store = transaction.objectStore('entity');
      let deleted = store.get(pktId);
      console.log(pktId);
      console.log("After push: " + deleted);
      store.delete(pktId);
      transaction.oncomplete = () => {
        console.log('finished transaction');
        db.close();
      }
      db.onerror = function (event) {
        // Generic error handler for all errors targeted at this database's requests!
        console.log("Database error: " + event.target.errorCode);
      };

    };
    // Show success message
    UI.showAlert('Seed Packet Deleted', 'warning', '#pkt-message', '#insert-form-alerts');
    // Clear form fields
    UI.clearFields();
    //Refresh table
    UI.refreshTable('pktId');
  }

  static addData(records) {
    const request = window.indexedDB.open('seedB', 1);
    request.onsuccess = (event) => {
      console.log('request success');
      const db = event.target.result;
      db.onerror = function (event) {
        // Generic error handler for all errors targeted at this database's requests!
        console.log("Database error: " + event.target.errorCode);
      };
      const transaction = db.transaction('entity', 'readwrite');
      const store = transaction.objectStore('entity');
      records.forEach(record => {
        store.put(record);
      });
      transaction.oncomplete = () => {
        console.log('finished transaction');
        db.close();
      }
    }
  }
} 

// Data
class Data {
  static retrieveAll() {
    openDbPromise().then(
      db => {
        return new Promise((resolve, reject) => {
          //request = db.transaction('entity').objectStore('entity').openCursor();
          const transaction = db.transaction(['entity'], "readonly");
          const store = transaction.objectStore('entity');
          let cursorRequest;
          let records = [];
          cursorRequest = store.openCursor();
  
          cursorRequest.onsuccess = event => {
            let cursor = event.target.result;
            if (cursor) {
              let primaryKey = cursor.primaryKey; //new
              let value = cursor.value;
              let key = cursor.key;
              console.log(key, value);
              records.push(value);
              cursor.continue();
            }
            else {
              resolve(records);
            }
          }
          cursorRequest.onerror = (event) => {
            reject(event.target.errorCode);
          }
        })
      })
      .then(records => {
        //return records;
        console.log(records)
        const text = JSON.stringify(records, null, 2);
        console.log(text);
        let time = Data.fileTime() + ".txt";
        var filename = "seedB-" + time;
        Data.download(filename, text);
      });
  };
  static download(filename, textInput) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(textInput));
    element.setAttribute('download', filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  static fileTime() {
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = "0" + (date.getMonth() + 1).toString();
    const day = "0" + (date.getDay() + 1).toString();
    const hours = "0" + date.getHours();
    const minutes = "0" + date.getMinutes();
    //const seconds = "0" + date.getSeconds();
    const formattedTime = `${year.slice(-2)}${month.slice(-2)}${day.slice(-2)}-${hours.slice(-2)}${minutes.slice(-2)}`;
    return formattedTime;
  };
}
// End of Classes

// Global variables
let oldSortOn = '';
let oldSortOrder = 'prev';
let totop = document.getElementById("js-page--to-top"); //Get the button
let tobottom = document.getElementById("js-page--to-bottom"); //Get the button
let deletedPkts = []; // session storage of deleted seed packets
let sortState = []; //trying to keep track of sort config befor edit of record

// Functions and events
function openDbPromise() {
  return new Promise((resolve, reject) => {
    let request = window.indexedDB.open('seedB', 1);
    request.onsuccess = (event) => {
      resolve(event.target.result);
    }
    request.onerror = (event) => {
      reject(event.target.errorCode);
    }
  });
};

function fetchDataPromise(db, sortOn = 'variety', sortOrder = 'next') {
  return new Promise((resolve, reject) => {
    //request = db.transaction('entity').objectStore('entity').openCursor();
    const transaction = db.transaction(['entity'], "readonly");
    const store = transaction.objectStore('entity');
    let cursorRequest;
    if (sortOn === 'pktId') {
      cursorRequest = store.openCursor(null, sortOrder);
    } else {
      const index = store.index(sortOn);
      cursorRequest = index.openCursor(null, sortOrder); //sort by variety name
    }
    records = [];
    cursorRequest.onsuccess = event => {
      let cursor = event.target.result;
      if (cursor) {
        records.push(cursor.value);
        cursor.continue();
      }
      else {
        resolve(records);
      }
    }
    cursorRequest.onerror = (event) => {
      reject(event.target.errorCode); 
    }
  })
};

async function loadData(sortOn = 'variety', sortOrder = 'next') {
  const db = await openDbPromise();
  const records = await fetchDataPromise(db, sortOn, sortOrder);
  UI.displaySeeds(records); // According to VS Code await is not needed here
};



// Event Open DB
document.addEventListener('DOMContetLoaded', UI.selectPages("homePage"));

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = () => { UI.scrollEvent() };
window.onload = () => {dbExist()};

// Event Menu
document.querySelector(".js-menu-hamburger").addEventListener("click", UI.menu);

// Event get pktId from table
function editSeedPkt(pktId) {
  console.log(pktId);
  openDbPromise().then(
    db => {
      return new Promise((resolve, reject) => {
        //request = db.transaction('entity').objectStore('entity').openCursor();
        const transaction = db.transaction(['entity'], "readwrite");
        const store = transaction.objectStore('entity');
        const request = store.get(pktId);
        request.onsuccess = event => {
          let record = event.target.result;
          resolve(record)
        }
        request.onerror = (event) => {
          reject(event.target.errorCode);
        }
      })
    }).then(record => {
      console.log(record);
      UI.editSeed(record, 'editSeedPkt');
    });
};

// Latest code for downloading and uploading seedB data
// code for creating backup files is now in Data Class
// Upload backup data to seedB
const fileSelect = document.getElementById("js-file-select");
const extractFileData = document.getElementById("js-input-file-data");

fileSelect.addEventListener("click", function (e) {
  if (extractFileData) {
    extractFileData.click();
  }
}, false);

//document.getElementById('js-input-file-data').onchange = function () {
extractFileData.onchange = function () {
  let dataFile = [];
  var file = this.files[0];
  var reader = new FileReader();
  reader.onload = function (progressEvent) {
    //console.log(this.result);
    dataFile = JSON.parse(this.result);
    console.log(dataFile);
    Store.addData(dataFile);
    //console.log(dataFile[4]);
  };
  reader.readAsText(file);
};

