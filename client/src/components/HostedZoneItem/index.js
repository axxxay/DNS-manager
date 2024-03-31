import { Link } from "react-router-dom"
import Cookies from 'js-cookie'
import Popup from 'reactjs-popup'
import { IoMdClose } from 'react-icons/io'


const HostedZoneItem = ({ zone, getHostedZones }) => {

    const handleDeleteHostedZone = async () => {
        const url = `${process.env.REACT_APP_API_URL}/dns/delete-hosted-zone/${zone.Id.slice(12)}`
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('jwtToken')}`
            }
        }
        const response = await fetch(url, options)
        const data = await response.json()
        if(response.ok === true) {
            if(data.error) {
                alert(data.error)
                return
            }
            alert('Hosted Zone deleted successfully')
            // window.location.reload()
            getHostedZones()
        } else {
            alert(data.error)
        }
    }

    const renderPopup = (close) => {
        return (
            <div className="create-hosted-zone-popup">
                <label htmlFor="domain" className="homepage-label">Do You Want To Delete This Hosted Zone?</label>
                <div className='hosted-zone-popup-buttons'>
                    <button className='hosted-zone-popup-button' onClick={handleDeleteHostedZone}>Yes</button>
                    <button className='hosted-zone-popup-button' onClick={close}>No</button>
                </div>
                <button className='create-hosted-zone-close-btn' onClick={close}>
                    <IoMdClose className="close-btn" />
                </button>
            </div>
        )
    }

    return (
        <tr className='hosted-zones-table-row'>
            <td className='hosted-zones-table-body-cell'>
                <Link className="active-cell" to={`/hosted-zones/${zone.Id.slice(12)}`}>
                    {zone.Name}
                </Link>
            </td>
            <td className='hosted-zones-table-body-cell'>{zone.Config.PrivateZone ? "Private" : "Public"}</td>
            <td className='hosted-zones-table-body-cell'>{zone.ResourceRecordSetCount}</td>
            <td className='hosted-zones-table-body-cell'>{zone.Config.Comment}</td>
            <td className='hosted-zones-table-body-cell'>{zone.Id.slice(12)}</td>
            <td className='hosted-zones-table-body-cell'>
                <Popup trigger={<button className='hosted-zones-table-button' onClick={handleDeleteHostedZone}>Delete</button>}>
                    {close => renderPopup(close)}
                </Popup>
            </td>
        </tr>
    )
}

export default HostedZoneItem