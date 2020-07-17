
function getTodayEvents() {

        let dayStart = new Date().setHours(0,0,0,0);
        let dayEnd = new Date().setHours(23,59,59,999);
    
        gapi.client.calendar.events.list({
            'calendarId': 'primary',
            'timeMin': (new Date(dayStart)).toISOString(),
            'timeMax' : (new Date(dayEnd)).toISOString(),
            'showDeleted': false,
            'singleEvents': true,
            'maxResults': 50,
            'orderBy': 'startTime'
        })
        .then((gapiResponse) => {
            let events = gapiResponse.result.items;
            let eventsList = document.getElementById("listOfUpcomingEvents");
    
            while (eventsList.firstChild) { // delete previously loaded events (if any)
                eventsList.removeChild(eventsList.lastChild);
            }
    
            if (events.length > 0) {
                for (i = 0; i < events.length; i++) {
                    let event = events[i];
                    let whenStart = event.start.dateTime;
                    let whenEnd = event.end.dateTime;
                    let now = new Date();
                    let isCurrentEvent = event.start.dateTime && (new Date(event.start.dateTime) <= now) && (new Date(event.end.dateTime) >= now);
                    let isPassedEvent = new Date(event.end.dateTime) <= now;
                    let a = document.createElement("a");
                    a.setAttribute("target","_blank");
                    a.setAttribute("class", "list-group-item list-group-item-action");
                    a.setAttribute("href", event.htmlLink);
        
                    if (!whenStart) { // a whole day event
                        a.innerHTML = event.summary;
                        a.classList.add("text-info");
                    } else {
                        a.innerHTML = '[' + whenStart.slice(11, 16) + '-' +  whenEnd.slice(11, 16) + "] " + event.summary;
                        if (isCurrentEvent) {
                            a.classList.add("font-weight-bold");
                        } else if (isPassedEvent) {
                            a.classList.add("text-muted");
                            a.classList.add("font-weight-lighter");
                        } 
                    }
                    eventsList.appendChild(a);
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



// Calendar events colors
// undefined	Who knows	#039be5	
// 1	Lavender	#7986cb	
// 2	Sage	#33b679	
// 3	Grape	#8e24aa	
// 4	Flamingo	#e67c73	
// 5	Banana	#f6c026	
// 6	Tangerine	#f5511d	
// 7	Peacock	#039be5	
// 8	Graphite	#616161	
// 9	Blueberry	#3f51b5	
// 10	Basil	#0b8043	
// 11	Tomato	#d60000


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

// function updateListOfUpcomingEvents() {
//   for (let i = 0; i < events.length)
// }

