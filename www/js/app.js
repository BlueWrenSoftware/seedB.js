/*All console.log are disable, were there for debugging
  => New Comment
  -> Continuation of initial comment*/
'use strict';

class Seed { //=> Creates an instance of a seed packet for data upload
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
};

class Db {    
    // responsible for Db access
    constructor() {
        this.newlyCreated = false;
        this.db = null;
        this.version = null;
    }
    
    open(version) {
	      return new Promise((resolve, reject) => {
	          const request = window.indexedDB.open('seedB', version);    
            request.onupgradeneeded = function (event) {
                this.db = event.target.result;
                const store = db.createObjectStore('collection', { keyPath: 'pktId' });
                store.createIndex('variety', 'variety', { unique: false });
                store.createIndex('seedGroup', 'seedGroup', { unique: false });
                store.createIndex('seedDatePacked', 'seedDatePacked', { unique: false });
                store.createIndex('timeStamp', 'timeStamp', { unique: false });
            }

	          request.onsuccess = (event) => {
                this.db = event.target.result;
                this.transaction = this.db.transaction(['collection'], "readwrite");
                this.store = this.transaction.objectStore('collection');
                this.version = this.db.version;
		            resolve(event.target.result);
	          }

            request.onerror = (event) => {
		            reject(event.target.errorCode);
	          }
	      });
    }

    delete() {        
        return new Promise((resolve, reject) => {
            const req = window.indexedDB.deleteDatabase('seedB')
            req.onsuccess = function () {
                //console.log("Deleted database successfully");
                resolve('success');
            };
            req.onerror = function () {
                //console.log("Couldn't delete database");
                reject('error');
            };
            req.onblocked = function () {
                //console.log("Couldn't delete database due to the operation being blocked");
                reject('blocked')
            };
        });
    }

    getRecord(id) {        
        return new Promise((resolve, reject) => {
            const request = this.store.get(id);
            request.onsuccess = event => {
                let record = event.target.result;
                resolve(record)
            };
            request.onerror = (event) => {
                reject(event.target.errorCode);
            };
        });
    };
    
    getAll(sortOn = 'variety', sortOrder = 'next') {
        return new Promise((resolve, reject) => {
            let cursorRequest;
            if (sortOn === 'pktId') {
                cursorRequest = this.store.openCursor(null, sortOrder);
            } else {
                const index = this.store.index(sortOn);
                cursorRequest = index.openCursor(null, sortOrder);
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
            };
            cursorRequest.onerror = (event) => {
                reject(event.target.errorCode);
            };
        })
    };

    
};

class View {
    // Responsible for presenting the model to the user
    constructor() {
    }
};

class Control {
    // Responsible for handling user input
}

class Model {
    // manages the data model
    constructor(controller, view) {
        this.controller = controller;
        this.view = view;
    }
}

class UI { // Handles UI Tasks
  static displaySeeds(seedTable) { //=> Delete table rows first before entering updated data on home page
    const table = document.querySelector('#seed-list');
    while (table.rows.length > 0) {
      table.deleteRow(0);
    };
    seedTable.forEach((row) => UI.addSeedToTable(row));
  }

  static addSeedToTable(seedPkt) { //=> Add row to seeds list table with seed packet
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
    `; //=> Created template literal with $ being a string interpolation
    list.appendChild(row);
  }

  static showAlert(message, className, idMessage, idLocation) { //=> Creating warning msg when entering data
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    const messages = document.querySelector(`${idMessage}`); //=> message content created Store.editSddRecord()
    const section = document.querySelector(`${idLocation}`); //=> where in the html page the msg is located
    section.insertBefore(div, messages);
    setTimeout(() => document.querySelector('.alert').remove(), 3000); //=> Vanish in 3 seconds
  }

  static clearFields() { //=> Clears all the entry fields on the edit/add page
    document.querySelector('#seedGroup').value = '';
    document.querySelector('#variety').value = '';
    document.querySelector('#pktId').value = '';
    document.querySelector('#seedNumbers').value = '';
    document.querySelector('#seedWeight').value = '';
    document.querySelector('#seedDatePacked').value = '';
    document.querySelector('#timeStamp').value = '';
    document.querySelector('#seedNotes').value = '';
  }

  static selectPages(pageSelected, initialSortOn, initialOrder) {  //=> Selects the pages from menu and other buttons
    if (pageSelected === "homePage") { //=> Checks if all the pages are hidden on startup and remove hidden to show
      if (document.getElementById("showHide").classList.contains("js-all-pages--none")) {
        document.getElementById("showHide").classList.add("js-all-pages--opened");
        document.getElementById("showHide").classList.remove("js-all-pages--none");
      }
      document.title = "SeedB Blue Wren"; //=> Page at startup being the seed list
      document.querySelector("#home-page").style.display = "";
      document.querySelector("#edit-page").style.display = "none";
      document.querySelector("#read-write-page").style.display = "none";
      document.querySelector("#instructions-page").style.display = "none";
      loadData(initialSortOn, initialOrder);
    }
    else if (pageSelected === "editSeedPkt") { //=> edit/add page seed packet selected from the seed list
      UI.clearFields();
      document.title = "Edit Seed Pkt";
      document.querySelector("#edit-pkt-buttons").style.display = "";
      document.querySelector("#new-pkt-buttons").style.display = "none";
      document.querySelector("#scrollRecordsButtons").style.display = "none";
      document.querySelector("#home-page").style.display = "none";
      document.querySelector("#edit-page").style.display = "";
      document.querySelector("#read-write-page").style.display = "none";
      document.querySelector("#instructions-page").style.display = "none";
    }
    else if (pageSelected === "newPktPage") { //=> edit/add page for new seed packet entry
      UI.clearFields();
      document.title = "New Seed Pkt";
      document.querySelector("#new-pkt-buttons").style.display = "";
      document.querySelector("#edit-pkt-buttons").style.display = "none";
      document.querySelector("#scrollRecordsButtons").style.display = "none";
      document.querySelector("#home-page").style.display = "none";
      document.querySelector("#edit-page").style.display = "";
      document.querySelector("#read-write-page").style.display = "none";
      document.querySelector("#instructions-page").style.display = "none";
    }
    else if (pageSelected === "scrollRecords") { //=> edit/add page for new seed packet entry
      UI.clearFields();
      document.title = "Scroll Pkt Records";
      document.querySelector("#new-pkt-buttons").style.display = "none";
      document.querySelector("#edit-pkt-buttons").style.display = "none";
      document.querySelector("#scrollRecordsButtons").style.display = "";
      document.querySelector("#home-page").style.display = "none";
      document.querySelector("#edit-page").style.display = "";
      document.querySelector("#read-write-page").style.display = "none";
      document.querySelector("#instructions-page").style.display = "none";
    }
    else if (pageSelected === "readWritePage") { //=> backup and restore page
      document.title = "Backup & Restore";
      document.querySelector("#retrieve-data-button").style.display = "";
      document.querySelector("#home-page").style.display = "none";
      document.querySelector("#edit-page").style.display = "none";
      document.querySelector("#read-write-page").style.display = "";
      document.querySelector("#instructions-page").style.display = "none";
      document.querySelector("#dbError").style.display = "none"
    }
    else if (pageSelected === "instructionsPage") { //=> page for instructions
      document.title = "Instructions";
      document.querySelector("#home-page").style.display = "none";
      document.querySelector("#edit-page").style.display = "none";
      document.querySelector("#read-write-page").style.display = "none";
      document.querySelector("#instructions-page").style.display = "";
    }
    else if (pageSelected === "dbError") { //=> checks if pages are hidden before loading error page on start
      if (document.getElementById("showHide").classList.contains("js-all-pages--none")) {
        document.getElementById("showHide").classList.add("js-all-pages--opened");
        document.getElementById("showHide").classList.remove("js-all-pages--none");
      }
      document.title = "DB Error"; //=> on start up if db fails this page will be loaded
      document.querySelector("#retrieve-data-button").style.display = "none";
      document.querySelector("#home-page").style.display = "none";
      document.querySelector("#edit-page").style.display = "none";
      document.querySelector("#read-write-page").style.display = "none";
      document.querySelector("#instructions-page").style.display = "none";
      document.querySelector("#read-write-page").style.display = "";
      //document.querySelector("#dbError").style.display = ""
    }
  }

  static menu() { //=> toggle function using class lists on click of the hamburger menu
    let getMenu = document.querySelector(".js-menu-hamburger--closed");
    getMenu.classList.toggle("js-menu-hamburger--opened");
  }

  static scrollToBottom() { //=> function activated on click of down arrow
    if (document.documentElement.scrollHeight > document.documentElement.clientHeight) {
      const scrollHeight = document.documentElement.scrollHeight;
      window.scrollTo(0, scrollHeight);
    }
  }

  static scrollToTop() { //=> function activated on click of up arrow
    toBottom = document.getElementById("js-page--to-bottom");
    toBottom.style.display = "block"
    document.body.scrollTop = 0; //=> For Safari
    document.documentElement.scrollTop = 0; //=> For Chrome, Firefox, IE and Opera
  }

  static scrollEvent() { //=> scroll event to hide or show to top button
    if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
      toTop.style.display = "block";
    } else {
      toTop.style.display = "none";
    }
  }

  static refreshTable(sortOn) { //=> refresh table on selected column for sort
    //console.log('1 ' + oldSortOn);
    //console.log('2 ' + sortOn);
    let invertSort = sortOn === oldSortOn; //=> false if not the same
    //console.log('3 ' + invertSort);
    let sortOrder = 'next';
    let invertOrder = sortOrder === oldSortOrder; //=> false if not the same
    //console.log('4 ' + invertOrder);
    if (invertOrder && invertSort) { //=> true - change sort order
      sortOrder = 'prev';
      //console.log('5 if was selected');
    }
    oldSortOn = sortOn;         //=> assign present sort column to variable ->
    oldSortOrder = sortOrder;  //-> and assign present sort order to variable
    const table = document.getElementById('seed-list');
    loadData(sortOn, sortOrder); //=> pass on the sort instruction to this function
    //sortState[0] = sortOn; 
    //sortState[1] = sortOrder;
    //console.log(sortState);
  }

  static locateBtnHomePage(e) { //=> select from classList the right return to Home page button
    if (e.target === foundBtnHomePage)
      {
        fileNotes.innerHTML = "";
        //console.log("file notes deleted");
        backupNotes.innerHTML = "";
      }; 
      //console.log('Home Page selected');
      UI.selectPages('homePage', oldSortOn, oldSortOrder);
  } 

  static editSeed(record, editPage) { //=> opens the edit/add page ->
    UI.clearFields();
    UI.selectPages(editPage);
    Object.keys(record).forEach(field => { // -> with the requested seed pkt record for editing
      //console.log(field);
      //console.log(record[field]);
      document.querySelector('#' + field).value = record[field];
    });
  } //=> Should be in Store Class?
}

class Store {
  //=> Handles all DB operations
  static async dbExist() {                                    
      const database = new Db();
      await database.open();
      console.log(database);
      // check if DB exists and open home page, if not display error
      if (database.db.objectStoreNames.contains('collection')) {       
        UI.selectPages('homePage');
      }
      else {
        UI.selectPages("dbError");                       
      }
      // TO DO: need final comment screen must not have captured some other error!
  }

    // TO DO: both dbExist and openDB might be merged. Issue to resolve on upgrade needed. never got it to work.
  
    static async openDB() {  //=> opens SeedB, if not exist will create SeedB ->
        const database = new Db();
        await database.open();
        if (database.newlyCreated) {
            const version = 'The new database version number is = ' + database.version;
            msgInstallBb.innerHTML += ('<li>=> New SeedB created.</li>');
            msgInstallBb.innerHTML += ('<li>=> ' + version + '</li>');
        }
    }

    static async corruptDB() {  //=> Deletes corrupted database directed from dbError page
        const db = new Db();
        const ret = await db.delete();
        if (ret === 'success') {
            //console.log("Deleted database successfully");
            msgInstallBb.innerHTML += ('<li>=> Deleted corrupted database.</li>');
            db.open();
        } else if (ret === 'error') {
            //console.log("Couldn't delete database");
            msgInstallBb.innerHTML += ('<li>=> Could not delete database</li>');
        } else if (ret === 'blocked') {
            //console.log("Couldn't delete database due to the operation being blocked");
            msgInstallBb.innerHTML += ('<li>=> Could not delete database due to the operation being blocked</li>');
        };
    }

  static editAddRecord(mode) { //=> Adds or edits one seed pkt record ->
    //console.log(mode);
    const seedGroup = document.querySelector('#seedGroup').value; // -> collects the ->
    const variety = document.querySelector('#variety').value;     // -> content from ->
    const pktId = document.querySelector('#pktId').value;         // -> each form field
    const seedNumbers = document.querySelector('#seedNumbers').value;
    const seedWeight = document.querySelector('#seedWeight').value;
    const seedDatePacked = document.querySelector('#seedDatePacked').value;
    const seedNotes = document.querySelector('#seedNotes').value;
    if (seedGroup === '' || variety === '' || pktId === '' || seedNumbers === ''
     || seedWeight === '' || seedDatePacked === '') {
      UI.showAlert('Please fill in all fields', 'warning', '#pkt-message', '#insert-form-alerts');
    } //=> checks if all the fields are filled out, if not an error message sent.
    else { //=> instantiates new seed object from Seed Class
      const timeStamp = Date.now();
      const seed = new Seed(seedGroup, variety, pktId, seedNumbers, seedWeight, seedDatePacked, seedNotes, timeStamp);
      //console.log(seed);
      //console.log(seed['pktId']);
      const request = window.indexedDB.open('seedB', 1); //=> Add SeedPkt to IndexedDB
      request.onsuccess = (event) => {
        //console.log('request success');
        const db = event.target.result;
        db.onerror = function (event) { //=> Generic error handler for all errors targeted at this database's requests!
          //console.log("Database error: " + event.target.errorCode);
          event.target.errorCode
        };
        const transaction = db.transaction('collection', 'readwrite');
        const store = transaction.objectStore('collection');
        store.put(seed); //=> adds record to collection. If pktID already exists, will update edited record.
      };
      UI.showAlert('Seed Packet Added', 'success', '#pkt-message', '#insert-form-alerts'); //=> Show success message
      UI.clearFields();  //=> Clear form fields 
      if (mode === 'editSeedPkt') { //=> return to seed list
        UI.selectPages('homePage', oldSortOn, oldSortOrder);
      } else if (mode === 'newPktPage') { //=> Create new empty seed packet entry
        UI.selectPages('newPktPage');
      };
    };
  }

  static deleteRecord() { //=> Delete record requested from delete button on edit page
    const pktId = document.querySelector('#pktId').value; //=> pktId obtained from edit button on seed list
    const request = window.indexedDB.open('seedB', 1);
    request.onsuccess = (event) => {
      //console.log('request success');
      const db = event.target.result;
      const transaction = db.transaction('collection', 'readwrite');
      const store = transaction.objectStore('collection');
      let deleted = store.get(pktId);
      //console.log(pktId);
      //console.log("After push: " + deleted);      //TO DO: Create this as a user message
      store.delete(pktId);
      transaction.oncomplete = () => {
        //console.log('finished transaction');
        db.close();
      }
      db.onerror = function (event) {
        // Generic error handler for all errors targeted at this database's requests!
        //console.log("Database error: " + event.target.errorCode);
        event.target.errorCode
      };
    };
    UI.showAlert('Seed Packet Deleted', 'warning', '#pkt-message', '#insert-form-alerts'); //=> Show success message
    UI.clearFields(); //=> Clear form fields
    UI.refreshTable('pktId'); //=> Refresh seed table sorted on pktId 
  }

    
  static addRecords(file) { //=> add te records extracted from the backup file.
    const request = window.indexedDB.open('seedB', 1);
    request.onsuccess = (event) => {
      //console.log('request success');
      const db = event.target.result;
      db.onerror = function (event) {
        // Generic error handler for all errors targeted at this database's requests!
        //console.log("Database error: " + event.target.errorCode);
        event.target.errorCode
      };
      const transaction = db.transaction('collection', 'readwrite');
      const store = transaction.objectStore('collection');
      file.forEach(record => { //=> cycle through each record oject and merge in the object store
        store.put(record);
      });
      transaction.oncomplete = () => {
        //console.log('finished transaction');
        db.close();
      }
    }
  }
  
    static openDbPromise() {
	      return new Promise((resolve, reject) => {
	          const request = window.indexedDB.open('seedB', 1);
	          request.onsuccess = (event) => {
		            resolve(event.target.result);
	          }
	          request.onerror = (event) => {
		            reject(event.target.errorCode);
	          }
	      });
    }
}


class Data { //=> Handles data files for backup and restore
  static fileTime() {  //=> Timestamp for file names
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = "0" + (date.getMonth() + 1)
    const day = "0" + date.getDate();
    const hours = "0" + date.getHours();
    const minutes = "0" + date.getMinutes();
    //const seconds = "0" + date.getSeconds();
    const formattedTime = `${year.slice(-2)}-${month.slice(-2)}-${day.slice(-2)}T${hours.slice(-2)}∶${minutes.slice(-2)}`;
    //console.log(date, day, month, year); //=> Time format to UTC standard. Colons not accepted in filenames. ->
    //console.log(formattedTime); //-> used math ratio symbol U2236 instead and truncated year to 2 digits
    return formattedTime;
  }
  
  static retrieveAll() { //=> Collects all data records from DB
    Store.openDbPromise().then( //=> open DB
      db => {
        return new Promise((resolve, reject) => {
          const transaction = db.transaction(['collection'], "readonly");
          const store = transaction.objectStore('collection');
          let cursorRequest;
          let records = []; //=> array objects
          cursorRequest = store.openCursor();

          cursorRequest.onsuccess = event => {
            let cursor = event.target.result;
            if (cursor) { 
              //let key = cursor.key; //=> Next key for console output
              let value = cursor.value; //=> Next record
              //console.log(key, value);
              records.push(value);
              cursor.continue();
            }
            else {
              resolve(records); //=> All records collected
              //console.log('All SeedB data retrieved');
              fileNotes.innerHTML += '<li>=> All SeedB data retrieved</li>';
            }
          }
          cursorRequest.onerror = (event) => {
            reject(event.target.errorCode);
          }
        })
      })
      .then(records => {  //=> return records;
        //console.log(records)
        const text = JSON.stringify(records, null, 2); //=> array of records objects converted to string
        //console.log(text);
        let time = Data.fileTime() + ".txt"; //=> Created file name with timestamp
        const filename = "seedB∶" + time;
        //console.log(filename);
        fileNotes.innerHTML += '<li>=> Backup file name is: ' + filename + '</li>';
        Data.download(filename, text); //=> Save backup file.
      });
  } // TO DO: Change to async await structure.

  static download(filename, textInput) { //=> Download filename using browser file download
    const element = document.createElement('a'); //=> Create anchor tag
    element.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(textInput));
    element.setAttribute('download', filename); //=> create and download the stringified record
    document.body.appendChild(element);
    element.click();                            //=> Click the href anchor
    document.body.removeChild(element);         //=> Remove anchor element
    //console.log('Download complete');
    fileNotes.innerHTML += '<li>=> Download is completed.</li>';
  }
 
  static backup() { //=> Upload backup file and merge with data in object store
    const fileSelect = document.getElementById("js-file-select");
    const extractFileData = document.getElementById("js-input-file-data");
    fileSelect.addEventListener("click", function () { //=> Upload Text File button clicked readWritePage
      if (extractFileData) { extractFileData.click(); } }, false);
    extractFileData.onchange = function () { //=> Parse data to JSON objects in an array
      let dataFile = [];
      const file = this.files[0];
      //console.log(file);
      //console.log(file.name);
      //console.log(file.lastModifiedDate.toString().slice(0,24));
      backupNotes.innerHTML += '<li>=> Backup file used:  '+file.name+'</li>';
      backupNotes.innerHTML += '<li>=> Backup file was created on:  '+ file.lastModifiedDate.toString().slice(0, 24) + '</li>';
      backupNotes.innerHTML += '<li>=> Backup file now merged with seed list already in db</li>';
      const reader = new FileReader();
      reader.onload = function (progressEvent) {
        //console.log(this.result);
        dataFile = JSON.parse(this.result);
        //console.log(dataFile);
        Store.addRecords(dataFile);
        //console.log(dataFile[4]);
      };
      reader.readAsText(file);
    };
  } /* TO DO: all the events have to be taken out!
              better documentation need for this function */

}
/* TO DO: wherever a the db is opened in a Store or Data static functions 
          should change that to one only function to open a db
          and use that function in any of the other ones requiring an open db request.
          Might also need to be promise-async-await structure
          Also sort out versioning numbering when creating opening request.  
          Make all Alert messages sticky and only disappear when changing pages
          deletedPkts = []; session storage of deleted seed packets*/
//=> End of Classes

//=> Global variables
let oldSortOn = 'variety'; //=> last sort configuration by user - table column
let oldSortOrder = 'next'; //=> last sort configuration by user - sort order
let toTop = document.getElementById("js-page--to-top"); //=> Get the button
let toBottom = document.getElementById("js-page--to-bottom"); //=> Get the button

const htmlId = id => document.getElementById(id); //=> alias
const foundBtnHomePage = document.getElementById('findBtnHomePage'); //=> alias
const fileNotes = document.getElementById('fileNotifications'); //=> alias for user msgs retrieving data & backup
const backupNotes = document.getElementById('backupNotifications');  //=> alias for user msgs backup installation
const errorMsg = document.getElementById("dbError");  //=> alias forDB error msgs for the UI
const msgInstallBb = document.getElementById('installDbMsg'); //=> alias for UI installation msgs

//=> Restore data from backup file
Data.backup(); // TO DO: have to sort the events in that function
 
//=> Events 
window.onscroll = () => { UI.scrollEvent() }; //=> scrolls down 20px, show the up button

window.onload = () => { Store.dbExist() }; //=> Load IndexedDB and check for right store

//=> Menu events
document.querySelector(".js-menu-hamburger").addEventListener("click", UI.menu);
// Menu selection events
htmlId('eventHomePage').addEventListener('click', () => { UI.selectPages('homePage') }, false);
htmlId('eventPktPage').addEventListener('click', () => { UI.selectPages('newPktPage') }, false);
htmlId('eventScrollPage').addEventListener('click', () => { UI.selectPages('scrollRecords') }, false)
htmlId('eventReadWritePage').addEventListener('click', () => { UI.selectPages('readWritePage') }, false);
htmlId('eventErrorPage').addEventListener('click', () => { UI.selectPages('dbError') }, false);
htmlId('eventInstrPage').addEventListener('click', () => { UI.selectPages('instructionsPage') }, false);

//=> Sort table columns events
htmlId('sortSeedGroup').addEventListener('click', () => { UI.refreshTable('seedGroup') }, false);
htmlId('sortVariety').addEventListener('click', () => { UI.refreshTable('variety') }, false);
htmlId('sortPktId').addEventListener('click', () => { UI.refreshTable('pktId') }, false);
htmlId('sortDatePacked').addEventListener('click', () => { UI.refreshTable('seedDatePacked') }, false);

//=> Button & input events
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
/*TO DO: make this functions static 
         convert all to sync await protocol
         create universal open db promise 
*/

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
    const db = new Db();
    await db.open();    
    const records = await db.getAll(sortOn, sortOrder);
    UI.displaySeeds(records);
};

// Event get pktId from table
async function editSeedPkt(pktId) {
    const db = new Db();
    await db.open();
    const record = await db.getRecord(pktId);
    UI.editSeed(record, 'editSeedPkt');
};

//=> Design Scroll pages

function fetchSelKeyPrimKey(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['collection'], "readonly");
    const store = transaction.objectStore('collection');
    const selIndex = store.index('seedDatePacked')
    const selKey = [];
    const pktIds = [];
    //const data = [];
    const keysData = {};
    selIndex.openCursor().onsuccess = (event) => {
      const cursor = event.target.result;
      if(cursor) {
        selKey.push(cursor.key);
        //pktIds.push(cursor.primaryKey);
        cursor.continue();
      }
      else {
        /* data = pktIds.map((value, index) => ({[value]: selKey[index]}));
        resolve(data); */
        /* pktIds.forEach((pktId, i) => keysData[pktId] = selKey[i]);
        resolve(keysData); */
        resolve(selKey);
        //console.log('finished');
      }
    }
    selIndex.openCursor().onerror = (event) => {
      reject(event.target.errorCode);
    }
  })
};

function fetchOnlyPrimKey(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['collection'], "readonly");
    const store = transaction.objectStore('collection');
    const selIndex = store.index('seedDatePacked');
    const getAllKeyReq = selIndex.getAllKeys();
    getAllKeyReq.onsuccess = (event) => {
      const allKeyData = event.target.result;
      //console.log(allKeyData);
      //console.log(getAllKeyReq.result);
      console.log(allKeyData[34]);
      resolve(allKeyData);
    }
    getAllKeyReq.onerror = (event) => {
      reject(event.target.errorCode);
    }
  })
};

async function printMe() {
    const db = new Db();
    db.open();
    const values = await fetchSelKeyPrimKey(db.db);
    const keys = await fetchOnlyPrimKey(db.db);
    console.log(keys);
    console.log(values);
    const data = {};

    for (let i = 0; i < keys.length; i++) {
        data[keys[i]] = values[i];
    }
    console.log(data)
}

// printMe();
