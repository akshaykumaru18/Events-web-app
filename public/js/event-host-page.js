
var categoriesList;
var hostSelectedList = [];
var eventID;
function searchMatchCategories() {
    var searchInput = document.getElementById('category_search');
    var categoryList = document.getElementById("event-category-list");
    var filter = searchInput.value.toUpperCase();
    //console.log(filter);
    if (filter != null) {
        for (i = 0; i < categoriesList.length; i++) {

            txtValue = categoriesList[i].CATEGORY_NAME;

            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                //console.log('match found' + categoriesList[i].CATEGORY_NAME);
                var categoryNode = document.getElementById(categoriesList[i].CATEGORY_ID);
                categoryNode.style.display = "block";
            } else {
                var categoryNode = document.getElementById(categoriesList[i].CATEGORY_ID);
                categoryNode.style.display = "none";


            }
        }
    }


}
function loadCountries() {


    /* TO FETCH COUNTRIES */
    var countryNode = document.getElementById('EVENT_COUNTRY');
    var apiUrl = 'http://localhost:5000/countries';
    fetch(apiUrl).then(response => {
        return response.json();
    }).then(data => {
        // Work with JSON data here
        //alert('CITY response got : ' + data['data']);
        for (i in data['data']) {
            var countryItemNode = document.createElement("option");
            countryItemNode.setAttribute("id",data['data'][i].COUNTRY_NAME);
            countryItemNode.setAttribute("value", data['data'][i].COUNTRY_NAME);
            var textNode = document.createTextNode(data['data'][i].COUNTRY_NAME);
            countryItemNode.appendChild(textNode);

            countryNode.appendChild(countryItemNode);
            //console.log(`COUNTRY NAME : ${data['data'][i].COUNTRY_NAME} COUNTRY CODE ${data['data'][i].COUNTRY_CODE}`);
        }
        //console.log(data);
    }).catch(err => {
        alert(err);
        // Do something for an error here
    });

    var categoriesUrl = 'http://localhost:5000/categories';
    fetch(categoriesUrl).then(response => {
        return response.json();
    }).then(data => {
        // Work with JSON data here
        categoriesList = data['data'];
        var categoryList = document.getElementById("event-category-list");
        for (i in categoriesList) {

            // console.log(`Category Name : ${categoriesList[i].CATEGORY_NAME} \n 
            // CATEGORY_TYPE : ${categoriesList[i].CATEGORY_TYPE}`);
            var categoryNode = document.createElement("li");
            categoryNode.setAttribute('id', categoriesList[i].CATEGORY_ID);
            categoryNode.setAttribute("onclick", "selectedCategory(this.id);");
            categoryNode.classList.add("list-group-item");

            var h4TitleNode = document.createElement("h6");
            var titleTextNode = document.createTextNode(categoriesList[i].CATEGORY_NAME);
            h4TitleNode.appendChild(titleTextNode);
            categoryNode.appendChild(h4TitleNode);
            categoryList.appendChild(categoryNode);

            console.log(`category id is ${categoriesList[i].CATEGORY_ID}`);

        }

        //console.log(data);
    }).catch(err => {
        //alert(err);
        // Do something for an error here
    });
}
function selectedCategory(clickedID) {

    var li = document.getElementById(clickedID);
    if (li.classList.contains("item-selected")) {
        //alert('already selected');
        li.classList.remove("item-selected");
        var index = hostSelectedList.indexOf(clickedID);

        hostSelectedList.splice(index, index + 1);

    } else {
        if (hostSelectedList.length == 0) {
            //EVENT_CATEGORY
            var selectedCategoryNode = document.getElementById("SELECTED_EVENT_CATEGORY");
            var selectedCategoryIDNode = document.getElementById("SELECTED_EVENT_CATEGORY_ID");

            selectedCategoryNode.readOnly = false;
            //selectedCategoryIDNode.readOnly = false;
            for (i in categoriesList) {
                if (categoriesList[i].CATEGORY_ID == clickedID) {
                    selectedCategoryNode.value = categoriesList[i].CATEGORY_NAME;
                    selectedCategoryIDNode.value = categoriesList[i].CATEGORY_ID;
                }
            }
            selectedCategoryNode.readOnly = true;


            li.classList.add("item-selected");
            hostSelectedList.push(clickedID);

        } else {
            alert('Only one category per event');
        }

    }
    console.log(hostSelectedList);

}
function loadStatesForCountry() {

    var countryNode = document.getElementById("EVENT_COUNTRY");
    var stateSelectNode = document.getElementById('EVENT_STATE');
    var apiUrl = 'http://localhost:5000/states?country=' + countryNode.value;
    fetch(apiUrl).then(response => {
        return response.json();
    }).then(data => {
        // Work with JSON data here
        //alert(data['data'].length);
        if (data['data'].length > 0) {
            for (i in data['data']) {
                var stateNode = document.createElement("option");
                stateNode.setAttribute("id",data['data'][i].STATE_NAME);
                stateNode.setAttribute("value", data['data'][i].STATE_NAME);
                var textNode = document.createTextNode(data['data'][i].STATE_NAME);
                stateNode.appendChild(textNode);

                stateSelectNode.appendChild(stateNode);
            }
        }
        else {
            stateSelectNode.innerHTML = "";
        }

        //console.log(data);
    }).catch(err => {
        //alert(err);
        // Do something for an error here
    });

}

function loadCitiesForStates() {
    var stateNode = document.getElementById("EVENT_STATE");
    var citySelectNode = document.getElementById('EVENT_CITY');
    var apiUrl = 'http://localhost:5000/cities?state=' + stateNode.value;
    fetch(apiUrl).then(response => {
        return response.json();
    }).then(data => {
        // Work with JSON data here
        citySelectNode.innerHTML = "";
        if (data['data'].length > 0) {
            for (i in data['data']) {

                // console.log(data['data'][i].CITY_NAME)
                
                var cityNode = document.createElement("option");
                cityNode.setAttribute("id",data['data'][i].CITY_NAME);
                cityNode.setAttribute("value", data['data'][i].CITY_NAME);
                var textNode = document.createTextNode(data['data'][i].CITY_NAME);
                cityNode.appendChild(textNode);

                citySelectNode.appendChild(cityNode);
            }
        }
        else {
            citySelectNode.innerHTML = "";
        }

        //console.log(data);
    }).catch(err => {
        //alert(err);
        // Do something for an error here
    });

}
function locationDetails() {
    alert('javascript linked');
    var citySelectNode = document.getElementById('EVENT_CITY');
    var stateSelectNode = document.getElementById('EVENT_STATE');


    /*to FETCH CITIES*/
    var apiUrl = 'http://localhost:5000/cities';
    fetch(apiUrl).then(response => {
        return response.json();
    }).then(data => {
        // Work with JSON data here
        //alert('CITY response got : ' + data['data']);
        for (city in data['data']) {
            var cityNode = document.createElement("option");
            cityNode.setAttribute("value", data['data'][city].CITY_NAME);
            var textNode = document.createTextNode(data['data'][city].CITY_NAME);
            cityNode.appendChild(textNode);
            //cityNode.value = data['data'][city].CITY_NAME;
            citySelectNode.appendChild(cityNode);
            console.log(`CITY NAME : ${data['data'][city].CITY_NAME} STATE NAME ${data['data'][city].STATE_NAME}`);
        }
        //console.log(data);
    }).catch(err => {
        //alert(err);
        // Do something for an error here
    });

    /*TO FETCH STATES*/
    var apiUrl = 'http://localhost:5000/states';
    fetch(apiUrl).then(response => {
        return response.json();
    }).then(data => {
        // Work with JSON data here
        //alert('CITY response got : ' + data['data']);
        for (i in data['data']) {
            var stateNode = document.createElement("option");
            stateNode.setAttribute("value", data['data'][i].STATE_NAME);
            var textNode = document.createTextNode(data['data'][i].STATE_NAME);
            stateNode.appendChild(textNode);

            stateSelectNode.appendChild(stateNode);
            console.log(`STATE NAME : ${data['data'][i].STATE_NAME} COUNTRY NAME ${data['data'][i].COUNTRY_NAME}`);
        }
        //console.log(data);
    }).catch(err => {
        //alert(err);
        // Do something for an error here
    });



}


function validateAndInsertEvent() {

    //event.preventDefault();
    var EVENT_NAME = document.forms["AddEventForm"]["EVENT_NAME"];
    var EVENT_IMAGE = document.forms["AddEventForm"]["EVENT_IMAGE"];
    var EVENT_START_DATE = document.forms["AddEventForm"]["EVENT_START_DATE"];
    var EVENT_END_DATE = document.forms["AddEventForm"]["EVENT_END_DATE"];
    var EVENT_DESCRIPTION = document.forms["AddEventForm"]["EVENT_DESCRIPTION"];
    var TICKET_PRICE = document.forms["AddEventForm"]["TICKET_PRICE"];
    var EVENT_ADDRESS = document.forms["AddEventForm"]["EVENT_ADDRESS"];
    var EVENT_CITY = document.forms["AddEventForm"]["EVENT_CITY"];
    var EVENT_STATE = document.forms["AddEventForm"]["EVENT_STATE"];
    var EVENT_COUNTRY = document.forms["AddEventForm"]["EVENT_COUNTRY"];
    var EVENT_HOST_ID = document.forms["AddEventForm"]["EVENT_HOST_ID"];
    var INVITE_TYPE = document.forms["AddEventForm"]["INVITE_TYPE"];
    var EVENT_CAPACITY = document.forms["AddEventForm"]["EVENT_CAPACITY"];
    var EVENT_CATEGORY = document.forms["AddEventForm"]["EVENT_CATEGORY"];

    EVENT_HOST_ID.value = localStorage.getItem("user_email");

    if (EVENT_NAME.value == "") {
        window.alert("Please Enter event name.");
        EVENT_NAME.focus();
        return false;
    }

    if (EVENT_START_DATE.value == "") {
        window.alert("Please enter Event Date.");
        EVENT_START_DATE.focus();
        return false;
    }

    if (EVENT_END_DATE.value == "") {
        window.alert("Please enter Event end Date.");
        EVENT_END_DATE.focus();
        return false;
    }

    if (EVENT_DESCRIPTION.value == "") {
        window.alert("Please enter Event Description");
        EVENT_END_DATE.focus();
        return false;
    }

    if (TICKET_PRICE.value == "") {
        window.alert("Please enter Ticket price");
        TICKET_PRICE.focus();
        return false;
    }


    if (EVENT_ADDRESS.value == "") {
        window.alert("Please enter event address.");
        EVENT_ADDRESS.focus();
        return false;
    }

    // EVENT_CITY
    if (EVENT_CITY.value == "") {
        window.alert("Please enter event city.");
        EVENT_CITY.focus();
        return false;
    }

    //EVENT_STATE
    if (EVENT_STATE.value == "") {
        window.alert("Please enter event state.");
        EVENT_STATE.focus();
        return false;
    }

    //EVENT_COUNTRY
    if (EVENT_COUNTRY.value == "") {
        window.alert("Please enter event country.");
        EVENT_COUNTRY.focus();
        return false;
    }
    //EVENT_HOST_ID
    if (EVENT_HOST_ID.value == "") {
        window.alert("Please enter event host email.");
        EVENT_HOST_ID.focus();
        return false;
    }

    //INVITE_TYPE
    if (INVITE_TYPE.value == "") {
        window.alert("Please enter Invite Type");
        INVITE_TYPE.focus();
        return false;
    }

    //EVENT_CAPACITY
    if (EVENT_CAPACITY.value == "") {
        window.alert("Please enter capacity");
        EVENT_CAPACITY.focus();
        return false;
    }
    if (EVENT_IMAGE.value == "") {
        window.alert("Please enter event image.");
        EVENT_IMAGE.focus();
        return false;
    }
    if (hostSelectedList.length == 0) {
        window.alert("Selecte event category");
        return false;
    }

    var EVENT_NAME = document.forms["AddEventForm"]["EVENT_NAME"];
    var EVENT_IMAGE = document.forms["AddEventForm"]["EVENT_IMAGE"];
    var EVENT_START_DATE = document.forms["AddEventForm"]["EVENT_START_DATE"];
    var EVENT_END_DATE = document.forms["AddEventForm"]["EVENT_END_DATE"];
    var EVENT_DESCRIPTION = document.forms["AddEventForm"]["EVENT_DESCRIPTION"];
    var TICKET_PRICE = document.forms["AddEventForm"]["TICKET_PRICE"];
    var EVENT_ADDRESS = document.forms["AddEventForm"]["EVENT_ADDRESS"];
    var EVENT_CITY = document.forms["AddEventForm"]["EVENT_CITY"];
    var EVENT_STATE = document.forms["AddEventForm"]["EVENT_STATE"];
    var EVENT_COUNTRY = document.forms["AddEventForm"]["EVENT_COUNTRY"];
    var EVENT_HOST_ID = document.forms["AddEventForm"]["EVENT_HOST_ID"];
    var INVITE_TYPE = document.forms["AddEventForm"]["INVITE_TYPE"];
    var EVENT_CAPACITY = document.forms["AddEventForm"]["EVENT_CAPACITY"];
    var EVENT_CATEGORY = document.forms["AddEventForm"]["EVENT_CATEGORY"];
    var EVENT_CATEGORY_ID = document.forms["AddEventForm"]["EVENT_CATEGORY_ID"];
    EVENT_HOST_ID.value = localStorage.getItem("user_email");

    var data = {
      EVENT_ID: "1",
      EVENT_NAME: EVENT_NAME.value,
      EVENT_IMAGE: EVENT_IMAGE.value,
      EVENT_START_DATE: sqlFormatDateString(EVENT_START_DATE.value),
      EVENT_END_DATE: sqlFormatDateString(EVENT_END_DATE.value),
      EVENT_DESCRIPTION: EVENT_DESCRIPTION.value,
      TICKET_PRICE: TICKET_PRICE.value,
      EVENT_ADDRESS: EVENT_ADDRESS.value,
      EVENT_CITY: EVENT_CITY.value,
      EVENT_STATE: EVENT_STATE.value,
      EVENT_COUNTRY: EVENT_COUNTRY.value,
      EVENT_HOST_ID: EVENT_HOST_ID.value,
      INVITE_TYPE: INVITE_TYPE.value,
      EVENT_CAPACITY: EVENT_CAPACITY.value,
      EVENT_CATEGORY: EVENT_CATEGORY.value,
      EVENT_CATEGORY_ID: EVENT_CATEGORY_ID.value
    }
    // alert('calling api ' + data);
    $.ajax({
      url: 'http://localhost:5000/events/add',
      type: "POST",
      data: data,
      success: function (result) {
        console.log(result);
        var success = result['data']['success'];
        console.log(success);
        if (success == 400) {
          alert(result['data']['message']);
        
        } else {
         
          alert("Event Added Successfully");
    
          window.location = "index.html";

        }

      },
      error: function () {
        alert('failure');
      }
    })
    return true;

}

// Update Event section

function loadYourEvents() {
    var apiUrl = 'http://localhost:5000/events?host=' + localStorage.getItem("user_email");
    fetch(apiUrl).then(response => {
        return response.json();
    }).then(data => {
        // Work with JSON data here
        eventsList = data['data'];
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
            var textnode = document.createTextNode(`Update`);
            attendNode.appendChild(textnode);
            trailingNode.appendChild(attendNode);


            node.setAttribute("onclick", "setEventId(this.id);");

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
        //console.log(data);
    }).catch(err => {
        //alert(err);
        // Do something for an error here
    });
}

function setEventId(event_id) {
    console.log(`event id is ${event_id}`);
    localStorage.setItem("update_event_id", event_id);
    window.location = "update_event_page.html";
}

function loadEventDetails() {
   
    var EVENT_ID = document.forms["UpdateEventForm"]["EVENT_ID"];
    var EVENT_NAME = document.forms["UpdateEventForm"]["EVENT_NAME"];
    var EVENT_IMAGE = document.forms["UpdateEventForm"]["EVENT_IMAGE"];
    var EVENT_START_DATE = document.forms["UpdateEventForm"]["EVENT_START_DATE"];
    var EVENT_END_DATE = document.forms["UpdateEventForm"]["EVENT_END_DATE"];
    var EVENT_DESCRIPTION = document.forms["UpdateEventForm"]["EVENT_DESCRIPTION"];
    var TICKET_PRICE = document.forms["UpdateEventForm"]["TICKET_PRICE"];
    var EVENT_ADDRESS = document.forms["UpdateEventForm"]["EVENT_ADDRESS"];
    var EVENT_CITY = document.forms["UpdateEventForm"]["EVENT_CITY"];
    var EVENT_STATE = document.forms["UpdateEventForm"]["EVENT_STATE"];
    var EVENT_COUNTRY = document.forms["UpdateEventForm"]["EVENT_COUNTRY"];
    var EVENT_HOST_ID = document.forms["UpdateEventForm"]["EVENT_HOST_ID"];
    var INVITE_TYPE = document.forms["UpdateEventForm"]["INVITE_TYPE"];
    var EVENT_CAPACITY = document.forms["UpdateEventForm"]["EVENT_CAPACITY"];
    var EVENT_CATEGORY = document.forms["UpdateEventForm"]["EVENT_CATEGORY"];
    var EVENT_CATEGORY_ID = document.forms["UpdateEventForm"]["SELECTED_EVENT_CATEGORY_ID"];
    EVENT_HOST_ID.value = localStorage.getItem("user_email");

    var apiUrl = 'http://localhost:5000/events?eventId=' + localStorage.getItem("update_event_id")+'&user_email=' + "";
    
   
    fetch(apiUrl).then(response => {
        return response.json();
    }).then(data => {
        // Work with JSON data here
        console.log(data);
        var eventsList = data['data'];
        for (i in eventsList) {
            console.log(eventsList[i]);
           

       
            EVENT_ID.value = eventsList[i].EVENT_ID;
            EVENT_NAME.value = eventsList[i].EVENT_NAME;
            var startDate = returnDateTimeString(eventsList[i].EVENT_START_DATE);
            var endDate = returnDateTimeString(eventsList[i].EVENT_END_DATE);
            EVENT_START_DATE.value = startDate;
            EVENT_END_DATE.value = endDate;
            EVENT_DESCRIPTION.value = eventsList[i].EVENT_DESCRIPTION;
            EVENT_IMAGE.value = eventsList[i].EVENT_IMAGE;
            TICKET_PRICE.value = eventsList[i].TICKET_PRICE;
            EVENT_ADDRESS.value = eventsList[i].EVENT_ADDRESS;
            loadCountries();
            var countrySelectedNode = document.getElementById('EVENT_COUNTRY');
            var countryNode = document.createElement("option");
            countryNode.setAttribute("id",eventsList[i].COUNTRY_NAME);
            countryNode.setAttribute("value", eventsList[i].COUNTRY_NAME);
            var textNode = document.createTextNode(eventsList[i].COUNTRY_NAME);
            countryNode.appendChild(textNode);
            countrySelectedNode.appendChild(countryNode);

            loadStatesForCountry();

            var stateSelectNode = document.getElementById('EVENT_STATE');
            var stateNode = document.createElement("option");
            stateNode.setAttribute("id",eventsList[i].STATE_NAME);
            stateNode.setAttribute("value", eventsList[i].STATE_NAME);
            var textNode = document.createTextNode(eventsList[i].STATE_NAME);
            stateNode.appendChild(textNode);
            stateSelectNode.appendChild(stateNode);

            loadCitiesForStates();

            var citySelectNode = document.getElementById('EVENT_CITY');
            var cityNode = document.createElement("option");
            cityNode.setAttribute("id",eventsList[i].EVENT_CITY);
            cityNode.setAttribute("value", eventsList[i].EVENT_CITY);
            var textNode = document.createTextNode(eventsList[i].EVENT_CITY);
            cityNode.appendChild(textNode);
            citySelectNode.appendChild(cityNode);

         

           
            EVENT_HOST_ID.value = eventsList[i].EVENT_HOST_ID;
            INVITE_TYPE.value = eventsList[i].INVITE_TYPE;
            EVENT_CAPACITY.value = eventsList[i].EVENT_CAPACITY;
            EVENT_CATEGORY.value = eventsList[i].CATEGORY_NAME;
            var selectedCategoryNode = document.getElementById("SELECTED_EVENT_CATEGORY");
            var selectedCategoryIDNode = document.getElementById("SELECTED_EVENT_CATEGORY_ID");
            selectedCategoryNode.value = eventsList[i].CATEGORY_NAME;
            selectedCategoryIDNode.value = eventsList[i].CATEGORY_ID;

        }

    }).catch(err => {
        //alert(err);
        // Do something for an error here
    });
}




let addEventForm = document.getElementById("AddEventForm");
addEventForm.addEventListener('submit', (event) => {
   
    event.preventDefault();
    // handle the form data
   
    var EVENT_NAME = document.forms["AddEventForm"]["EVENT_NAME"];
    var EVENT_IMAGE = document.forms["AddEventForm"]["EVENT_IMAGE"];
    var EVENT_START_DATE = document.forms["AddEventForm"]["EVENT_START_DATE"];
    var EVENT_END_DATE = document.forms["AddEventForm"]["EVENT_END_DATE"];
    var EVENT_DESCRIPTION = document.forms["AddEventForm"]["EVENT_DESCRIPTION"];
    var TICKET_PRICE = document.forms["AddEventForm"]["TICKET_PRICE"];
    var EVENT_ADDRESS = document.forms["AddEventForm"]["EVENT_ADDRESS"];
    var EVENT_CITY = document.forms["AddEventForm"]["EVENT_CITY"];
    var EVENT_STATE = document.forms["AddEventForm"]["EVENT_STATE"];
    var EVENT_COUNTRY = document.forms["AddEventForm"]["EVENT_COUNTRY"];
    var EVENT_HOST_ID = document.forms["AddEventForm"]["EVENT_HOST_ID"];
    var INVITE_TYPE = document.forms["AddEventForm"]["INVITE_TYPE"];
    var EVENT_CAPACITY = document.forms["AddEventForm"]["EVENT_CAPACITY"];
    var EVENT_CATEGORY = document.forms["AddEventForm"]["EVENT_CATEGORY"];
    var EVENT_CATEGORY_ID = document.forms["AddEventForm"]["EVENT_CATEGORY_ID"];
    EVENT_HOST_ID.value = localStorage.getItem("user_email");

    var data = {
      EVENT_ID: "1",
      EVENT_NAME: EVENT_NAME.value,
      EVENT_IMAGE: EVENT_IMAGE.value,
      EVENT_START_DATE: EVENT_START_DATE.value,
      EVENT_END_DATE: EVENT_END_DATE.value,
      EVENT_DESCRIPTION: EVENT_DESCRIPTION.value,
      TICKET_PRICE: TICKET_PRICE.value,
      EVENT_ADDRESS: EVENT_ADDRESS.value,
      EVENT_CITY: EVENT_CITY.value,
      EVENT_STATE: EVENT_STATE.value,
      EVENT_COUNTRY: EVENT_COUNTRY.value,
      EVENT_HOST_ID: EVENT_HOST_ID.value,
      INVITE_TYPE: INVITE_TYPE.value,
      EVENT_CAPACITY: EVENT_CAPACITY.value,
      EVENT_CATEGORY: EVENT_CATEGORY.value,
      EVENT_CATEGORY_ID: EVENT_CATEGORY_ID.value
    }
    // alert('calling api ' + data);
    $.ajax({
      url: 'http://localhost:5000/events/add',
      type: "POST",
      data: data,
      success: function (result) {
        console.log(result);
        var success = result['data']['success'];
        console.log(success);
        if (success == 400) {
          alert(result['data']['message']);
        
        } else {
         
          alert("Event Added Successfully");
    
          window.location = "index.html";

        }

      },
      error: function () {
        alert('failure');
      }
    })

  });


  function returnDateTimeString(date){
    
    var d = new Date(String(date));
    
    var eventDate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    return eventDate;
}


function sqlFormatDateString(date){

    var d = new Date(String(date));
    var eventDate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    return eventDate;
    }