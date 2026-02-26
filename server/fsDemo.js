/* import fs from "fs";

// Read data from file
const data = fs.readFileSync("data.txt", "utf-8");
console.log("Data =", data);

// Define new data to write
const myData = "This is new content";

/* /* // Write data to file
fs.writeFileSync("data.txt", myData);
console.log("Data Written Successfully"); */

/* // Append data to file
fs.appendFileSync("data.txt", myData);
console.log("Data Appended Successfully");

// Deleting the file
fs.unlinkSync("data.txt");
console.log("Data file deletd successfully") */ 

/* fs.renameSync("data.txt", "newdata.txt") */ 



/* import fs from "fs";

fs.readFile("newdata.txt", "utf-8", (err, data) => {
  if (err) {
    console.log("Error:", err.message);
  } else {
    console.log("Data =", data);
  }
});

const myData = "my WT project Data"
fs.writeFile("newData.txt", myData,(err)=>{
    if(err) {
        console.log("Error:",err.message);
    }
    else{
        console.log("Data Written Successfully");
    }
}); */





import fs from "fs/promises"

async function readData(){
    try{
        const data = await fs.readFile("newdata.txt","utf-8");
        console.log("Data = ", data)
    }
    catch(err) {
        console.log("Error:", err.message);
    }
}

readData();

async function writeData(myData) {
    try {
        await fs.writeFile("newData.txt", myData);
        console.log("Data Written Successfully")
    } catch(err) {
        console.error("Error", err.message);
    }
    
}

writeData("My FSD Data Function");
