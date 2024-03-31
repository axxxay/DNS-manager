import Cookies from 'js-cookie';
import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';


const CreateRecordPopup = ({close, hostedZoneId, domain, getHostedZoneRecords}) => {

    const [recordData, setRecordData] = useState({ name: '', recordType: 'A', value: '', ttl: '' })
    const [error, setError] = useState('')

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setRecordData({ ...recordData, [name]: value })
    }

    const handleCreateRecord = async (e) => {
        e.preventDefault()

        if (!recordData.name || !recordData.recordType || !recordData.value || !recordData.ttl) {
            setError('*Please enter all fields')
            return
        }

        if(recordData.name.match(/[^a-zA-Z0-9.-]/)) {
            setError('*Please enter a valid record name')
            return
        }

        const valueArr1 = recordData.value.split(/\n|,/);
        const valueArr2 = valueArr1.map(val => val.trim())

        if (recordData.recordType === 'A' && !recordData.value.match(/^(\d{1,3}\.){3}\d{1,3}$/)) {
            setError('*Please enter a valid IPv4 address')
            return
        }

        if (recordData.recordType === 'AAAA' && !recordData.value.match(/^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/)) {
            setError('*Please enter a valid IPv6 address')
            return
        }

        if (recordData.recordType === 'CNAME' && !valueArr2.every(val => /^([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.)+[a-zA-Z]{2,}$/.test(val))) {
            setError('*Please enter a valid domain name')
            return
        }

        if (recordData.recordType === 'MX' && !recordData.value.match(/^\d{1,3} [a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.$/)) {
            setError('*Please enter a valid MX record')
            return
        }

        // if (recordData.recordType === 'NS' && !recordData.value.match(/^([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.)+[a-zA-Z]{2,}$/)) {
        //     setError('*Please enter a valid domain name')
        //     return
        // }

        if (recordData.recordType === 'PTR' && !valueArr2.every(val => /^([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.)+[a-zA-Z]{2,}$/.test(val))) {
            setError('*Please enter a valid domain name')
            return
        }

        if (recordData.recordType === 'SOA' && !recordData.value.match(/^([a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.)+[a-zA-Z]{2,} [a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\. \d{10} \d{10} \d{10} \d{10} \d{10}$/)) {
            setError('*Please enter a valid SOA record')
            return
        }

        if (recordData.recordType === 'SPF' && !recordData.value.match(/^".*"$/)) {
            setError('*Please enter a valid SPF record')
            return
        }

        if (recordData.recordType === 'SRV' && !recordData.value.match(/^\d{1,5} \d{1,5} \d{1,5} [a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.$/)) {
            setError('*Please enter a valid SRV record')
            return
        }

        if (recordData.recordType === 'TXT' && !recordData.value.match(/^".*"$/)) {
            setError('*Please enter a valid TXT record')
            return
        }

        if(recordData.ttl < 60 || recordData.ttl > 172800) {
            setError('*Please enter a valid TTL value between 60 and 172800')
            return
        }

        setError('')
        const valueArr = recordData.value.split(/\n|,/);
        const value = valueArr.map(val => ({Value: val.trim()}))

        const updateRecord = {...recordData, name: domain === recordData.name ? domain : recordData.name + '.' + domain.slice(0, domain.length - 1) + ".", value}
        console.log(updateRecord)
        // return
        const url = process.env.REACT_APP_API_URL + '/dns/create-record/' + hostedZoneId
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('jwtToken')}`
            },
            body: JSON.stringify(updateRecord)
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
            getHostedZoneRecords(hostedZoneId)
        } else {
            setError("* "+data.error)
        }
    }
    
    return (
        <form className="create-hosted-zone-popup" onSubmit={handleCreateRecord}>
            <h1 className="create-hosted-zone-title">Create Record</h1>
            <label htmlFor="name" className="homepage-label">RECORD NAME</label>
            <div className='homepage-input-con'>
                <input type="text" style={recordData.name === domain ? {width: '100%'} : {}} id="name" name="name" className='edit-input' disabled={recordData.name === domain} placeholder='subdomain' value={recordData.name} onChange={handleInputChange}/>
                {recordData.name !== domain && <p className='homepage-input-con-text'>.{domain.slice(0, domain.length - 1)}</p>}
            </div>
            <label htmlFor="recordType" className="homepage-label">RECORD TYPE</label>
            <select id="recordType" name="recordType" className='homepage-input' value={recordData.recordType} onChange={handleInputChange}>
                <option value="A">A</option>
                <option value="AAAA">AAAA</option>
                <option value="CNAME">CNAME</option>
                <option value="MX">MX</option>
                <option value="NS">NS</option>
                <option value="PTR">PTR</option>
                <option value="SOA">SOA</option>
                <option value="SPF">SPF</option>
                <option value="SRV">SRV</option>
                <option value="TXT">TXT</option>
            </select>
            <label htmlFor="value" className="homepage-label">VALUE</label>
            <textarea id="value" style={{maxWidth: "100%", minHeight: "100px"}} name="value" className='homepage-input' placeholder='value' value={recordData.value} onChange={handleInputChange}></textarea>
            <p className='homepage-input-con-text-info'>Enter multiple values separated by comma (,) or new line</p>
            <label htmlFor="ttl" className="homepage-label">TTL</label>
            <input type="number" id="ttl" name="ttl" className='homepage-input' placeholder='time to live' value={recordData.ttl} onChange={handleInputChange}/>

            
            {error && <p className='error-message'>{error}</p>}
            <button type="submit" className='homepage-button'>Create</button>
            <button className='create-hosted-zone-close-btn' onClick={close}>
                <IoMdClose className="close-btn" />
            </button>
        </form>
    );
};

export default CreateRecordPopup;