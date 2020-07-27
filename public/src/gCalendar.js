import getTodayEvents from "./getTodayEvents.js";

//API client id
let CLIENT_ID = '203121643188-a74cesdr52dk8taqibu023as2cbi0rsj.apps.googleusercontent.com';
// Array of API discovery doc URLs for APIs used by the app
let DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
// Authorization scopes required by the API; multiple scopes can be included, separated by spaces.
let SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

let authorizeButton = document.getElementById('authorize_button');
let signoutButton = document.getElementById('signout_button');
let googleCalendar = document.getElementById('google_calendar');
let calendarSection = document.getElementById('calendarSection');
let timerSection = document.getElementById('timerSection');
let calendarUpdatingInterval;

uploadGoogleApiScript();

function uploadGoogleApiScript() {
    let gApiScript = document.createElement('script');
    gApiScript.src = "https://apis.google.com/js/api.js";
    gApiScript.async = true;
    gApiScript.defer = true;
    
    gApiScript.onload = function() {
        this.onload=function(){};
        handleClientLoad();
    };

    gApiScript.onreadystatechange = function() {
        if (this.readyState === 'complete') {
            this.onload();
        }
    }

    document.body.appendChild(gApiScript);
}

//On load, called to load the auth2 library and API client library.
function handleClientLoad() {
    gapi.load('client:auth2', initClient);  
}

//Initializes the API client library and sets up sign-in state listeners.
function initClient() {
    gapi.client.init({
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(() => {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.addEventListener("click", handleAuthClick);
        signoutButton.addEventListener("click", handleSignoutClick);
    }, function(error) {
        console.log(JSON.stringify(error, null, 2));
    });
}

//Called when the signed-in status changes, to update the UI appropriately and start the business logic.
function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        updateUi("signed_in");
        getTodayEvents(); //business logic
        if (!calendarUpdatingInterval) {
            calendarUpdatingInterval = window.setInterval(()=> {
                getTodayEvents(); //business logic
            }, 60000)
        }
    } else {
        updateUi();
        clearInterval(calendarUpdatingInterval);
        calendarUpdatingInterval = null;
    }
}


function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

function updateUi(status) {
    if (status === "signed_in") {

        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        googleCalendar.style.display = 'block';

        if (calendarSection.classList.contains("col-md-12")) {
            calendarSection.classList.remove("col-md-12");
            calendarSection.classList.add("col-md-4");
        }
        if (timerSection.classList.contains("col-md-12")) {
            timerSection.classList.remove("col-md-12");
            timerSection.classList.add("col-md-8");
        }

    } else {

        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        googleCalendar.style.display = 'none';

        if (calendarSection.classList.contains("col-md-4")) {
            calendarSection.classList.remove("col-md-4");
            calendarSection.classList.add("col-md-12");
        }
        if (timerSection.classList.contains("col-md-8")) {
            timerSection.classList.remove("col-md-8");
            timerSection.classList.add("col-md-12");
        }

    }
}


