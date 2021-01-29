var user_email_id;
var user_password;


function setUserEmail(email,password){
    user_email_id = email;
    user_password = password;
    if (typeof(Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        localStorage.setItem("user_email", email);
      } else {
        // Sorry! No Web Storage support..
      }
}


function printdetails(){
    //alert(localStorage.getItem("user_email"));
}


function loadUserEvents() {
  var apiUrl = 'http://localhost:5000/events?user=' + localStorage.getItem("user_email");
  fetch(apiUrl).then(response => {
      return response.json();
  }).then(data => {
      // Work with JSON data here
      eventsList = data['data'];
      var noEventsNode = document.getElementById("no-events-booked");
      var eventListNode = document.getElementById("your-events-list");
      if(eventsList.length == 0){
            
            noEventsNode.style.display = "block";
            eventListNode.style.display = "none";
      }else{
        noEventsNode.style.display = "none";
        for (i in eventsList) {
            //console.log(eventsList[i]);
            //  console.log(`Event Name : ${eventsList[i].EVENT_NAME} \n 
            //  Event Description : ${eventsList[i].EVENT_DESCRIPTION} \n
            //  Event Start Date : ${eventsList[i].EVENT_START_DATE}`);
            //create the li and set id and class
            var node = document.createElement("li");
            node.setAttribute("id", `${eventsList[i].EVENT_ID}`);
            node.classList.add("list-group-item");
  
            //create image and set class name = event-image and append to node
            var imgNode = document.createElement("img");
            imgNode.classList.add("event-image");
            imgNode.src =
                `${eventsList[i].EVENT_IMAGE}`;
            node.appendChild(imgNode);
  
            // create a div element with class = trailing-attend
            // h2 with text = Attend
  
            var trailingNode = document.createElement("div");
            trailingNode.classList.add("trailing-update");
            var attendNode = document.createElement("h2");
            var textnode = document.createTextNode(`View`);
            attendNode.appendChild(textnode);
            trailingNode.appendChild(attendNode);
  
  
            node.setAttribute("onclick", "setEventIdAndRoute(this.id);");
  
            node.appendChild(trailingNode);
  
  
            // create a div element add class = event-detail
            // 1) add H1 tag, id = event-item-title
            // 2) add h4 tag, id = event-item-description
            // 3) add h6 tag for location
            // 4) add h6 tag to Display start and end date
            var eventDetailDiv = document.createElement("div");
            eventDetailDiv.classList.add("event-detail");
  
            var eventTitleNode = document.createElement("h4");
            var titleTextNode = document.createTextNode(`${eventsList[i].EVENT_NAME}`)
            eventTitleNode.appendChild(titleTextNode);
  
            var eventDescriptionNode = document.createElement("h6");
            var descriptionTextNode = document.createTextNode(`Description ${eventsList[i].EVENT_DESCRIPTION}`)
            eventDescriptionNode.appendChild(descriptionTextNode);
  
  
            var eventLocationNode = document.createElement("h6");
            var locationTextNode = document.createTextNode(`Location :  ${eventsList[i].EVENT_CITY}`)
            eventLocationNode.appendChild(locationTextNode);
  
            //alert(eventsList[i].EVENT_START_DATE);
            var t = eventsList[i].EVENT_START_DATE.split(/[- :]/);
            var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
  
           
            var eventDateNode = document.createElement("h6");
            var dateTextNode = document.createTextNode(`Date : ${returnDateString(eventsList[i].EVENT_START_DATE)}`);
            eventDateNode.appendChild(dateTextNode);
  
            eventDetailDiv.appendChild(eventTitleNode);
            eventDetailDiv.appendChild(eventDescriptionNode);
            eventDetailDiv.appendChild(eventLocationNode);
            eventDetailDiv.appendChild(eventDateNode);
  
            node.appendChild(eventDetailDiv);
  
            document.getElementById("your-events-list").appendChild(node);
  
  
        }
      }
    
      //console.log(data);
  }).catch(err => {
      //alert(err);
      // Do something for an error here
  });
}
