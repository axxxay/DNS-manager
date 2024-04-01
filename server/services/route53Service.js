const csvtojson = require('csvtojson');
const route53 = require('../config/route53');
require('dotenv').config();


const createHostedZone = async (domain) => {
    const { domainName, comment } = domain;
    try {
        // Check if hosted zone already exists
        const hostedZones = await route53.listHostedZones().promise();
        const hostedZoneExists = hostedZones.HostedZones.some(
            (hostedZone) => hostedZone.Name === `${domainName}.`
        );

        if (hostedZoneExists) {
            const error = new Error(`Hosted zone with name ${domainName} already exists.`);
            error.statusCode = 400;
            throw error;
        }

        const params = {
            CallerReference: Date.now().toString(),
            Name: domainName,
            HostedZoneConfig: {
                Comment: comment,
                PrivateZone: false
            }
        };
        const data = await route53.createHostedZone(params).promise();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getAllHostedZones = async () => {
    try {
        const data = await route53.listHostedZones().promise();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getHostedZoneDetails = async (hostedZoneId) => {
    try {
        const hostedZones = await route53.listHostedZones().promise();
        const hostedZoneDetails = hostedZones.HostedZones.find(
            (hostedZone) => hostedZone.Id.slice(12) === hostedZoneId
        );
        if (!hostedZoneDetails) {
            const error = new Error(`Hosted zone with Id ${hostedZoneId} does not exist.`);
            error.statusCode = 400;
            throw error;
        }

        return hostedZoneDetails;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const deleteHostedZone = async (hostedZoneId) => {
    try {
        const hostedZones = await route53.listHostedZones().promise();
        const hostedZoneExists = hostedZones.HostedZones.some(
            (hostedZone) => hostedZone.Id.slice(12) === hostedZoneId
        );

        console.log(hostedZones)
        if (!hostedZoneExists) {
            const error = new Error(`Hosted zone with ID ${hostedZoneId} does not exist.`);
            error.statusCode = 400;
            throw error;
        }

        const params = {
            Id: hostedZoneId
        };
        const data = await route53.deleteHostedZone(params).promise();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const getAllRecords = async (hostedZoneId) => {
    try {
        const params = {
            HostedZoneId: hostedZoneId
        };
        const data = await route53.listResourceRecordSets(params).promise();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const createRecord = async (record, hostedZoneId) => {
    try {
        const { recordType, name, value, ttl } = record;

        const recordSets = await route53.listResourceRecordSets({ HostedZoneId: hostedZoneId }).promise();
        const recordExists = recordSets.ResourceRecordSets.filter(
            (recordSet) => recordSet.Name === name && recordSet.Type === recordType
        );

        if (recordExists.length > 0) {
            const error = new Error(`Record with name ${name} and type ${recordType} already exists.`);
            error.statusCode = 400;
            throw error;
        }

        const params = {
            HostedZoneId: hostedZoneId,
            ChangeBatch: {
                Changes: [
                    {
                        Action: 'CREATE',
                        ResourceRecordSet: {
                            Name: name,
                            Type: recordType,
                            TTL: ttl,
                            ResourceRecords: value
                        }
                    }
                ]
            }
        };
        const data = await route53.changeResourceRecordSets(params).promise();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const bulkCreateRecords = async (file, hostedZoneId) => {
    try {
        if (!file) {
            const error = new Error('No file uploaded!');
            error.statusCode = 400;
            throw error;
        }

        // Extract data from CSV file using csvtojson library
        const csvData = await csvtojson().fromString(file.buffer.toString());

        for (const record of csvData) {
            // Validate record fields (name, type, value, ttl)
            console.log(record)
            if (!record.name || !record.type || !record.value || !record.ttl) {
                const error = new Error('Invalid record data in CSV file!');
                error.statusCode = 400;
                throw error;
            }
        }

        // Create DNS records for each entry in csvData
        for (const record of csvData) {
            const valueArr = record.value.split(',');
            record.value = valueArr.map((value) => ({ Value: value.trim() }));
            const params = {
                HostedZoneId: hostedZoneId,
                ChangeBatch: {
                    Changes: [
                        {
                            Action: 'CREATE',
                            ResourceRecordSet: {
                                Name: record.name,
                                Type: record.type,
                                TTL: parseInt(record.ttl),
                                ResourceRecords: record.value
                            }
                        }
                    ]
                }
            };

            await route53.changeResourceRecordSets(params).promise();
        }

        return { success: true, message: 'DNS records created successfully' };
    } catch (error) {
        console.error('Error processing CSV file:', error);
        throw error;
    }
}

const updateRecord = async (record, hostedZoneId) => {
    try {
        const { recordType, name, value, ttl } = record;

        const recordSets = await route53.listResourceRecordSets({ HostedZoneId: hostedZoneId }).promise();
        const recordExists = recordSets.ResourceRecordSets.some(
            (recordSet) => recordSet.Name === name && recordSet.Type === recordType
        );

        if (!recordExists) {
            const error = new Error(`Record with name ${name} and type ${recordType} does not exist.`);
            error.statusCode = 400;
            throw error;
        }

        const params = {
            HostedZoneId: hostedZoneId,
            ChangeBatch: {
                Changes: [
                    {
                        Action: 'UPSERT',
                        ResourceRecordSet: {
                            Name: name,
                            Type: recordType,
                            TTL: ttl,
                            ResourceRecords: value
                        }
                    }
                ]
            }
        };
        const data = await route53.changeResourceRecordSets(params).promise();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const deleteRecord = async (record, hostedZoneId) => {
    try {
        const { recordType, name, value, ttl } = record;

        const recordSets = await route53.listResourceRecordSets({ HostedZoneId: hostedZoneId }).promise();
        const recordExists = recordSets.ResourceRecordSets.some(
            (recordSet) => recordSet.Name === name && recordSet.Type === recordType
        );

        if (!recordExists) {
            const error = new Error(`Record with name ${name} and type ${recordType} does not exist.`);
            error.statusCode = 400;
            throw error;
        }

        const params = {
            HostedZoneId: hostedZoneId,
            ChangeBatch: {
                Changes: [
                    {
                        Action: 'DELETE',
                        ResourceRecordSet: {
                            Name: name,
                            Type: recordType,
                            TTL: ttl,
                            ResourceRecords: value
                        }
                    }
                ]
            }
        };
        const data = await route53.changeResourceRecordSets(params).promise();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const getRecordDetails = async (record) => {
    try {
        const { recordType, name, hostedZoneId } = record;

        const recordSets = await route53.listResourceRecordSets({ HostedZoneId: hostedZoneId }).promise();
        const recordDetails = recordSets.ResourceRecordSets.find(
            (recordSet) => recordSet.Name === name && recordSet.Type === recordType
        );

        if (!recordDetails) {
            const error = new Error(`Record with name ${name} and type ${recordType} does not exist.`);
            error.statusCode = 400;
            throw error;
        }

        return recordDetails;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    createHostedZone,
    getAllHostedZones,
    getHostedZoneDetails,
    deleteHostedZone,
    createRecord,
    bulkCreateRecords,
    updateRecord,
    deleteRecord,
    getRecordDetails,
    getAllRecords
}