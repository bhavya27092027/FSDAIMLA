// http is a stateless protocol
import http from  "http"; /* // Node’s built‑in http module.
# This module lets you create a web server without needing external libraries like Express. */
import os from "os";  // Node's built-in OS module
const port = 5000;
let body=""; // browser par data laane ke liye user ke liye but it is for single entry
let data = []; // array for multiple data entries
const server = http.createServer((req,res)=>{      
/* - http.createServer((req, res) => { ... })
- Creates an HTTP server.
- The callback (req, res) runs every time a request comes in.
- req = request object (contains info like URL, headers, method).
- res = response object (used to send data back to the client).
*/ 
    const url = req.url; 
    /*- const url = req.url;
    - Extracts the path part of the request (e.g., /, /about, /contact).
    */ 
    if (url=="/" && req.method=="GET"){
        res.write("HomePage");
    }
    else if(url == "/about" && req.method=="POST"){
        
        res.write("About Page")       
    }
    else if(url == "/contact" && req.method=="GET"){
        
        res.write("Contact Page")       
    }
    else if (url === "/system" && req.method === "GET") {


    const systemInfo = {
            platform: os.platform(),        
            architecture: os.arch(),       
            cpu: os.cpus()[0].model,
            cpu_length: os.cpus(),     
            totalMemory: (os.totalmem()/1024**3).toFixed(2),     
            freeMemory: (os.freemem()/1024**3).toFixed(2)      
        }; // JS Object

        res.write(JSON.stringify(systemInfo, null, 2));  
        /* // - null → means “don’t filter any properties.”
              - 2 → makes the output pretty and easier to read (especially useful when debugging or returning JSON to humans via browser/Postman). */

    }
    else if(url=== "/senddata" && req.method === "POST"){
        let body = "";
        req.on("data", (chunk)=>{  // breaked large sized data into chunks
            body = body + chunk;
        })
        req.on("end",()=>{
            console.log(body,"data received");
            data.push(body);
            res.end(JSON.stringify(data)); // not for JSON data , its for text data
        }) 
    }

    else if(url=== "/viewdata" && req.method === "GET"){
        res.end(JSON.stringify(data));
    }

    else {
        res.statusCode=404;
        res.end("Error Page")    
    }
    //res.end();
}) 

server.listen(port, ()=> {
    console.log(`Server is running on port ${port}`) // Because used to show server info to developer
})


/* import http from "http";

const server = http.createServer((req, res) => {
    if (req.url === "/user" && req.method === "POST") {
        let body = "";

        // Collect the body data
        req.on("data", data => {
            body += data;
        });

        // When all data is received
        req.on("end", () => {
            try {
                const parsed = JSON.parse(body); // Expect JSON { "name": "...", "email": "..." }

                res.setHeader("Content-Type", "application/json");
                res.statusCode = 201;
                res.end(JSON.stringify({
                    message: "User received",
                    name: parsed.name,
                    email: parsed.email
                }));
            } catch (err) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: "Invalid JSON" }));
            }
        });
    } else {
        res.statusCode = 404;
        res.end("Not Found");
    }
});

server.listen(5000, () => {
    console.log("Server running on port 5000");
}); */

/* Key point
• 	Backend sets data as JS objects.
• 	Frontend receives JSON (string format) and parses it back into JS objects. 


• 	Backend: works with JS objects → converts to JSON string → sends over HTTP.
• 	Frontend: receives JSON string → parses back into JS object → uses in code.
👉 This separation exists because HTTP can only transmit text/binary, not raw language‑specific objects. JSON is the universal “bridge” format.
*/
