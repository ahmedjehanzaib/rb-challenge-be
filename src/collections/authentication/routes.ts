import { Request, Response, NextFunction, Router } from 'express';
import { passport } from './passport-local';
import * as jwt from 'jsonwebtoken'
import * as JOI from 'joi';
import * as uuidv4 from 'uuid/v4';
import * as bcrypt from 'bcrypt';
import { log } from '../../log';
import { validationSchema } from '../../config/validation';
import { authFacade } from './facade';
const saltRounds = 12;

/**
 * Authentication Router
 */
export function authenticationRouter(): Router {
	const router = Router();

	// POST /api/v1/authentication/register
	router.post('/register', async (req: Request, res: Response, _next: NextFunction) => {
		try {
			const validated = JOI.validate({ body: req.body }, validationSchema.registerAUser);
			if (validated.error === null) {
				const alreadyExist = await authFacade.findUserByEmail(req.body.email.toLowerCase());
				if (Object.keys(alreadyExist).length) {
					log.warn({ message: `Email(${req.body.email}) is already registered in our system!`, statusCode: 409, detail: `Email(${req.body.email}) is already registered in our system!`, repo: 'rb-challenge-be', path: '/api/v1/authentication/register' });
					res.status(409).json({ data: null, error: true, message: `Email(${req.body.email}) is already registered in our system!` });
				} else {
					const encryptedPassword = await bcrypt.hash(req.body.password, saltRounds);

					const user = await authFacade.registerAUser({
						id: uuidv4(),
						name: req.body.name,
						email: req.body.email.toLowerCase(),
						password: encryptedPassword,
						company: req.body.company,
						city: req.body.city,
						country: req.body.country,
						skills: JSON.stringify(req.body.skills),
						interests: JSON.stringify(req.body.interests),
					});
					delete user.password;
					// Sent an email for user email verification
					res.status(200).json({ data: user, error: null, message: 'User has been registered successfully!' });
				}
			} else {
				log.warn({ message: validated.error.message, statusCode: 400, detail: validated.error, repo: 'rb-challenge-be', path: '/api/v1/authentication/register' });
				res.status(400).json({ data: null, error: true, message: validated.error.message });
			}
		} catch (err) {
			log.error({ message: 'Error in registering a new user!', statusCode: 500, detail: err, repo: 'rb-challenge-be', path: '/api/v1/authentication/register' });
			res.status(500).json({ data: null, error: err, message: 'Error in registering a new user!' });
		}
	});

	// POST /api/v1/authentication/login
	router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const validated = JOI.validate({ body: req.body }, validationSchema.signingInAUser);
			if (validated.error === null) {
				passport.authenticate('local', async function(err, user) {
					if (err) {
						return next(err);
					} else if (!user) {
						res.status(401).json({ data: null, error: err, message: 'Invalid credentials. Please try again!'});
					} else {
						req.logIn(user, async function(err) {
							if (err) { return next(err); }
							const token = jwt.sign({ id: user.id }, 'RB-CHALLENGE-BE', {
								expiresIn: 86400
							})
							res.status(200).send({ token: token, profile: user,  err: null, message: 'You are successfully logged in!'});
						});
					}
				  })(req, res);
			} else {
				log.warn({ message: validated.error.details[0].message, statusCode: 400, detail: validated.error.details[0], repo: 'rb-challenge-be', path: '/api/v1/authentication/login' });
				res.status(400).json({ data: null, error: true, message: validated.error.details[0].message });
			}
		} catch (err) {
			log.error({ message: 'Error in signing in!', statusCode: 500, detail: err, repo: 'rb-challenge-be', path: '/api/v1/authentication/login' });
			res.status(500).json({ data: null, error: err, message: 'Error in signing in!'});
		}
	});

	return router;
};