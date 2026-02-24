import http from "http";
const port = 5001;
let data = [
    { id: 1, name: "xyz", email: "xyz@gmail.com" },
    { id: 2, name: "abc", email: "abc@gmail.com" },
    { id: 3, name: "pqr", email: "pqr@gmail.com" }
]; 

const server = http.createServer((req, res) => {
    const url = req.url;
    let body = "";
    if (url == "/" && req.method == "GET") {
        res.end("HomePage");
    }

    else if (url === "/createuser" && req.method === "POST") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const data1 = JSON.parse(body);

                // Manual validation
                if (!data1.id || !data1.name || !data1.email) {
                    res.statusCode = 400;
                    return res.end("Missing required fields: id, name, email");
                }

                const newUser = {
                    id: data1.id,
                    name: data1.name,
                    email: data1.email
                };

                data.push(newUser);

                res.statusCode = 201;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(newUser));
            } catch (err) {
                res.statusCode = 400;
                res.end("Invalid JSON payload");
            }
        });
    }

    else if (url === "/users" && req.method === "GET") {
        const user1 = data.find(u => u.name === name);

        if (!user1) {
            res.statusCode = 400;
            return res.end(`User ${name} not found`);
        }

        res.statusCode = 200;
        res.end(JSON.stringify(user1));
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
        const userIndex = data.findIndex(u = u.id == id);
        if (userIndex == -1) {
            res.statusCode(400);
            console.log(`user ${id} not found`)
            res.end(`user ${id} not found`);
        }
        let body = "";
        req.on("data", (chunk) => {
            body = body + chunk
        })
        req.on("end", () => {
            const data2 = JSON.parse(body);
            data[userIndex] = { ...data[userIndex], ...data2};
        })
        console.log("User", id, "updated successfully");
        res.end(JSON.stringify(data));
    }

    else if (url.startsWith("/users/") && req.method === "DELETE") {
        const id = url.split("/")[2];
        const userIndex = data.findIndex(u => u.id == id);
        if (userIndex == -1) {
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