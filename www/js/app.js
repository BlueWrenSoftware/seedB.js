"use strict";

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
        store.createIndex('cost', 'cost', { unique: false });
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
  }

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
      }
      request.onerror = (event) => {
        reject(event.target.errorCode);
      }
    });
  }

  getAll(sortOn = 'variety', sortOrder = 'next', filter = '') {
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
          let keys = Object.keys(cursor.value);
          let isFound = keys.some(key => {
            return String(cursor.value[key]).toUpperCase().includes(filter.toUpperCase())
          });
          if (isFound) {
            records.push(cursor.value);
          }
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
    const objectStore = transaction.objectStore('collection');
    records.forEach(record => {
      objectStore.put(record);
    });
  }

  async deleteRecord(packetId) {
    await this.tryOpen();
    const transaction = this.db.transaction('collection', 'readwrite');
    const objectStore = transaction.objectStore('collection');
    objectStore.delete(packetId);
  }

  async deleteAllRecords() {
    await this.tryOpen();
    const transaction = this.db.transaction(['collection'], 'readwrite');
    //transaction.oncomplete => 
    const objectStore = transaction.objectStore('collection');
    const objectStoreRequest = objectStore.clear();
    objectStoreRequest.onsuccess = (event) => {
      console.log('all records are cleared');
      // note.innerHTML += "<li>Request successful.</li>";
    }
  }
}

class View {
  /*	View is responsible for presenting the model to the user
        that is, updating the DOM.
        It is not responsible for:
         - handling user input
         - updating the database
        It does not make requests of the Model */
  constructor() {
    this.app = document.querySelector('#root');
    // Pages events
    this.homePageLinkElements = document.querySelectorAll('.openHomePage');
    this.searchPacketListLinkElements = document.querySelectorAll('.openSearchPacketList');
    this.addNewPacketLinkElement = document.querySelectorAll('.openNewPacketPage');
    this.backupRestoreLinkElement = document.querySelectorAll('.openBackupRestorePage');
    this.dbErrorLinkElement = document.querySelector('.openDbErrorPage');
    this.helpPageLinkElements = document.querySelectorAll('.openHelpPage');
    //Sort table columns events
    this.sortGroupLinkElement = document.querySelector('#sortGroup');
    this.sortVarietyLinkElement = document.querySelector('#sortVariety');
    this.sortPacketIdLinkElement = document.querySelector('#sortPacketId');
    this.sortDateLinkElement = document.querySelector('#sortDate');
    this.sortNumberLinkElement = document.querySelector('#sortNumber');
    this.sortWeightLinkElement = document.querySelector('#sortWeight');
    this.sortCostLinkElement = document.querySelector('#sortCost');
    // Button events
    this.btnScrollBackwardsLinkElement = document.querySelectorAll('.scrollBackwards');
    this.btnScrollForwardsLinkElement = document.querySelectorAll('.scrollForwards');
    this.btnCopyRecordLinkElement = document.querySelector('#btnCopyRecord');
    this.btnSubmitEditRecordLinkElement = document.querySelector('#btnSubmitEditRecord');
    this.btnSubmitNewRecordLinkElement = document.querySelector('#btnSubmitNewRecord');
    this.btnDeleteRecordLinkElement = document.querySelector('#btnDeleteRecord');
    this.btnUploadFileLinkElement = document.querySelector('#uploadFile');
    //this.btnReplaceAllRecordsLinkElement = document.getElementById('btnReplaceAllRecords');
    this.btnRetrieveDataLinkElement = document.querySelector('#btnRetrieveData');
    this.btnReinstallLinkElement = document.querySelector('#btnReinstall');
    this.btnLabelsQueueLinkElement = document.querySelector('#btnLabelsQueue');
    this.btnPrintLabelsLinkElement = document.querySelectorAll('.btnPrintLabels');
    
    this.btnClearFindInputLinkElement = document.querySelector('#clearFindInput');
    this.btnClrBarcodeInputLinkElement = document.querySelectorAll('.clrBarcodeInput');
    
    this.confirmOverwriteDialog = document.querySelector('#confirmOverwriteDialog');
    // Search input events
    this.searchBarcode = document.querySelectorAll('.searchBarcode');
    this.searchFilter = document.querySelector('#searchFilter');
  }

  bindBtnLabelsQueue(handler) {
    this.btnLabelsQueueLinkElement.addEventListener('click', handler, false);
  }
  bindBtnPrintLabels(handler) {
    this.btnPrintLabelsLinkElement.forEach(btn => btn.addEventListener(
      'click', handler, false));
  }

  bindBtnUploadFile(handler) {
    this.btnUploadFileLinkElement.addEventListener('click', handler, false);
  }

  //page events
  bindHomePage(handler) { // Open Home Page
    // pass on to Controller
    this.homePageLinkElements.forEach(btn => btn.addEventListener(
      'click', handler, false));
  }

  bindSearchPacketList(handler) { // Open Home Page
    // pass on to Controller
    this.searchPacketListLinkElements.forEach(btn => btn.addEventListener(
      'click', handler, false));
  }

  bindAddNewPacketPage(handler) { // Add New Packet Page
    this.addNewPacketLinkElement.forEach(btn => btn.addEventListener(
      'click', handler, false));
  }

  bindBackupRestorePage(handler) { // Backup & Restore Page
    this.backupRestoreLinkElement.forEach(btn => btn.addEventListener(
      'click', handler, false));
  }

  /*	bindDbErrorPage(handler) { // Reinstall corrupted DB
          this.dbErrorLinkElement.addEventListener('click', handler, false);
      }*/

  bindHelpPage(handler) {
    this.helpPageLinkElements.forEach(request => request.addEventListener(
      'click', handler, false));
  }
  //sort list table events

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

  bindSortCost(handler) {
    this.sortCostLinkElement.addEventListener('click', handler, false);
  }

  // buttons
  bindBtnScrollBackwards(handler) {
    this.btnScrollBackwardsLinkElement.forEach(btn => btn.addEventListener('click', handler, false));
  }

  bindBtnScrollForwards(handler) {
    this.btnScrollForwardsLinkElement.forEach(btn => btn.addEventListener('click', handler, false));
    //this.btnScrollForwardsLinkElement.addEventListener('click', handler, false);
  }

  bindBtnCopyRecord(handler) {
    this.btnCopyRecordLinkElement.addEventListener('click', handler, false);
  }

  bindBtnSubmitEditRecord(handler) {
    this.btnSubmitEditRecordLinkElement.addEventListener('click', handler, false);
  }

  bindBtnDeleteRecord(handler) {
    this.btnDeleteRecordLinkElement.addEventListener('click', handler, false);
  }

  /*	bindBtnReplaceAllRecords(handler) {
        this.btnReplaceAllRecordsLinkElement.addEventListener('click', handler, false);
      }*/

  bindEditPacket(editPacketRequestHandler) {
    this.editPacketRequestHandler = editPacketRequestHandler;
  }

  //retrieve data, reinstall db
  bindBtnRetrieveData(handler) {
    this.btnRetrieveDataLinkElement.addEventListener('click', handler, false);
  }

  bindBtnReinstall(handler) {
    this.btnReinstallLinkElement.addEventListener('click', handler, false);
  }

  /*	bindBtnUploadBackupFile(handler) {
          const btnUploadBackupFile = document.getElementById('btnUploadData');
          const extractFileData = document.getElementById('backupDataFile');
          btnUploadBackupFile.addEventListener('click', function () { 
            //=> Upload Text File button clicked pageBackupRestore
              if (extractFileData) { extractFileData.click(); }
              }, false);
            extractFileData.onchange = handler;
    };*/

  bindBtnOkOverwritePacket(handler) {
    document.querySelector('#btn-ok-overwrite-packet').onclick = handler;
    console.log(handler);
  }

  bindBtnCancelOverwritePacket(handler) {
    document.querySelector('#btn-cancel-overwrite-packet').onclick = handler;
  }

  /*     bindSearchFilter(handler) {
          document.querySelector('#searchFilter').addEventListener('input', handler);
      } */

  bindSearchFilter(handler) {
    this.searchFilter.addEventListener('input', handler, false);
  }
  bindClearFindInput(handler) {
    this.btnClearFindInputLinkElement.addEventListener('click', handler, false);
  }

  bindSearchBarcode(handler) {
    this.searchBarcode.forEach(scan => scan.addEventListener('keyup', handler, false));
  }
  bindClrBarcodeInput(handler) {
    //this.btnClrBarcodeInputLinkElement.forEach(barCodeInput => this.testInput(barCodeInput));
    this.btnClrBarcodeInputLinkElement.forEach(btn => btn.addEventListener('click', handler, false));
  }

  // transfer this to Controller
  requestSpecificHelp() {
    // designed to show specific instructions when clicked on ? anywhere
    this.showHelpPage();
    //await this.findHelpTopic();
  }

  createTableTemplate(packet) {
    // Adds a packet as a row to packet list
    const list = document.querySelector('#seed-list');
    const row = document.createElement('tr');
    row.className = `table__row_color`;
    const edit = document.createElement('td');
    edit.className = `table__data table__data_edit`;
    //edit.setAttribute("title", "Edit Record");
    edit.addEventListener('click', () => {
      this.editPacketRequestHandler(packet.packetId)}, false);
    if (packet.weight >= 9999) {
      //console.log(packet.weight);
      let expNum = packet.weight.toExponential();
      packet.weight = expNum;
    };
    row.innerHTML =
      `<td class="table__data">${packet.packetId}</td>		
             <td class="table__data">${packet.variety}</td>
             <td class="table__data">${packet.group}</td>
             <td class="table__data table__data_center">${packet.number}</td>
             <td class="table__data table__data_center">${packet.weight}</td>
             <td class="table__data table__data_right">${packet.cost.toFixed(2)}</td>
             <td class="table__data table__data_center">${(packet.date).substring(2)}</td>
             `;
    row.appendChild(edit);
    list.appendChild(row);
  }

  displayPacketsList(packets) {
    // Delete table rows first before entering updated data on home page
    const table = document.querySelector('#seed-list');
    while (table.rows.length > 0) {
      table.deleteRow(0);
    };
    packets.forEach((packet) => this.createTableTemplate(packet));
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

  showConfirmOverwriteDialog() {
    this.confirmOverwriteDialog.showModal();
    //console.log('this is id: ' + packetId);
    let resultPromise = new Promise((resolve, reject) => {
      this.bindBtnOkOverwritePacket(() => { resolve('Overwrite') });
      this.bindBtnCancelOverwritePacket(() => { resolve('Cancel') });
      //TO DO: Handle ESCAPE key press
    });
    return resultPromise;
  }

  clearFields() {
    //=> Clears all the entry fields on the edit/add page
    document.querySelector('#group').value = '';
    document.querySelector('#variety').value = '';
    document.querySelector('#packetId').value = '';
    document.querySelector('#number').value = '';
    document.querySelector('#weight').value = '';
    document.querySelector('#date').value = '';
    document.querySelector('#cost').value = '';
    document.querySelector('#timeStamp').value = '';
    document.querySelector('#seedNotes').value = '';
  }

  clearCopiedField() {
    document.querySelector('#packetId').value = '';
    document.querySelector('#date').value = '';
    document.querySelector('#timeStamp').value = '';
    document.querySelector('#seedNotes').value = '';
  }

  packetIdInputIsEditable() {
    return !document.querySelector('#packetId').hasAttribute('readonly');
  }

  // Open Pages
  showHomePage() {
    if (document.querySelector('#showHidePages').classList.contains('page__section_hide')) {
      document.querySelector('#showHidePages').classList.add('page__section_show');
      document.querySelector('#showHidePages').classList.remove('page__section_hide');
    }
    document.querySelector('#homePage').style.display = '';
    document.querySelector('#edit-page').style.display = 'none';
    document.querySelector('#backUp').style.display = 'none';
    document.querySelector('#helpPage').style.display = 'none';
    document.querySelector('#labelsQueuePage').style.display = 'none';
  }
  showAddNewPacket() {
    document.querySelector('#homePage').style.display = 'none';
    document.querySelector('#edit-page').style.display = '';
    document.querySelector('#backUp').style.display = 'none';
    document.querySelector('#helpPage').style.display = 'none';
    document.querySelector('#labelsQueuePage').style.display = 'none';
    // Key packetId readonly removed and is required
    document.querySelector('#packetId').removeAttribute('readonly');
    document.querySelector('#packetId').setAttribute('required', 'required');
    document.querySelector('#scrollBackwardsOnOff').style.display = 'none';
    document.querySelector('#scrollForwardsOnOff').style.display = 'none';
  }
  showEditPacket() {
    document.querySelector('#homePage').style.display = 'none';
    document.querySelector('#edit-page').style.display = '';
    document.querySelector('#backUp').style.display = 'none';
    document.querySelector('#helpPage').style.display = 'none';
    document.querySelector('#labelsQueuePage').style.display = 'none';
    // Key packetId is read only
    document.querySelector('#packetId').removeAttribute('required');
    document.querySelector('#packetId').setAttribute('readonly', 'readonly');
    document.querySelector('#scrollBackwardsOnOff').style.display = '';
    document.querySelector('#scrollForwardsOnOff').style.display = '';
  }
  showBackupRestore() {
    document.querySelector('#homePage').style.display = 'none';
    document.querySelector('#edit-page').style.display = 'none';
    document.querySelector('#backUp').style.display = '';
    document.querySelector('#helpPage').style.display = 'none';
    document.querySelector('#labelsQueuePage').style.display = 'none';
  }
  showHelpPage() {
    document.querySelector('#homePage').style.display = 'none';
    document.querySelector('#edit-page').style.display = 'none';
    document.querySelector('#backUp').style.display = 'none';
    document.querySelector('#helpPage').style.display = '';
    document.querySelector('#labelsQueuePage').style.display = 'none';
  }
  showPrintLabels() {
    document.querySelector('#homePage').style.display = 'none';
    document.querySelector('#edit-page').style.display = 'none';
    document.querySelector('#backUp').style.display = 'none';
    document.querySelector('#helpPage').style.display = 'none';
    document.querySelector('#labelsQueuePage').style.display = '';
  }

  showMessage(message) {
    msgInstallDb.innerHTML =
      (`<li>${message}.</li>
           <li>Manually restore data from backup file.</li>`);
  }
}

class Controller {
  // Responsible for handling user input
  constructor(model, view) {
    this.model = model;
    this.view = view;
    this.sortOn = 'variety';
    this.sortOrder = 'next';
    this.packetIds = [];
    this.packetIdsIndex = 0;
    this.forwardsClick = '';
    this.backwardsClick = '';
    this.dataFile = [];
    this.clicks = 0;
    // bindings pages
    this.view.bindHomePage(() => { this.requestHomePage(); });
    this.view.bindSearchPacketList(() => { this.requestSearchPacketList(); });
    this.view.bindAddNewPacketPage(() => { this.requestAddNewPacketPage(); });
    this.view.bindBackupRestorePage(() => { this.requestBackupRestorePage(); });
    this.view.bindHelpPage(() => { this.requestHelpPage(); });
    this.view.bindEditPacket((packetId) => { this.editPacketRequestHandler(packetId); });
    // bindings table sort
    this.view.bindSortGroup(() => { this.requestSortedPacketList('group'); });
    this.view.bindSortVariety(() => { this.requestSortedPacketList('variety'); });
    this.view.bindSortPacketId(() => { this.requestSortedPacketList('packetId'); });
    this.view.bindSortDate(() => { this.requestSortedPacketList('date'); });
    this.view.bindSortNumber(() => { this.requestSortedPacketList('number'); });
    this.view.bindSortWeight(() => { this.requestSortedPacketList('weight'); });
    this.view.bindSortCost(() => { this.requestSortedPacketList('cost'); });
    // bindings button events
    this.view.bindBtnScrollForwards(() => {
      this.requestScrollForwards(this.packetIds, this.packetIdsIndex, this.filter);
    });
    this.view.bindBtnScrollBackwards(() => {
      this.requestScrollBackwards(this.packetIds, this.packetIdsIndex, this.filter);
    });
    this.view.bindBtnSubmitEditRecord(() => { this.requestAddRecord('editRecord'); });
    this.view.bindBtnDeleteRecord(() => { this.requestDeleteRecord(); });

    //this.view.bindBtnReplaceAllRecords( () => { this.requestReplaceAllRecords(); });

    this.view.bindBtnRetrieveData(() => { this.requestRetrieveAllData(); });
    this.view.bindBtnReinstall(() => { this.fixCorruptDB(); });
    this.view.bindBtnCopyRecord(() => { this.unlockPacketId(); });
    this.view.bindBtnUploadFile(() => { this.requestUploadFile(); });

    //this.view.bindBtnUploadBackupFile( this.restoreBackup );

    this.view.bindSearchFilter((e) => { this.searchFilterHandler(e); });
    this.view.bindSearchBarcode((e) => { this.searchBarcodeInput(e); });
    this.view.bindClearFindInput(() => { this.requestClearFindInput(); });
    this.view.bindClrBarcodeInput(() => {this.requestClrBarcodeInput(); });
    
    this.view.bindBtnLabelsQueue(() => { this.requestLabelsQueue(); });
    this.view.bindBtnPrintLabels(() => { this.requestPrintLabels(); });
  }

  async requestPrintLabels() {
    const pageFooter = document.querySelector('#pageFooter');
    pageFooter.style.display = 'none';
    let labelContent = document.querySelector('#labelsQueuePage');
    await this.view.showPrintLabels();
    window.print();
    labelContent.innerHTML = "";
    await this.requestHomePage();
    pageFooter.style.display = '';
  }

  async requestLabelsQueue() {
    let labelContent = document.querySelector('#labelsQueuePage');
    console.log(this.packetId);
    const options = { year: "numeric", month: "long", day: "numeric" };
    const record = await this.model.getRecord(this.packetId);
    const auDate = new Date(record.date).toLocaleDateString("en-AU", options);
    const qrCode = ('ID: ' + this.packetId + '\nVariety: ' + record.variety + '\nGroup: ' + record.group
      + '\nProduct Count: ' + record.number + '\nWeight(grams): ' + record.weight + '\nCost: $' + record.cost
      + '\nDate created: ' + auDate + '\nTimestamp:' + record.timeStamp + '\nNotes:\n' + record.seedNotes);
    //console.log(record);	 
    console.log(qrCode);
    this.clicks = this.clicks + 1;
    console.log('left = ', this.clicks);
    labelContent.innerHTML += `<section class="packet-labels-page__block_left" >
        <p class="page__paragraph barcode">*${this.packetId}*</p>
        <p class="page__paragraph">ID: ${this.packetId}</p>
        <p class="page__paragraph">Variety: ${record.variety}</p>
        <p class="page__paragraph">Number: ${record.number}</p>
        <p class="page__paragraph">Weight: ${record.weight}</p>
        <p class="page__paragraph">Date: ${auDate}</p></section>`;
    //<p class="page__paragraph">Notes: ${record.seedNotes}</p>
    //await view.showPrintQueue();
    //await window.print();
    //document.getElementById('PrintQueue').close();
    //labelContent.innerHTML = "";
  }

  async searchFilterHandler(e) {
    this.filter = e.target.value;
    console.log(this.filter);
    await this.requestSortedPacketList();
  }

  async searchBarcodeInput(e) {
    if (e.key === "Enter") {
      this.inputPacketId = e.target.value.toLowerCase();
      await this.requestClrBarcodeInput();
      await this.editPacketRequestHandler(this.inputPacketId);
    }
  }

  async requestClearFindInput() {
    document.querySelector('#searchFilter').value = '';
    this.requestHomePage();
  }

  async requestClrBarcodeInput() {
    const barcodeInput = this.view.searchBarcode;
    barcodeInput.forEach((inputContent) => {
      console.log(inputContent.value);
      if ( inputContent.value !== "" ) {
        inputContent.value = "";
        inputContent.focus();
      } else {
        inputContent.focus();
      }
    });
/*     console.log(barcodeInput.value);
    if (barcodeInput.value !== "") {
      console.log("not clear");
      barcodeInput.value = "";
    } else {
      console.log("clear");
    } */
    //this.requestHomePage();
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
    const records = await this.model.getAll(this.sortOn, this.sortOrder, this.filter);
    await this.view.displayPacketsList(records);
    await this.createPacketIdsArray(records);
    //this.records = records;
    //console.log(this.packetIds);
  }

  createPacketIdsArray(records) {
    let index;
    const packetIds = [];
    //console.log(records);
    Object.values(records).forEach(record => {
      packetIds.push(record.packetId);
    });
    this.packetIds = packetIds;
  }

  async requestScrollForwards(packetIds, packetIdsIndex, filter) {
    console.log(this.packetId, 'filter=', filter);
    console.log(packetIds.indexOf(this.packetId));
    console.log("From scrollForwards: " + packetIds);
    console.log('this.forwardsClick=' + this.forwardsClick);
    const clickedPacketIdsIndex = packetIds.indexOf(this.packetId);

    if (this.forwardsClick === true) {
      packetIdsIndex = clickedPacketIdsIndex + 1;
    }
    else if (this.forwardsClick === '') {
      console.log('forwardsClick=""');
      this.forwardsClick = true;
      this.backwardsClick = false;
      packetIdsIndex = clickedPacketIdsIndex + 1;
    }
    else if (this.forwardsClick === false) {
      console.log('last click was backwards');
      this.forwardsClick = true;
      this.backwardsClick = false;
      packetIdsIndex = packetIdsIndex + 2;
    }

    const arrayLength = packetIds.length;
    console.log("before if: index=" + packetIdsIndex + ' filter=' + filter + ' arrayLength=' + arrayLength);
    if (packetIdsIndex > 0 && packetIdsIndex < arrayLength) {
      console.log("if: " + this.packetIds[packetIdsIndex]);
      await this.editPacketRequestHandler(packetIds[packetIdsIndex]);
      packetIdsIndex = packetIdsIndex + 1;
      this.packetIdsIndex = packetIdsIndex;
      console.log(this.packetIdsIndex);
      console.log('-------------------');
    }
    else {
      console.log("else index=" + packetIdsIndex);
      packetIdsIndex = 0;
      await this.editPacketRequestHandler(packetIds[packetIdsIndex]);
      packetIdsIndex = packetIdsIndex + 1;
      this.packetIdsIndex = packetIdsIndex;
      console.log(this.packetIdsIndex);
      console.log('-------------------');
    }
  }

  async requestScrollBackwards(packetIds, packetIdsIndex, filter) {
    console.log(this.packetId, 'filter=', filter);
    console.log(packetIds.indexOf(this.packetId));
    console.log("From scrollBackwards: " + packetIds);
    console.log('this.backwardsClick=' + this.backwardsClick);
    const clickedPacketIdsIndex = packetIds.indexOf(this.packetId);

    if (this.backwardsClick === true) {
      packetIdsIndex = clickedPacketIdsIndex - 1;
    }
    else if (this.backwardsClick === '') {
      console.log('backwardsClick=""');
      this.backwardsClick = true;
      this.forwardsClick = false;
      packetIdsIndex = clickedPacketIdsIndex - 1;
    }
    else if (this.backwardsClick === false) {
      console.log('last click was forwards');
      this.forwardsClick = false;
      this.backwardsClick = true;
      packetIdsIndex = packetIdsIndex - 2;
    }

    const arrayLength = packetIds.length;
    console.log("before if: index=" + packetIdsIndex + ' filter=' + filter);
    if (packetIdsIndex >= 0 && packetIdsIndex < arrayLength) {
      console.log("if: " + this.packetIds[packetIdsIndex]);
      await this.editPacketRequestHandler(packetIds[packetIdsIndex]);
      packetIdsIndex = packetIdsIndex - 1;
      this.packetIdsIndex = packetIdsIndex;
      console.log(this.packetIdsIndex);
      console.log('-------------------');
    }
    else {
      console.log("else index=" + packetIdsIndex);
      packetIdsIndex = (arrayLength - 1);
      await this.editPacketRequestHandler(packetIds[packetIdsIndex]);
      packetIdsIndex = packetIdsIndex - 1;
      this.packetIdsIndex = packetIdsIndex;
      console.log(this.packetIdsIndex);
      console.log('-------------------');
      //this.filterList = filter;
    }
  }

  async editPacketRequestHandler(packetId) {
    console.log(this.packetIds);
    console.log(packetId);
    this.packetId = packetId;
    const record = await this.model.getRecord(packetId);
    this.view.clearFields();
    this.view.showEditPacket();
    document.querySelector("#packetId").classList.add("form__input_gray");
    //element.classList.remove("form__input_gray");
    Object.keys(record).forEach(field => {
      // -> with the requested seed pkt record for editing
      //console.log(field);
      //console.log(record[field]);
      document.querySelector('#' + field).value = record[field];
    });
  };
  // Pages requested
  async requestSearchPacketList() {
    console.log('activated');
    await this.requestSortedPacketList();
    document.querySelector('#searchFilter').value = '';
    this.view.showHomePage();
    //console.log(this.packetIds);
  }

  async requestHomePage() {
    console.log('activated');
    this.filter = '';
    await this.requestSortedPacketList();
    document.querySelector('#searchFilter').value = '';
    this.packetIdsIndex = 0;
    this.forwardsClick = '';
    this.backwardsClick = '';
    await this.view.showHomePage();
    document.querySelector('#searchFilter').focus();
    //console.log(this.packetIds);
  }

  requestAddNewPacketPage() {
    this.view.showAddNewPacket();
    this.view.clearFields();
    document.querySelector("#packetId").classList.remove("form__input_gray");
  }

  requestBackupRestorePage() {
    this.view.showBackupRestore();
  }

  requestDbErrorPage() {
    this.view.showDbError();
  }

  requestHelpPage() {
    // designed to show specific instructions when clicked on ? anywhere
    this.view.showHelpPage();
  }

  async fixCorruptDB() {
    try {
      const ret = await this.model.delete();
      this.view.showMessage('Deleted corrupted database');
    } catch (error) {
      switch (error) {
        case 'error':
          this.view.showMessage('Could not delete database');
          break;
        case 'blocked':
          this.view.showMessage('Could not delete database; operation blocked');
          break;
        default:
          this.view.showMessage('Unknown error');
      }
    }
  }

  unlockPacketId() {
    const element = document.querySelector('#packetId');
    element.removeAttribute('readonly');
    element.setAttribute('required', 'required');
    element.classList.remove("form__input_gray");
    document.querySelector('#scrollBackwardsOnOff').style.display = 'none';
    document.querySelector('#scrollForwardsOnOff').style.display = 'none';
  }

  async loadRecord() {
    // Get the content from the form fields
    const formData = new FormData(document.querySelector('#seed-entry'));
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
          this.view.showAlert(
            'Please fill in all fields', 'warning', '#pkt-message', '#insert-form-alerts');
          break checkEntries;
        }
      }
    }
    if (!missingRequiredField) {
      //convert string from FormData to integer and float
      seed.number = parseInt(seed.number);
      seed.weight = parseFloat(seed.weight);
      seed.cost = parseFloat(seed.cost);
      // check if we in create mode & packedId already exists 
      if (this.view.packetIdInputIsEditable() && (await this.model.getRecord(seed.packetId))) {
        // display warning and wait for feedback before continuing
        //console.log('this is id: ' + seed.packetId);
        let confirmation_result = await this.view.showConfirmOverwriteDialog();
        if (confirmation_result == 'Cancel') {
          document.querySelector('#confirmOverwriteDialog').close();
          // show some message about not updating 
          return;
        }
        else if (confirmation_result == 'Overwrite') {
          document.querySelector('#confirmOverwriteDialog').close();
        }
      }
      await this.model.loadRecords([seed]);
      await this.view.showAlert(
        'Seed Packet Added', 'success', '#pkt-message', '#insert-form-alerts');
      //=> Show success message
      //await this.requestPacketListPage();
      //this.view.clearFields();  //=> Clear form fields
    }
  }

  async requestAddRecord() {
    await this.loadRecord();
  }

  async requestDeleteRecord() {
    //=> Delete record requested from delete button on edit page
    const packetId = document.querySelector('#packetId').value;
    //=> packetId obtained from edit button on seed list
    await this.model.deleteRecord(packetId);
    this.view.showAlert(
      'Seed Packet Deleted', 'warning', '#pkt-message', '#insert-form-alerts');
    //=> Show success message
    this.view.clearFields(); //=> Clear form fields
    this.model.getAll();
    //await this.requestPacketListPage();
  }

  /*	async requestReplaceAllRecords() {
      await this.model.deleteAllRecords();
      await this.requestUploadFile();
      await console.log(this.dataFile);
      await model.loadRecords(this.dataFile);
      // needs success message or modal
      //document.getElementById('btnUploadData').click();
      }*/

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
    element.setAttribute(
      'href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(textInput));
    element.setAttribute('download', filename); //=> create and download the stringified record
    document.body.appendChild(element);
    element.click();                            //=> Click the href anchor
    document.body.removeChild(element);         //=> Remove anchor element
    //console.log('Download complete');
    fileNotes.innerHTML += '<li>Download is completed.</li>';
  }

  async requestRetrieveAllData() {
    //=> Collects all data records from DB
    const records = await this.model.getAll();
    const text = JSON.stringify(records, null, 2); //=> array of records objects converted to string
    let time = this.fileTime() + '.txt'; //=> Created file name with timestamp
    const filename = 'seedB∶' + time;
    fileNotes.innerHTML += '<li>Backup file name is: ' + filename + '</li>';
    this.download(filename, text); //=> Save backup file.
  }

  async requestUploadFile() {
    await this.model.deleteAllRecords();
    console.log('clicked');
    const fileElemInput = document.querySelector('#fileElemInput');
    if (fileElemInput) { fileElemInput.click(); }
    //fileElemInput.click();
    console.log(onchange);
    fileElemInput.onchange = function () {
      const file = this.files[0];
      const reader = new FileReader();
      reader.onload = async function (progressEvent) {
        this.dataFile = await JSON.parse(this.result);
        await model.loadRecords(this.dataFile);
        console.log(this.dataFile);
      }
      reader.readAsText(file);
    }
  }
  /*       restoreBackup() {
         let dataFile = [];
         const file = this.files[0];
                 // TODO: move backupRestorationNotifications to View object
               const backupResotrationNotifications = document.getElementById('backupNotifications');  //=> alias for user msgs backup installation
         backupResotrationNotifications.innerHTML += '<li>Backup file used:  ' + file.name + '</li>';
         backupResotrationNotifications.innerHTML += '<li>Backup file was created on:  ' + file.lastModifiedDate.toString().slice(0, 24) + '</li>';
         backupResotrationNotifications.innerHTML += '<li>Backup file now merged with seed list already in db</li>';
         const reader = new FileReader();
         reader.onload = async function (progressEvent) {
             dataFile = JSON.parse(this.result);
             await model.loadRecords(dataFile);
         };
                 reader.readAsText(file);
         }*/
}

//=> End of Classes
const model = new Model();
const view = new View();
const controller = new Controller(model, view);
//=> Load IndexedDB and check for right store is missing!
window.onload = () => { controller.requestHomePage() };
//=> Global variables
//const foundBtnHomePage = document.getElementById('findBtnHomePage'); //=> alias
const fileNotes = document.querySelector('#fileNotifications'); //=> alias for user msgs retrieving data & backup
const errorMsg = document.querySelector('#dbError');  //=> alias forDB error msgs for the UI
const msgInstallDb = document.querySelector('#installDbMsg'); //=> alias for UI installation msgs
