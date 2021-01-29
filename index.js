const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require("body-parser");
const ejs = require('ejs');
const { data } = require('jquery');
const { json } = require('body-parser');
const app = express();
const port = process.env.port || 3000;


app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname + '/public/')));
app.use(express.static(path.join(__dirname + '/views/')));
app.engine('html', require('ejs').renderFile);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//To directly link the local css or js file with node modules rather than copy pasting everytime when we update the packages
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));


//Create a mysqlpool to use when needed for connection
var mysql_pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'akshay@123',
    database: 'dbms-project'
});




app.get('/', (req, res) => {
    //res.send('Connection established with port 4000 \n go to /actors to fetch actors');
    //res.sendFile(path.join(__dirname,'/views/','/index.html'));
    res.render(path.join(__dirname, '/views/', '/index.html'));
});

/*
Note : these are insertion related form's loading endpoints
*/

app.get('/insertions', (req, res) => {
    //res.send('Connection established with port 4000 \n go to /actors to fetch actors');
    //res.sendFile(path.join(__dirname,'/views/','/index.html'));
    res.render(path.join(__dirname, '/views/', 'insertion forms/insert_event.html'));
});




app.post('/login', (req, res) => {
    var emailid = req.body['email']
    var password = req.body['password'];
    console.log(req.body);
    console.log(`email id : ${emailid} : password : ${password}`);

    var login_query = `SELECT * FROM LOGIN WHERE EMAIL_ID = "${emailid}" AND PASSWD = "${password}"`;
    console.log('login_query is : ', login_query);
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            console.log('Error getting mysql_pool connection: ' + err);
        } else {
            console.log('Connection connected');
            connection.query(login_query, (err, results) => {
                if (err) {
                    console.log('ERROR executing qeuery ', err);
                    //res.send('ERROR : failed to GET LOGIN try again : ', err);
                } else {
                    console.log('records  ' + results.length);
                    if (results == 0) {
                        //res.send('user not found');
                        var result = { "success": 400, "message": "failed" };
                        return res.json({
                            data: result
                        })
                        // return res.json({
                        //     data: results
                        // })
                    } else {
                        for (user in results) {
                            console.log('The user email is  ' + results[user].EMAIL_ID);
                            console.log('The user email is  ' + results[user].PASSWD);

                        }
                        return res.json({
                            data: results
                        })
                        // res.send('SUCCESS :USER RESPONSE GOT');
                        //es.render(path.join(__dirname, '/views/', 'index.html'));
                    }

                }
            });
        }
    });

}
);

app.post('/signup', (req, res) => {
    var emailid = req.body['email']
    var password = req.body['password'];
    var fname = req.body['fname'];
    var lname = req.body['lname'];
    var phoneNumber = req.body['phoneNumber'];
    var dob = req.body['dateOfBirth'];
    var city = req.body['userCity'];
    var date = new Date(dob);
    var dobString = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}`;
    console.log(req.body);
    //console.log(`email id : ${emailid} : password : ${password}`);

    var signup_query = `CALL create_account('${emailid}','${password}','${phoneNumber}','${dobString}','${fname}','${lname}','${city}');`;
    console.log('login_query is : ', signup_query);
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            console.log('Error getting mysql_pool connection: ' + err);
        } else {
            console.log('Connection connected');
            connection.query(signup_query, (err, results) => {
                if (err) {
                    console.log('ERROR code ', err.code);
                    console.log('ERROR executing qeuery ', err.message);
                    var result;
                    if (err.code == "ER_DUP_ENTRY") {
                        result = { "success": 400, "message": "User already exists" };
                    }
                    result = { "success": 400, "message": "Failed to create account" };
                    return res.json({
                        data: result
                    })
                    //res.send('ERROR : failed to GET LOGIN try again : ', err);
                } else {
                    console.log('records  ' + results.length);
                    console.log(results);
                    var result = { "success": 200, "message": "account created successfully" };
                    return res.json({
                        data: result
                    })


                }
            });
        }
    });

}
);


app.post('/events/add', (req, res) => {

    console.log('req body is :', req.body);

    var event_title = req.body['EVENT_NAME'];
    var event_image = req.body['EVENT_IMAGE'];
    var event_start_date = req.body['EVENT_START_DATE'];
    var event_end_date = req.body['EVENT_END_DATE'];
    var event_description = req.body['EVENT_DESCRIPTION'];
    var ticket_price = req.body['TICKET_PRICE'];
    var event_address = req.body['EVENT_ADDRESS'];
    var event_city = req.body['EVENT_CITY'];
    var event_state = req.body['EVENT_STATE'];
    var event_country = req.body['EVENT_COUNTRY'];
    var event_host_id = req.body['EVENT_HOST_ID'];
    var invite_type = req.body['INVITE_TYPE']
    var capacity = req.body['EVENT_CAPACITY'];
    var category = req.body['EVENT_CATEGORY'];
    var event_category_id = req.body['EVENT_CATEGORY_ID'];

    var startDateString =event_start_date;
    var endDateString = event_end_date;


    var create_event_query = `CALL create_event('1','${event_title}','${event_image}','${startDateString}','${endDateString}','${event_description}',${ticket_price},'${event_host_id}','${invite_type}',${capacity},'${event_address}','${event_city}','${event_category_id}')`;

    console.log('Insert query is : ', create_event_query);
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            console.log('Error getting mysql_pool connection: ' + err);
        } else {
            console.log('Connection connected');
            connection.query(create_event_query, (err, results) => {
                if (err) {
                    console.log('ERROR executing qeuery ', err);
                    res.send('ERROR : failed to add event try again : ', err);
                } else {
                    console.log(results.data);
                    result = { "success": 200, "message": "event Added successfully" };
                    return res.json({
                        data: result
                    })
                }
            });
        }
    });

}
);

app.get('/events/delete', (req, res) => {
    const { event_id } = req.query;
    console.log('event_id', event_id);


    var delete_event_query = `CALL delete_event('${event_id}')`;

    console.log('DELETE query is : ', delete_event_query);
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            console.log('Error getting mysql_pool connection: ' + err);
        } else {
            console.log('Connection connected');
            connection.query(delete_event_query, (err, results) => {
                if (err) {
                    console.log('ERROR executing qeuery ', err);
                    result = { "success": 400, "message": "event delete failed" };
                    return res.json({
                        data: result
                    })
                } else {
                    console.log(results.data);
                    result = { "success": 200, "message": "event deleted successfully" };
                    return res.json({
                        data: result
                    })
                }
            });
        }
    });

}
);

app.post('/updateEvent', (req, res) => {

    console.log('req body is :', req.body);
    var event_id = req.body['EVENT_ID'];
    var event_title = req.body['EVENT_NAME'];
    var event_image = req.body['EVENT_IMAGE'];
    var event_start_date = req.body['EVENT_START_DATE'];
    var event_end_date = req.body['EVENT_END_DATE'];
    var event_description = req.body['EVENT_DESCRIPTION'];
    var ticket_price = req.body['TICKET_PRICE'];
    var event_address = req.body['EVENT_ADDRESS'];
    var event_city = req.body['EVENT_CITY'];
    var event_state = req.body['EVENT_STATE'];
    var event_country = req.body['EVENT_COUNTRY'];
    var event_host_id = req.body['EVENT_HOST_ID'];
    var invite_type = req.body['INVITE_TYPE']
    var capacity = req.body['EVENT_CAPACITY'];
    var category = req.body['EVENT_CATEGORY'];
    var event_category_id = req.body['EVENT_CATEGORY_ID'];

    
    var startDateString =event_start_date;
    var endDateString = event_end_date;
    console.log(`State Date ${startDateString} \t ${endDateString}`);
    var update_event_query = `CALL update_event('${event_id}','${event_title}','${event_image}','${startDateString}','${endDateString}','${event_description}',${ticket_price},'${event_host_id}','${invite_type}',${capacity},'${event_address}','${event_city}','${event_category_id}')`;

    console.log('Update query is : ', update_event_query);
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            console.log('Error getting mysql_pool connection: ' + err);
        } else {
            console.log('Connection connected');
            connection.query(update_event_query, (err, results) => {
                if (err) {
                    console.log('ERROR executing qeuery ', err);
                    result = { "success": 400, "message": "Failed to update event" };
                    return res.json({
                        data: result
                    })

                } else {
                    console.log(results);
                    //res.send('SUCCESS : event updated successfully');
                    result = { "success": 200, "message": "event updated successfully" };
                    return res.json({
                        data: result
                    })
                }
            });
        }
    });

}
);

app.post('/attendEvent', (req, res) => {

    console.log('req body is :', req.body);
    var event_id = req.body['event_id'];
    var payment_date = req.body['PAYMENT_DATE'];
    var transaction_status = req.body['transaction_status'];
    var user_email_id = req.body['user_email_id'];
    var pD = new Date(payment_date);


    var atend_event_query = `CALL attend_event('${event_id}','${user_email_id}','${payment_date}','UPI','${transaction_status}')`;

    console.log('Insert query is : ', atend_event_query);
    mysql_pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            console.log('Error getting mysql_pool connection: ' + err);
        } else {
            console.log('Connection connected');
            connection.query(atend_event_query, (err, results) => {
                if (err) {
                    console.log('ERROR executing qeuery ', err);
                    result = { "success": 400, "message": "Payment Failed" };
                    return res.json({
                        data: result
                    })

                } else {
                    console.log(results.data);
                    //res.send('SUCCESS : event updated successfully');
                    result = { "success": 200, "message": "Payment Success! Ticket Booked" };
                    return res.json({
                        data: result
                    })
                }
            });
        }
    });

}
);


app.get('/events', (req, res) => {
    console.log('API CALL: /events');
    const { host } = req.query;
    const {user} = req.query;
    const { eventId, emailId } = req.query;
    if (host != null) {
        console.log('Finding events for :' + host);
        //QUERIES
        const GET_events = `SELECT event.EVENT_ID,event.EVENT_NAME, event.EVENT_DESCRIPTION, event.EVENT_IMAGE,event.EVENT_START_DATE,event.EVENT_END_DATE, event.TICKET_PRICE, ea.EVENT_CITY, ec.CATEGORY_ID, c.CATEGORY_NAME, c.CATEGORY_TYPE
    from EVENT AS event, event_address AS ea, event_category AS ec, category AS c, event_host eh
    where ea.EVENT_ID = event.EVENT_ID and ec.EVENT_ID = event.EVENT_ID and ec.CATEGORY_ID = c.CATEGORY_ID and eh.EVENT_ID = event.EVENT_ID AND eh.EMAIL_ID = '${host}'
    order by(event.EVENT_START_DATE)`;
        mysql_pool.getConnection(function (err, connection) {

            if (err) {
                connection.release();
                console.log('Error getting mysql_pool connection: ' + err);

            } else {
                connection.query(GET_events, (err, results) => {
                    if (err) {
                        return res.send(err);
                    }
                    else {
                        console.log('The results got are :' + results.length);
                        // for(CITY in results){
                        //     console.log('The city ' + results[CITY].CITY_NAME);
                        // }
                        return res.json({
                            data: results
                        })
                    }
                });
            }
        });

    } else if (eventId != null) {
        console.log('Finding events for id:' + eventId + ' emailId = ' + emailId);
        //QUERIES
        const GET_events = `SELECT DISTINCT event.EVENT_ID ,event.EVENT_NAME, event.EVENT_DESCRIPTION, event.EVENT_IMAGE, event.EVENT_START_DATE, event.EVENT_END_DATE,
        event.TICKET_PRICE,event.EVENT_CAPACITY,event.INVITE_TYPE,ea.EVENT_ADDRESS, ea.EVENT_CITY, ec.CATEGORY_ID, c.CATEGORY_NAME,eh.EMAIL_ID as HOST_EMAIL,
         c.CATEGORY_TYPE,state.STATE_NAME,country.COUNTRY_NAME,eh.EMAIL_ID as HOST_EMAIL
       from EVENT AS event, event_address AS ea, event_category AS ec, category AS c, CITY as city, STATE as state, COUNTRY as country, EVENT_HOST as eh
       where event.EVENT_ID = '${eventId}' and ea.EVENT_ID = '${eventId}' and ec.EVENT_ID = '${eventId}' and eh.EVENT_ID = '${eventId}' AND eh.EVENT_ID = '${eventId}' and ec.CATEGORY_ID = c.CATEGORY_ID and ea.EVENT_CITY = city.CITY_NAME and
        city.STATE_NAME = state.STATE_NAME and state.COUNTRY_NAME = country.COUNTRY_NAME
       order by(event.EVENT_START_DATE)`;


      


        /*
        actual query

        SELECT event.EVENT_ID,event.EVENT_NAME, event.EVENT_DESCRIPTION, event.EVENT_IMAGE, event.EVENT_START_DATE, event.EVENT_END_DATE,
         event.TICKET_PRICE,event.EVENT_CAPACITY,event.INVITE_TYPE,ea.EVENT_ADDRESS, ea.EVENT_CITY, ec.CATEGORY_ID, c.CATEGORY_NAME,
          c.CATEGORY_TYPE,state.STATE_NAME,country.COUNTRY_NAME, CASE when ps.EMAIL_ID = '${emailId}' then 'true' else 'false'  end as USER_BOOKED
        from EVENT AS event, event_address AS ea, event_category AS ec, category AS c, CITY as city, STATE as state, COUNTRY as country, payment_history AS ps
        where event.EVENT_ID = '${eventId}' and ea.EVENT_ID = '${eventId}' and ec.EVENT_ID = '${eventId}' and ec.CATEGORY_ID = c.CATEGORY_ID and ea.EVENT_CITY = city.CITY_NAME and
         city.STATE_NAME = state.STATE_NAME and state.COUNTRY_NAME = country.COUNTRY_NAME
        order by(event.EVENT_START_DATE)

        */

        /*
        SELECT event.EVENT_ID ,event.EVENT_NAME, event.EVENT_DESCRIPTION, event.EVENT_IMAGE, event.EVENT_START_DATE, event.EVENT_END_DATE,
         event.TICKET_PRICE,event.EVENT_CAPACITY,event.INVITE_TYPE,ea.EVENT_ADDRESS, ea.EVENT_CITY, ec.CATEGORY_ID, c.CATEGORY_NAME,
          c.CATEGORY_TYPE,state.STATE_NAME,country.COUNTRY_NAME, CASE when ps.EMAIL_ID = '${emailId}' then 'true' else 'false'  end as USER_BOOKED
        from EVENT AS event, event_address AS ea, event_category AS ec, category AS c, CITY as city, STATE as state, COUNTRY as country, payment_history AS ps
        where event.EVENT_ID = '${eventId}' and ea.EVENT_ID = '${eventId}' and ec.EVENT_ID = '${eventId}' and ec.CATEGORY_ID = c.CATEGORY_ID and ea.EVENT_CITY = city.CITY_NAME and
         city.STATE_NAME = state.STATE_NAME and state.COUNTRY_NAME = country.COUNTRY_NAME
        order by(event.EVENT_START_DATE);
        */
        mysql_pool.getConnection(function (err, connection) {

            if (err) {
                connection.release();
                console.log('Error getting mysql_pool connection: ' + err);

            } else {
                connection.query(GET_events, (err, results) => {
                    if (err) {
                        return res.send(err);
                    }
                    else {
                        console.log('The results got are :' + results.length);
                        // for(CITY in results){
                        //     console.log('The city ' + results[CITY].CITY_NAME);
                        // }
                        return res.json({
                            data: results
                        })
                    }
                });
            }
        });

    } else if(user != null){
        console.log('Finding events for :' + user);
        //QUERIES
        const GET_events = `SELECT event.EVENT_ID,event.EVENT_NAME, event.EVENT_DESCRIPTION, event.EVENT_IMAGE,event.EVENT_START_DATE,event.EVENT_END_DATE, event.TICKET_PRICE, ea.EVENT_CITY, ec.CATEGORY_ID, c.CATEGORY_NAME, c.CATEGORY_TYPE
    from EVENT AS event, event_address AS ea, event_category AS ec, category AS c, payment_history ps
    where ea.EVENT_ID = event.EVENT_ID and ec.EVENT_ID = event.EVENT_ID and ec.CATEGORY_ID = c.CATEGORY_ID and ps.event_id = event.event_id
    order by(event.EVENT_START_DATE)`;
        mysql_pool.getConnection(function (err, connection) {

            if (err) {
                connection.release();
                console.log('Error getting mysql_pool connection: ' + err);

            } else {
                connection.query(GET_events, (err, results) => {
                    if (err) {
                        return res.send(err);
                    }
                    else {
                        console.log('The results got are :' + results.length);
                        // for(CITY in results){
                        //     console.log('The city ' + results[CITY].CITY_NAME);
                        // }
                        return res.json({
                            data: results
                        })
                    }
                });
            }
        });
    }
    else {
        //QUERIES
        console.log('getting all events');
        const GET_events =
            `SELECT event.EVENT_ID,event.EVENT_NAME, event.EVENT_DESCRIPTION, event.EVENT_IMAGE, event.EVENT_START_DATE,event.EVENT_END_DATE,event.INVITE_TYPE, event.TICKET_PRICE,event.EVENT_CAPACITY,ea.EVENT_ADDRESS, ea.EVENT_CITY, ec.CATEGORY_ID, c.CATEGORY_NAME, c.CATEGORY_TYPE,state.STATE_NAME,country.COUNTRY_NAME
        from EVENT AS event, event_address AS ea, event_category AS ec, category AS c, CITY as city, STATE as state, COUNTRY as country
        where ea.EVENT_ID = event.EVENT_ID and ec.EVENT_ID = event.EVENT_ID and ec.CATEGORY_ID = c.CATEGORY_ID and ea.EVENT_CITY = city.CITY_NAME and city.STATE_NAME = state.STATE_NAME and state.COUNTRY_NAME = country.COUNTRY_NAME 
        order by(event.EVENT_START_DATE)`;
        mysql_pool.getConnection(function (err, connection) {

            if (err) {
                connection.release();
                console.log('Error getting mysql_pool connection: ' + err);

            } else {
                connection.query(GET_events, (err, results) => {
                    if (err) {
                        return res.send(err);
                    }
                    else {
                        console.log('The results got are :' + results.data);
                        // for(CITY in results){
                        //     console.log('The city ' + results[CITY].CITY_NAME);
                        // }
                        return res.json({
                            data: results
                        })
                    }
                });
            }
        });

    }

});
app.get('/filtered_events', (req, res) => {
    console.log('API CALL: /filtered_events');
    const { filteredDate } = req.query;
    const { filteredCategory } = req.query;
    if(filteredDate != null){
      //QUERIES
      console.log('getting all events');
      const GET_events =
          `select * from event, event_category, event_category as ec, event_address as ea, category as c,city as ci,state as s, country as cunt
          where event.EVENT_ID = event_category.EVENT_ID and  ea.EVENT_ID = event.EVENT_ID and c.CATEGORY_ID = ec.CATEGORY_ID and ea.EVENT_CITY = ci.CITY_NAME 
          and ci.STATE_NAME = s.STATE_NAME and cunt.COUNTRY_NAME = s.COUNTRY_NAME and  DATE(event.EVENT_START_DATE) = '${sqlFormatDateString(filteredDate)}' OR DATE(event.EVENT_END_DATE) = '${sqlFormatDateString(filteredDate)}' order by(event.EVENT_START_DATE)`;

      mysql_pool.getConnection(function (err, connection) {

          if (err) {
              connection.release();
              console.log('Error getting mysql_pool connection: ' + err);

          } else {
              connection.query(GET_events, (err, results) => {
                  if (err) {
                      return res.send(err);
                  }
                  else {
                      console.log('The filtered results got are :' + results);
                      // for(CITY in results){
                      //     console.log('The city ' + results[CITY].CITY_NAME);
                      // }
                      return res.json({
                          data: results
                      })
                  }
              });
          }
      });
    }else if(filteredCategory != null){
      //QUERIES
      console.log('getting all events');
      const GET_events =
          `select * from event, event_category, event_category as ec, event_address as ea, category as c,city as ci,state as s, country as cunt
          where event.EVENT_ID = event_category.EVENT_ID and  ea.EVENT_ID = event.EVENT_ID and c.CATEGORY_ID = ec.CATEGORY_ID and ea.EVENT_CITY = ci.CITY_NAME 
          and ci.STATE_NAME = s.STATE_NAME and cunt.COUNTRY_NAME = s.COUNTRY_NAME and (ec.CATEGORY_ID = '${filteredCategory}' and
          ec.EVENT_ID = event.EVENT_ID) order by(event.EVENT_START_DATE)`;
      mysql_pool.getConnection(function (err, connection) {

          if (err) {
              connection.release();
              console.log('Error getting mysql_pool connection: ' + err);

          } else {
              connection.query(GET_events, (err, results) => {
                  if (err) {
                      return res.send(err);
                  }
                  else {
                      console.log('The filtered results got are :' + results);
                      // for(CITY in results){
                      //     console.log('The city ' + results[CITY].CITY_NAME);
                      // }
                      return res.json({
                          data: results
                      })
                  }
              });
          }
      });
    }
  

    

});

app.get('/categories', (req, res) => {
    console.log('API CALL: /categories');
    //QUERIES
    const GET_CATEGORIES = `SELECT * FROM CATEGORY`;
    mysql_pool.getConnection(function (err, connection) {

        if (err) {
            connection.release();
            console.log('Error getting mysql_pool connection: ' + err);

        } else {
            connection.query(GET_CATEGORIES, (err, results) => {
                if (err) {
                    return res.send(err);
                }
                else {
                    console.log('The CATEGORY results got are :' + results.length);
                    // for(CITY in results){
                    //     console.log('The city ' + results[CITY].CITY_NAME);
                    // }
                    return res.json({
                        data: results
                    })
                }
            });
        }
    });

});

app.get('/attendeeList', (req, res) => {
    const {eventId} = req.query;
    
    console.log('API CALL: /attendeeList \t' + eventId);
    //QUERIES
    const GET_CATEGORIES = `SELECT pt.EMAIL_ID, ph.PAYMENT_DATE FROM purchase_ticket as pt, payment_history as ph WHERE pt.EVENT_ID = '${eventId}' and ph.EVENT_ID = '${eventId}'`;
    mysql_pool.getConnection(function (err, connection) {

        if (err) {
            connection.release();
            console.log('Error getting mysql_pool connection: ' + err);

        } else {
            connection.query(GET_CATEGORIES, (err, results) => {
                if (err) {
                    return res.send(err);
                }
                else {
                    console.log('The attendee results got are :' + results);
                    //connection.release();
                    return res.json({
                        data: results
                    })
                }
            });
        }
    });

});

app.get('/checkAttended', (req, res) => {
    const {eventId,emailId} = req.query;
    
    console.log('API CALL: /checkAttended \t' + emailId);
    //QUERIES
    const GET_CATEGORIES = `SELECT ph.PAYMENT_DATE FROM  payment_history as ph WHERE ph.EVENT_ID = '${eventId}' and ph.EMAIL_ID = '${emailId}'`;
    mysql_pool.getConnection(function (err, connection) {

        if (err) {
            
            console.log('Error getting mysql_pool connection: ' + err);

        } else {
            connection.query(GET_CATEGORIES, (err, results) => {
                if (err) {
                    return res.send(err);
                }
                else {
                    console.log('The attendee results got are :' + results);
                    //connection.release();
                    return res.json({
                        data: results
                    })
                }
            });
        }
    });

});

app.get('/cities', (req, res) => {
    console.log('API CALL: /cities');
    const { state } = req.query;
    console.log(`Country selected is : ` + state);
    //QUERIES
    const GET_CITIES = `select * from city 
    where city.STATE_NAME = '${state}';`;
    mysql_pool.getConnection(function (err, connection) {

        if (err) {
            connection.release();
            console.log('Error getting mysql_pool connection: ' + err);

        } else {
            connection.query(GET_CITIES, (err, results) => {
                if (err) {
                    return res.send(err);
                }
                else {
                    console.log('The results got are :' + results.length);
                    // for(CITY in results){
                    //     console.log('The city ' + results[CITY].CITY_NAME);
                    // }
                    return res.json({
                        data: results
                    })
                }
            });
        }
    });


});

app.get('/states', (req, res) => {
    console.log('API CALL: /states');
    const { country } = req.query;
    console.log(`Country selected is : ` + country);
    //QUERIES
    const GET_STATES = `select * from state
    where state.COUNTRY_NAME = '${country}'`;
    mysql_pool.getConnection(function (err, connection) {

        if (err) {
            connection.release();
            console.log('Error getting mysql_pool connection: ' + err);

        } else {
            connection.query(GET_STATES, (err, results) => {
                if (err) {
                    return res.send(err);
                }
                else {
                    console.log('The STATE results got are :' + results.length);
                    // for(i in results){
                    //     console.log('The STATE ' + results[i].STATE_NAME);
                    // }
                    return res.json({
                        data: results
                    })
                }
            });
        }
    });


});

app.get('/countries', (req, res) => {
    console.log('API CALL: /countries');
    //QUERIES
    const GET_COUNTRIES = 'SELECT * FROM COUNTRY';
    mysql_pool.getConnection(function (err, connection) {

        if (err) {
            connection.release();
            console.log('Error getting mysql_pool connection: ' + err);

        } else {
            connection.query(GET_COUNTRIES, (err, results) => {
                if (err) {
                    return res.send(err);
                }
                else {
                    // console.log('The COUNTRY results got are :' + results.length);
                    // for (i in results) {
                    //     console.log('The COUNTRY ' + results[i].COUNTRY_NAME);
                    // }
                    return res.json({
                        data: results
                    })
                }
            });
        }
    });


});



app.listen(port, () => {
    console.log(`Connection established with port :  ${port}`);
});


function sqlFormatDateString(date){

    var d = new Date(String(date));
    var eventDate = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2, '0')}`;
   //console.log(`given date ${eventDate}`);
    return eventDate;
    }