import { IoMdClose } from 'react-icons/io'
import Cookies from 'js-cookie'
import { useState } from 'react';
import './style.css'

const UploadCSVFile = ({close, hostedZoneId, getHostedZoneRecords}) => {
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        if(e.target.files.length === 0) {
            return;
        }
        setFile(e.target.files[0]);
        console.log(e.target.files[0])
    };

    const uploadFile = async () => {
        if(file === null) {
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        const url = `${process.env.REACT_APP_API_URL}/dns/upload-csv/${hostedZoneId}`;
        const options = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${Cookies.get('jwtToken')}`
            },
            body: formData
        }
        const response = await fetch(url, options);
        const data = await response.json();
        
        if(response.ok === true) {
            if(data.error) {
                setError(data.error);
                return;
            }
            alert('Records created successfully');
            close();
            // window.location.reload();
            getHostedZoneRecords(hostedZoneId);
        } else {
            setError(data.error);
        }
    }

    return (
        <div className="create-hosted-zone-popup">
            <label htmlFor="domain" className="homepage-label">Upload .csv or json file</label>
            <input id='file' type="file" className='homepage-file-input' accept=".csv,.json" onChange={handleFileChange} />
            <label htmlFor="file" className="homepage-label-file">{file !== null ? file.name: "Upload a CSV file"}</label>
            {error && <p className='error-message'>{error}</p>}
            <div className='hosted-zone-popup-buttons'>
                <button className='hosted-zone-popup-button' onClick={uploadFile} >Upload</button>
                <button className='hosted-zone-popup-button' onClick={close}>Cancel</button>
            </div>
            <button className='create-hosted-zone-close-btn' onClick={close}>
                <IoMdClose className="close-btn" />
            </button>
        </div>
    )
}

export default UploadCSVFile;