import { CgMenuRight } from "react-icons/cg";
import {Link} from 'react-router-dom'
import Cookies from "js-cookie";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import './style.css'


const NavBar = () => {
    const [menuOpen, setMenuOpen] = useState(false)

    const handleMenu = () => {
        setMenuOpen(!menuOpen)
    }

    const handleLogout = () => {
        Cookies.remove('jwtToken')
        window.location.href = '/'
    }

    return (
        <>
        <nav className="navbar">
            <h1 className="navbar-title"><Link to='/' className="link">DNS</Link></h1>
            <ul className="navbar-list">
                <li className="navbar-item"><Link to='/' className="link">Home</Link></li>
                {
                    Cookies.get('jwtToken') ? 
                    <>
                        <li className="navbar-item"><Link to='/hosted-zones' className="link">Hosted Zones</Link></li>
                        <li className="navbar-item">
                            <button className="navbar-button" onClick={handleLogout}>Logout</button>
                        </li>
                    </>
                    : null
                }
                
            </ul>
            <button className='menu-button' onClick={handleMenu}>
                {
                    menuOpen ? <IoMdClose className="menu-icon" /> : <CgMenuRight className="menu-icon" />
                }
            </button>
        </nav>
        {
            menuOpen && 
            <ul className="navbar-list-mobile">
                <li className="navbar-item"><Link to='/' className="link">Home</Link></li>
                {
                    Cookies.get('jwtToken') ? 
                    <>
                        <li className="navbar-item"><Link to='/hosted-zones' className="link">Hosted Zones</Link></li>
                        <li className="navbar-item">
                            <button className="navbar-button" onClick={handleLogout}>Logout</button>
                        </li>
                    </>
                    : null
                }
            </ul>
        }
        </>
    )
}

export default NavBar