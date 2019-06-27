# High Level Requirements

Create a simple application that consumes our practice test feeds api
We ask that you spend no more than 2 hours on this.

# What you'll be submitting

Options:

- a git repo and a readme explaining how to view your work
- or [codesandbox](https://codesandbox.io/)

Whatever you're more comfortable with is fine! If you go the git route, please
aim to have roughly one commit per step.

# Project Steps

This project consists of several steps. We have included more steps than we
expect _could_ be covered in 2 hours. Please only complete what you can
as you can. If don't even complete the first step in this time frame, that is okay!
We'd be very surprised if you finish all 10 steps.

### Step 1: Fetch data from API

- Fetch data from a location
- Log output to console

Hint: using an extension like [JSON Formatter](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en) is a good place to start and helpful for debugging.

### Step 2: Display practice_tests data in table

- Display fetched data in table or table-like structure

Use the provided mockups as a template. Don't feel the need to be pixel perfect or get colors correct! A black and white table using the standard mark up would be great!

Reference material: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table

### Step 3: Sort based on scheduledAt

- Sort data based on tests' scheduledAt time

Hint: This is likely done just after the fetch or just before the data is rendered into the DOM

### Step 4: Add a testType filter

- Add a radio-button style filter that allows the user to pair down the data shown in the table to only be of one test type.

Hint: This is a string based filter. Use the test_types from the API call you made in step 1.

### Step 5: Show a count of how many matching tests are shown

- Add a count next to the table title with the count of matching tests.

Example: If there are 7 tests that are "ACT", add something like <span>7</span>

### Step 6: Add an index of locations

- Create list of all locations and allow users to select into their location

### Step 7: Link Locations List <-> Location Page

- Link the locations list to the locations page

This can be done through a link in a router or an in memory-type solution.

### Step 8: Handle no options case

- Display following message if a location "we don't see any options for this location. Please contact our team for more details" if the length of the practice tests returned from the API is 0. The location "Online" for example, will need to display this fallback.

### Step 9: Add error handling

- Display error message instead of results table if the response from our server isn't "ok"

### Step 10: Make table more mobile-friendly

- Collapse the table down to a list when the screen is under 480px

Hint: can you write a media query that displays the table in a flex column?

### Bonus: Add either an accommodation or time filter

- Add an additional filter to only show tests that offer a particular accommodation or tests in a specific time range

# API Details

We have a practice test api that is used to view our upcoming test schedule.

It can be accessed as follows:

Base url: https://dashboard.privateprep.com/feeds/practice_tests

If you visit just this url in a browser, you will see an error message. This is because specifying a location is required.

Try this instead:

https://dashboard.privateprep.com/feeds/practice_tests.json?locations=nyc

You will see that the result has two pieces: test_types and practice_tests.
Hopefully this is largely easy to understand, especially when paired with the mockups.

Here are some helper functions, you might find helpful:

```js
export const locations = [
  { id: 1, name: "NYC", slug: "new-york-city", abbreviation: "nyc" },
  {
    id: 2,
    name: "Westchester",
    slug: "westchester-county",
    abbreviation: "wc",
  },
  { id: 3, name: "Long Island", slug: "long-island", abbreviation: "li" },
  { id: 4, name: "DC Metro", slug: "dc-metro", abbreviation: "dc" },
  {
    id: 5,
    name: "Northern New Jersey",
    slug: "northern-new-jersey",
    abbreviation: "nj",
  },
  { id: 6, name: "Los Angeles", slug: "los-angeles", abbreviation: "la" },
  { id: 7, name: "Online", slug: "online", abbreviation: "ol" },
  { id: 8, name: "Connecticut", slug: "connecticut", abbreviation: "ct" },
  { id: 9, name: "South Florida", slug: "south-florida", abbreviation: "fl" },
  {
    id: 10,
    name: "Central New Jersey",
    slug: "central-new-jersey",
    abbreviation: "njw",
  },
  { id: 11, name: "Tampa Bay", slug: "tampa-bay", abbreviation: "tp" },
];

export const findLocationBySlug = slug => locations.find(l => l.slug === slug);

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  throw new Error(response.statusText);
};

const parseJSON = payload => {
  if (typeof payload === "string") {
    return JSON.parse(payload);
  }
  return payload.json();
};

export const fetchLocationTests = location =>
  fetch(
    `https://dashboard.privateprep.com/feeds/practice_tests?locations=${
      location.abbreviation
    }`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  )
    .then(checkStatus)
    .then(parseJSON);
```
