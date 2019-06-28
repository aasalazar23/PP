const locations = [
    { 
      id: 1, 
      name: "NYC", 
      slug: "new-york-city", 
      abbreviation: "nyc" 
      },
    {
      id: 2,
      name: "Westchester",
      slug: "westchester-county",
      abbreviation: "wc",
    },
    { 
      id: 3, 
      name: "Long Island", 
      slug: "long-island", 
      abbreviation: "li" },
    { 
      id: 4, name: "DC Metro", 
      slug: "dc-metro", 
      abbreviation: "dc" },
    {
      id: 5,
      name: "Northern New Jersey",
      slug: "northern-new-jersey",
      abbreviation: "nj",
    },
    { 
      id: 6, 
      name: "Los Angeles", 
      slug: "los-angeles", 
      abbreviation: "la" },
    { 
      id: 7, 
      name: "Online", 
      slug: "online", 
      abbreviation: "ol" 
      },
    { 
      id: 8, 
      name: "Connecticut", 
      slug: "connecticut", 
      abbreviation: "ct" 
      },
    { 
      id: 9, 
      name: "South Florida", 
      slug: "south-florida", 
      abbreviation: "fl" 
      },
    {
      id: 10,
      name: "Central New Jersey",
      slug: "central-new-jersey",
      abbreviation: "njw",
    },
    { 
      id: 11, 
      name: "Tampa Bay", 
      slug: "tampa-bay", 
      abbreviation: "tp" },
  ];
  
// starting at the top w/ selecting a location
    // didn't realize this was steps 6 & 7. Already completed!
const addLocations = (locations) => {
  let locSelect = document.getElementById('locSelect');

  for (let option of locations) {
    let o = document.createElement('option');
    o.value = option.abbreviation;
    o.text = option.name;
    locSelect.append(o);
  }
}

addLocations(locations);

// general fetch function to receive data based on location, pass a cb to process data
const fetchTests = (abbreviation, cb) => {
  fetch(`https://dashboard.privateprep.com/feeds/practice_tests?locations=${
    abbreviation
    }`).then(response => response.json()).then(data => cb(data))
}

// step #1: Fetch data from location and print it out in the console
let locSelect = document.getElementById('locSelect');
locSelect.onchange = () => {
  let location = locSelect.value;
  console.log('abbreviated location selection: ', location);
  // passes cb to console.log returned data
  fetchTests(location, (data) => {
    console.log(data);
    fillTable(data.practice_tests);
    createTypes(data.test_types);
  })
}


// step #2: Fill Table, fills once location selected

let tableBody = document.getElementById('tableContent');
const testTable = document.getElementById('testTable');

  // creates table row with test data
  let createRow = (test) => {
    let testEntry = document.createElement('tr');
    let testType = document.createElement('td');
    let testCenter = document.createElement('td');
    let startTime = document.createElement('td');
    let accommodations = document.createElement('td');
  
    testType.append(test.test_type);
    testCenter.append(test.test_center);
    startTime.append(test.starts_at);

    //formats accomodation data into a list
    let accomFormat = (accom) => {
      let accomList = document.createElement('ul');
      for (let val of accom) {
        let item = document.createElement('li');
        let text = document.createTextNode(`${val.name}`);
        item.appendChild(text);
        accomList.append(item);
      }
    return accomList;
    }
    let accoms = accomFormat(test.accommodations);
    accommodations.append(accoms);
  
    testEntry.append(testType);
    testEntry.append(testCenter);
    testEntry.append(startTime);
    testEntry.append(accommodations);

    return testEntry;
    }

  // fills table with data
let fillTable = (data) => {
  // clears old table
  removeTable();
  // creates table body
  let tableBody = document.createElement('tbody');
  tableBody.setAttribute('id', 'tableContent');
  testTable.append(tableBody);
  // creates test type filter
  let testType = document.createElement('div');
  testType.setAttribute('id', 'testTypes');
  document.getElementById('sort').append(testType);
  // accesses practice_test in data object, add rows
  let practiceList = data;
  for (let test of practiceList) {
    let row = createRow(test);
    tableBody.append(row);
  }
}

// clears table by removing child
let removeTable = () => {
  let tableBody = document.getElementById('tableContent');
  tableBody.parentNode.removeChild(tableBody);
  let testTypes = document.getElementById('testTypes');
  testTypes.parentNode.removeChild(testTypes);
}

// step #3: Sort by ScheduledAt
let sortSchedule = () => {
  let location = document.getElementById('locSelect').value;
  fetchTests(location, (data) => {
    let testArray = data.practice_tests;
    let sortedArray = testArray.sort((a, b) => {
      if (a.starts_at > b.starts_at) {
        return 1
      } else {
        return -1
      }
    });
    console.log(sortedArray);
    fillTable(sortedArray);
});
}

// step #4: Adding testType filter

    // passes test types to createRadio function
let createTypes = (types) => {
  let typesDiv = document.getElementById('testTypes');
  for (let type of types) {
    //TODO: radio buttons stay checked
    createRadio(type.test_type);
  }
}

    // creates radio element html
let createRadio = (type) => {
  let testTypes = document.getElementById('testTypes');
  let r = document.createElement('input');
  r.setAttribute('type', 'radio');
  r.value = type;
  r.name = type;
  let l = document.createElement('label');
  l.setAttribute('for', type);
  l.innerHTML = type;
  let br = document.createElement('br');

  r.setAttribute('onclick', `sortByTest('${r.value}')`);

  testTypes.append(r);
  testTypes.append(l);
  testTypes.append(br);

}

    // sorts based on selected test type
let sortByTest = (type) => {
  let location = document.getElementById('locSelect').value;
  let testName = document.getElementById('testName');
  fetchTests(location, (data) => {
    let results = [];
    let testArray = data.practice_tests;
    for (let test of testArray) {
      if (test.test_type === type) {
        results.push(test);
      } 
    }
    fillTable(results);

    // #5: adding name and number of tests available
    testName.innerText = `${type}: ${results.length} available`;
  });
}


