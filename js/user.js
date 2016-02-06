var path = "http://www.reddit.com/user/" + parameters.name + ".json";

document.getElementById("header").textContent = parameters.name;

refresh = function() {
	document.getElementById("posts").innerHTML = "Loading...";
	ajax.get(
		path,
		{},
		data => {
			data = JSON.parse(data);
			posts = data.data.children;

			document.getElementById("posts").innerHTML = posts.reduce(
				(x, post) => {console.log(toPost(post.data));return x + toPost(post.data)},
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
			"tr", {class: "title"},
			[
				"td", {colspan: 3}, [
					"a", {href: "./comments.html?id=" + post.id},
					[
						"h4",
						post.link_title
					]
				]
			]
		]) + make([
			"tr", {class: "body"},
			[
				"td", {colspan: 3},
				htmlDecode(post.body_html)
			]
		]);
	} else {
		return make([
			"tr", {class: "post"},
			makePost(post)
		]);
	}
}

refresh();