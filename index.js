var redis = require('redis');
var RedisChannels = require('./constants/redisChannels')
var utilities = require('./utilities')

var apiai = require('apiai');

var app = apiai("4690260581ca44bd8bda5509770c01d1");

//var userId = '57c01238296ad1b878399283'
var userId = 57c002f7741f998795f31c95
var botname = 'smartbot'
if (process.env.REDIS_URL) {
  var redisSub = redis.createClient(process.env.REDIS_URL)
  var redisPub = redis.createClient(process.env.REDIS_URL)
}
else {
  var redisSub = redis.createClient()
  var redisPub = redis.createClient()
}

redisSub.subscribe(RedisChannels.SmartBotMessage)
redisSub.on('message', onMessage)

allMessages = {}





function onMessage(channel, data) {
	var self = this;
	data = JSON.parse(data)
	// var messageId = data.clientMessageIdentifier;

	var messageId = data.clientMessageIdentifier;
  
  allMessages[messageId] = data;

	var textMessage = data.body.text;
	console.log('got message')
	console.log(textMessage)

	var request = app.textRequest(textMessage);

	request.on('response', function(response) {
		var result = response.result;
		var pizzas = undefined;
		var pizzas = result.parameters.pizza + ' ' + result.parameters.pizza1;
		var toppings = result.parameters.topping + ' ' + result.parameters.topping1;
		var base = result.parameters.base;
		var cooldrink = result.parameters.cooldrink;
		var intent = result.metadata.intentName;
		var fullfillment = result.fulfillment.speech;

		var response = 'no idea';
		if (fullfillment) {
			response = fullfillment;	
		} else {
			if (intent) {
				response = 'api method: ' + intent + '\n';
			}

			if (pizzas) {
				response = response + 'pizzas: ' + pizzas + '\n';
			}

			if (toppings) {
				reponse = response + 'toppingss: ' + toppings + '\n';
			}

			if (base) {
				reponse = response + 'base: ' + base + '\n';
			}

			if (cooldrink) {
				reponse = response + 'cooldrink: ' + cooldrink + '\n';
			}
		}
	    console.log(response);

	  console.log('here')
	  console.log(messageId)
	  console.log(allMessages)


	  var newMessage = newPubSubDirectMessage(allMessages[messageId], response)
	
		console.log(RedisChannels.SmartBotReply)
		console.log(JSON.stringify(newMessage));

	  redisPub.publish(RedisChannels.SmartBotReply, JSON.stringify(newMessage))
	});

	request.on('error', function(error) {
	    console.log(error);
	});

	request.end()
}

function newPubSubDirectMessage(received_message, response) {
    var new_body = {
        type: 'TextMessage',
        text: response
		}
    
    new_props =  {
      senderId: userId,
      senderName: botname,
      receiverId: received_message.senderId,
      receiverName: received_message.senderName,
      body: new_body,
      clientMessageIdentifier: utilities.guid(),
      clientStartTime: new Date()
    }

    return Object.assign(received_message, new_props);
}


