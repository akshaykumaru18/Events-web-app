function loadDetails(){
   // alert(localStorage.getItem('attend_event_id'));
    var contentBlock  = document.getElementById("content-block");
    var loadingBlock = document.getElementById('loading-block');

    contentBlock.style.display = "none";
    loadingBlock.style.display = "block";

    var apiUrl =  `http://localhost:5000/events?eventId=${localStorage.getItem("attend_event_id")}&emailId=${localStorage.getItem('user_email')}`;
    fetch(apiUrl).then(response => {
        return response.json();
    }).then(data => {
        // Work with JSON data here
        eventsList = data['data'];
        for (i in eventsList) {
            console.log(eventsList[i]);
           // alert(eventsList[i].EVENT_START_DATE);
           var st = eventsList[i].EVENT_START_DATE.split(/[- :]/);
           var et = eventsList[i].EVENT_END_DATE.split(/[- :]/);
           returnAttendEventDate(eventsList[i].EVENT_START_DATE);
           returnAttendEventDate(eventsList[i].EVENT_END_DATE);

            
            var titleNode = document.getElementById("eventName");
            titleNode.innerText = eventsList[i].EVENT_NAME;

            var eventImageNode = document.getElementById("event-image");
            eventImageNode.src = eventsList[i].EVENT_IMAGE;
            //event-description
            var eventDescriptionNode = document.getElementById('event-description');
            eventDescriptionNode.innerText = eventsList[i].EVENT_DESCRIPTION;

            //event-address
            var eventAddressFooter = document.getElementById("event-address")
            eventAddressFooter.innerText = `${eventsList[i].EVENT_ADDRESS}, ${eventsList[i].EVENT_CITY}, ${eventsList[i].STATE_NAME}, ${eventsList[i].COUNTRY_NAME}`;
            //event-start-end-date
            var eventStartEndDate = document.getElementById("event-start-end-date");
            eventStartEndDate.innerText = `${returnAttendEventDate(eventsList[i].EVENT_START_DATE)} to ${returnAttendEventDate(eventsList[i].EVENT_END_DATE)}`;

            //event-name-footer
            var footerTitleNode = document.getElementById("event-name-footer");
            footerTitleNode.innerText = eventsList[i].EVENT_NAME;
            //event-address-footer

            var footerAddressNode = document.getElementById("event-address-footer");
            footerAddressNode.innerText = `${eventsList[i].EVENT_ADDRESS}, ${eventsList[i].EVENT_CITY}, ${eventsList[i].STATE_NAME}, ${eventsList[i].COUNTRY_NAME}`;
            contentBlock.style.display = "block";
            loadingBlock.style.display = "none";
        
            var ticketPriceNode = document.getElementById("ticket-amount");
            ticketPriceNode.innerText = eventsList[i].TICKET_PRICE;

            var attendButtonNode = document.getElementById('attend-button');
            var bookedButtonNode = document.getElementById('booked-button');
            if(String(eventsList[i].USER_BOOKED) == "true"){
              bookedButtonNode.style.display = "block";
              attendButtonNode.style.display = "none";
            }else{
              attendButtonNode.style.display = "block";
              bookedButtonNode.style.display = "none";
            }
        }

    }).catch(err => {
        //alert(err);
        // Do something for an error here
    });
}

function makePayment(){
    //alert('making payment');
    var data = {
        event_id: localStorage.getItem("attend_event_id"),
        PAYMENT_DATE: new Date(),
        transaction_status:"SUCCESS",
        user_email_id:localStorage.getItem("user_email")
      }
    
      $.ajax({
        url: 'http://localhost:5000/attendEvent',
        type: "POST",
        data: data,
        success: function (result) {
          console.log(result);
          var success = result['data']['success'];
          console.log(success);
          if (success == 400) {
            alert('failure');
            
          } else {
            alert(result['data']['message']);
            var attendButtonNode = document.getElementById('attend-button');
            var bookedButtonNode = document.getElementById('booked-button');
            
              bookedButtonNode.style.display = "block";
              attendButtonNode.style.display = "none";
            
          }

        },
        error: function () {
          alert('failure');
        }
      })

}
function returnAttendEventDate(date){
    
  var d = new Date(String(date));
  
  var eventDate = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth()+1).padStart(2,'0')}-${d.getFullYear()}`;
    return eventDate;
}