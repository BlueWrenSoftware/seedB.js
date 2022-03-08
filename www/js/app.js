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
    while(table.rows.length > 0) {
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
  //needs re-writing
  static deleteSeed(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className, idMessage, idLocation) {
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    const messages = document.querySelector(`${idMessage}`);
    const section = document.querySelector(`${idLocation}`);
    section.insertBefore(div, messages);
    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 1000);
  }

  static clearFields() {
    document.querySelector('#seedGroup').value = '';
    document.querySelector('#variety').value = '';
    document.querySelector('#pktId').value = '';
    document.querySelector('#seedNumbers').value = '';
    document.querySelector('#seedWeight').value = '';
    document.querySelector('#seedDatePacked').value = '';
    document.querySelector('#seedNotes').value = '';
  }

  static selectPages(pageSelected) {
    if (pageSelected === "homePage") {
      loadData('variety');
      document.querySelector("#home-page").style.display = "";
      document.querySelector("#edit-page").style.display = "none";
      document.querySelector("#instructions-page").style.display = "none";
    }
    if (pageSelected === "editPage") {
      UI.clearFields();
      document.querySelector("#home-page").style.display = "none";
      document.querySelector("#edit-page").style.display = "";
      document.querySelector("#instructions-page").style.display = "none";
    }
    if (pageSelected === "instructionsPage") {
      document.querySelector("#home-page").style.display = "none";
      document.querySelector("#edit-page").style.display = "none";
      document.querySelector("#instructions-page").style.display = "";
    }
  }

  static menu() {
    let getMenu = document.querySelector(".js-menu-hamburger--black");
    getMenu.classList.toggle("js-menu-hamburger--red");
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

  // Should be in Store Class?
  static editSeed(record, editPage) {
    UI.selectPages(editPage);
    Object.keys(record).forEach(key => {
      document.querySelector('#' + key).value = record[key];
    });
  }
}

// Store Class: Handles Storage 
class Store {
  static openDB() {
    const request = window.indexedDB.open('seedB', 1 );
    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      const store = db.createObjectStore('entity', {keyPath: 'pktId'});
      store.createIndex('variety', 'variety', {unique: false});
      store.createIndex('seedGroup', 'seedGroup', {unique: false});
      store.createIndex('seedDatePacked', 'seedDatePacked', {unique: false});
      store.createIndex('timeStamp', 'timeStamp', {unique: false});
      console.log('Index Creation Successful');
      console.log('The new database version number is = ' + event.newVersion);
    }
  }
  static editAddRecord() {
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
      // Add SeedPkt to IndexedDB
      const request = window.indexedDB.open('seedB', 1);
      request.onsuccess = (event) => {
        console.log('request success');
        const db = event.target.result;
        db.onerror = function(event) {
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
      //Refresh table
      refreshTable('pktId');
    }
  }
      
  static addData(records) {
    const request = window.indexedDB.open('seedB', 1);
    request.onsuccess = (event) => {
      console.log('request success');
      const db = event.target.result;
      db.onerror = function(event) {
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
}
 
function loadData(sortOn = 'variety', sortOrder = 'next') {
  //sortOn = 'variety';
  openDbPromise().then(
    db => {
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
    }).then(records => {
      UI.displaySeeds(records);
    });
}

let oldSortOn ='';
let oldSortOrder = 'prev';

function refreshTable(sortOn) {
  let invertSort = sortOn === oldSortOn;
  let sortOrder = 'next';
  if ((oldSortOrder === sortOrder) && invertSort) {
    sortOrder = 'prev';
  }
  oldSortOn = sortOn;
  oldSortOrder = sortOrder;
  const table = document.getElementById('seed-list');
  loadData(sortOn, sortOrder);
}

// Event Open DB
document.addEventListener('DOMContetLoaded', UI.selectPages("homePage"));   

//Get the buttons:
let totop = document.getElementById("js-page--to-top");
let tobottom = document.getElementById("js-page--to-bottom");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll =  ()=> { UI.scrollEvent() };

// Event:Add Seed Packet
//document.querySelector('#seed-entry').addEventListener('submit', (e) => {
  // Prevent actual submit
  //e.preventDefault();
function editAddRecord() {
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

    // Add SeedPkt to IndexedDB
    const request = window.indexedDB.open('seedB', 1);
    request.onsuccess = (event) => {
      console.log('request success');
      const db = event.target.result;
      db.onerror = function(event) {
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
    
    //Refresh table
    refreshTable('pktId');

  }
};

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
      UI.editSeed(record, 'editPage')
    });
}

// function deleteSeedPkt