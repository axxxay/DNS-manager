import Popup from 'reactjs-popup'
import { IoMdClose, IoMdArrowDropdown } from 'react-icons/io'
import Cookies from 'js-cookie'
import './style.css'
import { useState } from 'react'
import EditRecordPopup from '../EditRecordPopup'

const RecordItem = ({ record, domain, hostedZoneId, getHostedZoneRecords }) => {

    const [showActions, setShowActions] = useState(false)

    const onClickButton = () => {
        setShowActions(!showActions)
    }


    const handleDeleteRecord = async () => {
        const url = `${process.env.REACT_APP_API_URL}/dns/delete-record/${hostedZoneId}`
        const body = {
            name: record.Name,
            recordType: record.Type,
            value: record.ResourceRecords,
            ttl: record.TTL
        }

        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('jwtToken')}`
            },
            body: JSON.stringify(body)
        }
        const response = await fetch(url, options)
        const data = await response.json()
        if(response.ok === true) {
            if(data.error) {
                alert(data.error)
                return
            }
            alert('Record deleted successfully')
            // window.location.reload()
            getHostedZoneRecords(hostedZoneId)
        } else {
            alert(data.error)
        }
    }


    const renderDeletePopup = (close) => {
        return (
            <div className="create-hosted-zone-popup">
                <label htmlFor="domain" className="homepage-label">Do You Want To Delete This Record?</label>
                <div className='hosted-zone-popup-buttons'>
                    <button className='hosted-zone-popup-button' onClick={handleDeleteRecord}>Yes</button>
                    <button className='hosted-zone-popup-button' onClick={close}>No</button>
                </div>
                <button className='create-hosted-zone-close-btn' onClick={close}>
                    <IoMdClose className="close-btn" />
                </button>
            </div>
        )
    }
    return (
        <tr className='hosted-zones-table-row' >
            <td className='hosted-zones-table-body-cell'>{record.Name}</td>
            <td className='hosted-zones-table-body-cell'>{record.Type}</td>
            <td className='hosted-zones-table-body-cell'>
                {record.ResourceRecords.map((resourceRecord, index) => {
                    return (
                        <p key={index}>{resourceRecord.Value}</p>
                    )
                })}
            </td>
            <td className='hosted-zones-table-body-cell'>{record.TTL}</td>
            <td className='hosted-zones-table-body-cell'>
                <button className='hosted-zones-table-actions-select' onClick={onClickButton}>
                    <p>Actions</p>
                    <IoMdArrowDropdown className='hosted-zones-table-actions-icon' />
                </button>
                {
                    showActions && (
                        <div className='hosted-zones-table-actions'>
                            <Popup trigger={<button className='table-button' onClick={onClickButton}>Edit</button>}>
                                {close => (
                                    <EditRecordPopup record={record} domain={domain} close={close} hostedZoneId={hostedZoneId} getHostedZoneRecords={getHostedZoneRecords} />
                                )}
                            </Popup>
                            <Popup trigger={<button className='table-button' onClick={onClickButton}>Delete</button>}>
                                {close => (
                                    renderDeletePopup(close)
                                )}
                            </Popup>
                        </div>
                    )
                }
            </td>
        </tr>
    )
}

export default RecordItem