import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie'
import './style.css'
import LoginForm from '../LoginForm'
import SignUpForm from '../SignUpForm'

const HomePage = () => {

    const [toggleForms, setToggleForms] = useState(false)

    const handleToggleForms = () => {
        setToggleForms(!toggleForms)
    }

    const navigate = useNavigate();
    useEffect(() => {
        if(Cookies.get('jwtToken')) {
            navigate('/hosted-zones');
        }
    }, [navigate]);

    return (
        <div className="homepage-container">
            <div className="homepage-content">
                {
                    toggleForms ? <SignUpForm handleToggleForms={handleToggleForms} /> : <LoginForm handleToggleForms={handleToggleForms} />
                }
            </div>
            <div className="homepage-image">
                <img src="/homepage_bg.jpg" className='homepage-bg' alt="homgepage-dns-bg" />
            </div>
        </div>
    )
}

export default HomePage