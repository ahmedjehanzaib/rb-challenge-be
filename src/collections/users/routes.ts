import { Request, Response, NextFunction, Router } from 'express';
import * as JOI from 'joi';

import { log } from '../../log';
import { validationSchema } from '../../config/validation';
import { userFacade } from './facade';

/**
 * Users Router
 */
export function usersRouter(): Router {
	const router = Router();

	// GET /api/v1/users/:id
	router.get('/:id', async (req: Request, res: Response, _next: NextFunction) => {
		try {
			const validated = JOI.validate({ params: req.params }, validationSchema.getAUser);
			if (validated.error === null) {
				const user = await userFacade.findUserById(req.params.id);
				if (user.length > 0) {
					const { password, ...userInfo } = user[0];
					res.status(200).json({ data: userInfo, error: null, message: 'User has been fetched successfully!' });
				} else {
					log.warn({ message: 'User not found', statusCode: 404, detail: user, repo: 'rb-challenge-be', path: '/api/v1/users/:id' });
					res.status(404).json({ data: null, error: true, message: 'User not found!' });
				}
			} else {
				log.warn({ message: validated.error.details[0].message, statusCode: 400, detail: validated.error.details[0], repo: 'rb-challenge-be', path: '/api/v1/users/:id' });
				res.status(400).json({ data: null, error: true, message: validated.error.details[0].message });
			}
		} catch (err) {
			log.error({ message: 'Error in fetching a user!', statusCode: 500, detail: err, repo: 'rb-challenge-be', path: '/api/v1/users/:id' });
			res.status(500).json({ data: null, error: err, message: 'Error in fetching a user!' });
		}
	});

	// PUT /api/v1/users/
	router.put('/', async (req: Request, res: Response, _next: NextFunction) => {
		try {
			const validated = JOI.validate({ body: req.body }, validationSchema.updateAUser);
			if (validated.error === null) {
				const user = await userFacade.findUserById(req.user.id);
				if (user.length > 0) {
					req.body.skills = req.body.skills ? JSON.stringify(req.body.skills) : null
					req.body.interests = req.body.interests ? JSON.stringify(req.body.interests) : null
					const updatedUser = await userFacade.updateAUser(req.user.id, Object.keys(req.body) ? req.body : {});
					res.status(200).json({ data: updatedUser[0], error: null, message: 'User has been updated successfully!' });
				} else {
					log.warn({ message: 'User not found', statusCode: 404, detail: user, repo: 'rb-challenge-be', path: '/api/v1/users/' });
					res.status(404).json({ data: null, error: true, message: 'User not found!' });
				}
			} else {
				log.warn({ message: validated.error.details[0].message, statusCode: 400, detail: validated.error.details[0], repo: 'rb-challenge-be', path: '/api/v1/users/' });
				res.status(400).json({ data: null, error: true, message: validated.error.details[0].message });
			}
		} catch (err) {
			log.error({ message: 'Error in updating a user!', statusCode: 500, detail: err, repo: 'rb-challenge-be', path: '/api/v1/users/' });
			res.status(500).json({ data: null, error: err, message: 'Error in updating a user!' });
		}
	});

	// GET /api/v1/users
	router.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
		try {
			const members = await userFacade.findMembers();
			res.status(200).json({ data: members, error: null, message: 'Users has been fetched successfully!' });
		} catch (err) {
			log.error({ message: 'Error in fetching users!', statusCode: 500, detail: err, repo: 'rb-challenge-be', path: '/api/v1/users' });
			res.status(500).json({ data: null, error: err, message: 'Error in fetching users!' });
		}
	});

	return router;
};