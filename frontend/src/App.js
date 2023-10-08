
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/home';

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



// Import your components


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<UserSelection/>}/>
<<<<<<< HEAD
          <Route path="/viewFamilyMembers/:username" element={<FamilyMembersList/>}/>
          
          <Route path="/viewMyPatients/:username" element={<MyPatients/>}/>
=======
 

           {/* <Route path="/createAdmin" element={<createAdmin/>}/>  */}
          <Route path="/createAdmin" element={<AdminRegistrationForm/>}/>

          <Route path="/viewFamilyMembers/:username" element={<MyPatients/>}/>
          
          
>>>>>>> e34665a352c699e51b7e1bdd1d1f9bb07a8d0e6b
          <Route path="/searchPatientsByName"  element={<SearchPatientByName/>} />
         


          <Route path="/register/doctor"  element={<DoctorRegistrationForm/>} />
          <Route path="/register/patient"  element={<PatientRegistrationForm/>} />

          <Route path="/dashboard/patient/:username" element={<PatientDashboard/>} />
          <Route path="/dashboard/doctor/:username" element={<DoctorDashboard/>} />
          <Route path="/addFamilyMember/:username"  element={<FamilyMemberForm/>} />

          <Route path="/dashboard/patient/:username" element={<PatientDashboard/>} />
          <Route path="/dashboard/doctor/:username" element={<DoctorDashboard/>} />

          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}


export default App;
