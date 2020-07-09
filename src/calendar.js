
    
    function getTodayEvents() {
        gapi.client.calendar.events.list(eventsListRequestSettings)
        .then(eventsHandler(gapiResponse));
    }

    function eventsHandler(gapiResponse){
        let events = gapiResponse.result.items;

        if (events.length > 0) {
            for (i = 0; i < events.length; i++) {

                let event = events[i];
                let whenStart = event.start.dateTime;
                let whenEnd = event.end.dateTime;
                let liContent = "";

                if (!whenStart) {
                    whenStart = event.start.date;
                }
                if (!whenEnd) {
                    whenEnd = '';
                }

                let li = document.createElement("li");

                if (whenEnd){
                    liContent = '[' + whenStart.slice(11, 16) + '-' +  whenEnd.slice(11, 16) + "] " + event.summary;
                } else {
                    liContent = event.summary;
                } 
                
                li.classList.add("list-group-item");
                let now = new Date();
                if (event.start.dateTime && (new Date(event.start.dateTime) <= now) && (new Date(event.end.dateTime) >= now)) {
                    li.classList.add("font-weight-bold");
                } else if ((new Date(event.end.dateTime) <= now)) {
                    li.classList.add("text-muted");
                    li.classList.add("font-weight-lighter");
                } else if (!whenEnd) {
                    li.classList.add("text-info");
                    // li.classList.add("font-italic");
                }

            }
        } else {
            liContent = "No upcoming events found";
        } 
        li.innerHTML = liContent;
        document.getElementById("listOfUpcomingEvents").appendChild(li);
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