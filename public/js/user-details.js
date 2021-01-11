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