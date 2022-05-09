const hamburger_icon = document.querySelector('.hamburger-icon');
const header_container = document.querySelector('.header-container'); 
const url_input = document.querySelector('.url-input');
const shorten_btn = document.querySelector('.shorten-btn');
const url_cards = document.querySelector('.url-cards');
const loader = document.querySelector('.loader');
const error_message = document.querySelector('.error-message');
const short_url = document.querySelector('.short-url');
const copy_btn = document.querySelector('.copy-btn');

//remove hide class from header container if displayed on wide screen
//get screen width
function getScreenWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

(function () {
    if (getScreenWidth() > 768) {
        header_container.classList.remove('hide');
    }
})();



// url_cards click handler
url_cards.addEventListener('click', (e) => {

    if (e.target.classList.contains('copy-btn')) {
        const url = e.target.parentElement.querySelector('.short-url').innerText;
        copyToClipboard(url);
        let button = e.target;
        button.innerText = 'Copied!';
        // change button color curstom property name --light-purple
        button.style.backgroundColor = 'var(--light-purple)';

    }
}
);

//url object
var urls = [];

var urlObj = {
    longurl: '',
    shorturl:'',
}

// #API TOCKEN
// #7OeBgXUQUyxqkrqpPWiKlnEToPvsRS3ShQBxDwOUSQtKAPW2U7iIcckAwIWW

//copy url to clipboard
function copyToClipboard(element) {
    var input_element = document.createElement('input');
    input_element.value = element;
    document.body.appendChild(input_element);
    input_element.select();
    document.execCommand('copy');
    document.body.removeChild(input_element);
}
//when copy button is clicked copy short url to clipboard


//toggle header-container when hamburger icon is clicked
hamburger_icon.addEventListener('click', () => {
    //toggle header-container using css display property
    if(header_container.style.display === 'none') {
        header_container.style.display = 'block';
    }else
    {
        header_container.style.display = 'none';
    }
});

// fetch tinyurl api and display the result
shorten_btn.addEventListener('click', () => {
//return if url is not valid
    if (!checkUrl(url_input.value)) {
        showErrorMessage('Please enter a valid url');
        // focus on the input field
        url_input.focus();
        return;
    }
    // show loader
    loader.classList.remove('hide');
let body = {
    url: `${url_input.value}`,
    domain: `tiny.one`
  }
  
  fetch(`https://api.tinyurl.com/create`, {
      method: `POST`,
      headers: {
        accept: `application/json`,
        authorization: `Bearer 7OeBgXUQUyxqkrqpPWiKlnEToPvsRS3ShQBxDwOUSQtKAPW2U7iIcckAwIWW`,
        'content-type': `application/json`,
      },
      body: JSON.stringify(body)
    })
    .then(response => {
      if (response.status != 200) throw `There was a problem with the fetch operation. Status Code: ${response.status}`;
      return response.json()
      //hide loader
    })
    .then(data => {
        loader.classList.add('hide');
        const template = `
        <div class="url-card">
        <p class="url">
          ${url_input.value}
        </p>
        <div class="short-url-copy">
          <p class="short-url">
            ${data.data.tiny_url}
          </p>
          <button class="btn btn-secondary copy-btn">
            Copy
          </button>
        </div>
    </div>`;
    url_cards.innerHTML += template;
    //populate urls array
    populateUrls(data.data.tiny_url, url_input.value);
    // clean input field
    url_input.value = '';

    })
    .catch(error => {
        console.error(error)
        //create error message
        showErrorMessage('There was a problem with the fetch operation. Please try again later.');

    });
}
);


// check if url is valid
function checkUrl(url) {
    if (url.includes('http://') || url.includes('https://')) {
        return true;
    }
    else {
        return false;
    }
}

// show error message for 3 seconds
function showErrorMessage(message) {
    error_message.innerHTML = `<p>${message}</p>`;
    error_message.classList.remove('hide');
    setTimeout(() => {
        error_message.classList.add('hide');
    }, 3000);

    //remoe loader
    loader.classList.add('hide');
}

function populateUrls(url, longurl) {
    urlObj.longurl = longurl;
    urlObj.shorturl = url;
    urls.push(urlObj);
    console.log(urls);

    //update local storage
    localStorage.setItem('urls', JSON.stringify(urls));
}

// retrieve urls from local storage
function getUrls() {
    if (localStorage.getItem('urls')) {
        urls = JSON.parse(localStorage.getItem('urls'));
    }
    return urls;
}

//display urls in the url-cards
function displayUrls() {
    let urls = getUrls();
    let template = '';
    urls.forEach(url => {
        template += `
        <div class="url-card">
        <p class="url">
            ${url.longurl}
        </p>
        <div class="short-url-copy">
            <p class="short-url">
                ${url.shorturl}
            </p>    
            <button class="btn btn-secondary copy-btn">
                Copy
            </button>
        </div>
    </div>`;
    });
    url_cards.innerHTML = template;
}

//display urls on page load
displayUrls();
