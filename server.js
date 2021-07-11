'use strict';

const express 				= require( 'express' );
const app 					= express();
const dotenv 				= require( 'dotenv' );
const cors  				= require( 'cors' );
const cookieParser 			= require( 'cookie-parser' );
const bodyParser 			= require( 'body-parser' );

const customer 				= require( './src/routes/customer' );

dotenv.config( { path: './.env' } );
app.use( express.json() );
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( cors({
	origin: process.env.FRONT_END_URL,
	methods: [ 'GET', 'POST' ],
	credentials: true
}) );
app.use( cookieParser() );
//app.use( session({

//	key: "userId",
//	secret: process.env.COOKIE_SECRET,
//	resave: false,
//	saveUninitialized: false,
//	cookie: {
//		expires: 60*60*24*7
//	}

//}));
app.use( '/customer', customer );
app.use( '*', ( req, res )=>{

	res.status( 404 ).json( { error: "Page not found" } );

});

app.listen( process.env.PORT, ()=>console.log( `Server is running on port number ${process.env.PORT}` ) );