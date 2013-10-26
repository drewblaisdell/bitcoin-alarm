var app = app || {};
app.templates = app.templates || {};

app.templates.alarm = '<div class="alarm" data-id="{{id}}"><div class="symbol-wrapper"><div class="symbol">{{type}}</div></div><div class="alarm-text">${{price}}</div><div class="delete button">delete</div></div>';

app.templates.modal = '<div class="curtain"><div class="modal"><header>Alarm Started</header><div class="inner">The price moved past your alarm set at ${{price}}.<div class="stop-alarm button">stop alarm</div></div></div></div>';