const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const rbacMiddleware = require('../middleware/rbac');
const feedbackController = require('../controllers/feedbackController');

router.post('/', authMiddleware.protect, rbacMiddleware.authorize('Interviewer'), feedbackController.submitFeedback);
router.get('/application/:applicationId', authMiddleware.protect, feedbackController.getApplicationFeedback);
router.get('/my-feedback', authMiddleware.protect, rbacMiddleware.authorize('Interviewer'), feedbackController.getMyFeedback);

module.exports = router;