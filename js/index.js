var path = "http://www.reddit.com/";

if (parameters.subreddit)
	path += "/r/" + parameters.subreddit;

path += ".json";

refresh = function() {
	document.getElementById("posts").innerHTML = "Loading...";
	ajax.get(
		path,
	    {},
	    data => {
	        data = JSON.parse(data);
	        posts = data.data.children;
	        console.log(posts[0]);
	        document.getElementById("posts").innerHTML = "";
	        posts.forEach(
	        	post => document.getElementById("posts").appendChild(toPost(post.data)));
	    }
	);
}

refresh();