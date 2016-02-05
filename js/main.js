// http://stackoverflow.com/a/21210643/1541408
parameters = {};
location.search.substr(1).split("&").forEach(function(item) {parameters[item.split("=")[0]] = item.split("=")[1]});

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1);
		if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	}
	return "";
}

function getClientId() {
	if (getCookie("client_id") != "")
		return getCookie("client_id");
	function kindaGuid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4();
	}
	var guid = kindaGuid();
	document.cookie = "client_id=" + guid;
	return guid;
}

//http://stackoverflow.com/a/18078705/1541408

var ajax = {};

ajax.send = function (url, callback, method, data, async) {
	if (async === undefined)
		async = true;

	var x = new XMLHttpRequest();
	x.open(method, url, async);
	x.onreadystatechange = function () {
		if (x.readyState == 4)
			callback(x.responseText)
	};
	if (method == 'POST') {
		x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		x.setRequestHeader("Authorization", "Basic " + btoa("<CLIENT_ID>:"));
	}
	x.send(data)
};

ajax.get = function (url, data, callback, async) {
	var query = [];
	for (var key in data) {
		query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
	}
	ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async)
};

ajax.post = function (url, data, callback, async) {
	var query = [];
	for (var key in data) {
		query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
	}
	ajax.send(url, callback, 'POST', query.join('&'), async)
};

// make(["p", "Here is a ", ["a", { href:"http://www.google.com/" }, "link"], "."]);
// -> "<p>Here is a <a href="http://www.google.com/">link</a>.</p>"
function make(desc) {
	var name = desc[0];
	var attributes = desc[1];

	var html = "<" + name;

	var start = 1;
	if (typeof attributes === "object" && attributes !== null && !Array.isArray(attributes)) {
		for (var attr in attributes)
			html += ' ' + attr + '="' + attributes[attr] + '"';
		start = 2;
	}

	html += ">";

	for (var i = start; i < desc.length; i++)
		html += Array.isArray(desc[i]) ? make(desc[i]) : desc[i];

	html += "</" + name + ">";

	return html;
}

function toPost(post) {
	console.log(post, post.title);
	var row = [
		"tr", {
			class: "post" + (post.over_18 ? " nsfw" : "")
		}
	];

	var hasThumbnail =
		post.thumbnail != "default" &&
		post.thumbnail != "" &&
		post.thumbnail != "self" &&
		post.thumbnail != "nsfw";

	if (hasThumbnail)
		row.push([
			"td", {class: "thumbnailDiv"},
			[
				"a", {href: post.url},
				[
					"img", {
						class: "media-object thumbnail",
						src: post.thumbnail
					}
				]
			]
		]);

	var header = [
		"h4", {
			class: "media-heading" + (post.stickied ? " sticky" : "")
		}
	];

	if (post.url)
		header.push([
			"a", {href: post.url},
			post.title
		]);
	else
		header.push(post.title);

	var middleRow = [
		"div",
		[
			"span", {class: "upvotes"},
			post.score + "pts "
		],
		[
			"span", {class: "author"},
			post.author + " "
		]
	];

	var bottomRow = [
		"div",
		[
			"span", {class: "subreddit"},
			post.subreddit + " "
		],
		[
			"span", {class: "domain"},
			post.domain + " "
		],
		[
			"span", {class: "date"},
			jQuery.timeago(new Date(post.created * 1000)) + " "
		]
	];

	if (post.over_18)
		bottomRow.push([
			"span", {class: "nsfw-label"},
			"NSFW"
		]);

	row.push([
		"td", {
			colspan: hasThumbnail ? 1 : 2,
			class: "link-content"
		},
		header,
		middleRow,
		bottomRow
	]);

	row.push([
		"td", {class: "media-body text-center comment-count"},
		[
			"a", {href: "https://reddit.com" + post.permalink},
			'<span class="glyphicon glyphicon-comment"></span><br>',
			post.num_comments			
		]
	]);

	console.log(row, make(row));

	return row;
}