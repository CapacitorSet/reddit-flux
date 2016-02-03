ajax.get(
    "https://www.reddit.com/.json",
    {},
    data => {
        data = JSON.parse(data);
        posts = data.data.children;
        console.log(posts[0]);
        posts.forEach(post => document.body.appendChild(toPost(post.data)));
    }
);