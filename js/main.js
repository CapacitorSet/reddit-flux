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

function toPost(post) {
	console.log(post, post.title);
	var row = document.createElement("tr");
	row.className = "post";

	var hasThumbnail =
		post.thumbnail != "default" &&
		post.thumbnail != "" &&
		post.thumbnail != "self" &&
		post.thumbnail != "nsfw";

	if (hasThumbnail) {
		var thumbnailHref = document.createElement("a");
		thumbnailHref.href = post.url;

		var thumbnail = document.createElement("img");
		thumbnail.className = "media-object thumbnail";
		thumbnail.src = post.thumbnail;
		thumbnailHref.appendChild(thumbnail);

		var thumbnailDiv = document.createElement("td");
		thumbnailDiv.className = "thumbnailDiv";

		thumbnailDiv.appendChild(thumbnailHref);
		row.appendChild(thumbnailDiv);
	}

	var contentDiv = document.createElement("td");
	if (!hasThumbnail)
		contentDiv.colSpan = 2;

	contentDiv.className = "link-content";
	row.appendChild(contentDiv);

	var header = document.createElement("h4");
	header.className = "media-heading" + (post.stickied ? " sticky" : "");
	if (post.url) {
		link = document.createElement("a");
		link.href = post.url;
		link.textContent = post.title;
		header.appendChild(link);
	} else {
		header.textContent = post.title;
	}
	contentDiv.appendChild(header);

	var commentDiv = document.createElement("td");
	commentDiv.className = "media-body text-center comment-count";
	row.appendChild(commentDiv);
	var commentHref = document.createElement("a");
	commentDiv.appendChild(commentHref);
	commentHref.href = "https://reddit.com" + post.permalink;
	commentHref.innerHTML = '<span class="glyphicon glyphicon-comment"></span><br>' + post.num_comments;


	// Middle row
	var middleRow = document.createElement("div");
	contentDiv.appendChild(middleRow);

	var upvotesDiv = document.createElement("span");
	upvotesDiv.className = "upvotes";
	upvotesDiv.textContent =  post.score + "pts ";
	middleRow.appendChild(upvotesDiv);

	var authorDiv = document.createElement("span");
	authorDiv.className = "author";
	authorDiv.textContent = post.author + " ";
	middleRow.appendChild(authorDiv);

	// Bottom row
	var bottomRow = document.createElement("div");
	contentDiv.appendChild(bottomRow);

	var subredditDiv = document.createElement("span");
	subredditDiv.className = "subreddit";
	subredditDiv.textContent = post.subreddit + " ";
	bottomRow.appendChild(subredditDiv);

	var domainDiv = document.createElement("a");
	domainDiv.className = "domain";
	domainDiv.href = domainDiv.textContent = post.domain + " ";
	bottomRow.appendChild(domainDiv);

	var dateDiv = document.createElement("span");
	dateDiv.className = "date";
	dateDiv.textContent = jQuery.timeago(new Date(post.created * 1000)) + " ";
	bottomRow.appendChild(dateDiv);

	if (post.over_18) {
		row.className += " nsfw";
		var nsfwDiv = document.createElement("span");
		nsfwDiv.className = "nsfw-label";
		nsfwDiv.textContent = "NSFW";
		bottomRow.appendChild(nsfwDiv);		
	}

	return row;
}