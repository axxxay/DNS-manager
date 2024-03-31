import { useState } from 'react'
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import './style.css'

const LoginForm = ({handleToggleForms}) => {

    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setLoginData({ ...loginData, [name]: value })
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        if (!loginData.email || !loginData.password) {
            setError('*Please enter username, email and password')
            return
        } 
        setError('')
        const url = process.env.REACT_APP_API_URL + '/api/login'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        }
        const response = await fetch(url, options);
        const data = await response.json();
        if(response.ok === true) {
            if(data.error) {
                setError("* "+data.error)
                return
            }
            setError('')
            Cookies.set('jwtToken', data.jwtToken)
            navigate('/hosted-zones')
            window.location.reload();
        } else {
            setError("* "+data.error)
        }
    }

    return (
        <form className="homepage-form" onSubmit={handleLogin}>
            <h3 className="homepage-form-title">Login</h3>
            <label htmlFor="email" className="homepage-label">EMAIL</label>
            <input type="email" id="email" name="email" className='homepage-input' placeholder='example@mail.com' value={loginData.email} onChange={handleInputChange} />
            <label htmlFor="password" className="homepage-label">PASSWORD</label>
            <input type="password" id="password" name="password" className='homepage-input' placeholder='Password' value={loginData.password} onChange={handleInputChange} />
            {error && <p className='error-message'>{error}</p>}
            <button type="submit" className='homepage-button'>Login</button>
            <p className='homepage-link'>Don't have an account? <span className='homepage-span' onClick={() => handleToggleForms()}>Register here</span></p>
        </form>
    )
}

export default LoginForm