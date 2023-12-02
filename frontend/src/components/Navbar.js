import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import { FaShoppingCart } from 'react-icons/fa';
import { FaBell } from 'react-icons/fa';

const Navbar = () => {
  const { logout } = useLogout()
  const { user } = useAuthContext()


  const handleClick = () => {
    console.log("userrrr"+user);
    logout()
  }

  return (
    <header>
      <div className="container">
        <Link to="/">
          <h1>Clinic</h1>
        </Link>
        <nav>
          {user && (
            <div>
              <span>{user.user}</span>

              {/* Link to Notifications Page */}
              <Link to={`/notifications/${user.user}`} className="notification-icon">
                <FaBell />
              </Link>

              <button onClick={handleClick}>Log out</button>
            </div>
          )}
          {!user && (
            <div>
              <Link to="/login">Login</Link>
              <Link to="/register/doctor">Signup as Doctor</Link>
              <Link to="/register/patient">Signup as Patient</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
export default Navbar