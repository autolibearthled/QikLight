var App = {
	profile: {
		editing: false,
		name: "",
		colors: {
			first: {
				hex: "#ffffff",
				name: "White"
			},
			second: {
				hex: "#000000",
				name: "Black"
			}
		},
		interval: 1000, //milliseconds
		transition: "flash"
	},

	timer: null,
	transitions: {
		flash: function(el) {
			clearInterval(App.timer);
			App.timer = setInterval(function() {
				var t = App.rgb2hex(el.css("background-color"));
				var color = t == App.profile.colors.first.hex ? App.profile.colors.second.hex : App.profile.colors.first.hex;
				el.css("background", color);
			}, App.profile.interval, false);
		},

		pulse: function(el) {
			clearInterval(App.timer);
			App.timer = setInterval(function() {
				var color = App.rgb2hex(el.css("background-color")) == App.profile.colors.first.hex ? App.profile.colors.second.hex : App.profile.colors.first.hex;
				el.css("background", App.profile.colors.second.hex);
				el.animate({
					opacity: 0.2
				}, 200, function() {
					el.css("opacity", 1);
				});
			}, App.profile.interval, false);
		},

		burst: function(el) {
			clearInterval(App.timer);
			App.timer = setInterval(function() {
				var color = App.rgb2hex(el.css("background-color")) == App.profile.colors.first.hex ? App.profile.colors.second.hex : App.profile.colors.first.hex;
				el.css("background", color);
			}, App.profile.interval, false);
		}
	},

	activate: function(name) {
		App.load(name);
		$.mobile.changePage("#active");
		App.transitions[App.profile.transition]($("div#active"));
	},
	preview: function() {
		App.transitions[App.profile.transition]($("div.preview"));
	},

	save: function() {
		var name = $("input#name").val();
		if(name == "") {
			$("div#profileNamePopup").popup("open");
			return false;
		}

		if(name != App.profile.name && App.profile.editing) {
			localStorage.removeItem(App.profile.name);
		}
		App.profile.name = name;

		App.profile.colors.first.name = $("a#color-one span.ui-btn-text").html();
		App.profile.colors.second.name = $("a#color-two span.ui-btn-text").html();

		localStorage.setItem(App.profile.name, JSON.stringify(App.profile));

		App.profile.editing = true;

		$.mobile.changePage("#profiles");
	},
	edit: function(name) {
		App.load(name);

		App.profile.editing = true;

		$("#settings input#name").val(App.profile.name);
		$("a#color-one span.ui-btn-text").html(App.profile.colors.first.name);
		$("a#color-two span.ui-btn-text").html(App.profile.colors.second.name);

		$("#interval option:selected").attr("selected", "false");
		$("#interval option[value='"+App.profile.interval+"']").attr("selected", "true");

		$("#transition option:selected").attr("selected", "false");
		$("#transition option[value='"+App.profile.transition+"']").attr("selected", "true");

		$.mobile.changePage("#settings");
	},
	load: function(name) {
		var profile = JSON.parse(localStorage.getItem(name));
		if(profile != null) {
			App.profile.name = name;
			App.profile.colors = profile.colors;
			App.profile.interval = profile.interval;
			App.profile.transition = profile.transition;
		}
	},
	loadProfiles: function() {
		$("div#profiles-list").empty();
		if(localStorage.length != 0) {
			for (var i = 0; i < localStorage.length; i++) {
				var profile = JSON.parse(localStorage.getItem(localStorage.key(i)));
				$("div#profiles-list").append('<div data-role="collapsible"><h3>'+ profile.name +'</h3><button type="submit" data-theme="c" name="activate" onClick="App.activate(\''+profile.name+'\')">Activate</button><button type="submit" data-theme="c" name="edit" onClick="App.edit(\''+ profile.name +'\')">Edit</button><button type="submit" data-theme="c" name="delete" onClick="App.delete(\''+profile.name+'\')">Delete</button></div>');
			}
		} else {
			$("div#profiles-list").append('<div data-role="collapsible"><h3>No Profiles</h3></div>');
		}
		$("div#profiles-list").trigger("create");
	},

	"delete": function(name) {
		if(localStorage.getItem(name) != null) {
			localStorage.removeItem(name);
			App.loadProfiles();
		}
	},
	cancel: function() {
		App.profile.editing = false;

		$("input#name").val("");
		$("a#color-one span.ui-btn-text").html("Black");
		$("a#color-two span.ui-btn-text").html("White");

		clearInterval(App.timer);
		history.back();
	},
	home: function() {
		App.profile.editing = false;
		clearInterval(App.timer);
		$.mobile.changePage("#home", {
			reverse: true
		});
	},

	rgb2hex: function(rgb) {
	    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	    function hex(x) {
	        return ("0" + parseInt(x).toString(16)).slice(-2);
	    }
	    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	}
};