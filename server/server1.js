import http from "http";

const port = 5001;

let data = [
    { id: 1, name: "xyz", email: "xyz@gmail.com" },
    { id: 2, name: "abc", email: "abc@gmail.com" },
    { id: 3, name: "pqr", email: "pqr@gmail.com" }
];

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    // Home Route
    if (url === "/" && method === "GET") {
        res.end("HomePage");
    }

    // Create User (POST)
    else if (url === "/createuser" && method === "POST") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const data1 = JSON.parse(body);

                // validation
                if (!data1.id || !data1.name || !data1.email) {
                    res.statusCode = 400;
                    return res.end("Missing fields");
                }

                data.push(data1);

                res.statusCode = 201;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(data1));

            } catch (err) {
                res.statusCode = 400;
                res.end("Invalid JSON");
            }
        });
    }

    // Get All Users
    else if (url === "/users" && method === "GET") {
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data));
    }

    // Get User by ID
    else if (url.startsWith("/users/") && method === "GET") {
        const id = url.split("/")[2];

        const user = data.find(u => u.id == id);

        if (!user) {
            res.statusCode = 404;
            return res.end("User not found");
        }

        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(user));
    }

    // Update User (PUT)
    else if (url.startsWith("/users/") && method === "PUT") {
        const id = url.split("/")[2];
        const userIndex = data.findIndex(u => u.id == id);

        if (userIndex === -1) {
            res.statusCode = 404;
            return res.end("User not found");
        }

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const updatedData = JSON.parse(body);

                data[userIndex] = {
                    ...data[userIndex],
                    ...updatedData
                };

                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(data[userIndex]));

            } catch (err) {
                res.statusCode = 400;
                res.end("Invalid JSON");
            }
        });
    }

    // Delete User
    else if (url.startsWith("/users/") && method === "DELETE") {
        const id = url.split("/")[2];
        const userIndex = data.findIndex(u => u.id == id);

        if (userIndex === -1) {
            res.statusCode = 404;
            return res.end("User not found");
        }

        data.splice(userIndex, 1);

        res.end(`User ${id} deleted`);
    }

    else {
        res.statusCode = 404;
        res.end("Route not found");
    }
});

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});