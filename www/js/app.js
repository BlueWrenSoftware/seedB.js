/*All console.log are disable, were there for debugging
  => New Comment
  -> Continuation of initial comment*/
'use strict';

class View {
    // View is reponsible for presenting the model to the user
    // that is, updating the DOM.
    // It is not responsible for:
    //  - handling user input
    //  - updating the database
    // It does not make requests of the Model
    
    static addPacketToTable(seedPkt) {
        // Adds a packet as a row to packet list
        const list = document.querySelector('#seed-list');
        const row = document.createElement('tr');
        row.innerHTML =  `<td>${seedPkt.seedGroup}</td>
                          <td>${seedPkt.variety}</td>
                          <td>${seedPkt.pktId}</td>
                          <td class="table-seeds__col--center">${(seedPkt.seedDatePacked).substring(2)}</td>
                          <td class="table-seeds__col--center">${seedPkt.seedNumbers}</td>
                          <td class="table-seeds__col--center">${seedPkt.seedWeight}</td>
                          <td class="edit" onclick="editSeedPkt('${seedPkt.pktId}')"></td>`;
        list.appendChild(row);
    }
    
    static displayPackets(packets) {
        // Delete table rows first before entering updated data on home page
        const table = document.querySelector('#seed-list');
        while (table.rows.length > 0) {
            table.deleteRow(0);
        };
        packets.forEach((packet) => View.addPacketToTable(packet));
    }
    
    static showAlert(message, className, idMessage, idLocation) {
        //=> Creating warning msg when entering data
        const div = document.createElement('div');
        div.className = `alert ${className}`;
        div.appendChild(document.createTextNode(message));
        const messages = document.querySelector(`${idMessage}`);
        //=> where in the html page the msg is located
        const section = document.querySelector(`${idLocation}`); 
        section.insertBefore(div, messages);
        //=> Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 3000); 
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

    static showHomePage() {
        if (document.getElementById("showHide").classList.contains("js-all-pages--none")) {
                document.getElementById("showHide").classList.add("js-all-pages--opened");
                document.getElementById("showHide").classList.remove("js-all-pages--none");
            }
        document.title = "SeedB Blue Wren"; //=> Page at startup being the seed list
        document.querySelector("#home-page").style.display = "";
        document.querySelector("#edit-page").style.display = "none";
        document.querySelector("#read-write-page").style.display = "none";
        document.querySelector("#instructions-page").style.display = "none";
    }

    static showAddPacket() {        
        View.clearFields();
        document.title = "New Seed Pkt";
        document.querySelector("#new-pkt-buttons").style.display = "";
        document.querySelector("#edit-pkt-buttons").style.display = "none";
        document.querySelector("#scrollRecordsButtons").style.display = "none";
        document.querySelector("#home-page").style.display = "none";
        document.querySelector("#edit-page").style.display = "";
        document.querySelector("#read-write-page").style.display = "none";
        document.querySelector("#instructions-page").style.display = "none";
    }

    static selectPages(pageSelected, initialSortOn, initialOrder) {  //=> Selects the pages from menu and other buttons
        if (pageSelected === "homePage") { //=> Checks if all the pages are hidden on startup and remove hidden to show
            View.showHomePage();
        }
        else if (pageSelected === "editSeedPkt") { //=> edit/add page seed packet selected from the seed list
            View.clearFields();
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
            View.showAddPacket();
        }
    else if (pageSelected === "scrollRecords") { //=> edit/add page for new seed packet entry
      View.clearFields();
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

  static locateBtnHomePage(e) { //=> select from classList the right return to Home page button
    if (e.target === foundBtnHomePage)
      {
        fileNotes.innerHTML = "";
        //console.log("file notes deleted");
        backupNotes.innerHTML = "";
      }; 
      //console.log('Home Page selected');
      View.showHomePage();
  } 

  static editSeed(record, editPage) { //=> opens the edit/add page ->
    View.clearFields();
    View.selectPages(editPage);
    Object.keys(record).forEach(field => { // -> with the requested seed pkt record for editing
      //console.log(field);
      //console.log(record[field]);
      document.querySelector('#' + field).value = record[field];
    });
  } //=> Should be in Store Class?

    static showMessage(message) {
        msgInstallBb.innerHTML += (`<li>=> ${message}</li>`);
    }
}

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
    constructor(view = null) {
        this.newlyCreated = false;
        this.db = null;
        this.version = null;
        this.view = view;
    }

    close() {
        this.db.close();
        this.db = null;
    }
    
    open(version) {
	      return new Promise((resolve, reject) => {
	          const request = window.indexedDB.open('seedB', version);    
            request.onupgradeneeded = function (event) {
                this.db = event.target.result;
                const store = this.db.createObjectStore('collection', { keyPath: 'pktId' });
                store.createIndex('variety', 'variety', { unique: false });
                store.createIndex('seedGroup', 'seedGroup', { unique: false });
                store.createIndex('seedDatePacked', 'seedDatePacked', { unique: false });
                store.createIndex('timeStamp', 'timeStamp', { unique: false });
            }

	          request.onsuccess = (event) => {
                this.db = event.target.result;
                this.version = this.db.version;
		            resolve(event.target.result);
	          }

            request.onerror = (event) => {
		            reject(event.target.errorCode);
	          }
	      });
    };

    async tryOpen(version) {
        if (this.db===null) {
            await this.open(version);
        };
    }

    delete() {
        return new Promise((resolve, reject) => {
            if (this.db) {
                this.close();
            };
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
        return new Promise(async (resolve, reject) => {
            await this.tryOpen();
            const transaction = this.db.transaction('collection', "readonly");
            const objectStore = transaction.objectStore('collection');
            const request = objectStore.get(id);
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
        return new Promise(async (resolve, reject) => {
            let cursorRequest;
            await this.tryOpen();
            const transaction = this.db.transaction('collection', "readonly");
            const objectStore = transaction.objectStore('collection');
            if (sortOn === 'pktId') {
                cursorRequest = objectStore.openCursor(null, sortOrder);
            } else {
                const index = objectStore.index(sortOn);
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

    
    async loadRecords(records) {
        await this.tryOpen();
        const transaction = this.db.transaction('collection', 'readwrite');
        const store = transaction.objectStore('collection');
        records.forEach(record => { 
            store.put(record);
        });
    }
};

class Controller {
    // Responsible for handling user input

    constructor(model) {
        this.model = model;
        // Packet sorting column
        this.sortOn = 'variety';
        // Sort 'next' or 'prev'
        this.sortOrder = 'next';
    }

    async showPacketList() {
        View.showHomePage();
        this.getSortedPacketList();        
    }
    
    async getSortedPacketList(sortOn) {
        // Refresh table on selected column for sort
        // if the new sort column is not the same as the old,
        // then we have changed the sorting
        let sameSortColumn = sortOn === this.sortOn;

        // default to sorting forward (next)
        let sortOrder = 'next';
        // if the old sort order is the same as the default
        let sameSortOrder = sortOrder === this.sortOrder; 

        // if the same column for sorting was requested
        // and the sorting direction was already 'next'
        // then we should change the sortOrder to 'prev'
        // for all other cases, we will go with the default
        // sort order
        if (sameSortOrder && sameSortColumn) {
            sortOrder = 'prev';
        }
        // save the new sorting order and column
        this.sortOrder = sortOrder;
        this.sortOn = sortOn;

        // request the new data from the model
        const records = await this.model.getAll(sortOn, sortOrder);
        View.displayPackets(records);
    }

    async fixCorruptDB() {
        try {
            const ret = await this.model.delete();
            View.showMessage('Deleted corrupted database');
        } catch (error) {
            switch (error) {
            case 'error':
                View.showMessage('Could not delete database');
                break;
            case 'blocked':
                View.showMessage('Could not delete database; operation blocked');
                break;
            default:
                View.showMessage('Unknown error');
            }
        }
    }

    async addPacket(form) {
        console.log(form);
    }
}


class Store {  

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
      View.showAlert('Please fill in all fields', 'warning', '#pkt-message', '#insert-form-alerts');
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
      View.showAlert('Seed Packet Added', 'success', '#pkt-message', '#insert-form-alerts'); //=> Show success message
      View.clearFields();  //=> Clear form fields 
      if (mode === 'editSeedPkt') { //=> return to seed list
        View.selectPages('homePage', oldSortOn, oldSortOrder);
      } else if (mode === 'newPktPage') { //=> Create new empty seed packet entry
          View.showAddPacket();
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
    View.showAlert('Seed Packet Deleted', 'warning', '#pkt-message', '#insert-form-alerts'); //=> Show success message
      View.clearFields(); //=> Clear form fields
      model.getAll();
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
      reader.onload = async function (progressEvent) {
        //console.log(this.result);
        dataFile = JSON.parse(this.result);
          //console.log(dataFile);
          await model.loadRecords(dataFile);
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
window.onscroll = () => { View.scrollEvent() }; //=> scrolls down 20px, show the up button
const model = new Db();
const controller = new Controller(model);

//=> Menu events
document.querySelector(".js-menu-hamburger").addEventListener("click", View.menu);
// Menu selection events
htmlId('eventHomePage').addEventListener('click', controller.showPacketList, false);
htmlId('eventPktPage').addEventListener('click', View.showAddPacket, false);
htmlId('eventScrollPage').addEventListener('click', () => { View.selectPages('scrollRecords') }, false)
htmlId('eventReadWritePage').addEventListener('click', () => { View.selectPages('readWritePage') }, false);
htmlId('eventErrorPage').addEventListener('click', () => { View.selectPages('dbError') }, false);
htmlId('eventInstrPage').addEventListener('click', () => { View.selectPages('instructionsPage') }, false);

//=> Sort table columns events
htmlId('sortSeedGroup').addEventListener('click', () => { controller.getSortedPacketList('seedGroup') }, false);
htmlId('sortVariety').addEventListener('click', () => { controller.getSortedPacketList('variety') }, false);
htmlId('sortPktId').addEventListener('click', () => { controller.getSortedPacketList('pktId') }, false);
htmlId('sortDatePacked').addEventListener('click', () => { controller.getSortedPacketList('seedDatePacked') }, false);

//=> Button & input events
htmlId('btnSubmitRecord').addEventListener('click', () => { Store.editAddRecord('editSeedPkt') }, false);
htmlId('btnDeleteRecord').addEventListener('click', () => { Store.deleteRecord() }, false);
htmlId('btnNewRecord').addEventListener('click', () => { Store.editAddRecord('newPktPage') }, false);
htmlId('btnRetrieveData').addEventListener('click', () => { Data.retrieveAll() }, false);
htmlId('btnReinstall').addEventListener('click', () => { controller.fixCorruptDB() }, false);
htmlId('js-page--to-bottom').addEventListener('click', () => { View.scrollToBottom() }, false);
htmlId('js-page--to-top').addEventListener('click', () => { View.scrollToTop() }, false);

// Buttons & inputs all opening Home Page (same class)
document.querySelectorAll('.btnHomePage')
  .forEach(btn => btn.addEventListener('click', (e) => { View.locateBtnHomePage(e) }, false));

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
    View.displayPackets(records);
};

// Event get pktId from table
async function editSeedPkt(pktId) {
    const db = new Db();
    await db.open();
    const record = await db.getRecord(pktId);
    View.editSeed(record, 'editSeedPkt');
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

