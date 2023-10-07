
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Home from './pages/home';

import DoctorRegistrationForm  from './pages/DoctorRegPage';
import DoctorDashboard from './components/DoctorDashboard';
import PatientRegistrationForm  from './pages/PatientRegPage';
import PatientDashboard from './pages/PatientDashboard';
import UserSelection from './components/UserSelection';
import FamilyMemberForm from './components/FamilyMemberForm';

// Import your components


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<UserSelection/>}/>
          <Route path="/register/doctor"  element={<DoctorRegistrationForm/>} />
          <Route path="/register/patient"  element={<PatientRegistrationForm/>} />
          <Route path="/dashboard/patient/:username" component={PatientDashboard} />
          <Route path="/dashboard/doctor/:username" component={DoctorDashboard} />
          <Route path="/addFamilyMember"  element={<FamilyMemberForm/>} />
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}


export default App;
