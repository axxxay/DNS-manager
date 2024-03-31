import { useState } from 'react'
import './style.css'

const SignUpForm = ({handleToggleForms}) => {

    const [signUpData, setSignUpData] = useState({ username: '', email: '', password: '' })
    const [error, setError] = useState('')

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setSignUpData({ ...signUpData, [name]: value })
    }

    const handleSignUp = async (e) => {
        e.preventDefault()
        if (!signUpData.username || !signUpData.email || !signUpData.password) {
            setError('*Please enter username, email and password')
            return
        } 
        setError('')
        const url = process.env.REACT_APP_API_URL + '/api/register'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signUpData)
        }
        const response = await fetch(url, options);
        const data = await response.json();
        if(response.ok === true) {
            if(data.error) {
                setError("* "+data.error)
                return
            }
            setError('')
            handleToggleForms()
        } else {
            setError("* "+data.error)
        }
    }

    return (
        <form className="homepage-form" onSubmit={handleSignUp}>
            <h3 className="homepage-form-title">Sign Up</h3>
            <label htmlFor="username" className="homepage-label">USERNAME</label>
            <input type="text" id="username" name="username" className='homepage-input' placeholder='Username' value={signUpData.userName} onChange={handleInputChange} />
            <label htmlFor="email" className="homepage-label">EMAIL</label>
            <input type="email" id="email" name="email" className='homepage-input' placeholder='example@mail.com' value={signUpData.email} onChange={handleInputChange} />
            <label htmlFor="password" className="homepage-label">PASSWORD</label>
            <input type="password" id="password" name="password" className='homepage-input' placeholder='Password' value={signUpData.password} onChange={handleInputChange} />
            {error && <p className='error-message'>{error}</p>}
            <button type="submit" className='homepage-button'>Sign up</button>
            <p className='homepage-link'>Already have an account? <span className='homepage-span' onClick={() => handleToggleForms()}>Login here</span></p>
        </form>
    )
}

export default SignUpForm