var app = app || {};

app.config = {
	currency: 'USD'
};

app.url = 'http://data.mtgox.com/api/2/BTC'+ app.config.currency +'/money/ticker_fast?pretty';

// model
app.models = {
	alarms: {
		data: [],
		
		get: function(){
			return app.models.alarms.data;
		},

		delete: function(id){
			for(var i = 0, j = app.models.alarms.data.length; i < j; i++){
				if(app.models.alarms.data[i] && app.models.alarms.data[i].id === id){
					delete app.models.alarms.data[i];
					break;
				}
			}
		},

		save: function(){
			var alarm = {
				id: Date.now(),
				type: $('.alarm-option.active').data('type'),
				price: $('.price-threshold').val()
			};

			app.models.alarms.data.push(alarm);
			return alarm;
		}
	},

	price: {
		data: {
			now: {
				value: "181.08013",
				value_int: "18108013",
				display: "$181.08"
			}
		},

		get: function(){
			return app.models.price.data.now;
		},

		getLast: function(){
			return app.models.price.data.last;
		},

		update: function(){
			$.get(app.url, function(data){
				var last_local = data.data.last_local;
				if(!app.models.price.data.last){
					app.models.price.data.last = last_local;
				} else {
					app.models.price.data.last = app.models.price.data.now;
				}

				app.models.price.data.now = last_local;
				app.gotPrice(app.models.price.data.now);
			});
		},
	}
};

// view
app.views = {
	alarms: {
		display: function(alarm){
			var compiledTemplate = Mustache.compile(app.templates.alarm);
			var templateOutput = compiledTemplate(alarm);
			$('.alarms-set').append(templateOutput);
		},

		remove: function(id){
			$('.delete[data-id="'+ id +'"]').parents('.alarm').remove();	
		}
	},

	price: {
		display: function(price){
			$('#price').text(price);
		}
	}
};

// controller
app.updatePrice = setInterval(app.models.price.update, 10000);

app.startAlarm = function(){
	app.alarm = setInterval(beep, 600);
};

app.stopAlarm = function(){
	clearInterval(app.alarm);
};

app.gotPrice = function(price){
	app.views.price.display(price.display);
	app.checkAlarms();
};

app.setAlarm = function(){
	var alarm = app.models.alarms.save(),
		that = this;

	app.views.alarms.display(alarm);
	$(this).addClass('active');

	setTimeout(function(){
		$(that).removeClass('active');
	}, 1000);
};

app.setType = function(){
	$('.alarm-option.active').removeClass('active');
	$(this).addClass('active');
};

app.clickDelete = function(){
	var id = $(this).data('id');
	app.models.alarms.delete(id);
	app.views.alarms.remove(id);
};

app.checkAlarms = function(){
	var alarms = app.models.alarms.get();
	for(var i = 0, j = alarms.length; i < j; i++){
		if(alarms[i]){
			var alarm = alarms[i],
				price = parseFloat(alarm.price),
				currentPrice = parseFloat(app.models.price.get().value),
				lastPrice = parseFloat(app.models.price.getLast().value);

			console.log('price: '+ price +' current: '+ currentPrice +' last: '+ lastPrice);

			if(price >= currentPrice && price < lastPrice){
				// sound alarm
				console.log("ALRM");
			} else if (price <= currentPrice && price > lastPrice){
				// sound alarm
				console.log("ALRM");
			}
		}
	}
};

$(document).ready(function(){
	app.gotPrice(app.models.price.get());
	app.models.price.update();

	$('.set-alarm').click(app.setAlarm);
	$('.alarm-option').click(app.setType);
	$('.alarms').on('click', '.delete', app.clickDelete);
});