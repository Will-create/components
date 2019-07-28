COMPONENT('validation', 'delay:100;flags:visible', function(self, config) {

	var path, elements = null;
	var def = 'button[name="submit"]';
	var flags = null;
	var tracked = false;
	var old;
	var track;

	self.readonly();

	self.make = function() {
		elements = self.find(config.selector || def);
		path = self.path.replace(/\.\*$/, '');
		setTimeout(function() {
			self.watch(self.path, self.state, true);
		}, 50);
	};

	self.configure = function(key, value, init) {
		switch (key) {
			case 'selector':
				if (!init)
					elements = self.find(value || def);
				break;
			case 'flags':
				if (value) {
					flags = value.split(',');
					for (var i = 0; i < flags.length; i++)
						flags[i] = '@' + flags[i];
				} else
					flags = null;
				break;
			case 'track':
				track = value.split(',').trim();
				break;
		}
	};

	self.setter = function(value, path, type) {
		if ((type === 1 || type === 2) && track && track.length) {
			for (var i = 0; i < track.length; i++) {
				if (path.indexOf(track[i]) !== -1) {
					tracked = true;
					self.state();
					return;
				}
			}
		}
	};

	self.state = function() {
		setTimeout2(self.id, function() {
			var cls = 'ui-validation';
			var disabled = tracked ? VALIDATE(path, flags) : DISABLED(path, flags);
			if (!disabled && config.if)
				disabled = !EVALUATE(self.path, config.if);
			if (disabled !== old) {
				elements.prop('disabled', disabled);
				self.tclass(cls + '-ok', !disabled);
				self.tclass(cls + '-no', disabled);
				old = disabled;
			}
			if (tracked)
				tracked = false;
		}, config.delay);
	};
});