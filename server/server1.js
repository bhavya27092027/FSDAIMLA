import http from "http";
const port = 5001;

const server = http.createServer((req, res) => {
    const url = req.url;
    let body = "";
    let data = [
        {id:1, name:"xyz", email:"xyz@gmail.com"},
        {id:2, name:"abc", email:"abc@gmail.com"},
        {id:3, name:"pqr", email:"pqr@gmail.com"}
    ];

    if (url == "/" && req.method == "GET") {
        res.end("HomePage");
    }    

    else if (url === "/createuser" && req.method === "POST") {
        req.on("data", chunk => { body += chunk; });
        req.on("end", () => {
            const newUser = JSON.parse(body);
            newUser.id = data.length + 1;
            data.push(newUser);
            console.log(body, "user data received");
            res.end(JSON.stringify(data));
        });
    }

    else if (url.startsWith("/users/") && req.method === "GET") {
        const id = url.split("/")[2];
        const user = data.find(u => u.id == id);
        if (!user) {
            res.statusCode = 400;
            return res.end(`User ${id} not found`);
        }
        res.end(JSON.stringify(user));
    }

    else if (url.startsWith("/users/") && req.method === "PUT") {
        const id = url.split("/")[2];
        const user = data.find(u => u.id == id);
        if (!user) {
            res.statusCode = 400;
            return res.end(`User ${id} not found`);
        }
        console.log("User", id, "found successfully");
        res.end(JSON.stringify(user));
    }

    else if (url.startsWith("/users/") && req.method === "DELETE") {
        const id = url.split("/")[2];
        const userIndex = data.findIndex(u => u.id == id);
        if (userIndex === -1) {
            return res.end(`User ${id} not found`);
        }
        data.splice(userIndex, 1);
        res.end(`User ${id} deleted`);
    }

    else if (url === "/users" && req.method === "GET") {
        res.end(JSON.stringify(data));
    }

    else {
        res.statusCode = 404;
        res.end("Error Page");
    }
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});