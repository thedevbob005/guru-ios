// Dom7
var $$ = Dom7;

// Framework7 App main instance
var app  = new Framework7({
  root: '#app',
  id: 'com.gurusiksha.app', 
  name: 'Gurusiksha', 
  theme: 'md', 
  statusbar: {
    iosOverlaysWebView: true,
  },
  routes: routes,
  view: {
    pushState: false,
  },
  // Dialog
  dialog: {
    title: 'Gurusiksha',
  },
  smartSelect: {
    pageTitle: 'Select Option',
    openIn: 'popup',
  },

  
  
});


var panel = app.panel.create({
  el: '#profile-panel',
})




// Init/Create views

var homeView = app.views.create('#view-home', {
  url: '/'
});
var catalogView = app.views.create('#view-catalog', {
  url: '/catalog/'
});
var settingsView = app.views.create('#view-settings', {
  url: '/settings/'
});

var profileView = app.views.create('#view-profile', {
  url: '/profile/'
});

var createPost = app.views.create('#view-create-post', {
  url: '/create-post/'
});

var exploreView = app.views.create('#view-explore', {
  url: '/explore/'
});
// var mainView = app.views.create('.view-main', {
//   url: '/'
// });
// create searchbar
// create searchbar
var searchbar = app.searchbar.create({
  el: '.searchbar',
  searchContainer: '.list',
  searchIn: '.item-title',
  on: {
    search(sb, query, previousQuery) {
      console.log(query, previousQuery);
    }
  }
});


// This Section For Auto Complete Text Box
let autocompleteDropdownAjax = app.autocomplete.create({
  inputEl: '#autocomplete-dropdown-ajax',
  openIn: 'dropdown',
  preloader: true, //enable preloader
  /* If we set valueProperty to "id" then input value on select will be set according to this property */
  valueProperty: 'name', //object's "value" property name
  textProperty: 'name', //object's "text" property name
  limit: 20, //limit to 20 results
  dropdownPlaceholderText: 'Try "Garia"',
  source: function (query, render) {
    var autocomplete = this;
    var results = [];
    if (query.length === 0) {
      render(results);
      return;
    }
    // Show Preloader
    autocomplete.preloaderShow();

    // Do Ajax request to Autocomplete data
    app.request({
      url: url + 'getArea',
      method: 'post',
      dataType: 'json',
      //send "query" to server. Useful in case you generate response dynamically
      data: {
        query: query,
      },
      success: function (data) {
        // Find matched items
        for (var i = 0; i < data.length; i++) {
          if (data[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i].title);
        }
        // Hide Preoloader
        autocomplete.preloaderHide();
        // Render items by passing array with result items
        render(results);
      }
    });
  }
});


let autocompleteDropdownAjaxFilterArea = app.autocomplete.create({
  inputEl: '#txtFilterArea',
  openIn: 'dropdown',
  preloader: true, //enable preloader
  /* If we set valueProperty to "id" then input value on select will be set according to this property */
  valueProperty: 'name', //object's "value" property name
  textProperty: 'name', //object's "text" property name
  limit: 20, //limit to 20 results
  dropdownPlaceholderText: 'Try "Garia"',
  source: function (query, render) {
    var autocomplete = this;
    var results = [];
    if (query.length === 0) {
      render(results);
      return;
    }
    // Show Preloader
    autocomplete.preloaderShow();

    // Do Ajax request to Autocomplete data
    app.request({
      url: url + 'getArea',
      method: 'post',
      dataType: 'json',
      //send "query" to server. Useful in case you generate response dynamically
      data: {
        query: query,
      },
      success: function (data) {
        // Find matched items
        for (var i = 0; i < data.length; i++) {
          if (data[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i].title);
        }
        // Hide Preoloader
        autocomplete.preloaderHide();
        // Render items by passing array with result items
        render(results);
      }
    });
  }
});

let autocompleteDropdownAjaxG = app.autocomplete.create({
  inputEl: '#autocomplete-dropdown-ajax-typeahead-gurdians',
  openIn: 'dropdown',
  preloader: true, //enable preloader
  /* If we set valueProperty to "id" then input value on select will be set according to this property */
  valueProperty: 'name', //object's "value" property name
  textProperty: 'name', //object's "text" property name
  limit: 20, //limit to 20 results
  dropdownPlaceholderText: 'Try "Garia"',
  source: function (query, render) {
    var autocomplete = this;
    var results = [];
    if (query.length === 0) {
      render(results);
      return;
    }
    // Show Preloader
    autocomplete.preloaderShow();

    // Do Ajax request to Autocomplete data
    app.request({
      url: url + 'getArea',
      method: 'post',
      dataType: 'json',
      //send "query" to server. Useful in case you generate response dynamically
      data: {
        query: query,
      },
      success: function (data) {
        // Find matched items
        for (var i = 0; i < data.length; i++) {
          if (data[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i].title);
        }
        // Hide Preoloader
        autocomplete.preloaderHide();
        // Render items by passing array with result items
        render(results);
      }
    });
  }
});

let autocompleteDropdownAjaxM = app.autocomplete.create({
  inputEl: '#autocomplete-dropdown-ajax-typeahead-mentor',
  openIn: 'dropdown',
  preloader: true, //enable preloader
  /* If we set valueProperty to "id" then input value on select will be set according to this property */
  valueProperty: 'name', //object's "value" property name
  textProperty: 'name', //object's "text" property name
  limit: 20, //limit to 20 results
  dropdownPlaceholderText: 'Try "Garia"',
  source: function (query, render) {
    var autocomplete = this;
    var results = [];
    if (query.length === 0) {
      render(results);
      return;
    }
    // Show Preloader
    autocomplete.preloaderShow();

    // Do Ajax request to Autocomplete data
    app.request({
      url: url + 'getArea',
      method: 'post',
      dataType: 'json',
      //send "query" to server. Useful in case you generate response dynamically
      data: {
        query: query,
      },
      success: function (data) {
        // Find matched items
        for (var i = 0; i < data.length; i++) {
          if (data[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0) results.push(data[i].title);
        }
        // Hide Preoloader
        autocomplete.preloaderHide();
        // Render items by passing array with result items
        render(results);
      }
    });
  }
});



var messagebar = app.messagebar.create({
  el: '.messagebar',
  autoLayout: true,
  scrollMessages:true,
  // First message rule
  firstMessageRule: function (message, previousMessage, nextMessage) {
    // Skip if title
    if (message.isTitle) return false;
    /* if:
      - there is no previous message
      - or previous message type (send/received) is different
      - or previous message sender name is different
    */
    if (!previousMessage || previousMessage.type !== message.type || previousMessage.name !== message.name) return true;
    return false;
  },
  // Last message rule
  lastMessageRule: function (message, previousMessage, nextMessage) {
    // Skip if title
    if (message.isTitle) return false;
    /* if:
      - there is no next message
      - or next message type (send/received) is different
      - or next message sender name is different
    */
    if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
    return false;
  },
  // Last message rule
  tailMessageRule: function (message, previousMessage, nextMessage) {
    // Skip if title
    if (message.isTitle) return false;
    /* if (bascially same as lastMessageRule):
    - there is no next message
    - or next message type (send/received) is different
    - or next message sender name is different
  */
    if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
    return false;
  }
});


// Response flag
var responseInProgress = false;

// Send Message
$$('.send-link').on('click', function () {
  var text = messagebar.getValue().replace(/\n/g, '<br>').trim();
  // return if empty message
  if (!text.length) return;

  // Clear area
  messagebar.clear();

  // Return focus to area
  messagebar.focus();

  // Add message to messages
  messages.addMessage({
    text: text,
  });

  if (responseInProgress) return;
  // Receive dummy message
  receiveMessage();
});

// Dummy response
var answers = [
  'Yes!',
  'No',
  'Hm...',
  'I am not sure',
  'And what about you?',
  'May be ;)',
  'Lorem ipsum dolor sit amet, consectetur',
  'What?',
  'Are you sure?',
  'Of course',
  'Need to think about it',
  'Amazing!!!'
]
var people = [
  {
    name: 'Kate Johnson',
    avatar: 'img/user.jpg'
  },
  {
    name: 'Blue Ninja',
    avatar: 'img/user1.jpg'
  }
];
function receiveMessage() {
  responseInProgress = true;
  setTimeout(function () {
    // Get random answer and random person
    var answer = answers[Math.floor(Math.random() * answers.length)];
    var person = people[Math.floor(Math.random() * people.length)];

    // Show typing indicator
    messages.showTyping({
      header: person.name + ' is typing',
      avatar: person.avatar
    });

    setTimeout(function () {
      // Add received dummy message
      messages.addMessage({
        text: answer,
        type: 'received',
        name: person.name,
        avatar: person.avatar
      });
      // Hide typing indicator
      messages.hideTyping();
      responseInProgress = false;
    }, 4000);
  }, 1000);
}

$$('form.form-ajax-submit').on('formajax:success', function (e) {
  var xhr = e.detail.xhr; // actual XHR object

  var data = e.detail.data; // Ajax response from action file
  // do something with response data
  console.log(data)
  console.log(xhr)
});





