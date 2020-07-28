const eventsList = document.getElementById("listOfUpcomingEvents");

export default function getTodayEvents() {
        let dayStart = new Date().setHours(0,0,0,0);
        let dayEnd = new Date().setHours(23,59,59,999);
    
        gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date(dayStart)).toISOString(),
            'timeMax' : (new Date(dayEnd)).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 100,
            'orderBy': 'startTime'
        })
        .then((gapiResponse) => {
            let events = gapiResponse.result.items;

            // Delete previously loaded events (if any)
            while (eventsList.firstChild) { 
                eventsList.removeChild(eventsList.lastChild);
            }
    
            if (events.length > 0) {
                let wholeDayEventsOverallSummary = [];

                for (let i = 0; i < events.length; i++) {
                    let event = events[i];
                    let nextEvent = events[i + 1];
                    let whenStart = event.start.dateTime;
                    let whenEnd = event.end.dateTime;
                    let item = createBlankItem(event);

                    if (event.summary === undefined) {
                        event.summary = "(No title)";
                    }
                    if (isWholeDay(event)) {
                        wholeDayEventsOverallSummary.push(" " + event.summary);

                        if (!isWholeDay(nextEvent)) { 
                            item.innerHTML = wholeDayEventsOverallSummary;
                            eventsList.appendChild(item);
                        }
                    } else {
                        let formattedSummary = formatSummary(whenStart, whenEnd, event.summary);
                        item.innerHTML = formattedSummary;

                        if (isCurrent(event)) {
                            item = highlight(item);
                        } 
                        else if (isPassed(event)) {
                            item = fade(item);
                        } 
                        eventsList.appendChild(item);
                    }
                }
            } else {
                let item = createNoEventsItem();
                eventsList.appendChild(item);
            } 
        });
}

function createBlankItem(event) {
    let item = document.createElement("a");
    item.setAttribute("target","_blank");
    item.setAttribute("class", "calendarFont list-group-item list-group-item-action");
    if (event) {
        item.setAttribute("href", event.htmlLink);
        item.classList.add("googleCalColor_" + event.colorId);
    } else {
        item.setAttribute("href", "https://calendar.google.com/");
        item.classList.add("googleCalColor_undefined");
    }
    return item;
}

function isWholeDay(event) {
    return (event.start.dateTime) ?  false : true; 
}

function formatSummary(whenStart, whenEnd, eventSummary) {
    return '[' + whenStart.slice(11, 16) + '-' +  whenEnd.slice(11, 16) + "] " + eventSummary;
}

function highlight(item) {
    item.classList.add("font-weight-bold");
    return item;
}

function fade(item) {
    item.classList.add("text-muted");
    item.classList.add("font-weight-lighter");
    item.classList.remove("googleCalColor_" + event.colorId);
    item.classList.add("googleCalColor_" + event.colorId + "_faded");
    return item;
}

function isCurrent(event) {
    let now = new Date();
    return event.start.dateTime && (new Date(event.start.dateTime) <= now) && (new Date(event.end.dateTime) >= now);
}

function isPassed(event) {
    let now = new Date();
    return new Date(event.end.dateTime) <= now;
}

function createNoEventsItem() {
    let item = createBlankItem();
    item.innerHTML = "No upcoming events found for today";
    return item;
}









