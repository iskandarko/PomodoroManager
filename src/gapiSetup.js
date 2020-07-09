//GOOGLE CALENDAR API SETTINGS//////////////////////

    // Client ID and API key from the Developer Console
    let CLIENT_ID = '203121643188-9afap42bpoiu4jj6mqo2qoi0nl05jeic.apps.googleusercontent.com';
    let API_KEY = 'AIzaSyDBYTf7cKR7T6VhdqqoxZt4i1Zw_b-Ri-A';

    // Array of API discovery doc URLs for APIs used by the quickstart
    let DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

    // Authorization scopes required by the API; multiple scopes can be
    // included, separated by spaces.
    let SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

    let authorizeButton = document.getElementById('authorize_button');
    let signoutButton = document.getElementById('signout_button');

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
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    }, function(error) {
        appendPre(JSON.stringify(error, null, 2));
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
        getTodayEvents();
        // updateListOfUpcomingEvents();
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
    }
    }

    /**
     *  Sign in the user upon button click.
     */
    function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
    }

    /**
     *  Sign out the user upon button click.
     */
    function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
    }

    let dayStart = new Date().setHours(0,0,0,0);
    let dayEnd = new Date().setHours(23,59,59,999);

    //settings for the gapi request

    let eventsListRequestSettings = {
        'calendarId': 'primary',
        'timeMin': (new Date(dStart)).toISOString(),
        'timeMax' : (new Date(dEnd)).toISOString(),
        'showDeleted': false,
        'singleEvents': true,
        'maxResults': 10,
        'orderBy': 'startTime'
    }