'use strict';

const express 				= require( 'express' );
const routes 				= express.Router();
const auth 					= require( '../middlewares/auth' );
const bcrypt 				= require( 'bcrypt' );
const randomstring 			= require( 'randomstring' );

const { validationResult  } = require( 'express-validator' )
const formValidation 		= require( '../middlewares/formValidation' );
const { PrismaClient } 		= require( '@prisma/client' );

const { customers } 		= new PrismaClient();
const sendMail 				= require( '../shared/sendEmail' );
const saltRounds 			= 10;

routes.get( '/', ( req, res )=>{

	res.send("Api called");

});

routes.post( '/signup', formValidation.customerRegistrationFormOne(), async ( req, res )=>{

	const errors = validationResult( req );
	
	if(!errors.isEmpty()){

      	res.status(200).send( { validationError: true, errors: errors.mapped() } )
		
      	return

    }

	const isUserExist = await customers.findFirst({
		where: {
			OR:[
				{
					"username": req.body.username
				},
				{
					"email": req.body.email
				}

			]
		}
	});
	if( isUserExist ){
		res.status( 200 ).json( { "userExist": true } );
		return
	}
	await bcrypt.genSalt(saltRounds, (err, salt)=>{
		
		bcrypt.hash(req.body.password, salt, (err, hash)=>{
			customers.create({
				
				data: {
					"username": req.body.username,
					"user_role": 'customer',
					"email": req.body.email,
					"password": hash
				}
				
			}).then((customerCreatedSuccess)=>{
				
				if( customerCreatedSuccess ){
					
					const userId = customerCreatedSuccess.id
					const _token = auth.generateToken( customerCreatedSuccess );
					res.cookie( '_token', _token, { httpOnly: true } );
					//expires: new Date(Date.now()+60*60*24*7*1000)
					res.status( 200 ).json( { "userCreated": "User created successfully" } );
					
				}
				else
					res.status(400).json( { "userCreatedFaild": "Sorry try again!" } );
			}).catch(e=>{
				
				console.log(e)
				
			})
			
		});
		
	});

});
routes.post( '/save-customerdetails', formValidation.customerRegistrationFormTwo(), auth.verifyToken, async( req, res )=>{
	
	const errors = validationResult( req );
	
	if(!errors.isEmpty()){

      	res.status(200).send( { validationError: true, errors: errors.mapped() } )
		
      	return

    }
	
	if(req.cookies._token){
		const customerId = auth.decodeToken(req.cookies._token).userData.id
		if(!customerId){
			res.status( 200 ).json( { "userNotValid": true } );
		}
		else{
			const updateCustomer = await customers.update({
				where:{
					"id": customerId
				},
				data: {
					phone_number: req.body.phone_number,
					communication_email: req.body.communication_email,
					fullname: req.body.fullname,
					street_no: req.body.street_no,
					street_name: req.body.street_name,
					suburb: req.body.suburb,
					state: req.body.state,
					pincode: parseInt(req.body.pincode)
				}
			}).then( saveExtraCustomerInfo=>{
				
				if( saveExtraCustomerInfo ){
					const userData = customers.findUnique({
					
						where: {
							id: customerId
						}
					}).then(customerData=>{
						const _token =  auth.generateToken( customerData );
						res.cookie( '_token', _token, { httpOnly: true } );
						res.status( 200 ).json( { "updateStatus": true } );
					}).catch(err=>console.log(err))

				}
				else
					res.status(200).json( { "updateStatus": false } );
			}).catch(e=>{
				console.log(e)		
			});
		}
	}
	else{
		res.status( 200 ).json( { "userNotValid": true } );
	}
});
routes.post( '/login', formValidation.customerLogin(), async ( req, res )=>{
	
	const customer = await customers.findFirst({
		
		where: {
			OR: [
			
				{
					email: req.body.username
				},
				{
					username: req.body.username
				}
			
			]
		}
		
	}).then(customerDetails=>{
		
		if(customerDetails){
			bcrypt.compare(req.body.password, customerDetails.password, ( err, status )=>{
				if(status){
					
					const _token =  auth.generateToken( customerDetails );
					res.cookie( '_token', _token, { httpOnly: true } );
					res.status(200).json({loginStatus: true});
				}
				else{
					res.status(200).json({loginStatus: false});
					console.log(err)
				}
			});
		}
		else{
			res.status(200).json({loginStatus: false});
		}
		
	}).catch(err=>{
		console.log(err)
	})
});
routes.get( '/isloggedIn', auth.verifyToken, ( req, res )=>{
	
	const customerData = auth.decodeToken(req.cookies._token)
	
	res.status(200).json( { 'isLoggedIn': true, 'customerData': customerData } )
	
})
routes.post( '/forgot-password', async (req, res)=>{
	const customer = await customers.findFirst({
		
		where:{
			email: req.body.email
		}
		
	}).then(customer=>{
		if( customer ){
			const emailverificationCode = randomstring.generate( { length: 25 } )
			const body = `<a href=${process.env.FRONT_END_URL}/${emailverificationCode}>Please click here to reset your password</a>`
			
			if( sendMail( req.body.email, 'Password reset email', `Password reset confirmation mail from ${process.env.APP_NAME}`, body ) ){
			
				res.status( 200 ).json( { isCustomerExisit: true, msg: 'An email has been setn to your register email' } );
				
			}
			else{
				res.status( 200 ).json( { isCustomerExisit: false, 'msg': 'Something went wrong' } );
			}
		
		}else{
			res.status( 200 ).json( { isCustomerExisit: false, 'msg': 'User not found' } );
		}
	}).catch(err=>{
		res.status( 200 ).json( { isCustomerExisit: false, 'msg': 'Something went wrong'  } );
		console.log(err)
	})
	
})

module.exports = routes;