// http://stackoverflow.com/a/1912522/1541408
function htmlDecode(input) {
	var e = document.createElement('div');
	e.innerHTML = input;
	return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

var path = "http://www.reddit.com/" + parameters.id + ".json";

refresh = function(cb) {
	ajax.get(
		path,
		{},
		data => {
			data = JSON.parse(data);

			var op = data[0].data.children[0].data,
				replies = data[1].data.children.map(x => x.data);

			document.getElementById("subreddit").textContent = 
				document.getElementById("header").textContent = op.subreddit;
			document.getElementById("domain").textContent = op.domain;
			document.getElementById("date").textContent = jQuery.timeago(new Date(op.created * 1000));

			if (op.is_self) {
				document.getElementById("mediaDiv").outerHTML = "";
				document.getElementById("opText").innerHTML = htmlDecode(op.selftext_html);
			} else {
				document.getElementById("opText").outerHTML = "";
			}
			document.getElementById("opTitle").textContent = op.title;

			var parent = document.getElementById(op.name);
			var handle = (reply, level) => {
				var styleString = "border-left: 5px solid ";
				switch (level) {
					case 0:
						styleString = "none";
						break;
					case 1:
						styleString += "#ddd";
						break;
					case 2:
						styleString += "#ccc";
						break;
					case 3:
						styleString += "#bbb";
						break;
					case 4:
						styleString += "#aaa";
						break;
					case 5:
						styleString += "#999";
						break;
					case 6:
						styleString += "#888";
						break;
					case 7:
						styleString += "#777";
						break;
					case 8:
						styleString += "#666";
						break;
				}
				console.log(reply);

				var self = [
					"div", {
						class: "comment",
						style: styleString
					},
					[
						"div", {
							class: "comment-body",
							id: reply.id
						},
						[
							"span", {class: "comment-author"},
							reply.author + " "
						], [
							"span", {class: "comment-score"},
							reply.score + "pts "
						], [
							"span", {class: "comment-date"},
							jQuery.timeago(new Date(reply.created * 1000))
						], [
							"div", {class: "comment-content"},
							htmlDecode(reply.body_html)
						]
					]
				];

				if (!reply.author) {
					self = [
						"div", {
							class: "loadmore",
							style: styleString
						},
						[
							"a",
							"Load " + reply.children.length + " more comments [unsupported]"
							//, JSON.stringify(reply)
						]
					];
				}

				if (reply.replies && reply.replies.data.children.length > 0)
					self = reply.replies.data.children.reduce(
						(x, d) => {
							x.push(handle(d.data, level + 1));
							return x;
						},
						self
					);

				return self;
			};
			document.getElementById("postsContainer").innerHTML = replies.reduce(
				(x, d) => x + make(handle(d, 0)),
				""
			);
			if (cb) cb();
		}
	);
}

refresh(function() {
	Array.prototype.slice.call(document.getElementsByClassName("comment-body"))
		.forEach(x => x.onclick = clickHandlerFactory(x.id));
});

var active_comment = null; // ID of the currently highlighted comment

function clickHandlerFactory(id) {
	return function(event) {
		var self = document.getElementById(id);

		if (active_comment == id) {
			active_comment = null;
			self.className = self.className.replace("active-comment", "");
		} else {
			active_comment = id;
			self.className += " active-comment";
		}
	}
}