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

		remove: function(id){
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
				value: "202.08013",
				value_int: "20208013",
				display: "$202.08"
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
		}
	}
};

// view
app.views = {
	alarms: {
		display: function(alarm){
			var compiledTemplate = Mustache.compile(app.templates.alarm);
			var templateOutput = compiledTemplate(alarm);
			$('.alarms-set').prepend(templateOutput);
		},

		remove: function(id){
			$('.alarm[data-id="'+ id +'"]').remove();	
		},

		activate: function(id){
			$('.alarm[data-id="'+ id +'"]').addClass('active');
		},

		deactivate: function(id){
			$('.alarm[data-id="'+ id +'"]').removeClass('active');			
		},

		deactivateAll: function(){
			$('.alarm.active').removeClass('active');
		}
	},

	price: {
		display: function(price){
			$('#price').text(price);
		}
	},

	modal: {
		display: function(price){
			var compiledTemplate = Mustache.compile(app.templates.modal);
			var templateOutput = compiledTemplate({ price: price });
			$('body').append(templateOutput);
			setTimeout(function(){
				$('.curtain').addClass('active');
			}, 1);
		}
	}
};

// controller
app.updatePrice = setInterval(app.models.price.update, 5000);

app.showModal = function(price){
	app.views.modal.display(price);
};

app.closeModal = function(){
	$('.curtain').removeClass('active');
	setTimeout(function(){
		$('.curtain').remove();
	}, 200);

	app.stopAlarm();
};

app.soundAlarm = function(alarm){
	app.showModal(alarm.price);
	app.views.alarms.activate(alarm.id);
	app.startAlarm();
};

app.startAlarm = function(){
	app.alarm = setInterval(beep, 600);
};

app.stopAlarm = function(){
	console.log("STOPPING ALARM");
	clearInterval(app.alarm);
	app.alarm = false;
	app.views.alarms.deactivateAll();
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
	var id = $(this).parents('.alarm').data('id');
	app.models.alarms.remove(id);
	app.views.alarms.remove(id);
};

app.checkAlarms = function(){
	if(app.alarm){
		return;
	}

	var alarms = app.models.alarms.get();
	for(var i = 0, j = alarms.length; i < j; i++){
		if(alarms[i]){
			var alarm = alarms[i],
				price = parseFloat(alarm.price),
				currentPrice = parseFloat(app.models.price.get().value),
				lastPrice = parseFloat(app.models.price.getLast().value);

			if((price >= currentPrice && price < lastPrice) || (price <= currentPrice && price > lastPrice)){
//TODO: this is buggy.
// if there is a one beep before an alarm, it will skip the alarm
				app.runAlarm(alarm);
				break;
			}
		}
	}
};

app.runAlarm = function(alarm){
	if(alarm.type === 'alarm'){
		app.soundAlarm(alarm);
	} else if(alarm.type = 'one beep') {
		app.views.alarms.activate(alarm.id);
		beep();

		setTimeout(function(){
			app.views.alarms.deactivate(alarm.id);
		}, 400);
	}
};

$(document).ready(function(){
	app.gotPrice(app.models.price.get());
	app.models.price.update();
	$('#price').fadeIn('fast');

	$('.set-alarm').click(app.setAlarm);
	$('.price-threshold').keypress(function(event){
		if(event.keyCode === 13){
			app.setAlarm();
		}
	});
	$('.alarm-option').click(app.setType);
	$('.alarms').on('click', '.delete', app.clickDelete);
	$('body').on('click', '.curtain', app.closeModal);
});