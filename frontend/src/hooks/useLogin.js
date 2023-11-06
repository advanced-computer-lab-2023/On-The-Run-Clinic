import { useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { useNavigate } from 'react-router-dom';


export const useLogin = () => {
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(null)
  const { dispatch } = useAuthContext()
  const navigate = useNavigate();

  const login = async (username, password) => {
    setIsLoading(true)
    setError(null)

    const response = await fetch(`http://localhost:4000/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ username, password })
    })
    const json = await response.json()
    const usernamee=json.username;
    const role=json.role;

    if (!response.ok) {
      setIsLoading(false)
      setError(json.error)
    }
    if (response.ok) {
      // save the user to local storage
      localStorage.setItem('user', JSON.stringify(json))

      // update the auth context
      dispatch({type: 'LOGIN', payload: json})
      if (json.role === 'patient') {
        navigate(`/dashboard/patient/${username}`);
      }else if(json.role === 'doctor'){
        navigate(`/dashboard/doctor/${username}`);

      }
       else {
        navigate('/dashboard/admin');
      }

      // update loading state
      setIsLoading(false)

    }
  }

  return { login, isLoading, error }
}