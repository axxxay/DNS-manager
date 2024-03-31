const express = require('express');
const route53Controller = require('../controllers/route53Controller');
const authenticateToken = require('../middlewares/authenticationMiddleware');
const upload = require('../config/multerConfig');

const router = express.Router();

router.post('/create-hosted-zone', authenticateToken, route53Controller.createHostedZone);
router.get('/all-hosted-zones', authenticateToken, route53Controller.getAllHostedZones);
router.get('/hosted-zone-details/:hostedZoneId', authenticateToken, route53Controller.getHostedZoneDetails);
router.delete('/delete-hosted-zone/:hostedZoneId', authenticateToken, route53Controller.deleteHostedZone);
router.post('/create-record/:hostedZoneId', route53Controller.createRecord);
router.post('/upload-csv/:hostedZoneId', upload.single('file'), route53Controller.bulkCreateRecords);
router.put('/update-record/:hostedZoneId', authenticateToken, route53Controller.updateRecord);
router.delete('/delete-record/:hostedZoneId', authenticateToken, route53Controller.deleteRecord);
router.get('/record-details/:name/:recordType/:hostedZoneId', authenticateToken, route53Controller.getRecordDetails);
router.get('/all-records/:hostedZoneId', authenticateToken, route53Controller.getAllRecords);

module.exports = router;