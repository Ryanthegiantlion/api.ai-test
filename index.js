var apiai = require('apiai');

var app = apiai("4690260581ca44bd8bda5509770c01d1");

var request = app.textRequest('Hi');

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
});

request.on('error', function(error) {
    console.log(error);
});

request.end()