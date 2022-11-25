/*All console.log are disable, were there for debugging
  => New Comment
  -> Continuation of initial comment*/
'use strict';

class Model {
  // responsible for Db access
  constructor() {
    this.db = null;
    this.version = null;
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
        const store = this.db.createObjectStore('collection', { keyPath: 'packetId' });
        store.createIndex('variety', 'variety', { unique: false });
        store.createIndex('group', 'group', { unique: false });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('number', 'number', { unique: false });
        store.createIndex('weight', 'weight', { unique: false });
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
    if (this.db === null) {
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
        //console.log('Deleted database successfully');
        resolve('success');
      };
      req.onerror = function () {
        //console.log('Couldn't delete database');
        reject('error');
      };
      req.onblocked = function () {
        //console.log('Couldn't delete database due to the operation being blocked');
        reject('blocked')
      };
    });
  }

  getRecord(id) {
    return new Promise(async (resolve, reject) => {
      await this.tryOpen();
      const transaction = this.db.transaction('collection', 'readonly');
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
      const transaction = this.db.transaction('collection', 'readonly');
      const objectStore = transaction.objectStore('collection');
      if (sortOn === 'packetId') {
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

  async deleteRecord(packetId) {
    await this.tryOpen();
    const transaction = this.db.transaction('collection', 'readwrite');
    const store = transaction.objectStore('collection');
    store.delete(packetId);
  }
}

class View {
  // View is responsible for presenting the model to the user
  // that is, updating the DOM.
  // It is not responsible for:
  //  - handling user input
  //  - updating the database
  // It does not make requests of the Model

  constructor() {
    this.app = this.getElement('#root');

    // Pages events
    this.seedListLinkElements = document.querySelectorAll('.openHomePage');
    this.addNewPacketLinkElement = document.querySelector('.openNewPacketPage');
    this.scrollPacketsLinkElement = document.querySelector('.openScrollPacketsPage');
    this.backupRestoreLinkElement = document.querySelector('.openBackupRestorePage');
    this.dbErrorLinkElement = document.querySelector('.openDbErrorPage');
    this.instructionsLinkElements = document.querySelectorAll('.openInstructionsPage');
    //Sort table columns events
    this.sortGroupLinkElement = document.getElementById('sortGroup');
    this.sortVarietyLinkElement = document.getElementById('sortVariety');
    this.sortPacketIdLinkElement = document.getElementById('sortPacketId');
    this.sortDateLinkElement = document.getElementById('sortDate');
    this.sortNumberLinkElement = document.getElementById('sortNumber');
    this.sortWeightLinkElement = document.getElementById('sortWeight');
    // Button events
    this.btnSubmitEditRecordLinkElement = document.querySelector('#btnSubmitEditRecord');
    this.btnSubmitNewRecordLinkElement = document.querySelector('#btnSubmitNewRecord');
    this.btnDeleteRecordLinkElement = document.querySelector('#btnDeleteRecord');
    this.btnRetrieveDataLinkElement = document.querySelector('#btnRetrieveData');
    // Menu events
    this.toTop = document.getElementById('js-page--to-top'); //=> Get the button
    this.toBottom = document.getElementById('js-page--to-bottom'); //=> Get the button
    this.pageTopButton = window.onscroll = () => { this.scrollEvent() };
    this.menuButton = document.querySelector('.js-menu-hamburger');
    this.menuButton.addEventListener('click', () => { this.toggleMenu() });
    this.closedMenu = document.querySelector('.js-menu-hamburger--closed');
  }

  bindHomePageLink(handler) {
    // pass on to Controller
    this.seedListLinkElements.forEach(btn => btn.addEventListener('click', handler, false));
    //console.log(handler);
  }
  bindAddNewPacketLink(handler) { // Add New Packet Page
    //can be converted to multiple classes to trigger this event
    //variable addNewLinkElement is singular as only one class at the moment
    this.addNewPacketLinkElement.addEventListener('click', handler, false);
  }
  bindScrollPacketsLink(handler) { // Scroll Packets Page
    this.scrollPacketsLinkElement.addEventListener('click', handler, false);
  }
  bindBackupRestoreLink(handler) { // Backup & Restore Page
    this.backupRestoreLinkElement.addEventListener('click', handler, false);
  }
  bindDbErrorLink(handler) { // Reinstall corrupted DB
    this.dbErrorLinkElement.addEventListener('click', handler, false);
  }
  bindInstructionsPageLink(handler) {
    this.instructionsLinkElements.forEach(request => request.addEventListener('click', handler, false));
  }

  bindSortGroup(handler) {
    this.sortGroupLinkElement.addEventListener('click', handler, false);
  }
  bindSortVariety(handler) {
    this.sortVarietyLinkElement.addEventListener('click', handler, false);
  }
  bindSortPacketId(handler) {
    this.sortPacketIdLinkElement.addEventListener('click', handler, false);
  }
  bindSortDate(handler) {
    this.sortDateLinkElement.addEventListener('click', handler, false);
  }
  bindSortNumber(handler) {
    this.sortNumberLinkElement.addEventListener('click', handler, false);
  }
  bindSortWeight(handler) {
    this.sortWeightLinkElement.addEventListener('click', handler, false);
  }

  bindBtnSubmitEditRecord(handler) {
    this.btnSubmitEditRecordLinkElement.addEventListener('click', handler, false);
  }
  bindBtnSubmitNewRecord(handler) {
    this.btnSubmitNewRecordLinkElement.addEventListener('click', handler, false);
  }
  bindBtnDeleteRecord(handler) {
    this.btnDeleteRecordLinkElement.addEventListener('click', handler, false);
  }
  bindBtnRetrieveData(handler) {
    this.btnRetrieveDataLinkElement.addEventListener('click', handler, false);
  }
  // async findHelpTopic(topic=all) {
  //     this.displayHelpTopic()
  // }

  // transfer this to Controller
  requestSpecificHelp() {
    // designed to show specific instructions when clicked on ? anywhere
    this.showInstructions();
    //await this.findHelpTopic();
  }

  pageEvent(selector, trigger) {
    document.querySelector(selector).addEventListener('click', () => {
      this.selectPages(trigger)
    }, false);
  }


  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    return element;
  }

  getElement(selector) {
    const element = document.querySelector(selector);
    return element;
  }

  addPacketToTable(seedPkt) {
    // Adds a packet as a row to packet list
    const list = document.querySelector('#seed-list');
    const row = document.createElement('tr');
    row.innerHTML =
      `<td>${seedPkt.group}</td>
            <td>${seedPkt.variety}</td>
            <td>${seedPkt.packetId}</td>
            <td class='table-seeds__col--center'>${(seedPkt.date).substring(2)}</td>
            <td class='table-seeds__col--center'>${seedPkt.number}</td>
            <td class='table-seeds__col--center'>${seedPkt.weight}</td>
            <td class='edit' onclick=controller.editSeedPkt('${seedPkt.packetId}')></td>`;
    list.appendChild(row);
  }

  displayPackets(packets) {
    // Delete table rows first before entering updated data on home page
    const table = document.querySelector('#seed-list');
    while (table.rows.length > 0) {
      table.deleteRow(0);
    };
    packets.forEach((packet) => this.addPacketToTable(packet));
  }

  showAlert(message, className, idMessage, idLocation) {
    //alert('Record submitted');
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

  clearFields() {
    //=> Clears all the entry fields on the edit/add page
    document.querySelector('#group').value = '';
    document.querySelector('#variety').value = '';
    document.querySelector('#packetId').value = '';
    document.querySelector('#number').value = '';
    document.querySelector('#weight').value = '';
    document.querySelector('#date').value = '';
    document.querySelector('#timeStamp').value = '';
    document.querySelector('#seedNotes').value = '';
  }

  clearCopiedField() {
    document.querySelector('#packetId').value = '';
    document.querySelector('#date').value = '';
    document.querySelector('#timeStamp').value = '';
    document.querySelector('#seedNotes').value = ''
  }

  // Open Pages
  showHomePage() {
    if (document.getElementById('showHide').classList.contains('js-all-pages--none')) {
      document.getElementById('showHide').classList.add('js-all-pages--opened');
      document.getElementById('showHide').classList.remove('js-all-pages--none');
    }
    document.title = 'SeedB List'; //=> Page at startup being the seed list
    document.querySelector('#home-page').style.display = '';
    document.querySelector('#edit-page').style.display = 'none';
    document.querySelector('#read-write-page').style.display = 'none';
    document.querySelector('#instructions-page').style.display = 'none';
  }

  showAddNewPacket() {
    // this.clearFields();
    // clearFields() only called from menu event, not from buttons
    document.title = 'New Seed Pkt';
    document.querySelector('#headerAddSeedPage').style.display = '';
    document.querySelector('#new-pkt-buttons').style.display = '';
    document.querySelector('#edit-pkt-buttons').style.display = 'none';
    document.querySelector('#scrollRecordsButtons').style.display = 'none';
    document.querySelector('#home-page').style.display = 'none';
    document.querySelector('#headerEditSeedPage').style.display = 'none';
    document.querySelector('#edit-page').style.display = '';
    document.querySelector('#read-write-page').style.display = 'none';
    document.querySelector('#instructions-page').style.display = 'none';
    // Key packetId readonly removed and is required
    document.querySelector('#packetId').removeAttribute('readonly');
    document.querySelector('#packetId').setAttribute('required', 'required');
  }

  showEditPacket() {
    document.title = 'Edit Seed Pkt';
    document.querySelector('#edit-pkt-buttons').style.display = '';
    document.querySelector('#headerAddSeedPage').style.display = 'none';
    document.querySelector('#new-pkt-buttons').style.display = 'none';
    document.querySelector('#scrollRecordsButtons').style.display = 'none';
    document.querySelector('#home-page').style.display = 'none';
    document.querySelector('#headerEditSeedPage').style.display = '';
    document.querySelector('#edit-page').style.display = '';
    document.querySelector('#read-write-page').style.display = 'none';
    document.querySelector('#instructions-page').style.display = 'none';
    // Key packetId is read only
    document.querySelector('#packetId').removeAttribute('required');
    document.querySelector('#packetId').setAttribute('readonly', 'readonly');   
  }

  showScrollPackets() {
    this.clearFields();
    document.title = 'Scroll Pkt Records';
    document.querySelector('#new-pkt-buttons').style.display = 'none';
    document.querySelector('#edit-pkt-buttons').style.display = 'none';
    document.querySelector('#scrollRecordsButtons').style.display = '';
    document.querySelector('#home-page').style.display = 'none';
    document.querySelector('#edit-page').style.display = '';
    document.querySelector('#read-write-page').style.display = 'none';
    document.querySelector('#instructions-page').style.display = 'none';
  }

  showBackupRestore() {
    document.title = 'Backup & Restore';
    document.querySelector('#retrieve-data-button').style.display = '';
    document.querySelector('#home-page').style.display = 'none';
    document.querySelector('#edit-page').style.display = 'none';
    document.querySelector('#read-write-page').style.display = '';
    document.querySelector('#instructions-page').style.display = 'none';
    document.querySelector('#dbError').style.display = 'none'
  }

  showDbError() {
    //=> checks if pages are hidden before loading error page on start
    /* if (document.getElementById('showHide').classList.contains('js-all-pages--none')) {
      document.getElementById('showHide').classList.add('js-all-pages--opened');
      document.getElementById('showHide').classList.remove('js-all-pages--none');
    } */
    document.title = 'DB Error';
    //=> on start up if db fails this page will be loaded
    document.querySelector('#retrieve-data-button').style.display = 'none';
    document.querySelector('#home-page').style.display = 'none';
    document.querySelector('#edit-page').style.display = 'none';
    document.querySelector('#read-write-page').style.display = '';
    document.querySelector('#instructions-page').style.display = 'none';
    document.querySelector('#dbError').style.display = ''
  }

  showInstructions() {
    //=> page for instructions
    //this.clearFields();
    document.title = 'Instructions';
    //document.querySelector('#seed-entry').style.display = 'none';
    document.querySelector('#home-page').style.display = 'none';
    document.querySelector('#edit-page').style.display = 'none';
    document.querySelector('#read-write-page').style.display = 'none';
    document.querySelector('#instructions-page').style.display = '';
  }

  toggleMenu() {
    //=> toggle function using class lists on click of the hamburger menu
    this.closedMenu.classList.toggle('js-menu-hamburger--opened');

  }

  scrollToBottom() { //=> function activated on click of down arrow
    if (document.documentElement.scrollHeight > document.documentElement.clientHeight) {
      const scrollHeight = document.documentElement.scrollHeight;
      window.scrollTo(0, scrollHeight);
    }
  }

  scrollToTop() { //=> function activated on click of up arrow
    this.toBottom = document.getElementById('js-page--to-bottom');
    this.toBottom.style.display = 'block'
    document.body.scrollTop = 0; //=> For Safari
    document.documentElement.scrollTop = 0; //=> For Chrome, Firefox, IE and Opera
  }

  scrollEvent() {
    //=> scroll event to hide or show to top button
    //=> scrolls down 20px, show the up button
    if (document.body.scrollTop > 10 || document.documentElement.scrollTop > 10) {
      this.toTop.style.display = 'block';
    } else {
      this.toTop.style.display = 'none';
    }
  }

  /* static locateBtnHomePage(e) { //=> select from classList the right return to Home page button
      if (e.target === foundBtnHomePage) {
          fileNotes.innerHTML = '';
          //console.log('file notes deleted');
          backupNotes.innerHTML = '';
      };
      //console.log('Home Page selected');
      View.showHomePage();
  } */

/*   editSeed(record) { //=> opens the edit/add page ->
    this.clearFields();
    this.showEditPacket();
    Object.keys(record).forEach(field => { // -> with the requested seed pkt record for editing
      //console.log(field);
      //console.log(record[field]);
      document.querySelector('#' + field).value = record[field];
    });
  } */ //=> Should be in Controller!!!

  static showMessage(message) {
    msgInstallBb.innerHTML += (`<li>=> ${message}</li>`);
  }

  /* bindEditAddSeedPages(handler) {
      this.pagesAddEditLinkElements.forEach(btn => btn.addEventListener('click', handler, false));
  } */
}

class Controller {
  // Responsible for handling user input

  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.sortOn = 'variety';
    this.sortOrder = 'next';
    // bindings pages
    this.view.bindHomePageLink(() => { this.requestPacketListPage(); });
    this.view.bindAddNewPacketLink( () => { this.requestAddNewPacketPage(); });
    this.view.bindScrollPacketsLink( () => { this.requestScrollPacketsPage(); });
    this.view.bindBackupRestoreLink( () => { this.requestBackupRestorePage(); });
    this.view.bindDbErrorLink(() => { this.requestDbErrorPage(); });
    this.view.bindInstructionsPageLink( () => { this.requestHelpPage(); });
    // bindings table sort
    this.view.bindSortGroup( () => { this.requestSortedPacketList('group'); });
    this.view.bindSortVariety( () => { this.requestSortedPacketList('variety'); });
    this.view.bindSortPacketId( () => { this.requestSortedPacketList('packetId'); });
    this.view.bindSortDate( () => { this.requestSortedPacketList('date'); });
    this.view.bindSortNumber( () => { this.requestSortedPacketList('number'); });
    this.view.bindSortWeight( () => { this.requestSortedPacketList('weight'); });
    // bindings button events
    this.view.bindBtnSubmitEditRecord( () => { this.requestAddRecord('editRecord'); });
    this.view.bindBtnSubmitNewRecord( () => { this.requestAddRecord('newRecord'); });
    this.view.bindBtnDeleteRecord( () => { this.requestDeleteRecord(); });
    this.view.bindBtnRetrieveData( () => { this.requestRetrieveAllData(); });
  }

  async requestSortedPacketList(sortOn) {
    if (sortOn !== undefined) {
      // if sortOn is supplied, then the user is attempting
      // to change the sorting
      // sameSortColumn is true if the user has requested the
      // same sorting column as last time
      const sameSortColumn = sortOn === this.sortOn;
      // if the same column for sorting was requested
      // and the sorting direction was already 'next'
      // then we should change the sortOrder to 'prev'
      let sortOrder;
      if (sameSortColumn && this.sortOrder === 'next') {
        sortOrder = 'prev';
      } else {
        sortOrder = 'next';
      }
      // save the new sorting order and column
      this.sortOrder = sortOrder;
      this.sortOn = sortOn;
    }
    // request the new data from the model
    const records = await this.model.getAll(this.sortOn, this.sortOrder);
    this.view.displayPackets(records);
  }

  // Pages requested
  async requestPacketListPage() {
    this.view.showHomePage();
    await this.requestSortedPacketList();
  }
  requestAddNewPacketPage() {
    this.view.showAddNewPacket();
  }
  requestScrollPacketsPage() {
    this.view.showScrollPackets();
  }
  requestBackupRestorePage() {
    this.view.showBackupRestore();
  }
  requestDbErrorPage() {
    this.view.showDbError();
  }
  requestHelpPage() {
    // designed to show specific instructions when clicked on ? anywhere
    this.view.showInstructions();
    //await this.findHelpTopic();
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

  async loadRecord() {
    // Get the content from the form fields
    const formData = new FormData(document.getElementById('seed-entry'));
    const seed = Object.fromEntries(formData);
    seed['timeStamp'] = Date.now();
    let missingRequiredField;
    checkEntries: {
      for (const pair of formData.entries()) {
        const key = pair[0];
        const value = pair[1];
        const missingField = value === '';
        const isRequired = document.getElementById(key).hasAttribute('required');
        missingRequiredField = missingRequiredField || (missingField && isRequired);
        if (missingRequiredField) {
          this.view.showAlert('Please fill in all fields', 'warning', '#pkt-message', '#insert-form-alerts');
          break checkEntries;
        };
      };
    };
    if (!missingRequiredField) {
      //convert string from FormData to integer and float
      seed.number = parseInt(seed.number);
      seed.weight = parseFloat(seed.weight);
      await this.model.loadRecords([seed]);
      await this.view.showAlert('Seed Packet Added', 'success', '#pkt-message', '#insert-form-alerts');
      //=> Show success message
      //await this.requestPacketListPage();
      //this.view.clearFields();  //=> Clear form fields
    };
  };

  async editSeedPkt(packetId) {
    const record = await this.model.getRecord(packetId);
    this.view.clearFields();
    this.view.showEditPacket();
    Object.keys(record).forEach(field => { // -> with the requested seed pkt record for editing
      //console.log(field);
      //console.log(record[field]);
      document.querySelector('#' + field).value = record[field];
    });
    //this.view.editSeed(record, 'editSeedPkt');
  };

  async requestAddRecord(submit) {
    await this.loadRecord();
    switch (submit) {
      case 'editRecord':
        console.log('edit record');
        this.view.clearFields();
        this.requestPacketListPage();
        break;
      case 'newRecord':
        console.log('new record');
        this.view.clearFields();  //=> Clear form fields
        this.view.showAddNewPacket();
        break;
      default:
        break;
    };
  };

  async requestDeleteRecord() {
    //=> Delete record requested from delete button on edit page
    const packetId = document.querySelector('#packetId').value;
    //=> packetId obtained from edit button on seed list
    await this.model.deleteRecord(packetId);
    this.view.showAlert('Seed Packet Deleted', 'warning', '#pkt-message', '#insert-form-alerts'); //=> Show success message
    this.view.clearFields(); //=> Clear form fields
    this.model.getAll();
    await this.requestPacketListPage();
  };

  fileTime() {  //=> Timestamp for file names
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = '0' + (date.getMonth() + 1)
    const day = '0' + date.getDate();
    const hours = '0' + date.getHours();
    const minutes = '0' + date.getMinutes();
    const formattedTime = `${year.slice(-2)}-${month.slice(-2)}-${day.slice(-2)}T${hours.slice(-2)}∶${minutes.slice(-2)}`;
    return formattedTime;
  }

  download(filename, textInput) {
    //=> Download filename using browser file download
    const element = document.createElement('a'); //=> Create anchor tag
    element.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(textInput));
    element.setAttribute('download', filename); //=> create and download the stringified record
    document.body.appendChild(element);
    element.click();                            //=> Click the href anchor
    document.body.removeChild(element);         //=> Remove anchor element
    //console.log('Download complete');
    fileNotes.innerHTML += '<li>=> Download is completed.</li>';
  }

  async requestRetrieveAllData() {
    //=> Collects all data records from DB
    const records = await this.model.getAll();
    const text = JSON.stringify(records, null, 2); //=> array of records objects converted to string
    let time = this.fileTime() + '.txt'; //=> Created file name with timestamp
    const filename = 'seedB∶' + time;
    fileNotes.innerHTML += '<li>=> Backup file name is: ' + filename + '</li>';
    this.download(filename, text); //=> Save backup file.
  }

  backup() { //=> Upload backup file and merge with data in object store
    const fileSelect = document.getElementById('js-file-select');
    const extractFileData = document.getElementById('js-input-file-data');
    fileSelect.addEventListener('click', function () { //=> Upload Text File button clicked pageBackupRestore
      if (extractFileData) { extractFileData.click(); }
    }, false);
    extractFileData.onchange = function () { //=> Parse data to JSON objects in an array
      let dataFile = [];
      const file = this.files[0];
      //console.log(file);
      //console.log(file.name);
      //console.log(file.lastModifiedDate.toString().slice(0,24));
      backupNotes.innerHTML += '<li>=> Backup file used:  ' + file.name + '</li>';
      backupNotes.innerHTML += '<li>=> Backup file was created on:  ' + file.lastModifiedDate.toString().slice(0, 24) + '</li>';
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
  }   /* TO DO: all the events have to be taken out of backup()!
                  better documentation need for this function
        */
}

//=> End of Classes
/* TO DO: wherever a the db is opened in a Store or Data static functions
          should change that to one only function to open a db
          and use that function in any of the other ones requiring an open db request.
          Might also need to be promise-async-await structure
          Also sort out versioning numbering when creating opening request.
          Make all Alert messages sticky and only disappear when changing pages
          deletedPkts = []; session storage of deleted seed packets
          Checking for the right store on start
*/

const model = new Model();
const view = new View();
const controller = new Controller(model, view);

window.onload = () => { controller.requestPacketListPage() }; //=> Load IndexedDB and check for right store is missing!

//=> Global variables
const htmlId = id => document.getElementById(id); //=> alias
const foundBtnHomePage = document.getElementById('findBtnHomePage'); //=> alias
const fileNotes = document.getElementById('fileNotifications'); //=> alias for user msgs retrieving data & backup
const backupNotes = document.getElementById('backupNotifications');  //=> alias for user msgs backup installation
const errorMsg = document.getElementById('dbError');  //=> alias forDB error msgs for the UI
const msgInstallBb = document.getElementById('installDbMsg'); //=> alias for UI installation msgs

//=> Restore data from backup file
controller.backup(); // TO DO: have to sort the events in that function

//=> Button & input events
htmlId('btnReinstall').addEventListener('click', () => { controller.fixCorruptDB() }, false);
htmlId('js-page--to-bottom').addEventListener('click', () => { view.scrollToBottom() }, false);
htmlId('js-page--to-top').addEventListener('click', () => { view.scrollToTop() }, false);

htmlId('btnCopyRecord').addEventListener('click', () => {
  view.clearCopiedField();
  view.showAddNewPacket();
})