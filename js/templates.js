var app = app || {};
app.templates = app.templates || {};

app.templates.alarm = '<div class="alarm"><div class="symbol-wrapper"><div class="symbol">{{type}}</div></div><div class="alarm-text">${{price}}</div><div class="delete" data-id="{{id}}">delete</div></div>';