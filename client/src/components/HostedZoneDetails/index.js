import { useParams } from 'react-router-dom'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import Popup from 'reactjs-popup'
import RecordItem from '../RecordItem'
import './style.css'
import CreateRecordPopup from '../CreateRecordPopup'
import UploadCSVFile from '../UploadCSVFile'

const apiStatusConstants = {
    initial: 'INITIAL',
    inProgress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE'
}

const HostedZoneDetails = () => {

    const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial)
    const [hostedZone, setHostedZone] = useState({})
    const [hostedZoneRecords, setHostedZoneRecords] = useState([])
    const { id } = useParams()

    useEffect(() => {
        getHostedZoneDetails(id)
        getHostedZoneRecords(id)
    }, [id])


    const getHostedZoneDetails = async (hostedZoneId) => {
        const url = `${process.env.REACT_APP_API_URL}/dns/hosted-zone-details/${hostedZoneId}`
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
        console.log(data)
        if(response.ok === true) {
            if(data.error) {
                setApiStatus(apiStatusConstants.failure)
                return
            }
            setApiStatus(apiStatusConstants.success)
            setHostedZone(data)
        } else {
            setApiStatus(apiStatusConstants.failure)
        }
    }

    const getHostedZoneRecords = async (hostedZoneId) => {
        const url = `${process.env.REACT_APP_API_URL}/dns/all-records/${hostedZoneId}`
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('jwtToken')}`
            }
        }
        // setApiStatus(apiStatusConstants.inProgress)
        const response = await fetch(url, options)
        const data = await response.json()
        console.log(data)
        if(response.ok === true) {
            if(data.error) {
                // setApiStatus(apiStatusConstants.failure)
                return
            }
            // setApiStatus(apiStatusConstants.success)
            setHostedZoneRecords(data.ResourceRecordSets)
        } else {
            // setApiStatus(apiStatusConstants.failure)
        }
    }

    const renderHostedZoneDetails = () => (
        <div className='hosted-zone-details-con'>
            <h1 className="hosted-zone-details-title">Hosted Zone Details</h1>
            <div className='hosted-zone-details-sub'>
                <div className='hosted-zone-details'>
                    <p className='hosted-zone-details-label'>Domain name:</p>
                    <p className='hosted-zone-details-value'>{hostedZone.Name}</p>
                </div>
                <div className='hosted-zone-details'>
                    <p className='hosted-zone-details-label'>Record type:</p>
                    <p className='hosted-zone-details-value'>{hostedZone.Config.PrivateZone ? "Private" : "Public"}</p>
                </div>
            </div>
            <div className='hosted-zone-details-sub'>
                <div className='hosted-zone-details'>
                    <p className='hosted-zone-details-label'>Resource Record Set Count:</p>
                    <p className='hosted-zone-details-value'>{hostedZone.ResourceRecordSetCount}</p>
                </div>
                <div className='hosted-zone-details'>
                    <p className='hosted-zone-details-label'>Description:</p>
                    <p className='hosted-zone-details-value'>{hostedZone.Config.Comment}</p>
                </div>
            </div>
            <div className='hosted-zone-details'>
                <p className='hosted-zone-details-label'>Hosted zone Id:</p>
                <p className='hosted-zone-details-value'>{hostedZone.Id.slice(12)}</p>
            </div>
        </div>
    )

    const renderSwitch = () => {
        switch(apiStatus) {
            case apiStatusConstants.inProgress:
                return <p>Loading...</p>
            case apiStatusConstants.success:
                return renderHostedZoneDetails()
            case apiStatusConstants.failure:
                return <p>Failed to fetch hosted zone details</p>
            default:
                return null;
        }
    }

    return (
        <div className="hosted-zone-details-container">
            
            {renderSwitch()}
            <div className='hosted-zones-buttons'>
                <p className='hosted-zones-count'>Records ({hostedZoneRecords.length})</p>
                
                <div>
                    <Popup trigger={<button className='hosted-zones-button' style={{marginRight: '5px'}}>Upload .csv file</button>}>
                        {close => (
                            <UploadCSVFile close={close} getHostedZoneRecords={getHostedZoneRecords} domain={hostedZone.Name} hostedZoneId={id} />
                        )}
                    </Popup>
                    <Popup trigger={<button className='hosted-zones-button'>Create record</button>}>
                        {close => (
                            <CreateRecordPopup close={close} getHostedZoneRecords={getHostedZoneRecords} domain={hostedZone.Name} hostedZoneId={id} />
                        )}
                    </Popup>
                </div>
            </div>
            <div className='hosted-zones-content' style={{position: "relative"}}>
                <table className='hosted-zones-table' >
                    <thead className='hosted-zones-table-head'>
                        <tr className='hosted-zones-table-row'>
                            <th className='hosted-zones-table-head-cell'>Record Name</th>
                            <th className='hosted-zones-table-head-cell'>Type</th>
                            <th className='hosted-zones-table-head-cell'>Value</th>
                            <th className='hosted-zones-table-head-cell'>TTL</th>
                            <th className='hosted-zones-table-head-cell'>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='hosted-zones-table-body'>
                        {hostedZoneRecords.map(zone => (
                            <RecordItem key={zone.Name} domain={hostedZone.Name} getHostedZoneRecords={getHostedZoneRecords} record={zone} hostedZoneId={id} />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default HostedZoneDetails