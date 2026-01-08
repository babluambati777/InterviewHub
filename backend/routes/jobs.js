const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const rbacMiddleware = require('../middleware/rbac');
const jobController = require('../controllers/jobController');

router.post('/', authMiddleware.protect, rbacMiddleware.authorize('HR'), jobController.createJob);
router.get('/', authMiddleware.protect, jobController.getAllJobs);
router.get('/my-jobs', authMiddleware.protect, rbacMiddleware.authorize('HR'), jobController.getMyJobs);
router.get('/:id', authMiddleware.protect, jobController.getJobById);
router.put('/:id', authMiddleware.protect, rbacMiddleware.authorize('HR'), jobController.updateJob);
router.delete('/:id', authMiddleware.protect, rbacMiddleware.authorize('HR'), jobController.deleteJob);

module.exports = router;