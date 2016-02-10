var path = "http://www.reddit.com/user/" + parameters.name + ".json";

document.getElementById("header").textContent = parameters.name;

refresh = function() {
	document.getElementById("posts").innerHTML = "Loading...";
	ajax.get(
		path,
		{},
		null,
		data => {
			data = JSON.parse(data);
			posts = data.data.children;

			document.getElementById("posts").innerHTML = posts.reduce(
				(x, post) => x + make(toPost(post.data)),
				""
			);
		}
	);
}

function toPost(post) {
	console.log(post);
	var row;
	if (post.link_title) {
		return make([
			"tr",
			[
				"td", {colspan: 3},
				[
					"a", {
						href: "./comments.html?id=" + post.link_id.substr(3) + "#" + post.id,
						class: "title"
					},
					[
						"h4",
						post.link_title
					]
				]
			]
		]) + make([
			"tr",
			[
				"td", {colspan: 3, class: "body"},
				[
					"span", {class: "comment-subreddit"},
					post.subreddit + " "
				], [
					"span", {class: "comment-score"},
					post.score + "pts "
				], [
					"span", {class: "comment-date"},
					jQuery.timeago(new Date(post.created * 1000))
				],
				htmlDecode(post.body_html)
			]
		]);
	} else {
		return [
			"tr", {class: "post"},
			makePost(post)
		];
	}
}

refresh();