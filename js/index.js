refresh = function() {
	document.getElementById("posts").innerHTML = "Loading...";
	ajax.get(
	    "https://www.reddit.com/r/all.json",
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