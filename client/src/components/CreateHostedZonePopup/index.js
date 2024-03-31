import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import Cookies from 'js-cookie'
import './style.css'

const CreateHostedZonePopup = ({close, getHostedZones}) => {

    const [hostedZoneData, setHostedZoneData] = useState({ domainName: '', comment: '' })
    const [error, setError] = useState('')

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setHostedZoneData({ ...hostedZoneData, [name]: value })
    }

    const handleCreateHostedZone = async (e) => {
        e.preventDefault()
        const domainRegex = /^([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.)+[a-zA-Z]{2,}$/;
        if (!domainRegex.test(hostedZoneData.domainName)) {
            setError('*Please enter a valid domain name')
            return
        }
        setError('')
        console.log(hostedZoneData)
        const url = process.env.REACT_APP_API_URL + '/dns/create-hosted-zone'
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('jwtToken')}`
            },
            body: JSON.stringify(hostedZoneData)
        }
        const response = await fetch(url, options);
        const data = await response.json();
        if(response.ok === true) {
            if(data.error) {
                setError("* "+data.error)
                return
            }
            setError('')
            close()
            // window.location.reload()
            getHostedZones()
        } else {
            setError("* "+data.error)
        }
    }

    return (
        <form className="create-hosted-zone-popup" onSubmit={handleCreateHostedZone}>
            <h1 className="create-hosted-zone-title">Create Hosted Zone</h1>
            <label htmlFor="domain" className="homepage-label">DOMAIN NAME</label>
            <input type="text" id="domain" name="domainName" className='homepage-input' placeholder='example.com' value={hostedZoneData.domainName} onChange={handleInputChange}/>
            <label htmlFor="comment" className="homepage-label">DESCRIPTION - (optional)</label>
            <input type="text" id="comment" name="comment" className='homepage-input' placeholder='Comment' value={hostedZoneData.comment} onChange={handleInputChange}/>
            {error && <p className='error-message'>{error}</p>}
            <button type="submit" className='homepage-button'>Create</button>
            <button className='create-hosted-zone-close-btn' onClick={close}>
                <IoMdClose className="close-btn" />
            </button>
        </form>
    )
}

export default CreateHostedZonePopup