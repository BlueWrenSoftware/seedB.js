'use strict';
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
    }
    else if (pageSelected === "readWritePage") {
      document.title = "Backup";
      document.querySelector("#retrieve-data-button").style.display = "";
      document.querySelector("#home-page").style.display = "none";
      document.querySelector("#edit-page").style.display = "none";
      document.querySelector("#read-write-page").style.display = "";
      document.querySelector("#instructions-page").style.display = "none";
      document.querySelector("#dbError").style.display = "none"
    }
    else if (pageSelected === "instructionsPage") {
      document.title = "Instructions";
      document.querySelector("#home-page").style.display = "none";
      document.querySelector("#edit-page").style.display = "none";
      document.querySelector("#read-write-page").style.display = "none";
      document.querySelector("#instructions-page").style.display = "";
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
      //toBottom.style.display = "200none"
      // get the scroll height of the window
      const scrollHeight = document.documentElement.scrollHeight;
      // scroll to the bottom of webpage
      window.scrollTo(0, scrollHeight);
    }
  }

  static scrollToTop() {
    toBottom = document.getElementById("js-page--to-bottom");
    toBottom.style.display = "block"
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }

  static scrollEvent() {
    if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
      toTop.style.display = "block";
    } else {
      toTop.style.display = "none";
      //toBottom.style.display = "block";
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

  static locateBtnHomePage(e) {
    if (e.target === foundBtnHomePage)
      {
        fileNotes.innerHTML = "";
        console.log("file notes deleted");
        backupNotes.innerHTML = "";
      }; 
      console.log('Home Page selected');
      UI.selectPages('homePage');
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
    //errorMsg.innerHTML  = "";
    const req = indexedDB.deleteDatabase('seedB');
    req.onsuccess = function () {
      console.log("Deleted database successfully");
      msgInstallBb.innerHTML += ('<li>=> Deleted corrupted database.</li>');
      Store.openDB();
    };
    req.onerror = function () {
      console.log("Couldn't delete database");
      msgInstallBb.innerHTML += ('<li>=> Could not delete database</li>');
    };
    req.onblocked = function () {
      console.log("Couldn't delete database due to the operation being blocked");
      msgInstallBb.innerHTML += ('<li>=> Could not delete database due to the operation being blocked</li>');
    };
  }

  static openDB() {
    const request = window.indexedDB.open('seedB', 1);
    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      const store = db.createObjectStore('collection', { keyPath: 'pktId' });
      store.createIndex('variety', 'variety', { unique: false });
      store.createIndex('seedGroup', 'seedGroup', { unique: false });
      store.createIndex('seedDatePacked', 'seedDatePacked', { unique: false });
      store.createIndex('timeStamp', 'timeStamp', { unique: false });
      console.log('Index Creation Successful');
      console.log('The new database version number is = ' + event.newVersion);
      const version = 'The new database version number is = ' + event.newVersion;
      msgInstallBb.innerHTML += ('<li>=> New SeedB created.</li>');
      msgInstallBb.innerHTML += ('<li>=> ' + version + '</li>');
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
        const transaction = db.transaction('collection', 'readwrite');
        const store = transaction.objectStore('collection');
        store.put(seed);
      };

      // Show success message
      UI.showAlert('Seed Packet Added', 'success', '#pkt-message', '#insert-form-alerts');
      // Clear form fieldsBackupNotifications
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
      const transaction = db.transaction('collection', 'readwrite');
      const store = transaction.objectStore('collection');
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
      const transaction = db.transaction('collection', 'readwrite');
      const store = transaction.objectStore('collection');
      records.forEach(record => {
        store.put(record);
      });
      transaction.oncomplete = () => {
        console.log('finished transaction');
        db.close();
      }
    }
  }
  static dbExist() {
    const request = window.indexedDB.open('seedB');
    request.onsuccess = function(e) {
      const db = e.target.result;
      console.log('db is open');
      if (!db.objectStoreNames.contains('collection')) {
        //db.close();
        console.log('no object store');
        UI.selectPages("dbError");
        db.close();
      }
      else if (db.objectStoreNames.contains('collection')) {
        console.log('Object store is named collection');
        UI.selectPages('homePage');
      }
      // need final comment screen must not have captured some other error!
    }
  }
}

// Data
class Data {
  static retrieveAll() {
    openDbPromise().then(
      db => {
        return new Promise((resolve, reject) => {
          const transaction = db.transaction(['collection'], "readonly");
          const store = transaction.objectStore('collection');
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
              console.log('All SeedB data retrieved');
              fileNotes.innerHTML += '<li>=> All SeedB data retrieved</li>';
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
        const filename = "seedB-" + time;
        console.log(filename);
        fileNotes.innerHTML += '<li>=> Backup file name is: ' + filename + '</li>';
        Data.download(filename, text);
      });
  };
  static download(filename, textInput) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(textInput));
    element.setAttribute('download', filename);
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    console.log('Download complete');
    fileNotes.innerHTML += '<li>=> Download is completed.</li>';
  };
  static fileTime() {
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = "0" + (date.getMonth() + 1)
    const day = "0" + date.getDate();
    const hours = "0" + date.getHours();
    const minutes = "0" + date.getMinutes();
    //const seconds = "0" + date.getSeconds();
    const formattedTime = `${year.slice(-2)}${month.slice(-2)}${day.slice(-2)}-${hours.slice(-2)}${minutes.slice(-2)}`;
    console.log(date, day, month, year);
    console.log(formattedTime);
    return formattedTime;
  };

  static backup() { // all the events have to be taken out!
    const fileSelect = document.getElementById("js-file-select");
    const extractFileData = document.getElementById("js-input-file-data");
    fileSelect.addEventListener("click", function () {
      if (extractFileData) {
        extractFileData.click();
      }
    }, false);
    extractFileData.onchange = function () {
      let dataFile = [];
      const file = this.files[0];
      console.log(file);
      console.log(file.name);
      console.log(file.lastModifiedDate.toString().slice(0,24));
      backupNotes.innerHTML += '<li>=> Backup file used:  '+file.name+'</li>';
      backupNotes.innerHTML += '<li>=> Backup file was created on:  '+ file.lastModifiedDate.toString().slice(0, 24) + '</li>';
      backupNotes.innerHTML += '<li>=> Backup file now merged with seed list already in db</li>';
      const reader = new FileReader();
      reader.onload = function (progressEvent) {
        //console.log(this.result);
        dataFile = JSON.parse(this.result);
        console.log(dataFile);
        Store.addData(dataFile);
        //console.log(dataFile[4]);
      };
      reader.readAsText(file);
    };
  };
}

// End of Classes

// Global variables
let oldSortOn = '';
let oldSortOrder = 'prev';
let toTop = document.getElementById("js-page--to-top"); //Get the button
let toBottom = document.getElementById("js-page--to-bottom"); //Get the button

//let deletedPkts = []; session storage of deleted seed packets
//let sortState = []; trying to keep track of sort config before edit of record

const htmlId = id => document.getElementById(id);
const foundBtnHomePage = document.getElementById('findBtnHomePage');
const fileNotes = document.getElementById('fileNotifications');
const backupNotes = document.getElementById('backupNotifications');  
const errorMsg = document.getElementById("dbError");
const msgInstallBb = document.getElementById('installDbMsg');

// Restore data from backup file
Data.backup(); // have to sort the events in that function

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = () => { UI.scrollEvent() };

// Load IndexedDB and check for right store
window.onload = () => { Store.dbExist() };

//Events
// Event Menu
document.querySelector(".js-menu-hamburger").addEventListener("click", UI.menu);
// Menu selection events
htmlId('eventHomePage').addEventListener('click', () => { UI.selectPages('homePage') }, false);
htmlId('eventPktPage').addEventListener('click', () => { UI.selectPages('newPktPage') }, false);
htmlId('eventReadWritePage').addEventListener('click', () => { UI.selectPages('readWritePage') }, false);
htmlId('eventInstrPage').addEventListener('click', () => { UI.selectPages('instructionsPage') }, false);

// Sort table columns events
htmlId('sortSeedGroup').addEventListener('click', () => { UI.refreshTable('seedGroup') }, false);
htmlId('sortVariety').addEventListener('click', () => { UI.refreshTable('variety') }, false);
htmlId('sortPktId').addEventListener('click', () => { UI.refreshTable('pktId') }, false);
htmlId('sortDatePacked').addEventListener('click', () => { UI.refreshTable('seedDatePacked') }, false);

// Button & input events
htmlId('btnSubmitRecord').addEventListener('click', () => { Store.editAddRecord('editSeedPkt') }, false);
htmlId('btnDeleteRecord').addEventListener('click', () => { Store.deleteRecord() }, false);
htmlId('btnNewRecord').addEventListener('click', () => { Store.editAddRecord('newPktPage') }, false);
htmlId('btnRetrieveData').addEventListener('click', () => { Data.retrieveAll() }, false);
htmlId('btnReinstall').addEventListener('click', () => { Store.corruptDB() }, false);
htmlId('js-page--to-bottom').addEventListener('click', () => { UI.scrollToBottom() }, false);
htmlId('js-page--to-top').addEventListener('click', () => { UI.scrollToTop() }, false);

// Buttons & inputs all opening Home Page (same class)
document.querySelectorAll('.btnHomePage')
  .forEach(btn => btn.addEventListener('click', (e) => { UI.locateBtnHomePage(e) }, false));

// Functions
  function openDbPromise() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('seedB', 1);
    request.onsuccess = (event) => {
      resolve(event.target.result);
    }
    request.onerror = (event) => {
      reject(event.target.errorCode);
    }
  });
};

function fetchSortDataPromise(db, sortOn = 'variety', sortOrder = 'next') {
  return new Promise((resolve, reject) => {
    //request = db.transaction('collection').objectStore('collection').openCursor();
    const transaction = db.transaction(['collection'], "readonly");
    const store = transaction.objectStore('collection');
    let cursorRequest;
    if (sortOn === 'pktId') {
      cursorRequest = store.openCursor(null, sortOrder);
    } else {
      const index = store.index(sortOn);
      cursorRequest = index.openCursor(null, sortOrder); //sort by variety name
    }
    const records = [];
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
  const records = await fetchSortDataPromise(db, sortOn, sortOrder);
  UI.displaySeeds(records); // According to VS Code await is not needed here
};

// Event get pktId from table
function editSeedPkt(pktId) {
  console.log(pktId);
  openDbPromise().then(
    db => {
      return new Promise((resolve, reject) => {
        //request = db.transaction('collection').objectStore('collection').openCursor();
        const transaction = db.transaction(['collection'], "readwrite");
        const store = transaction.objectStore('collection');
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