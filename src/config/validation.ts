import * as JOI from 'joi';

const validationSchema = {
	// POST /api/v1/authentication/register
	registerAUser: {
		headers: {
			// token
		},
		body: {
			name: JOI.string().required().error(new Error('Name is not allowed to be empty!')),
			email: JOI.string().email().required(),
			password: JOI.string().regex(/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/).required().error(new Error('Password must be 8 characters long which includes uppercase, lowercase, numbers and symbols.')),
			repeat_password: JOI.string().regex(/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/).valid(JOI.ref('password')).required().error(new Error('Confirm password must match with password field.')),
			company: JOI.string().required().error(new Error('Company is not allowed to be empty!')),
			city: JOI.string().required().error(new Error('City is not allowed to be empty!')),
			country: JOI.string().required().error(new Error('Country is not allowed to be empty!')),
			skills: JOI.string().required().error(new Error('Skills is not allowed to be empty!')),
			interests: JOI.string().required().error(new Error('Interests is not allowed to be empty!')),
		}
	},

	// POST /api/v1/authentication/login
	signingInAUser: {
		headers: {
			// token
		},
		body: {
			email: JOI.string().email().required(),
			password: JOI.string().required(),
		}
	},
}

export { validationSchema };