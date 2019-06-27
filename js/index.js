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
    fillTable(data);
  })
}


// step #2: Fill Table, fills once location selected

let tableBody = document.getElementById('tableContent');

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
  // accesses practice_test in data object
  //TODO: clear table after each search 
  let practiceList = data.practice_tests;
  for (let test of practiceList) {
    let row = createRow(test);
    tableBody.append(row);
  }
}

