import http from "http";
import fs from "fs/promises";

const port = 5001;
let data = [];

// Function to write data into users.json file
async function writeData(user) {
  try {
    await fs.writeFile("users.json", JSON.stringify(user));
  } catch (err) {
    console.error("Error:", err.message);
  }
}

// Function to read data from users.json file
async function readData() {
  try {
    const data11 = await fs.readFile("users.json", "utf-8");
    console.log("Data:", data11);
    data = JSON.parse(data11);
  } catch (err) {
    console.error("Error:", err.message);
    data = [];
  }
}

const server = http.createServer(async (req, res) => {
  const url = req.url;
  await readData(); // Always load latest data from file

  // Route: Home page
  if (url === "/" && req.method === "GET") {
    res.end("HomePage");
  }

  // Route: Create new user (POST /createuser)
  else if (url === "/createuser" && req.method === "POST") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {
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
          email: data1.email,
        };

        data.push(newUser);
        await writeData(data);

        res.statusCode = 201;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(newUser));
      } catch (err) {
        res.statusCode = 400;
        res.end("Invalid JSON payload");
      }
    });
  }

  // Route: Get all users (GET /users)
  else if (url === "/users" && req.method === "GET") {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(data));
  }

  // Route: Get user by ID (GET /users/:id)
  else if (url.startsWith("/users/") && req.method === "GET") {
    const id = url.split("/")[2];
    const user = data.find(u => u.id == id);

    if (!user) {
      res.statusCode = 404;
      return res.end(`User ${id} not found`);
    }

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(user));
  }

  // Route: Update user by ID (PUT /users/:id)
  else if (url.startsWith("/users/") && req.method === "PUT") {
    const id = url.split("/")[2];
    const userIndex = data.findIndex(u => u.id == id);

    if (userIndex === -1) {
      res.statusCode = 404;
      return res.end(`User ${id} not found`);
    }

    let body = "";
    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const data2 = JSON.parse(body);
        data[userIndex] = { ...data[userIndex], ...data2 };
        await writeData(data);

        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(data[userIndex]));
      } catch (err) {
        res.statusCode = 400;
        res.end("Invalid JSON payload");
      }
    });
  }

  // Route: Delete user by ID (DELETE /users/:id)
  else if (url.startsWith("/users/") && req.method === "DELETE") {
    const id = url.split("/")[2];
    const userIndex = data.findIndex(u => u.id == id);

    if (userIndex === -1) {
      res.statusCode = 404;
      return res.end(`User ${id} not found`);
    }

    data.splice(userIndex, 1);
    await writeData(data);

    res.end(`User ${id} deleted`);
  }

  // Fallback route: Not found
  else {
    res.statusCode = 404;
    res.end("Error Page");
  }
});

// Start server
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});