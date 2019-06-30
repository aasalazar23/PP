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
    }`).then(
      response => {
        if (response.status >= 200 && response.status < 300) {
          return response.json()
        }
        // step #9 error handling
        alert("We seem to be having trouble with our server. Try again later");
        throw new Error(response.statusText);
      })
      
      .then(data => cb(data))
}

// step #1: Fetch data from location and print it out in the console
let locSelect = document.getElementById('locSelect');
locSelect.onchange = () => {
  let location = locSelect.value;
  console.log('abbreviated location selection: ', location);
  // passes cb to console.log returned data
  fetchTests(location, (data) => {
    console.log(data);
    let availTests = document.getElementById('availTests');
    if (data.practice_tests.length > 0) {
      availTestsHead.innerHTML = 'Test Schedule';
      fillTable(data.practice_tests);
      createTypes(data.test_types);      
    } else {
      // #step 8: handles no options case
      if (document.getElementById('tableContent')) {
        removeTable();
      }
      console.log('no results');
      availTests.innerHTML = "Sorry, we don't see any options for this location. Please contact our team for more details";
    }

  })
}


// step #2: Fill Table, fills once location selected
    // creates table row in grid layout
    let createGridRow = (test) => {
      let grid_row = document.createElement('div');
      grid_row.setAttribute('class', 'grid-row');
      
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
          // need to create div manually for accomodations to display list
      let accoms = accomFormat(test.accommodations);
      let accomodations = document.createElement('div');
      accomodations.setAttribute('class', 'grid-cell');
      accomodations.append(accoms);


      let html_block = `
        <div class="grid-cell">${test.test_type}</div>
        <div class="grid-cell">${test.test_center}</div>
        <div class="grid-cell">${test.starts_at}</div>
        `;
      grid_row.innerHTML = html_block;
      grid_row.append(accomodations);

      return grid_row;
    }

  // fills table with data
let fillTable = (data) => {
  // clears old table
  removeTable();

  let table_container = document.getElementById('availTests');
  // creates grid-table
  let grid_table = document.createElement('div');
  grid_table.setAttribute('id', 'grid-table');
  table_container.append(grid_table);
  let table_header = `
                    <div class="grid-row" id="grid-header">
                      <div class="grid-cell grid-header">Test Type</div>
                      <div class="grid-cell grid-header">Test Center</div>
                      <div class="grid-cell grid-header">Start Time</div>
                      <div class="grid-cell grid-header">Accommodations</div>
                    </div>
  `;
  grid_table.innerHTML = table_header;

  // creates test type filter
  let testType = document.createElement('div');
  testType.setAttribute('id', 'testTypes');
  document.getElementById('sort').append(testType);
  // accesses practice_test in data object, add rows
  let practiceList = data;
  for (let test of practiceList) {
    let grid_row = createGridRow(test);
    grid_table.append(grid_row);
  }
}

// clears table by removing child
let removeTable = () => {
  let grid_table = document.getElementById('grid-table');
  if (grid_table) {
    grid_table.parentNode.removeChild(grid_table);
  }
  let testTypes = document.getElementById('testTypes');
  if (testTypes) {
      testTypes.parentNode.removeChild(testTypes);
  }
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


