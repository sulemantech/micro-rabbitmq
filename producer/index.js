const experess = require("express");
const mongoose = require("mongoose");
const sequelize = require("sequelize");

const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const amqp = require("amqplib");
const { Sequelize } = require("sequelize");


const app = experess();


const PORT = process.env.PORT || 4003;
function  startUp () {
    /*const sequelize = new Sequelize(process.env.PG_URL, sequelize.authenticate()
    .then(conn=>{
        console.log('Consumer: Connected to Postgres');
    }).catch(() => {
        console.error("Caught an error");
      })*/
}
var channel, conn;

async function sendToQueue(data){
    try {
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        console.log('Start publishing');
        return await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));
        console.log('End publishing');

        await channel.close();
        await connection.close();
    }
    catch (ex) {
        console.error(ex);
    }
}

app.get("/send-msg", (req, res) => {
    
    // data to be sent
    const data = {
        productId  : 1,
        Name : "IPhone",
        Price: 200,
        Model:2022
    }
    //connectQueue();
    sendToQueue(data);  // pass the data to the function we defined
    console.log("The message is sent to the rabbit message queue")
    res.send("Message Sent"); //response to the API request
    
})
app.post("/send-msg", (req, res) => {
    
    // data to be sent
    const data = {
        productId  : 1,
        Name : "IPhone",
        Price: 200,
        Model:2022
    }
    //connectQueue();
    sendToQueue(data);  // pass the data to the function we defined
    console.log("The message is sent to the rabbit message queue")
    res.send("Message Sent"); //response to the API request
    
})

// GET Call for all devices
app.get("/devices", (req, res) => {
    return res.status(200).send({
      success: "true",
      message: "devices",
      devices: deviceList,
    });
  });
  
  app.get("/", (req, res) => {
    return res.status(200).send({
      success: "true",
      message: "devices",
      devices: deviceList,
    });
  });
  
  //  POST call - Means you are adding new device into database 
  
  app.post("/addDevice", (req, res) => {
  
    if (!req.body.name) {
      return res.status(400).send({
        success: "false",
        message: "name is required",
      });
    } else if (!req.body.companies) {
      return res.status(400).send({
        success: "false",
        message: "companies is required",
      });
    }
    const device = {
      id: deviceList.length + 1,
      isPublic: req.body.isPublic,
      name:  req.body.name,
      companies: req.body.companies,
      books:  req.body.books
    };
    deviceList.push(device);
    return res.status(201).send({
      success: "true",
      message: "device added successfully",
      device,
    });
  });
  
  //  PUt call - Means you are updating new device into database 
  
  app.put("/device/:deviceId", (req, res) => {
    console.log(req.params)
    const id = parseInt(req.params.deviceId, 10);
    const deviceFound=findDeviceById(id)
    
  
    if (!deviceFound) {
      return res.status(404).send({
        success: 'false',
        message: 'device not found',
      });
    }
  
    const updatedDevice= {
        id: id,
        isPublic: req.body.isPublic || deviceFound.body.isPublic,
        name:req.body.name || deviceFound.body.name,
        companies: req.body.companies || deviceFound.body.companies,
        books: req.body.books || deviceFound.body.books
     
    };
  
    if (!updatedDevice.name) {
      return res.status(400).send({
        success: "false",
        message: "name is required",
      });
    } else if (!updatedDevice.companies) {
      return res.status(400).send({
        success: "false",
        message: "companies is required",
      });
    }
  
    for (let i = 0; i < deviceList.length; i++) {
        if (deviceList[i].id === id) {
            deviceList[i] = updatedDevice;
            return res.status(201).send({
              success: 'true',
              message: 'device updated successfully',
              updatedDevice
            
            });
        }
    }
    return  res.status(404).send({
              success: 'true',
              message: 'error in update'
             
       });
  })
  
  //  Delete call - Means you are deleting new device from database 
  
  app.delete("/device/:deviceId", (req, res) => {
    console.log(req.params)
    const id = parseInt(req.params.deviceId, 10);
    console.log(id)
    for(let i = 0; i < deviceList.length; i++){
        if(deviceList[i].id === id){
             deviceList.splice(i,1);
             return res.status(201).send({
              success: 'true',
              message: 'device deleted successfully'
            });
        }
    }
    return res.status(404).send({
                success: 'true',
                message: 'error in delete'   
      });
  })

app.use(
    '/api-docs',
    swaggerUi.serve, 
    swaggerUi.setup(swaggerDocument)
  );
app.listen(PORT, ()=>console.log("Server running at port: "+ PORT));
