var app = app || {};

app.api = {
	bitstamp: {
		url: '/bitstamp',

		getPrice: function(callback){
			$.get(app.api.bitstamp.url, function(data){
				callback({
					value: parseFloat(data.last),
					display: '$'+ parseFloat(data.last)
				});
			});
		}
	},

	mtgox: {
		url: 'http://data.mtgox.com/api/2/BTCUSD/money/ticker_fast?pretty',

		getPrice: function(callback){
			$.get(app.api.mtgox.url, function(data){
				callback({
					value: data.data.last_local.value,
					display: data.data.last_local.display
				});
			});
		}
	}
};