import * as passport from 'passport';
import * as passportLocal from 'passport-local';
import * as bcrypt from 'bcrypt';
import {authFacade} from './facade'

const LocalStrategy = passportLocal.Strategy;

passport.serializeUser(function (user, done) {
	/**
	 * Just store the user id
	 */
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	/**
	 * Get user from db on the basis of user id
	 */
	done(null, user);
});

passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
},
	async function (username: string, password: string, done) {
		const user = await authFacade.findUserByEmail(username.toLowerCase())
		if (!Object.keys(user).length) {
			return done(null, false)
		} else {
			bcrypt.compare(password, user.password, (err, isValid) => {
				if (err) {
					return done(err)
				}
				if (!isValid) {
					return done(null, false, { message: 'Invalid credentials' });
				}
				return done(null, { id: user.id  })
			})
		}
	}
));


export { passport };
