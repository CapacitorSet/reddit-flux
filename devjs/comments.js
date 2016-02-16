var path = "http://www.reddit.com/" + parameters.id + ".json",
	cid = parameters.cid,
	authors = []; // Global, so that it can be reused for the buttons

// https://gist.github.com/green-flash/8c9ac15f48291ab0524b
function calcUpvotes(score, upvoteRatio) {
	return Math.round((upvoteRatio * score) / (2 * upvoteRatio - 1));
}

refresh = function(cb) {
	ajax.get(
		path,
		{},
		"",
		data => {
			data = JSON.parse(data);

			var op = data[0].data.children[0].data,
				replies = data[1].data.children.map(x => x.data);

			document.getElementById("post-subreddit").textContent = 
				document.getElementById("header").textContent = op.subreddit;
			document.getElementById("post-domain").textContent = op.domain;
			document.getElementById("post-date").textContent = jQuery.timeago(new Date(op.created * 1000));
			document.getElementById("post-author").textContent = op.author;

			document.getElementById("post-score").textContent = op.score + "pts";
			var upvotes = op.score == 0 ? 0 : calcUpvotes(op.score, op.upvote_ratio),
				downvotes = upvotes - op.score;
			document.getElementById("post-updoots").textContent = upvotes;
			document.getElementById("post-downdoots").textContent = downvotes;

			if (op.is_self) {
				document.getElementById("mediaDiv").outerHTML = "";
				document.getElementById("opText").innerHTML = htmlDecode(op.selftext_html);
			} else {
				document.getElementById("thumbnail").src = op.thumbnail;
				document.getElementById("opText").outerHTML = "";
			}
			document.getElementById("opTitle").textContent = op.title;

			document.getElementById("commentCount").textContent = op.num_comments;

			document.getElementById("hrefAuthor").href = "./user.html?name=" + op.author;

			var items = ["div"];
			// todo: nest using html children
			var traverse = (reply, level) => {
				var self = [];
				var styleString = "margin-left: " + (level-1) * 5 + "px; border-left: 5px solid ";
				switch (level) {
					case 0:
						styleString = "none";
						break;
					case 1:
						styleString += "#690";
						break;
					case 2:
						styleString += "#099";
						break;
					case 3:
						styleString += "#36f";
						break;
					case 4:
						styleString += "#60c";
						break;
					case 5:
						styleString += "#f06";
						break;
					case 6:
						styleString += "#c60";
						break;
					case 7:
						styleString += "#c30";
						break;
					case 8:
						styleString += "#666";
						break;
				}

				authors[reply.id] = reply.author;

				if (!reply.author) {
					if (!reply.children) return ["span"];
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
				} else {
					self = [
						"div", [
							"div", {
								class: "comment",
								style: styleString,
								id: reply.id
							},
							[
								"span", {class: "comment-author" + (reply.author == op.author ? " comment-op" : "")},
								reply.author + " "
							], [
								"span", {class: "comment-score"},
								reply.score + "pts "
							], [
								"span", {class: "comment-date"},
								jQuery.timeago(new Date(reply.created * 1000)) + " "
							], [
								"span", {
									class: reply.controversiality ? "glyphicon glyphicon-fire" : "hide",
									style: "color: orange"
								}
							], [
								"div", {class: "comment-content"},
								htmlDecode(reply.body_html)
							]
						]
					];
				}
				if (reply.replies && reply.replies.data.children.length > 0)
					reply.replies.data.children.forEach(x => self.push(traverse(x.data, level + 1)));
				return self;
			};
			var a = replies.reduce((x, d) => {x.push(traverse(d, 0));return x}, []);
			a.unshift("div");
			document.getElementById("postsContainer").innerHTML = make(a);
			if (cb) cb();
		}
	);
}

refresh(function() {
	Array.prototype.slice.call(document.getElementsByClassName("comment"))
		.forEach(x => x.onclick = clickHandlerFactory(x.id));
});

var active_comment = null; // ID of the currently highlighted comment

function clickHandlerFactory(id) {
	return function(event) {
		if (active_comment != id) {
			deactivate();
			activate(id);
		} else {
			deactivate();
		}
	}
}

function activate(id) {
	var self = document.getElementById(id);
	active_comment = id;
	self.className += " active-comment";
	var bar = document.createElement("table");
	bar.id = "commentButtons"
	bar.innerHTML = make([
		"tr", [
			["td", ""],
			["td", ["span", {class: "glyphicon glyphicon-arrow-up disabled"}]],
			["td", ["span", {class: "glyphicon glyphicon-arrow-down disabled"}]],
			["td", ["span", {class: "glyphicon glyphicon-comment disabled"}]],
			["td", ["a", {
				class: "glyphicon glyphicon-user",
				href: "./user.html?name=" + authors[id]
			}]],
			["td", ["span", {class: "glyphicon glyphicon-minus disabled"}]],
			["td", ["span", {class: "glyphicon glyphicon-floppy-disk disabled"}]]
	]]);
	self.appendChild(bar);
	console.log(self);
}

function deactivate() {
	if (active_comment == null) return;
	var target = document.getElementById(active_comment);
	target.className = target.className.replace("active-comment", "");
	active_comment = null;
	document.getElementById("commentButtons").outerHTML = "";
}
