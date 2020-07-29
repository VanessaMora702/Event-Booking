
const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');


module.exports =  {
    // Create User
    createUser: (args) => {
        return User.findOne({email: args.userInput.email}).then(user => {
            if (user) {
                throw new Error("User already exists.")
            }
            // hash password : number security of the hash 12 rounds of salting
            return bcrypt.hash(args.userInput.password, 12);
        }).then(hashedPassword => {
                const user = new User({
                    email: args.userInput.email,
                    password: hashedPassword
            });
            return user.save();
        }).then(result => {
                return {...result._doc, password: null,  _id: result.id};
        })
        .catch(error => {
            throw error;
        })
    },
    login: async ({email, password}) => {
             const user = await User.findOne({email: email});
            if (!user) {
                throw Error("User does not exist")
            }
            const isEqual = await bcrypt.compare(password, user.password);
            if (!isEqual) {
                throw Error("Password is incorrect")
            }
            // token that is not hashed with secretKey somesupersecretkey is invalid 
           const token =  jwt.sign({userId: user.id, email: user.email}, 'somesupersecretkey', {
               expiresIn: '1h'
           });
           return { userId: user.id, token: token, tokenExpiration: 1}
    }
}