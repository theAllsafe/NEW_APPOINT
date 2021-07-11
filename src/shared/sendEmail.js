'use strict';

const nodemailer 	  = require( 'nodemailer' );

const sendEmail = async ( to, subject, heading='', body )=>{
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST_NAME,
		port: 587,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD
		}
	});
	const html = body
	// send email
	const emailStatus = await transporter.sendMail({
		from: process.env.EMAIL_FROM,
		to: to,
		subject: subject,
		html: html
	});
	if( emailStatus ) return true
	else return false
}
module.exports = sendEmail;