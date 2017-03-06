const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')
const app = express()
const YQL = require('yql')
const translate = require('google-translate-api')
app.set('port', (process.env.PORT || 5000))
    // Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
        extended: false
    }))
    // Process application/json
app.use(bodyParser.json())
    // Index route
app.get('/', function(req, res) {
        res.send('Hello world, I am a chat bot')
    })
    // for Facebook verification
app.get('/webhook/', function(req, res) {
        if (req.query['hub.verify_token'] === 'my_voice_is_my_password_verify_me') {
            res.send(req.query['hub.challenge'])
        }
        res.send('Error, wrong token')
    })
    /*if (event.message && event.message.text){
        if (!kittenMessage(event.sender.id, event.message.text)) {
            /*if (event.message.text === 'โปรเจคส่งวันไหน') {
                sendMessage(event.sender.id, {
                    text: "....."    
                });
            } else if (event.message.text === 'รับน้องภาควันไหน') {
                sendMessage(event.sender.id, {
                    text: "30 ก.ย. ถึง 2 ต.ค"
                })
            } else {
                sendMessage(event.sender.id, {
                    text: "พิมผิดรึป่าว"
                })
            }*/
    /*                sendMessage(event.sender.id, {
                        text: "Echo: " + event.message.text
                    });
                }
            } else if (event.postback) {
                console.log("Postback received: " + JSON.stringify(event.postback));
            }
        }
    }
        res.sendStatus(200);
    });*/
app.post('/webhook', function(req, res) {
    var events = req.body.entry[0].messaging;
    for (i = 0; i < events.length; i++) {
        var event = events[i];
        if (event.message && event.message.text) {
            if (event.message.text.slice(0, 7) === "weather") {
                weather(event.sender.id, event.message.text)
            } else if (event.message.text.slice(0, 3) === "จาก") {
                googlemap(event.sender.id, event.message.text)
            } else if (event.message.text.slice(0, 6) === "kitten") {
                kittenMessage(event.sender.id, event.message.text)
            } else if (event.message.text.postback) {
                receivedPostback(event.sender.id, event.message.text);
            } else if (event.message.text.slice(0, 9) === "translate") {
                googletranslate(event.sender.id, event.message.text);
            }else if (event.message.text === "วันนี้สอบห้องไหน") {
               sendMessage(event.sender.id, {
                    text: "ห้องสอบ 702 ตึกโหล เวลา 9.30 น. Math2"
                })
            }else if (event.message.text === "ใจมาก") {
               sendMessage(event.sender.id, {
                    text: "สู้ๆนะ "+" "+":)"
                })
            }
             else {
                sendMessage(event.sender.id, {
                    text: "error123"
                })
            }
        }
    }
    res.sendStatus(200);
});
const FB_PAGE_ACCESS_TOKEN = "EAAC57tDP7SUBAJKkvNxLjXcZA40vtBqCIINH3DirbjuHea11VYmZB9rNm2gNKFQW6splay4tHCAmNYmnAiyrsqVYOZApAY3sKpV7m7gAZCgWa9Sj8oOZArPbfKXhEmp5sIRqKuyZCpb1qJKA8JBi1lQq6AZAsNRSIQE6ZB0c1vvkDAZDZD"

function sendMessage(recipientId, message) {
    request({
        url: 'https://graph.facebook.com/v2.8/1749192568679879/messages',
        qs: {
            access_token: process.env.FB_PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json: {
            recipient: {
                id: recipientId
            },
            message: message,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        } else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    });
};

function googletranslate(recipientId, text){
var sentence = text.slice(10, text.length);
 
translate(sentence, {to: 'th'}).then(res => {
    //console.log(res.text);
    //=> I speak English 
    //console.log(res.from.language.iso);
    //=> nl
    var word = res.text;
    sendMessage(recipientId, {
            text: word
        })

}).catch(err => {
    console.error(err);
});
};

function googlemap(recipientId, text) {
    text = text || "";
    var values = text.split(' ');
    if (values[0] === 'จาก' && values[2] === 'ไป') {
        var directionurl = "https://www.google.co.th/maps/dir/" + values[1] + "/" + values[3];
        /*message: {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": [{
                        "title": "Classic White T-Shirt",
                        "item_url": "https://petersfancyapparel.com/classic_white_tshirt",
                        "image_url": "https://petersfancyapparel.com/classic_white_tshirt.png",
                        "subtitle": "Soft white cotton t-shirt is back in style",
                        "buttons": [{
                            "type": "web_url",
                            "url": directionurl,
                            "title": "direction"
                        }]
                    }]
                }
            }
        }
        sendMessage(recipientId, {
            text: message
        })*/
        sendMessage(recipientId, {
            text: "Direction:\n" + directionurl
        })
    }
};

function facebook(recipientId, text) {
    var lat = event.message.attachments[0].payload.coordinates.lat;
    var lng = event.message.attachments[0].payload.coordinates.long;
    var reverseurl = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lng + "&key=AIzaSyDPIxlnO2w8zAQEi8G-DHaNIxoZxukoCkA";
}

function weather(recipientId, text) {
    var city = text.slice(8, text.length);
    translate(city, {to: 'en'}).then(res => {
    //console.log(res.text);
    //=> I speak English 
    //console.log(res.from.language.iso);
    //=> nl
    var land = res.text;
    var query = new YQL('select * from weather.forecast where woeid in (select woeid from geo.places(1) where text="' + land + ', th")');
    query.exec(function(err, data) {
        var area = data.query.results.channel.location;
        var condition = data.query.results.channel.item.condition;
        var celsius = (condition.temp - 32) / (1.8);
        //var celsistwo = Math.round(celsius * 100) / 100;
        //sendTextMessage(sender, "Today is " + condition.temp + " and " + condition.text + " in " + area.city);
        sendMessage(recipientId, {
            text: "Today is " + celsius.toFixed(2) + " and " + condition.text + " in " + area.city
        })
    });

}).catch(err => {
    console.error(err);
});
    /*text = text || "";
    var values = text.split(' ');
    if (values.length === 2 && values[0] === 'weather') {
        if (values[1] !== ' ') */
    
};

function receivedPostback(recipientId, text) {
  var recipientID = text.recipient.id;
  var timeOfPostback = text.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
  var payload = text.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " + 
    "at %d", recipientId, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to 
  // let them know it was successful
  sendMessage(recipientId, {text:"Postback called"});
}

function kittenMessage(recipientId, text) {
    text = text || "";
    var values = text.split(' ');
    if (values.length === 3 && values[0] === 'kitten') {
        if (Number(values[1]) > 0 && Number(values[2]) > 0) {
            var imageUrl = "https://placekitten.com/" + Number(values[1]) + "/" + Number(values[2]);
            message = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Kitten",
                            "subtitle": "Text Date/Time/Place",
                            "image_url": imageUrl,
                            "buttons": [{
                                "type": "web_url",
                                "url": imageUrl,
                                "title": "Show kitten"
                            }, {
                                "type": "postback",
                                "title": "I like this",
                                "payload": "User " + recipientId + " likes kitten " + imageUrl,
                            }]
                        }]
                    }
                }
            };
            //sendMessage(recipientId,{text:"Text/n Date/Time/Place"});
            sendMessage(recipientId, message);
            return true;
        }
    }
    return false;
};
// spin spin sugar
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})