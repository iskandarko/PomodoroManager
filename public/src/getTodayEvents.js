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
    
            while (eventsList.firstChild) { // delete previously loaded events (if any)
                eventsList.removeChild(eventsList.lastChild);
            }
    
            if (events.length > 0) {
                let wholeDayEventsSummary = [];

                for (let i = 0; i < events.length; i++) {
                    let whenStart = events[i].start.dateTime;
                    let whenEnd = events[i].end.dateTime;

                    let a = document.createElement("a");
                    a.setAttribute("target","_blank");
                    a.setAttribute("class", "calendarFont list-group-item list-group-item-action");
                    a.setAttribute("href", events[i].htmlLink);
                    a.classList.add("googleCalColor_" + events[i].colorId);

                    if (events[i].summary === undefined) {
                        events[i].summary = "(No title)";
                    }
        
                    if (isWholeDay(events[i])) {
                        wholeDayEventsSummary.push(" " + events[i].summary);
                        if (!isWholeDay(events[i + 1])) { 
                            a.innerHTML = wholeDayEventsSummary;
                            eventsList.appendChild(a);
                        }
                    } else {
                        a.innerHTML = '[' + whenStart.slice(11, 16) + '-' +  whenEnd.slice(11, 16) + "] " + events[i].summary;
                        if (isCurrent(events[i])) {
                            a.classList.add("font-weight-bold");
                        } 
                        else if (isPassed(events[i])) {
                            a.classList.add("text-muted");
                            a.classList.add("font-weight-lighter");
                            a.classList.remove("googleCalColor_" + events[i].colorId);
                            a.classList.add("googleCalColor_" + events[i].colorId + "_faded");
                        } 
                        eventsList.appendChild(a);
                    }
                }
            } else {
                let a = document.createElement("a");
                a.setAttribute("target","_blank");
                a.setAttribute("class", "list-group-item list-group-item-action");
                a.setAttribute("href", "https://calendar.google.com/");
                a.innerHTML = "No upcoming events found";
                eventsList.appendChild(a);
            } 
        });
}

function isCurrent(event) {
    let now = new Date();
    return event.start.dateTime && (new Date(event.start.dateTime) <= now) && (new Date(event.end.dateTime) >= now);
}

function isPassed(event) {
    let now = new Date();
    return new Date(event.end.dateTime) <= now;
}

function isWholeDay(event) {
    return (event.start.dateTime) ?  false : true; 
}


// function formatDate(date) {
//   let d = new Date(date),
//       month = '' + (d.getMonth() + 1),
//       day = '' + d.getDate(),
//       year = d.getFullYear();

//   if (month.length < 2) 
//       month = '0' + month;
//   if (day.length < 2) 
//       day = '0' + day;

//   return [year, month, day].join('-');
// }


