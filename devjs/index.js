var path = "http://www.reddit.com/";

if (parameters.subreddit) {
	path += "/r/" + parameters.subreddit;
	document.getElementById("header").textContent = parameters.subreddit;	
}

path += ".json";

refresh = function() {
	document.getElementById("posts").innerHTML = "Loading...";
	ajax.get(
		path,
		{},
		"",
		data => {
			data = JSON.parse(data);
			posts = data.data.children;

			document.getElementById("posts").innerHTML = posts.reduce(
				(x, post) => x + make(makePost(post.data)),
				""
			);
		}
	);
}

refresh();