COMPONENT('exec', function(self, config) {
	self.readonly();
	self.blind();
	self.make = function() {
		self.event('click', config.selector || '.exec', function(e) {
			var el = $(this);

			var attr = el.attrd('exec');
			var path = el.attrd('path');
			var href = el.attrd('href');

			if (el.attrd('prevent') === 'true') {
				e.preventDefault();
				e.stopPropagation();
			}

			attr && EXEC(attr, el, e);
			href && NAV.redirect(href);

			if (path) {
				var val = el.attrd('value');
				if (val == null) {
					var a = new Function('return ' + el.attrd('value-a'))();
					var b = new Function('return ' + el.attrd('value-b'))();
					var v = GET(path);
					if (v === a)
						SET(path, b, true);
					else
						SET(path, a, true);
				} else
					SET(path, new Function('return ' + val)(), true);
			}
		});
	};
});