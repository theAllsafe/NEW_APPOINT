const jwt = require( 'jsonwebtoken' );

module.exports = {

    generateToken:  ( data )=>{

        try{

            const token = jwt.sign( { userData: data }, process.env.JWT_SECRET );
            return token;

        }
        catch(error){

            console.log( error );

        }
        

    },
    verifyToken: ( req, res, next )=>{
	
		if(req.cookies._token){
			try{
				
				const _token = req.cookies._token
				const data = jwt.verify( _token, process.env.JWT_SECRET ); 
				next();

			}
			catch(error){

				console.log( error );
				res.status(401).json( { 'error': 'Not authorized' } );
				
			}
		}
		else{
			res.status(401).json( { 'error': 'Not authorized' } );
		}
    },

    decodeToken: ( _token )=>{

        try{

            const data = jwt.verify( _token, process.env.JWT_SECRET );
            return data;

        }
        catch(error){

            console.log( error );

        }

    }
}