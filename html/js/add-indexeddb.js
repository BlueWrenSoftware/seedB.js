// Seed Class: Represents a Seed Packet
class Seed {
  constructor(seedGroup, variety, id, seedNumbers, seedWeight) {
    this.seedGroup = seedGroup;
    this.variety = variety;
    this.id = id;
    this.seedNumbers = seedNumbers;
    this.seedWeight = seedWeight;
  }
}

// UI Class: Handle UI Tasks
class UI {
  static displaySeeds() {
    const StoredSeeds = [
      {
        seedGroup: "Vegetables",
        variety: "Curly Kale",
        id: 1,
        seedNumbers: 0,
        seedWeight: 20
      },
      {
        seedGroup: "Vegetables",
        variety: "Curly Kale",
        id: 2,
        seedNumbers: 100,
        seedWeight: 30
      },
      {
        seedGroup: "Vegetables",
        variety: "Carrots",
        id: 3,
        seedNumbers: 1000,
        seedWeight: 0
      }
    ];

    const seeds = StoredSeeds;

    seeds.forEach((seed) => UI.addSeedToList(seed));
  }

  static addSeedToList(seed) {
    const list = document.querySelector('#seed-list');

    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${seed.seedGroup}</td>
      <td>${seed.variety}</td>
      <td class="table-seeds__col--center">${seed.id}</td>
      <td class="table-seeds__col--center">${seed.seedNumbers}</td>
      <td class="table-seeds__col--center">${seed.seedWeight}</td>
      <td class="edit"></td>
      <td class="change-link"><a href="#" class="delete">X</a></td>
    `;

    list.appendChild(row);
  }

  static deleteSeed(el) {
    if (el.classList.contains('delete')) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement('div');
    div.className = `alert ${className}`;
    //div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    const messages = document.querySelector('#messages');
    const section = document.querySelector('#insert-alerts');
    section.insertBefore(div, messages);

    // Vanish in 3 seconds
    setTimeout(() => document.querySelector('.alert').remove(), 3000);
  }

  static clearFields() {
    document.querySelector('#seedGroup').value = '';
    document.querySelector('#variety').value = '';
    document.querySelector('#id').value = 0;
    document.querySelector('#seedNumbers').value = 0;
    document.querySelector('#seedWeight').value = 0;
  }
}

// Store Class: Handles Storage 

// Event: Displays Seedss
document.addEventListener('DOMContentLoaded', UI.displaySeeds);

// Event:Add Seed Packet
document.querySelector('#seed-entry').addEventListener('submit', (e) => {
  // Prevent actual submit
  e.preventDefault();

  // Get form values
  const seedGroup = document.querySelector('#seedGroup').value;
  const variety = document.querySelector('#variety').value;
  const id = document.querySelector('#id').value;
  const seedNumbers = document.querySelector('#seedNumbers').value;
  const seedWeight = document.querySelector('#seedWeight').value;

  // Validate
  if (seedGroup === '' || variety === '' || id === '' || seedNumbers === '' || seedWeight === '') 
  {
    UI.showAlert('Please fill in all fields', 'warning');
  
  } 
  else {
    // Instantiate seed
    const seed = new Seed(seedGroup, variety, id, seedNumbers, seedWeight);

    // Add seed entry to UI
    UI.addSeedToList(seed);

    // Show success message
    UI.showAlert('Book Added', 'success');

    // Clear form fields
    UI.clearFields();
  }
});

// Event: Remove Seed Packet
document.querySelector('#seed-list').addEventListener('click', (e) => {
  //console.log(e.target);
  UI.deleteSeed(e.target);

  // Show success message
  UI.showAlert('Book Removed', 'success');

});
