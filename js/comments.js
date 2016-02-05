// http://stackoverflow.com/a/1912522/1541408
function htmlDecode(input) {
	var e = document.createElement('div');
	e.innerHTML = input;
	return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}

var path = "http://www.reddit.com/" + parameters.id + ".json";

refresh = function() {
	ajax.get(
		path,
		{},
		data => {
			data = JSON.parse(data);

			var op = data[0].data.children[0].data,
				replies = data[1].data.children.map(x => x.data);

			console.log(replies);

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
			document.getElementById("postsContainer").id = op.name;

			var parent = document.getElementById(op.name);
			var handle = (comments, parent, level) => {
				comments.forEach(reply => {
					var self = document.createElement("div");
					self.id = reply.name;
					self.className = "comment";
					var borderString = "5px solid ";
					switch (level) {
						case 0:
							borderString = "none";
							break;
						case 1:
							borderString += "#ddd";
							break;
						case 2:
							borderString += "#ccc";
							break;
						case 3:
							borderString += "#bbb";
							break;
						case 4:
							borderString += "#aaa";
							break;
						case 5:
							borderString += "#999";
							break;
						case 6:
							borderString += "#888";
							break;
						case 7:
							borderString += "#777";
							break;
						case 8:
							borderString += "#666";
							break;
					}
					self.style.borderLeft = borderString;

					var data = document.createElement("div");
					self.appendChild(data);

					var authorSpan = document.createElement("span");
					authorSpan.textContent = reply.author + " ";
					authorSpan.className = "comment-author";
					data.appendChild(authorSpan);

					var scoreSpan = document.createElement("span");
					scoreSpan.textContent = reply.score + "pts ";
					scoreSpan.className = "comment-score";
					data.appendChild(scoreSpan);

					var dateSpan = document.createElement("span");
					dateSpan.textContent = jQuery.timeago(new Date(reply.created * 1000));
					dateSpan.className = "comment-date";
					data.appendChild(dateSpan);

					var postContent = document.createElement("div");
					postContent.innerHTML = htmlDecode(reply.body_html);
					postContent.className = "comment-content"
					self.appendChild(postContent);

					if (reply.replies && reply.replies.data.children.length > 0)
						handle(reply.replies.data.children.map(x => x.data), self, level + 1);

					parent.appendChild(self);
				});
			};
			handle(replies, parent, 0);
		}
	);
}

refresh();