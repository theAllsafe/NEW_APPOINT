const { check } = require('express-validator');


let formValidation = {
  	customerRegistrationFormOne: ()	=>	{
		return [
			check('username', 'invalid').trim().matches('^[A-Za-z0-9]{1,25}$'),
			check('password', 'invalid').trim().not().isEmpty(),
			check('email', 'invalid').trim().not().isEmpty().isEmail(),
		]
	},
	customerRegistrationFormTwo: ()=>{
		return [
		
			check('phone_number', 'invalid').trim().not().isEmpty(),
			check('fullname', 'invalid').trim().not().isEmpty().matches('^[A-Za-z]{1,40}$'),
			check('street_no', 'invalid').trim().not().isEmpty(),
			check('street_name', 'invalid').trim().not().isEmpty(),
			check('suburb', 'invalid').trim().not().isEmpty(),
			check('state', 'invalid').trim().not().isEmpty(),
			check('pincode', 'invalid').trim().not().isEmpty()
		
		]
	},
	customerLogin: ()=>{
		return [
		
			check('username', 'invalid').trim(),
			check('password', 'invalid').trim(),
		
		]
	},
	forgotPassword: ()=>{
		return [
		
			check('email', 'invalid').trim().not().isEmpty().isEmail(),
		
		]
	},
	//customerRegistrationFormTwo: ()=>{
	//	check('first_name', 'invalid').trim().matches('^[A-Za-z]{1,25}$'),
	//	check('last_name', 'invalid').trim().matches('^[A-Za-z]{1,25}$'),
	//	check('email_addr', 'invalid').trim().isEmail(),
	//	check('mobile_phone', 'invalid').trim().not().isEmpty(),
	//	check('password').custom((value, {req})=>{
	//		if(value==='YABtDojxyRMq3Ev4lZqpXg==') //YABtDojxyRMq3Ev4lZqpXg==  === empty
	//			throw new Error('invalid')
	//	}),
	//	check('conpassword').custom((value, {req})=>{
	//		if(value!==req.body.password)
	//			throw new Error('invalid')
	//	}),
	//	check('termsAndCondition', 'invalid').trim().not().isEmpty()
	//},

}
module.exports = formValidation
