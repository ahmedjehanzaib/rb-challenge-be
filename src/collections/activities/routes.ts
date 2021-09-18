import { Request, Response, NextFunction, Router } from 'express';
import * as uuidv4 from 'uuid/v4';
import * as JOI from 'joi';
import { log } from '../../log';
import { validationSchema } from '../../config/validation';
import { activitiesFacade } from './facade';

/**
 * Activities Router
 */
export function activitiesRouter(): Router {
	const router = Router();

	// POST /api/v1/activities/
	router.post('/',  async (req: Request, res: Response, _next: NextFunction) => {
		try {
			const validated = JOI.validate({ body: req.body }, validationSchema.createActivity);
			if (validated.error === null) {
				const activity = await activitiesFacade.createActivity({
					id: uuidv4(),
					name: req.body.name,
					description: req.body.description ? req.body.description : null,
					type: req.body.type,
					tags: req.body.tags ? JSON.stringify(req.body.tags) : null,
					location: req.body.location ? req.body.location : null,
					start_time: req.body.start_time,
					end_time: req.body.end_time,
					allowed_participants: req.body.allowed_participants,
					created_by: req.user.id
				});
				res.status(200).json({ data: activity, error: null, message: 'Activity created successfully!' });
			} else {
				log.warn({ message: validated.error.details[0].message, statusCode: 400, detail: validated.error.details[0], repo: 'rb-challenge-be', path: '/api/v1/activities/' });
				res.status(400).json({ data: null, error: true, message: validated.error.details[0].message });
			}
		} catch (err) {
			log.error({ message: 'Error in creating an activity!', statusCode: 500, detail: err, repo: 'rb-challenge-be', path: '/api/v1/activities/' });
			res.status(500).json({ data: null, error: err, message: 'Error in creating an activity!' });
		}
    });
    
    // GET /api/v1/activities/:id
	router.get('/:id',  async (req: Request, res: Response, _next: NextFunction) => {
		try {
			const validated = JOI.validate({ params: req.params }, validationSchema.findAnActivity);
			if (validated.error === null) {
				const activity = await activitiesFacade.findActivityById(req.params.id);
				if (!activity.length) {
					log.warn({ message: 'Activity not exist!', statusCode: 404, detail: 'Activity not exist!', repo: 'rb-challenge-be', path: '/api/v1/activities/:id' });
					res.status(404).json({ data: null, error: true, message: 'Activity not exist!' });
				} else {
					res.status(200).json({ data: activity[0], error: null, message: 'Activity fetched successfully!' });
				}
			} else {
				log.warn({ message: validated.error.details[0].message, statusCode: 400, detail: validated.error.details[0], repo: 'rb-challenge-be', path: '/api/v1/activities/:id' });
				res.status(400).json({ data: null, error: true, message: validated.error.details[0].message });
			}
		} catch (err) {
			log.error({ message: 'Error in finding an activity!', statusCode: 500, detail: err, repo: 'rb-challenge-be', path: '/api/v1/activities/:id' });
			res.status(500).json({ data: null, error: err, message: 'Error in finding an activity!' });
		}
    });
    
    // PUT /api/v1/activities/:id
	router.put('/:id',  async (req: Request, res: Response, _next: NextFunction) => {
		try {
			const validated = JOI.validate({ params: req.params, body: req.body }, validationSchema.updateAnActivity);
			if (validated.error === null) {
				const activity = await activitiesFacade.findActivityById(req.params.id);
				if (!activity.length) {
					log.warn({ message: 'Activity not exist!', statusCode: 404, detail: 'Activity not exist!', repo: 'rb-challenge-be', path: '/api/v1/activities/:id' });
					res.status(404).json({ data: null, error: true, message: 'Activity not exist!' });
				} else {
					req.body.tags = req.body.tags ? JSON.stringify(req.body.tags) : null
					const updatedActivity = await activitiesFacade.updateActivityById(req.params.id, req.body);
					res.status(200).json({ data: updatedActivity[0], error: null, message: 'Activity updated successfully!' });
				}
			} else {
				log.warn({ message: validated.error.details[0].message, statusCode: 400, detail: validated.error.details[0], repo: 'rb-challenge-be', path: '/api/v1/activities/:id' });
				res.status(400).json({ data: null, error: true, message: validated.error.details[0].message });
			}
		} catch (err) {
			log.error({ message: 'Error in updating an activity!', statusCode: 500, detail: err, repo: 'rb-challenge-be', path: '/api/v1/activities/:id' });
			res.status(500).json({ data: null, error: err, message: 'Error in updating an activity!' });
		}
	});

    // DELETE /api/v1/activities/:id
	router.delete('/:id',  async (req: Request, res: Response, _next: NextFunction) => {
		try {
			const validated = JOI.validate({ params: req.params }, validationSchema.deleteAnActivity);
			if (validated.error === null) {
				await activitiesFacade.deleteActivityById(req.params.id);
				res.status(200).json({ data: true, error: null, message: 'Activity deleted successfully!' });
			} else {
				log.warn({ message: validated.error.details[0].message, statusCode: 400, detail: validated.error.details[0], repo: 'rb-challenge-be', path: '/api/v1/activities/:id' });
				res.status(400).json({ data: null, error: true, message: validated.error.details[0].message });
			}
		} catch (err) {
			log.error({ message: 'Error in deleting an activity!', statusCode: 500, detail: err, repo: 'rb-challenge-be', path: '/api/v1/activities/:id' });
			res.status(500).json({ data: null, error: err, message: 'Error in deleting an activity!' });
		}
    });

	// GET /api/v1/activities
	router.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
		try {
			const activites = await activitiesFacade.findAllActivities();
			res.status(200).json({ data: activites, error: null, message: 'All activities has been fetched successfully!' });
		} catch (err) {
			log.error({ message: 'Error in fetching activities!', statusCode: 500, detail: err, repo: 'rb-challenge-be', path: '/api/v1/activities' });
			res.status(500).json({ data: null, error: err, message: 'Error in fetching activities!' });
		}
	});

	// POST /api/v1/activities/:id/request
	router.post('/:id/request',  async (req: Request, res: Response, _next: NextFunction) => {
		try {
			const validated = JOI.validate({ params: req.params }, validationSchema.findAnActivity);
			if (validated.error === null) {
				const activity = await activitiesFacade.findActivityById(req.params.id);
				if (!activity.length) {
					log.warn({ message: 'Activity not exist!', statusCode: 404, detail: 'Activity not exist!', repo: 'rb-challenge-be', path: '/api/v1/activities/:id/request' });
					res.status(404).json({ data: null, error: true, message: 'Activity not exist!' });
				} else {
					// Requested user must not the owner of the activity
					const isRequestUserOwner = await activitiesFacade.findActivityOwnerByUserId(req.user.id, req.params.id)
					if (isRequestUserOwner.length) {
						log.warn({ message: 'You are owner of this activity!', statusCode: 400, detail: 'You are owner of this activity!', repo: 'rb-challenge-be', path: '/api/v1/activities/:id/request' });
						res.status(400).json({ data: null, error: true, message: 'You are the owner of this activity!' });
					} else {
						// Is request already present
						const userRequest = await activitiesFacade.findActivityUserRequest(req.user.id, req.params.id);
						if (userRequest.length) {
							log.warn({ message: 'You request is already present!', statusCode: 400, detail: 'You request is already present!', repo: 'rb-challenge-be', path: '/api/v1/activities/:id/request' });
							res.status(400).json({ data: null, error: true, message: 'You request is already present!' });
						} else {
							// find total participants of activity
							const participantsCount = await activitiesFacade.findActivityParticipants(req.params.id);
							if (participantsCount.length && participantsCount[0].count == activity[0].allowed_participants) {
								log.warn({ message: 'Activity allowed particpants is exceeding its limit.!', statusCode: 400, detail: 'Activity allowed particpants is exceeding its limit.!', repo: 'rb-challenge-be', path: '/api/v1/activities/:id/request' });
								res.status(400).json({ data: null, error: true, message: 'Activity allowed particpants is exceeding its limit.!' });
							} else {
								// Request added with status pending
								await activitiesFacade.addActivityRequest(req.user.id, req.params.id);
								res.status(200).json({ data: true, error: null, message: 'Your request for an activity has been sent!' });
							}
						}
					}
				}
			} else {
				log.warn({ message: validated.error.details[0].message, statusCode: 400, detail: validated.error.details[0], repo: 'rb-challenge-be', path: '/api/v1/activities/:id/request' });
				res.status(400).json({ data: null, error: true, message: validated.error.details[0].message });
			}
		} catch (err) {
			log.error({ message: 'Error in creating an activity!', statusCode: 500, detail: err, repo: 'rb-challenge-be', path: '/api/v1/activities/:id/request' });
			res.status(500).json({ data: null, error: err, message: 'Error in creating an activity!' });
		}
    });

	// POST /api/v1/activities/:id/approve
	router.post('/:id/approve',  async (req: Request, res: Response, _next: NextFunction) => {
		try {
			const validated = JOI.validate({ params: req.params, body: req.body }, validationSchema.approveActivityRequest);
			if (validated.error === null) {
				const activity = await activitiesFacade.findActivityById(req.params.id);
				if (!activity.length) {
					log.warn({ message: 'Activity not exist!', statusCode: 404, detail: 'Activity not exist!', repo: 'rb-challenge-be', path: '/api/v1/activities/:id/request' });
					res.status(404).json({ data: null, error: true, message: 'Activity not exist!' });
				} else {
					// Requested user must not the owner of the activity
					const isRequestUserOwner = await activitiesFacade.findActivityOwnerByUserId(req.user.id, req.params.id)
					if (isRequestUserOwner.length) {
						// find total participants of activity
						const participantsCount = await activitiesFacade.findActivityParticipants(req.params.id);
						if (participantsCount.length && participantsCount[0].count == activity[0].allowed_participants) {
							log.warn({ message: 'Activity allowed particpants is exceeding its limit.!', statusCode: 400, detail: 'Activity allowed particpants is exceeding its limit.!', repo: 'rb-challenge-be', path: '/api/v1/activities/:id/request' });
							res.status(400).json({ data: null, error: true, message: 'Activity allowed particpants is exceeding its limit.!' });
						} else {
							// Request approved
							await activitiesFacade.approveActivityRequest(req.body.userId, req.params.id);
							res.status(200).json({ data: true, error: null, message: 'Request for an activity has been approved!' });
						}
					} else {
						log.warn({ message: 'You are not the owner of this activity!', statusCode: 400, detail: 'You are not the owner of this activity!', repo: 'rb-challenge-be', path: '/api/v1/activities/:id/request' });
						res.status(400).json({ data: null, error: true, message: 'You are not the owner of this activity!' });
					}
				}
			} else {
				log.warn({ message: validated.error.details[0].message, statusCode: 400, detail: validated.error.details[0], repo: 'rb-challenge-be', path: '/api/v1/activities/:id/request' });
				res.status(400).json({ data: null, error: true, message: validated.error.details[0].message });
			}
		} catch (err) {
			log.error({ message: 'Error in creating an activity!', statusCode: 500, detail: err, repo: 'rb-challenge-be', path: '/api/v1/activities/:id/request' });
			res.status(500).json({ data: null, error: err, message: 'Error in creating an activity!' });
		}
    });
    
	return router;
};