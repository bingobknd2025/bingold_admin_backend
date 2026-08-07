// routes/public/contact.public.routes.js
//
// Public "contact us" submission. This router is mounted in app.js ABOVE both
// the CORS whitelist and the api-key middleware, so it is:
//   • callable from ANY origin (the form may live on a site we don't control), and
//   • callable with NO x-api-key and NO JWT.
//
// Because it is fully open it carries its own body parser, its own permissive
// CORS and its own rate limiter — nothing upstream is doing that work for it.
const express = require('express');
const cors = require('cors');
const router = express.Router();

const { contactFormLimiter } = require('../../middleware/security.middleware');
const controller = require('../../controllers/public/contact.public.controller');

// Any origin, and only what a JSON form post needs. Declared here rather than
// added to ALLOWED_ORIGINS because the set of submitting sites is open-ended.
router.use(cors({
    origin: '*',
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

// Own parser: the global express.json() is registered after this mount point.
// 20kb is far above a contact form and far below anything worth storing.
router.use(express.json({ limit: '20kb' }));

router.post('/',
    contactFormLimiter,
    /*  #swagger.tags = ['Contact']
        #swagger.summary = 'Submit a contact-us request (public, no auth, any origin)'
        #swagger.security = []
        #swagger.requestBody = { required:true, content: { "application/json": { schema: { type:'object', required:['name','email','subject','message'], properties: { name:{type:'string', maxLength:150}, email:{type:'string', maxLength:255}, subject:{type:'string', maxLength:255}, message:{type:'string', maxLength:5000}, source:{type:'string', maxLength:50, description:'Which front-end submitted it. Defaults to "website".'} } } } } } */
    controller.submit);

module.exports = router;
