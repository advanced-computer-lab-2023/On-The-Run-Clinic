
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/Navbar';

import DoctorRegistrationForm  from './pages/DoctorRegPage';
import DoctorDashboard from './components/DoctorDashboard';
import PatientRegistrationForm  from './pages/PatientRegPage';
import PatientDashboard from './pages/PatientDashboard';
import UserSelection from './components/UserSelection';
import AdminRegistrationForm from "./components/AdminRegistrationForm"
import FamilyMemberForm from './components/FamilyMemberForm';
import FamilyMembersList from './pages/viewMyFamilyMem';
import SearchPatientByName from './pages/SearchPatientsByName';
import MyPatients from './pages/MyPatients';
import MyPrescription from './pages/viewMyPrescriptions';
import DoctorListPage from './pages/viewDoctors';
import DeleteDoctorPage from './pages/DeleteDoctorPage';
import AdminHealthPackages from './pages/AdminHealthPackages';
import UpdateDoctorInfo from './pages/updateDoctor';
import ViewDoctorRequest from './pages/ViewDoctorRequest';
<<<<<<< HEAD
import FilterAppointments from './pages/FilterAppointments';
import AdminDashboard from './components/AdminDashboard';
import DeleteAdmin from './pages/DeleteAdminPage';
import DeletePatient from './pages/DeletePatientPAge';
=======
import PatientDetails from './components/PatientDetails';

>>>>>>> d72c857530c49137d152362fdf4b00e440263245

// Import your components


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <Routes>
          <Route path="/" element={<UserSelection/>}/>
          <Route path="/dashboard/admin" element={<AdminDashboard/>}/>
          <Route path="/updateDoctor/:username" element={<UpdateDoctorInfo/>}/>
          <Route path="/viewFamilyMembers/:username" element={<FamilyMembersList/>}/>

          <Route path="/healthPackages" element={<AdminHealthPackages/>}/>
          <Route path="/viewMyPatients/:username" element={<MyPatients/>}/>
          <Route path="/viewMyPrescription/:username" element={<MyPrescription/>}/>
          <Route path="/viewDoctors/:username" element={<DoctorListPage/>}/>

          <Route path="/addAdmin" element={<AdminRegistrationForm/>}/>
          <Route path="/getOneRequest" element={<ViewDoctorRequest/>}/>
          <Route path="/searchPatientsByName"  element={<SearchPatientByName/>} />
         <Route path="/getDoctors" element={<getDoctors/>}/>
          <Route path="/deleteDoctor" element={<DeleteDoctorPage/>} />
          <Route path="/deleteAdmin" element={<DeleteAdmin/>} />
          <Route path="/deletePatient" element={<DeletePatient/>} />
          <Route path="/register/doctor"  element={<DoctorRegistrationForm/>} />
          <Route path="/register/patient"  element={<PatientRegistrationForm/>} />
          <Route path="/dashboard/patient/:username" element={<PatientDashboard/>} />
          <Route path="/dashboard/doctor/:username" element={<DoctorDashboard/>} />
          <Route path="/addFamilyMember/:username"  element={<FamilyMemberForm/>} />
<<<<<<< HEAD
          <Route path="/filterAppointments" element={<FilterAppointments/>} />
=======
          <Route path="/patient-details/:username" element = {<PatientDetails />} />

>>>>>>> d72c857530c49137d152362fdf4b00e440263245
  

          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}


export default App;
