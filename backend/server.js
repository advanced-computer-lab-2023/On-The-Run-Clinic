require('dotenv').config()


const express= require("express")
const mongoose=require('mongoose')
const {createDoctor,getDocPatients,getDoctors,updateDoctor,deleteDoctor,addPatientToDr,getDoctorByUsername} = require("./controllers/doctorController")
const {createPatient,getPatients,searchPatientsByName,getMyPrescriptions} = require("./controllers/patientController")
const {createAdmin,getAdmin} = require("./controllers/adminController")
const {createMember,getFamilyMembers} = require("./controllers/familymemController")
const cors = require('cors');
const{createAppointment,filter,getAllAppointments}=require("./controllers/appointmentsController")
const{createPrescription,getPrescriptionsForPatient}=require("./controllers/perscriptionsController")
const{createRequest}=require("./controllers/requestsController")
const{createHealthPackage,getPackages,updateHealthPackage,deleteHealthPackage}=require("./controllers/HealthPackagesController")


//express app
const app = express()
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with your frontend's URL
  };
  
  app.use(cors(corsOptions));

app.use(express.json())


app.use((req,res,next)=>{
    console.log(req.path,req.method)
    next()
})
//routes


//connect to DB
mongoose.connect('mongodb+srv://laylathabet:iwant28.@cluster0.vv8gqjs.mongodb.net/?retryWrites=true&w=majority')
.then(()=>{
    // listen for req
app.listen(4000,()=>{
    console.log('Connected to DB & listenening on port 4000')
})

})
.catch((error)=>{
    console.log(error)
})
app.use(express.json())
app.post("/createAdmin",createAdmin);
app.post("/register/doctor",createDoctor);
app.put("/updateDoctor",updateDoctor);
app.post("/register/patient",createPatient);
app.get("/getDocpatients", getDocPatients);
app.get("/getDoctors",getDoctors);
app.get("/getPatients",getPatients);
app.get("/getAdmins",getAdmin)
app.post("/addFamilyMember",createMember);
app.delete("/deleteDoctor",deleteDoctor);
app.patch("/ubdateDoctor",updateDoctor);
app.get("/getFamilyMem",getFamilyMembers);
app.get("/searchPatientsByName",searchPatientsByName);
app.post("/addPatientToDr",addPatientToDr);
app.post("/addPrescription",createPrescription);
app.get("/getPrescriptions",getPrescriptionsForPatient);
app.get("/getMyPrescriptions",getMyPrescriptions);
app.post("/createRequest",createRequest);
app.post("/createPackage",createHealthPackage);
app.get("/getPackages",getPackages);
app.put("/updatePackage",updateHealthPackage);
app.delete("/deletePackage",deleteHealthPackage);
app.get("/getDoctor",getDoctorByUsername);

app.post("/createAppointment",createAppointment);
app.get("/getAllAppointments",getAllAppointments);
app.get("/filterAppointments",filter);

//app.put("/updateUser", updateUser);

