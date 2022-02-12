// Seed Class: Represents a Seed Packet
class Seed {
  constructor(seedGroup, variety, pktId, seedNumbers, seedWeight) {
    this.seedGroup = seedGroup;
    this.variety = variety;
    this.pktId = pktId;
    this.seedNumbers = seedNumbers;
    this.seedWeight = seedWeight;
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displaySeeds(seedTable) {
     seedTable.forEach((row) => UI.addSeedToList(row));
  }

  static addSeedToList(seedPkt) {
    const list = document.querySelector('#seed-list');

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${seedPkt.seedGroup}</td>
      <td>${seedPkt.variety}</td>
      <td>${seedPkt.pktId}</td>
      <td class="table-seeds__col--center">${seedPkt.seedNumbers}</td>
      <td class="table-seeds__col--center">${seedPkt.seedWeight}</td>
      <td class="edit"></td>
      <td class="change-link table-seeds__col--center"><a href="#" class="delete">X</a></td>
      <td class="change-link table-seeds__col--center strike">
      <a href="" class="undelete">Un</a></td>
    `;

    list.appendChild(row);
  }

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
    setTimeout(() => document.querySelector('.alert').remove(), 2000);
  }

  static clearFields() {
    document.querySelector('#seedGroup').value = '';
    document.querySelector('#variety').value = '';
    document.querySelector('#pktId').value = '';
    document.querySelector('#seedNumbers').value = '';
    document.querySelector('#seedWeight').value = '';
  }
}

// Store Class: Handles Storage 
class Store {
  static openDB() {
    const request = window.indexedDB.open('seedB', 1 );
    /* request.onerror = function(e){              // Listen for execution when connection database fails
      console.log('Failure to connect database');
    }
    request.onsuccess = function(e) {            // Listen for execution when the connection database is successful
      console.log('Successful connection to database');
    } */
    
    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      const store = db.createObjectStore('entity', {keyPath: 'pktId'});
      store.createIndex('variety', 'variety', {unique: false});
      store.createIndex('seedGroup', 'seedGroup', {unique: false});
      store.createIndex('timeStamp', 'timeStamp', {unique: false});
      console.log('Index Creation Successful');
      console.log('The new database version number is = ' + event.newVersion);
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
    };
  }
}

// Seed Data
const time = Date.now();
const startDate = new Date(time).toLocaleString();
let seedData = [
  {
    pktId: "9-red-tulip",
    seedGroup: "Bulbs",
    variety: "Tulip Red",
    seedWeight: 2000,
    seedNumbers: 10,
    timeStamp: time,
    date: startDate,
    qrCode: ""
  },
  {
    pktId: "10-curly-kale",
    seedGroup: "Vegetables",
    variety: "Curly Kale",
    seedWeight: 30,
    seedNumbers: 100,
    timeStamp: time
  },
  {
    pktId: "11-carrots",
    seedGroup: "Vegetables",
    variety: "Carrots",
    seedWeight: 140,
    seedNumbers: 1000,
    timeStamp: time
  },
  {
    pktId: "1-danish-poppy",
    seedGroup: "Drugs",
    variety: "Danish Poppy",
    seedWeight: 20,
    seedNumbers: 10,
    timeStamp: time,
    date: startDate,
    qrCode: ""
  }
];

// Event Open DB
document.addEventListener('DOMContentLoaded', Store.openDB);

// Event: Displays Seeds
//document.addEventListener('DOMContentLoaded', UI.displaySeeds(seedData));

// Event:Add Seed Packet
document.querySelector('#seed-entry').addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const seedGroup = document.querySelector('#seedGroup').value;
  const variety = document.querySelector('#variety').value;
  const pktId = document.querySelector('#pktId').value;
  const seedNumbers = document.querySelector('#seedNumbers').value;
  const seedWeight = document.querySelector('#seedWeight').value;

  // Validate
  if (seedGroup === '' || variety === '' || pktId === '' || seedNumbers === '' || seedWeight === '') {
    UI.showAlert('Please fill in all fields', 'warning', '#pkt-message', '#insert-form-alerts');

  }
  else {
    // Instantiate seed
    const seed = new Seed(seedGroup, variety, pktId, seedNumbers, seedWeight);

    // Add seed entry to UI
    UI.addSeedToList(seed);

    // Show success message
    UI.showAlert('Seed Packet Added', 'success', '#pkt-message', '#insert-form-alerts');

    // Clear form fields
    UI.clearFields();
  }
});

// Event: Remove Seed Packet
document.querySelector('#seed-list').addEventListener('click', (e) => {
  //console.log(e.target);
  UI.deleteSeed(e.target);

  // Show success message
  UI.showAlert('Seed Packet Removed', 'warning', '#seed-list-message', '#insert-seed-list-alerts');
});

// Event Add Data
document.querySelector('#add-data').addEventListener('click', () => {
  Store.addData(seedData);
  UI.displaySeeds(seedData);
});





