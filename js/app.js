var app = app || {};

app.alarms = [];

app.config = {
	currency: 'USD'
};

app.url = 'http://data.mtgox.com/api/2/BTC'+ app.config.currency +'/money/ticker_fast?pretty';

app.price = 0;

// model
app.getPrice = function(){
	$.get(app.url, function(data){
		app.price = data.data.last_local;
		app.gotPrice();
	});
};

app.storeAlarm = function(){
	var alarm = {
		id: Date.now(),
		type: $('.alarm-option.active').data('type'),
		price: $('.price-threshold').val()
	};

	app.alarms.push(alarm);

	return alarm;
};

app.deleteAlarm = function(id){
	for(var i = 0, j = app.alarms.length; i < j; i++){
		if(app.alarms[i] && app.alarms[i].id === id){
			delete app.alarms[i];
			break;
		}
	}
};

// view
app.displayPrice = function(){
	$('#price').text(app.price.display);
};

app.displayAlarm = function(alarm){
	var compiledTemplate = Mustache.compile(app.templates.alarm);
	var templateOutput = compiledTemplate(alarm);
	$('.alarms-set').append(templateOutput);
};

app.removeAlarm = function(el){
	$(el).parents('.alarm').remove();
}

// controller
app.updatePrice = setInterval(app.getPrice, 10000);

app.startAlarm = function(){
	app.alarm = setInterval(beep, 600);
};

app.stopAlarm = function(){
	clearInterval(app.alarm);
};

app.gotPrice = function(){
	// beep();
	app.displayPrice();
};

app.setAlarm = function(){
	var alarm = app.storeAlarm(),
		that = this;
	app.displayAlarm(alarm);
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
	app.deleteAlarm(id);
	app.removeAlarm(this);
};

$(document).ready(function(){
	app.getPrice();

	$('.set-alarm').click(app.setAlarm);
	$('.alarm-option').click(app.setType);
	$('.alarms').on('click', '.delete', app.clickDelete);
});