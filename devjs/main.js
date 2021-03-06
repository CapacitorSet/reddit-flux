// http://stackoverflow.com/a/21210643/1541408
var parameters = {};
location.search.substr(1).split("&").forEach(item => parameters[item.split("=")[0]] = item.split("=")[1]);

// http://stackoverflow.com/a/1912522/1541408
function htmlDecode(input) {
	var e = document.createElement('div');
	e.innerHTML = input;
	return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ')
			c = c.substring(1);
		if (c.indexOf(name) == 0)
			return c.substring(name.length, c.length);
	}
	return "";
}

function getAccessToken() {
	return getCookie("access_token");
}

//http://stackoverflow.com/a/18078705/1541408
var ajax = {};

ajax.send = function (url, auth, callback, method, data, async) {
	if (async === undefined) async = true;

	var x = new XMLHttpRequest();
	x.open(method, url, async);
	x.onreadystatechange = function () {
		if (x.readyState == 4) callback(x.responseText);
	};
	if (typeof auth === typeof "string") {
		if (auth)
			x.setRequestHeader("Authorization", auth);
	} else {
		throw new Error("Authorization (" + JSON.stringify(auth) + ") is not a string");
	}
//	x.setRequestHeader("Authorization", "Basic " + btoa("uKBSIfai8-jOxg:"));
	if (method == 'POST')
		x.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	x.send(data);
};

ajax.get = function (url, data, auth, callback, async) {
	var query = [];
	for (var key in data) {
		query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
	}
	ajax.send(url + (query.length ? '?' + query.join('&') : ''), auth, callback, 'GET', null, async);
};

ajax.post = function (url, data, auth, callback, async) {
	var query = [];
	for (var key in data) {
		query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
	}
	ajax.send(url, auth, callback, 'POST', query.join('&'), async);
};

// make(["p", "Here is a ", ["a", { href:"http://www.google.com/" }, "link"], "."]);
// -> "<p>Here is a <a href="http://www.google.com/">link</a>.</p>"
function make(desc) {
	var name = desc[0];
	var attributes = desc[1];

	var html = "<" + name;

	var start = 1;
	if (typeof attributes === "object" && attributes !== null && !Array.isArray(attributes)) {
		for (var attr in attributes) {
			html += ' ' + attr + '="' + attributes[attr] + '"';
		}start = 2;
	}

	html += ">";

	for (var i = start; i < desc.length; i++) {
		html += Array.isArray(desc[i]) ? make(desc[i]) : desc[i];
	}html += "</" + name + ">";

	return html;
}

function makePost(post) {
	var row = ["tr", {
		class: "post" + (post.over_18 ? " nsfw" : "")
	}];

	var hasThumbnail = post.thumbnail != "default" && post.thumbnail != "" && post.thumbnail != "self" && post.thumbnail != "nsfw";

	if (hasThumbnail) row.push(["td", { class: "thumbnailDiv" }, ["a", { href: post.url }, ["img", {
		class: "media-object thumbnail",
		src: post.thumbnail
	}]]]);

	var header = ["h4", {
		class: "media-heading" + (post.stickied ? " sticky" : "")
	}];

	if (post.url) header.push(["a", { href: post.is_self ? "./comments.html?id=" + post.id : post.url }, post.title]);else header.push(post.title);

	var middleRow = ["div", ["span", { class: "upvotes" }, post.score + "pts "], ["span", { class: "author" }, post.author + " "]];

	var bottomRow = ["div", ["span", { class: "subreddit" }, post.subreddit + " "], ["span", { class: "domain" }, post.domain + " "], ["span", { class: "date" }, jQuery.timeago(new Date(post.created * 1000)) + " "]];

	if (post.over_18) bottomRow.push(["span", { class: "nsfw-label" }, "NSFW"]);

	row.push(["td", {
		colspan: hasThumbnail ? 1 : 2,
		class: "link-content"
	}, header, middleRow, bottomRow]);

	row.push(["td", { class: "media-body text-center comment-count" }, ["a", { href: "./comments.html?id=" + post.id }, '<span class="glyphicon glyphicon-comment"></span><br>', post.num_comments]]);

	return row;
}