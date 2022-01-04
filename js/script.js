const jobsContainer = document.querySelector('.jobs-container');
const filtersContainer = document.querySelector('.filters-container');
const filters = document.querySelector('.filters');
const clearBtn = document.querySelector('.clear-btn');
let filtersSelected = [];


// ----------------------- creating jobs ------------------------ //
function getJobs() {
  fetch('../data.json')
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      jobsContainer.innerHTML += createJob(item);
    })
  })
}

function createJob(item) {
  return `
    <div class="job ${featuredJobBorder(item)}">
      <div class="left-side">
        <img class="company-logo" src="${item.logo}" alt="${item.company}">
        <div class="job-details flex">
          <div class="job-specs flex">
            <span class="company-name">${item.company}</span>
            ${flags(item)}
          </div>
          <span class="job-title">${item.position}</span>
          <div class="job-info">
            <span class="">${item.postedAt}</span>
            <span class="span-separator">${item.contract}</span>
            <span>${item.location}</span>
          </div>
        </div>
      </div>
      <hr>
        <div class="job-filters flex">
        ${jobFilters(item)}
      </div>
    </div> `
}

getJobs();


// -------------------- flags of the job -------------------- //

function flags(item) {
  let flagOutput = '';
  if (item.new) flagOutput += `<div class="flag flag-new">new!</div>`
  if (item.featured) flagOutput += `<div class="flag flag-featured">featured</div>`

  return flagOutput;
}


// -------------------- featured job border ----------------- //

function featuredJobBorder(item) {
  if (item.featured) return `job-featured`; 
  return '';
}


// ------------------ job filters ---------------------- //

function jobFilters(item) {
  let filters = '';

  filters += `<div class="filter">${item.role}</div>`
  filters += `<div class="filter">${item.level}</div>`
  item.languages.forEach(lang => {
    filters += `<div class="filter">${lang}</div>`
  });
  item.tools.forEach(tool => {
    filters += `<div class="filter">${tool}</div>`
  })

  return filters;
}


// ------------------- display selected filters -------------------- //

jobsContainer.addEventListener('click', e => {
  if (e.target.classList.contains('filter')) {
    let value = e.target.textContent;
    
    if (!filtersSelected.includes(value)) {
      filtersSelected.push(value);
      showFilters(value);
    }

    filterJobs();
  }
})

function showFilters(value) {
  if (filtersContainer.classList.contains('inactive')) filtersContainer.classList.remove('inactive');

  let filter = document.createElement('div');
  filter.classList.add('filter', 'filter-x', 'flex');
  filter.innerHTML = `
  <span>${value}</span>
  <div class="delete-btn"></div>`

  filters.appendChild(filter);
  filterJobs();
}


// -------------------- deleting filters --------------------- //

// delete one filter

filters.addEventListener('click', e => {
  if (e.target.classList.contains('delete-btn')) {
    let text = e.target.previousSibling.previousSibling.textContent;
    filtersSelected = filtersSelected.filter(filter  => filter !== text);
    e.target.parentElement.remove();
  }

  filterJobs();
})

// clear all filters

clearBtn.addEventListener('click', () => {
  filtersSelected = [];
  filters.innerHTML = '';
  filterJobs();
  
  setTimeout(() => {
    filtersContainer.classList.add('inactive');
  }, 500);
})


// ------------------ filter jobs ------------------- //

function filterJobs() {
  let filteredJobs = '';

  if (filtersSelected.length == 0){
    filtersContainer.classList.add('inactive');
    jobsContainer.innerHTML = '';
    getJobs();
    return;
  } else {
    fetch('../data.json')
    .then(response => response.json())
    .then(JobData => {
      JobData.forEach(data => {
        if (validJob(data)){
          filteredJobs += createJob(data);
        }
      })
      jobsContainer.innerHTML = filteredJobs;
    })
  }

}

function validJob(data) {
  let valid = true;

  filtersSelected.forEach(filter => {
    if (data.role !== filter && data.level !== filter && !data.languages.includes(filter) && !data.tools.includes(filter)){
      valid = false;
    }
  })

  return valid;
}