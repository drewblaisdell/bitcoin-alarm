var app = app || {};

app.api = {
	bitstamp: {
		url: '/bitstamp',

		getPrice: function(callback){
			$.get(app.api.bitstamp.url, function(data){
				callback({
					value: parseFloat(data.last),
					display: '$'+ parseFloat(data.last).toFixed(2)
				});
			});
		}
	},

	btce: {
		url: '/btce',

		getPrice: function(callback){
			$.get(app.api.btce.url, function(data){
				data = JSON.parse(data);
				callback({
					value: parseFloat(data.ticker.last),
					display: '$'+ parseFloat(data.ticker.last).toFixed(2)
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
					display: '$'+ parseFloat(data.data.last_local.value).toFixed(2)
				});
			});
		}
	}
};