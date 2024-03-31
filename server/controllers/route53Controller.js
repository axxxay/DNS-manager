const route53Service = require('../services/route53Service');

const createHostedZone = async (req, res) => {
    const domain = req.body;
    try {
        const newHostedZone = await route53Service.createHostedZone(domain);
        res.status(201).json(newHostedZone);
      } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
      }
}

const getAllHostedZones = async (req, res) => {
    try {
        const hostedZones = await route53Service.getAllHostedZones();
        res.status(200).json(hostedZones);
      } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
      }
}

const getHostedZoneDetails = async (req, res) => {
    const hostedZoneId = req.params.hostedZoneId;
    try {
        const hostedZoneDetails = await route53Service.getHostedZoneDetails(hostedZoneId);
        res.status(200).json(hostedZoneDetails);
      } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
      }
}

const deleteHostedZone = async (req, res) => {
    const hostedZoneId = req.params.hostedZoneId;
    try {
        const deletedHostedZone = await route53Service.deleteHostedZone(hostedZoneId);
        res.status(200).json(deletedHostedZone);
      } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
      }
}

const createRecord = async (req, res) => {
    const record = req.body;
    const hostedZoneId = req.params.hostedZoneId;
    try {
        const newRecord = await route53Service.createRecord(record, hostedZoneId);
        res.status(201).json(newRecord);
      } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
      }
}

const bulkCreateRecords = async (req, res) => {
    const file = req.file;
    const hostedZoneId = req.params.hostedZoneId;
    try {
        const newRecords = await route53Service.bulkCreateRecords(file, hostedZoneId);
        res.status(201).json(newRecords);
      } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
      }
}

const updateRecord = async (req, res) => {
    const hostedZoneId = req.params.hostedZoneId;
    const record = req.body;
    try {
        const updatedRecord = await route53Service.updateRecord(record, hostedZoneId);
        res.status(200).json(updatedRecord);
      } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
      }
}

const deleteRecord = async (req, res) => {
    const hostedZoneId = req.params.hostedZoneId;
    const record = req.body;
    try {
        const deletedRecord = await route53Service.deleteRecord(record, hostedZoneId);
        res.status(200).json(deletedRecord);
      } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
      }
}

const getRecordDetails = async (req, res) => {
    const record = req.params;
    try {
        const recordDetails = await route53Service.getRecordDetails(record);
        res.status(200).json(recordDetails);
      } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
      }
}

const getAllRecords = async (req, res) => {
    const hostedZoneId = req.params.hostedZoneId;
    try {
        const records = await route53Service.getAllRecords(hostedZoneId);
        res.status(200).json(records);
      } catch (error) {
        res.status(error.statusCode || 500).json({ error: error.message });
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