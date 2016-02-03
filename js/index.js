ajax.get(
    "https://www.reddit.com/r/all.json",
    {},
    data => {
        data = JSON.parse(data);
        posts = data.data.children;
        console.log(posts[0]);
        posts.forEach(post => document.getElementById("posts").appendChild(toPost(post.data)));
    }
);