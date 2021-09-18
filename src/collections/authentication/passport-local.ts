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
				return done(null, { 
					id: user.id,
					name: user.name,
					email: user.email,
					picture_url: user.picture_url,
					company: user.company,
					designation: user.designation,
					industry: user.industry,
					phone_number: user.phone_number,
					country: user.country,
					city: user.city,
					address: user.address,
					gender: user.gender,
					date_of_birth: user.data_of_birth,
					linkedin_profile: user.linkedin_profile,
					github_profile: user.github_profile,
					interests: user.interests,
					skills: user.skills,
					meta_data: user.meta_data
				})
			})
		}
	}
));


export { passport };
