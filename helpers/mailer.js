module.exports = function () {
    var _ = require('../public/js/libs/underscore-min.map.1.6.0.js');
    var nodemailer = require('nodemailer');
    var smtpTransportObject = require('../config/mailer').noReplay;
    var pathMod = require('path');

    var fs = require('fs');

    function deliver(mailOptions, cb) {
        var transport = nodemailer.createTransport(smtpTransportObject);

        transport.sendMail(mailOptions, function (err, response) {
            if (err) {
                console.log(err);
                if (cb && (typeof cb === 'function')) {
                    cb(err, null);
                }
            } else {
                console.log('Message sent: ' + response.message);
                if (cb && (typeof cb === 'function')) {
                    cb(null, response);
                }
            }
        });
    }

    this.forgotPassword = function (options, cb) {
        var templateOptions = {
            password: options.password,
            email   : options.email,
            url     : process.env.HOST + '#login'
        };
        var mailOptions = {
            from                : 'easyerp <no-replay@easyerp.com>',
            to                  : templateOptions.email,
            subject             : 'Change password',
            generateTextFromHTML: true,
            html                : _.template(fs.readFileSync('public/templates/mailer/forgotPassword.html', encoding = 'utf8'), templateOptions)
        };

        deliver(mailOptions, cb);
    };

    this.changePassword = function (options) {
        var templateOptions = {
            name    : options.firstname + ' ' + options.lastname,
            email   : options.email,
            password: options.password,
            url     : 'http://localhost:8823'
        };
        var mailOptions = {
            from                : 'Test',
            to                  : options.email,
            subject             : 'Change password',
            generateTextFromHTML: true,
            html                : _.template(fs.readFileSync('public/templates/mailer/changePassword.html', encoding = 'utf8'), templateOptions)
        };

        deliver(mailOptions);
    };

    this.sendInvoice = function (mailOptions, cb) {

        mailOptions.generateTextFromHTML = true;
        mailOptions.from = 'easyerp <no-replay@easyerp.com>';
        mailOptions.html = _.template(fs.readFileSync(pathMod.join(__dirname, '../public/templates/mailer/sendInvoice.html'), encoding = 'utf8'), {});

        deliver(mailOptions, cb);
    };

    this.sendAssignedToLead = function (mailOptions, cb) {

        var templateOptions = {
            isOpportunity         : mailOptions.isOpportunity,
            employee              : mailOptions.employee.first + ' ' + mailOptions.employee.last,
            opportunityName       : mailOptions.opportunityName,
            opportunityDescription: mailOptions.opportunityDescription
        };

        mailOptions.generateTextFromHTML = true;
        mailOptions.from = 'ThinkMobiles <no-replay@easyerp.com>';
        mailOptions.subject = 'Lead is assigned'; // + name Leads

        mailOptions.html = _.template(fs.readFileSync('public/templates/mailer/sendAssignedToLead.html', encoding = 'utf8'), templateOptions);

        deliver(mailOptions, cb);
    };

    this.registeredNewUser = function (options) {
        var templateOptions = {
            name   : options.firstName + ' ' + options.lastName,
            email  : options.email,
            country: options.countryInput,
            city   : options.city
        };
        var mailOptions = {
            from                : 'easyerp <no-replay@easyerp.com>',
            to                  : 'sales@easyerp.com',
            subject             : 'new user',
            generateTextFromHTML: true,
            html                : _.template(fs.readFileSync('public/templates/mailer/registeredNewUser.html', encoding = 'utf8'), templateOptions)
        };

        var mailOptionsUser = {
            from                : 'easyerp <support@easyerp.com>',
            to                  : templateOptions.email,
            subject             : 'New registration',
            generateTextFromHTML: true,
            html                : _.template(fs.readFileSync('public/templates/mailer/newUser.html', encoding = 'utf8'), templateOptions)
        };

        deliver(mailOptionsUser);
        deliver(mailOptions);
    };

};

