const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const rbacMiddleware = require('../middleware/rbac');
const { upload } = require('../middleware/upload');
const applicationController = require('../controllers/applicationController');

router.post('/', authMiddleware.protect, rbacMiddleware.authorize('Student'), upload.single('resume'), applicationController.createApplication);
router.get('/my-applications', authMiddleware.protect, rbacMiddleware.authorize('Student'), applicationController.getMyApplications);
router.get('/job/:jobId', authMiddleware.protect, rbacMiddleware.authorize('HR'), applicationController.getJobApplications);
router.get('/:id', authMiddleware.protect, applicationController.getApplicationById);
router.put('/:id/status', authMiddleware.protect, rbacMiddleware.authorize('HR'), applicationController.updateApplicationStatus);

module.exports = router;