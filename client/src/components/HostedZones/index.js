import { useEffect, useState } from 'react'
import Popup from 'reactjs-popup'
import Cookies from 'js-cookie'
import { IoSearchOutline } from "react-icons/io5";
import HostedZoneItem from '../HostedZoneItem'
import './style.css'
import CreateHostedZonePopup from '../CreateHostedZonePopup'

const apiStatusConstants = {
    initial: 'INITIAL',
    inProgress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE'
}

const HostedZones = () => {
    const [hostedZones, setHostedZones] = useState([])
    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const [searchInput, setSearchInput] = useState('')

    useEffect(() => {
        getHostedZones()
    }, [])

    const handleSearchInput = (e) => {
        setSearchInput(e.target.value)
    }

    const getHostedZones = async () => {
        const url = process.env.REACT_APP_API_URL + '/dns/all-hosted-zones'
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('jwtToken')}`
            }
        }
        setApiStatus(apiStatusConstants.inProgress)
        const response = await fetch(url, options)
        const data = await response.json()
        if(response.ok === true) {
            if(data.error) {
                setApiStatus(apiStatusConstants.failure)
                return
            }
            setApiStatus(apiStatusConstants.success)
            setHostedZones(data.HostedZones)
        } else {
            setApiStatus(apiStatusConstants.failure)
        }
    }
    
    const filteredHostedZones = hostedZones.filter(zone => {
        return zone.Name.toLowerCase().includes(searchInput.toLowerCase()) || zone.Id.slice(12).toLowerCase().includes(searchInput)
    })

    return (
        <div className="hosted-zones-container">
            <h1 className="hosted-zones-title">Hosted Zones</h1>
            <div className='search-bar'>
                <IoSearchOutline className='search-icon' />
                <input type='text' className='search-input' placeholder='Search by zone name or ID' value={searchInput} onChange={handleSearchInput} />
            </div>
            <div className='hosted-zones-buttons'>
                <p className='hosted-zones-count'>Hosted Zones ({hostedZones.length})</p>
                <Popup trigger={<button className='hosted-zones-button'>Create Hosted Zone</button>}>
                    {close => (
                        <CreateHostedZonePopup close={close} getHostedZones={getHostedZones} />
                    )}
                </Popup>
            </div>
            <div className='hosted-zones-content'>
                <table className='hosted-zones-table'>
                    <thead className='hosted-zones-table-head'>
                        <tr className='hosted-zones-table-row'>
                            <th className='hosted-zones-table-head-cell'>Zone Name</th>
                            <th className='hosted-zones-table-head-cell'>Type</th>
                            <th className='hosted-zones-table-head-cell'>Record Count</th>
                            <th className='hosted-zones-table-head-cell'>Description</th>
                            <th className='hosted-zones-table-head-cell'>Hosted zone ID</th>
                            <th className='hosted-zones-table-head-cell'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='hosted-zones-table-body'>
                        {filteredHostedZones.map(zone => (
                            <HostedZoneItem key={zone.Id} zone={zone} getHostedZones={getHostedZones} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default HostedZones