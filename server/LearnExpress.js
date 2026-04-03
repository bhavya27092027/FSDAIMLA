import express from "express"
const port = 5001;
const app = express();
const users = [
    { id: 1, name: "ABC1", email: "abc1@gmail.com" },
    { id: 2, name: "ABC2", email: "abc2@gmail.com" },
    { id: 3, name: "ABC3", email: "abc3@gmail.com" }
]
app.use(express.json())
app.get("/users/:id", (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const user = users.find(u => u.id === id);

        if (!user) {
            return res.status(404).json({ message: `user id ${id} not found` });
        }

        return res.status(200).json(user);

    }
    catch (err) {
        const message = err.message;
        res.status(500).json({ message: "server error" + message });
    }

})
app.post("/create", (req, res) => {
    try {
        const user = req.body;
        if (user.name == undefined || user.email == undefined) {
            return res.status(400).json({ message: "incomplete user data" })
        }
        const userIndex = users.findIndex(u => u.email == user.email);
        if (userIndex != -1) {
            return res.status(400).json({ message: "user already exists" })
        }
        const newUser = {
            id: Date.now(),
            ...user
        }
        users.push(newUser);
        res.status(201).json({ message: "user created successfully", newUser });

        // user.id=users.length+1;
        // users.push(user);
        // res.status(201).json({message:"user created successfully",user:user});
    }
    catch (err) {
        const message = err.message;
        res.status(500).json({ message: "server error" + message })
    }
})
app.delete("/delete/:id", (req, res) => {
    try {
        const id = req.params.id;
        const userIndex = users.findIndex(u => u.id == id);
        if (userIndex == -1) {
            return res.status(404).json({ message: `user id ${id} not found` });
        }
        users.splice(userIndex, 1);
        return res.status(200).json({ message: `user id ${id} deleted successfully` });
    }
    catch (err) {
        const message = err.message;
        res.status(500).json({ message: "server error" + message })
    }
})
app.put("/edit/:id", (req, res) => {
    try {
        const id = req.params.id;
        const userdata = req.body;
        const userIndex = users.findIndex(u => u.id == id);
        if (userIndex == -1) {
            return res.status(404).json({ message: `user id ${id} not found to edit` });
        }

        users[userIndex] = { ...users[userIndex], ...userdata };
        return res.status(200).json({ message: `user id ${id} data updated successfully`, updatedUser: users[userIndex] });
    }
    catch (err) {
        const message = err.message;
        res.status(500).json({ message: "server error" + message })
    }
})
app.listen(port, () => {
    console.log(`server is running on port ${port}`)

})
