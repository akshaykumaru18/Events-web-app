

var header = document.getElementById("navbarDiv");
var btns = header.getElementsByClassName("btn");
var eventsList = [];
var categoriesList = [];
var filteredDate = "No Date selected";//= //new Date();
var filteredCategory = "None";
var imported = document.createElement('script');
imported.src = '/js/user-details.js';
document.head.appendChild(imported);

var userFilteredCategoryList = [];
for (var i = 0; i < btns.length; i++) {
    btns[i].addEventListener("click", function () {
        var current = document.getElementsByClassName("active");
        if (current.length > 0) {
            current[0].className = current[0].className.replace(" active", "");
        }
        this.className += " active";
    });
}

function routeToHost() {
    if (localStorage.getItem("user_email") == null) {
        alert('To host event You need to first login');
        window.location.replace("login.html");
    } else {
        //host_event_page.html
        window.location = "host_event_page.html";
    }
}

function routeToUpdateEvents() {
    if (localStorage.getItem("user_email") == null) {
        alert('To host event You need to first login');
        window.location.replace("login.html");
    } else {
        //host_event_page.html
        window.location = "view_events.html";
    }
}

function routeToYourEvents() {
    if (localStorage.getItem("user_email") == null) {
        alert('To host event You need to first login');
        window.location.replace("login.html");
    } else {
        //host_event_page.html
        window.location = "view-user-events.html";
    }
}
function logout() {
    //alert('logout');
    localStorage.removeItem('user_email');
    setLoginButtons();
}

function setLoginButtons() {
    var loginButton = document.getElementById("loginButton");
    var logoutButton = document.getElementById("logoutButton");
    if (localStorage.getItem('user_email') != null) {
        loginButton.style.display = "none";
        logoutButton.style.display = "block";
    } else {
        loginButton.style.display = "block";
        logoutButton.style.display = "none";
    }
}
function loadEventsAndCategories() {

    ///printdetails();

    document.getElementById("applied-filter-tab").style.display = "none";
    setLoginButtons();
    var apiUrl = 'http://localhost:5000/events';
    fetch(apiUrl).then(response => {
        return response.json();
    }).then(data => {
        // Work with JSON data here
        eventsList = data['data'];
        if (eventsList.length == 0) {
            var noEventsNode = document.getElementById("no-events");
            noEventsNode.innerText = "Oh ho no Events Found!"
            document.getElementById("events-list").style.display = "none";
        } else {
            document.getElementById("no-events").style.display = "none";
            for (i in eventsList) {

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
                trailingNode.classList.add("trailing-attend");
                var attendNode = document.createElement("h2");
                var textnode = document.createTextNode(`Attend`);
                attendNode.appendChild(textnode);
                trailingNode.appendChild(attendNode);
                trailingNode.setAttribute("id", eventsList[i].EVENT_ID);
                trailingNode.setAttribute("onclick", "setEventIdAndRoute(this.id);");
                node.appendChild(trailingNode);


                // create a div element add class = event-detail
                // 1) add H1 tag, id = event-item-title
                // 2) add h4 tag, id = event-item-description
                // 3) add h6 tag for location
                // 4) add h6 tag to Display start and end date
                var eventDetailDiv = document.createElement("div");

                //eventDetailDiv.onclick = setAndRouteToEventPage(this);

                eventDetailDiv.classList.add("event-detail");

                var eventTitleNode = document.createElement("h4");
                var titleTextNode = document.createTextNode(`${eventsList[i].EVENT_NAME}`)
                eventTitleNode.appendChild(titleTextNode);

                var eventDescriptionNode = document.createElement("h6");
                var descriptionTextNode = document.createTextNode(`Description : ${eventsList[i].EVENT_DESCRIPTION}`)
                eventDescriptionNode.appendChild(descriptionTextNode);


                var eventLocationNode = document.createElement("h6");
                var locationTextNode = document.createTextNode(`Location :  ${eventsList[i].EVENT_CITY}`)
                eventLocationNode.appendChild(locationTextNode);

                //alert(eventsList[i].EVENT_START_DATE);
                var t = eventsList[i].EVENT_START_DATE.split(/[- :]/);
                var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);


                var eventDateNode = document.createElement("h6");
                var dateTextNode = document.createTextNode(String(`${returnDateString(eventsList[i].EVENT_START_DATE)} TO ${returnDateString(eventsList[i].EVENT_END_DATE)}`));

                eventDateNode.appendChild(dateTextNode);
                //eventDateNode.style.fontWeight = "800";  

                var eventCategoryNode = document.createElement("h6");
                var eventCategoryTextNode = document.createTextNode(`Event Category :  ${eventsList[i].CATEGORY_NAME}`)
                eventCategoryNode.appendChild(eventCategoryTextNode);

                eventDetailDiv.appendChild(eventTitleNode);
                eventDetailDiv.appendChild(eventDescriptionNode);
                eventDetailDiv.appendChild(eventLocationNode);
                eventDetailDiv.appendChild(eventDateNode);
                eventDetailDiv.appendChild(eventCategoryNode);

                node.appendChild(eventDetailDiv);

                document.getElementById("events-list").appendChild(node);


            }
        }



    }).catch(err => {
        alert(err);
        // Do something for an error here
    });


    loadCategories();


}

function loadCategories() {
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
            categoryNode.setAttribute("id", categoriesList[i].CATEGORY_ID);
            categoryNode.setAttribute("onclick", "filterSelectedCategory(this.id)");
            categoryNode.classList.add("list-group-item");
            categoryNode.classList.add('home-page-category');


            var h4TitleNode = document.createElement("h4");
            var titleTextNode = document.createTextNode(categoriesList[i].CATEGORY_NAME);
            h4TitleNode.appendChild(titleTextNode);
            categoryNode.appendChild(h4TitleNode);
            categoryList.appendChild(categoryNode);

        }
        //console.log(data);
    }).catch(err => {
        alert(err);
        // Do something for an error here
    });
}
function userSearchFunction() {

    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toLowerCase();
    ul = document.getElementById("events-list");

    for (i = 0; i < eventsList.length; i++) {

        txtValue = eventsList[i].EVENT_NAME;
        if (txtValue.toLowerCase().indexOf(filter) > -1) {

            var eventNode = document.getElementById(eventsList[i].EVENT_ID);
            eventNode.style.display = "block";

        } else {
            var eventNode = document.getElementById(eventsList[i].EVENT_ID);
            eventNode.style.display = "none";

        }

    }
}


function setEventIdAndRoute(eventId) {
    //alert(eventId);
    localStorage.setItem('attend_event_id', eventId);
    window.location = "attend_event.html";
}


function filterSelectedDate() {
    //alert('filter by date');
    var dateSelectedNode = document.getElementById("dateSelected");
    //var filterSectionNode = document.getElementById("applied-filter-tab");

    filteredDate = dateSelectedNode.value;

    // for (i = 0; i < eventsList.length; i++) {
    //     var eventDate = returnFilterDateString(eventsList[i].EVENT_START_DATE);
    //     console.log(`filter by date ${dateSelectedNode.value} the event date ${eventDate}`);
    //     if (eventDate.toLowerCase().indexOf(filteredDate) > -1) {
    //         document.getElementById("no-events").style.display = "none";
    //         document.getElementById("events-list").style.display = "block";
    //         var eventNode = document.getElementById(eventsList[i].EVENT_ID);
    //         eventNode.style.display = "block";
    //     } else {
    //         var eventNode = document.getElementById(eventsList[i].EVENT_ID);
    //         eventNode.style.display = "none";
    //         var noEventsNode = document.getElementById("no-events");
    //         noEventsNode.innerText = "Oh ho no Events Found!"
    //         noEventsNode.style.display = "block";
    //         document.getElementById("events-list").style.display = "none";

    //     }

    // }
    showFilterSection();
    fetchFilteredDateEvents();

}
function showFilterSection() {
    //filtered-date
    var filteredDateNode = document.getElementById("filtered-date");

    filteredDateNode.innerText = `Date : ${filteredDate}`;
    //filtered-category
    var filteredCategoryNode = document.getElementById("filtered-category");
    filteredCategoryNode.innerText = `Category : ${userFilteredCategoryList}`;
    var filterSectionNode = document.getElementById("applied-filter-tab");
    filterSectionNode.style.display = "block";
}
function filterSelectedCategory(clickedID) {

    var li = document.getElementById(clickedID);
    if (li.classList.contains("home-page-category-selected")) {
        //alert('already selected');
        li.classList.remove("home-page-category-selected");
        var index = userFilteredCategoryList.indexOf(clickedID);

        userFilteredCategoryList.splice(index, index + 1);
    } else {

        if (userFilteredCategoryList.length == 0) {
            li.classList.add("home-page-category-selected");
            userFilteredCategoryList.push(clickedID);
        } else {
            alert("You can filter One category at Once");
        }



    }
    console.log(userFilteredCategoryList);
    showFilterSection();
    fetchFilteredCategoryEvents();

}

function resetFilters() {
    filteredDate = null;
    filteredCategory = 'None'
    document.getElementById("applied-filter-tab").style.display = "none";
    location.reload();
}

function returnFilterDateString(date) {
    var d = new Date(String(date));
    //alert(d);
    var eventDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return eventDate;
}


function returnDateString(date) {


    var d = new Date(String(date));//new Date(t[0], t[1], t[2], t[3], t[4], t[5]);
    //alert(d);
    var eventDate = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
    return eventDate;
}
function sqlFormatDateString(date) {

    var d = new Date(String(date));
    var eventDate = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    return eventDate;
}

function fetchFilteredCategoryEvents() {
    document.getElementById("applied-filter-tab").style.display = "block";

    //  alert(userFilteredCategoryList[0]);
    var apiUrl = `http://localhost:5000/filtered_events?filteredCategory=${userFilteredCategoryList[0]}`;
    fetch(apiUrl).then(response => {
        return response.json();
    }).then(data => {
        // Work with JSON data here
        $(document.getElementById("events-list")).empty();
        eventsList = data['data'];
        console.log(eventsList);
        //alert(eventsList.length);
        if (eventsList.length == 0) {
            var noEventsNode = document.getElementById("no-events");
            noEventsNode.innerText = "Oh ho no Events Found!"
            document.getElementById("no-events").style.display = "block";
            document.getElementById("events-list").style.display = "none";
        } else {
            document.getElementById("no-events").style.display = "none";
            for (i in eventsList) {
                if (document.getElementById(`${eventsList[i].EVENT_ID}`) == null) {


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
                    trailingNode.classList.add("trailing-attend");
                    var attendNode = document.createElement("h2");
                    var textnode = document.createTextNode(`Attend`);
                    attendNode.appendChild(textnode);
                    trailingNode.appendChild(attendNode);
                    trailingNode.setAttribute("id", eventsList[i].EVENT_ID);
                    trailingNode.setAttribute("onclick", "setEventIdAndRoute(this.id);");
                    node.appendChild(trailingNode);


                    // create a div element add class = event-detail
                    // 1) add H1 tag, id = event-item-title
                    // 2) add h4 tag, id = event-item-description
                    // 3) add h6 tag for location
                    // 4) add h6 tag to Display start and end date
                    var eventDetailDiv = document.createElement("div");

                    //eventDetailDiv.onclick = setAndRouteToEventPage(this);

                    eventDetailDiv.classList.add("event-detail");

                    var eventTitleNode = document.createElement("h4");
                    var titleTextNode = document.createTextNode(`${eventsList[i].EVENT_NAME}`)
                    eventTitleNode.appendChild(titleTextNode);

                    var eventDescriptionNode = document.createElement("h6");
                    var descriptionTextNode = document.createTextNode(`Description : ${eventsList[i].EVENT_DESCRIPTION}`)
                    eventDescriptionNode.appendChild(descriptionTextNode);


                    var eventLocationNode = document.createElement("h6");
                    var locationTextNode = document.createTextNode(`Location :  ${eventsList[i].EVENT_CITY}`)
                    eventLocationNode.appendChild(locationTextNode);

                    //alert(eventsList[i].EVENT_START_DATE);
                    var t = eventsList[i].EVENT_START_DATE.split(/[- :]/);
                    var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);


                    var eventDateNode = document.createElement("h6");
                    var dateTextNode = document.createTextNode(String(`${returnDateString(eventsList[i].EVENT_START_DATE)} TO ${returnDateString(eventsList[i].EVENT_END_DATE)}`));

                    eventDateNode.appendChild(dateTextNode);
                    //eventDateNode.style.fontWeight = "800";  

                    var eventCategoryNode = document.createElement("h6");
                    var eventCategoryTextNode = document.createTextNode(`Event Category :  ${eventsList[i].CATEGORY_NAME}`)
                    eventCategoryNode.appendChild(eventCategoryTextNode);

                    eventDetailDiv.appendChild(eventTitleNode);
                    eventDetailDiv.appendChild(eventDescriptionNode);
                    eventDetailDiv.appendChild(eventLocationNode);
                    eventDetailDiv.appendChild(eventDateNode);
                    eventDetailDiv.appendChild(eventCategoryNode);

                    node.appendChild(eventDetailDiv);

                    document.getElementById("events-list").appendChild(node);


                }else{
                    //alert(eventsList[i].EVENT_ID)
                }
            }
        }



    }).catch(err => {
        alert(err);
        // Do something for an error here
    });
}

function fetchFilteredDateEvents() {
    document.getElementById("applied-filter-tab").style.display = "block";

    //  alert(userFilteredCategoryList[0]);
    var apiUrl = `http://localhost:5000/filtered_events?filteredDate=${String(sqlFormatDateString(filteredDate))}`;
    fetch(apiUrl).then(response => {
        return response.json();
    }).then(data => {
        // Work with JSON data here
        $(document.getElementById("events-list")).empty();
        eventsList = data['data'];
        console.log(eventsList);
        //alert(eventsList.length);
        if (eventsList.length == 0) {
            var noEventsNode = document.getElementById("no-events");
            noEventsNode.innerText = "Oh ho no Events Found!"
            document.getElementById("no-events").style.display = "block";
            document.getElementById("events-list").style.display = "none";
        } else {
            document.getElementById("no-events").style.display = "none";
            for (i in eventsList) {
                if (document.getElementById(`${eventsList[i].EVENT_ID}`) == null) {


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
                    trailingNode.classList.add("trailing-attend");
                    var attendNode = document.createElement("h2");
                    var textnode = document.createTextNode(`Attend`);
                    attendNode.appendChild(textnode);
                    trailingNode.appendChild(attendNode);
                    trailingNode.setAttribute("id", eventsList[i].EVENT_ID);
                    trailingNode.setAttribute("onclick", "setEventIdAndRoute(this.id);");
                    node.appendChild(trailingNode);


                    // create a div element add class = event-detail
                    // 1) add H1 tag, id = event-item-title
                    // 2) add h4 tag, id = event-item-description
                    // 3) add h6 tag for location
                    // 4) add h6 tag to Display start and end date
                    var eventDetailDiv = document.createElement("div");

                    //eventDetailDiv.onclick = setAndRouteToEventPage(this);

                    eventDetailDiv.classList.add("event-detail");

                    var eventTitleNode = document.createElement("h4");
                    var titleTextNode = document.createTextNode(`${eventsList[i].EVENT_NAME}`)
                    eventTitleNode.appendChild(titleTextNode);

                    var eventDescriptionNode = document.createElement("h6");
                    var descriptionTextNode = document.createTextNode(`Description : ${eventsList[i].EVENT_DESCRIPTION}`)
                    eventDescriptionNode.appendChild(descriptionTextNode);


                    var eventLocationNode = document.createElement("h6");
                    var locationTextNode = document.createTextNode(`Location :  ${eventsList[i].EVENT_CITY}`)
                    eventLocationNode.appendChild(locationTextNode);

                    //alert(eventsList[i].EVENT_START_DATE);
                    var t = eventsList[i].EVENT_START_DATE.split(/[- :]/);
                    var d = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);


                    var eventDateNode = document.createElement("h6");
                    var dateTextNode = document.createTextNode(String(`${returnDateString(eventsList[i].EVENT_START_DATE)} TO ${returnDateString(eventsList[i].EVENT_END_DATE)}`));

                    eventDateNode.appendChild(dateTextNode);
                    //eventDateNode.style.fontWeight = "800";  

                    var eventCategoryNode = document.createElement("h6");
                    var eventCategoryTextNode = document.createTextNode(`Event Category :  ${eventsList[i].CATEGORY_NAME}`)
                    eventCategoryNode.appendChild(eventCategoryTextNode);

                    eventDetailDiv.appendChild(eventTitleNode);
                    eventDetailDiv.appendChild(eventDescriptionNode);
                    eventDetailDiv.appendChild(eventLocationNode);
                    eventDetailDiv.appendChild(eventDateNode);
                    eventDetailDiv.appendChild(eventCategoryNode);

                    node.appendChild(eventDetailDiv);

                    document.getElementById("events-list").appendChild(node);


                }else{
                    //alert(eventsList[i].EVENT_ID)
                }
            }
        }



    }).catch(err => {
        alert(err);
        // Do something for an error here
    });
}