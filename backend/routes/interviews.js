const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const rbacMiddleware = require('../middleware/rbac');
const interviewController = require('../controllers/interviewController');

router.post('/', authMiddleware.protect, rbacMiddleware.authorize('HR'), interviewController.createInterview);
router.get('/', authMiddleware.protect, interviewController.getAllInterviews);
router.get('/my-interviews', authMiddleware.protect, rbacMiddleware.authorize('Interviewer'), interviewController.getMyInterviews);
router.get('/:id', authMiddleware.protect, interviewController.getInterviewById);
router.get('/:id/applicants', authMiddleware.protect, rbacMiddleware.authorize('HR', 'Interviewer'), interviewController.getInterviewApplicants);
router.put('/:id', authMiddleware.protect, rbacMiddleware.authorize('HR'), interviewController.updateInterview);
router.delete('/:id', authMiddleware.protect, rbacMiddleware.authorize('HR'), interviewController.deleteInterview);

module.exports = router;