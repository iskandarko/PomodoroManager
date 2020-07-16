//GOOGLE CALENDAR API SETTINGS//////////////////////

    // Client ID and API key from the Developer Console
    let CLIENT_ID = '203121643188-9afap42bpoiu4jj6mqo2qoi0nl05jeic.apps.googleusercontent.com';

    // Array of API discovery doc URLs for APIs used by the quickstart
    let DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    let SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

    let authorizeButton = document.getElementById('authorize_button');
    let signoutButton = document.getElementById('signout_button');
    let googleCalendar = document.getElementById('google_calendar');
    let calendarSection = document.getElementById('calendarSection');
    let timerSection = document.getElementById('timerSection');
    let calendarUpdatingInterval;


    /**
     *  On load, called to load the auth2 library and API client library.
     */
    function handleClientLoad() {
        gapi.load('client:auth2', initClient);  
    }

    /**
     *  Initializes the API client library and sets up sign-in state
     *  listeners.
     */
    function initClient() {
        gapi.client.init({
            // apiKey: API_KEY,
            clientId: CLIENT_ID,
            discoveryDocs: DISCOVERY_DOCS,
            scope: SCOPES
        }).then(function () {
            // Listen for sign-in state changes.
            gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

            // Handle the initial sign-in state.
            updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
            authorizeButton.addEventListener("click", handleAuthClick);
            signoutButton.addEventListener("click", handleSignoutClick);
        }, function(error) {
            // appendPre(JSON.stringify(error, null, 2));
            console.log(JSON.stringify(error, null, 2));
        });
    }


    /**
     *  Called whenStart the signed in status changes, to update the UI
     *  appropriately. After a sign-in, the API is called.
     */
    function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
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
            getTodayEvents();
            if (!calendarUpdatingInterval) {
                calendarUpdatingInterval = window.setInterval(()=> {
                    console.log('tic-tac');
                    getTodayEvents();
                }, 60000)
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
            clearInterval(calendarUpdatingInterval);
            calendarUpdatingInterval = null;
        }
    }

    /**
     *  Sign in the user upon button click.
     */
    function handleAuthClick() {
        gapi.auth2.getAuthInstance().signIn();
    }

    /**
     *  Sign out the user upon button click.
     */
    function handleSignoutClick() {
        gapi.auth2.getAuthInstance().signOut();
    }

