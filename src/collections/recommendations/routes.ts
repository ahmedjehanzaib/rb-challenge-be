import { Request, Response, NextFunction, Router } from 'express';
import * as uuidv4 from 'uuid/v4';
import * as JOI from 'joi';
import { log } from '../../log';
import { validationSchema } from '../../config/validation';
import { recommendationsFacade } from './facade';

/**
 * Recommendations Router
 */
export function recommendationsRouter(): Router {
	const router = Router();

	// POST /api/v1/recommendations/
	router.post('/',  async (req: Request, res: Response, _next: NextFunction) => {
		try {
			const validated = JOI.validate({ body: req.body }, validationSchema.createRecommendation);
			if (validated.error === null) {
				const recommendation = await recommendationsFacade.createRecommendation({
					id: uuidv4(),
					name: req.body.name,
					description: req.body.description ? req.body.description : null,
					tags: req.body.tags ? JSON.stringify(req.body.tags) : null,
					recommendated_by: req.user.id
				});
				res.status(200).json({ data: recommendation, error: null, message: 'Recommendation created successfully!' });
			} else {
				log.warn({ message: validated.error.details[0].message, statusCode: 400, detail: validated.error.details[0], repo: 'rb-challenge-be', path: '/api/v1/recommendations/' });
				res.status(400).json({ data: null, error: true, message: validated.error.details[0].message });
			}
		} catch (err) {
			log.error({ message: 'Error in creating recommendations!', statusCode: 500, detail: err, repo: 'rb-challenge-be', path: '/api/v1/recommendations/' });
			res.status(500).json({ data: null, error: err, message: 'Error in creating recommendations!' });
		}
    });
    
    // GET /api/v1/recommendations/:id
	router.get('/:id',  async (req: Request, res: Response, _next: NextFunction) => {
		try {
			const validated = JOI.validate({ params: req.params }, validationSchema.findRecommendation);
			if (validated.error === null) {
				const recommendation = await recommendationsFacade.findRecommendationById(req.params.id);
				if (!recommendation.length) {
					log.warn({ message: 'Recommendation not exist!', statusCode: 404, detail: 'Recommendation not exist!', repo: 'rb-challenge-be', path: '/api/v1/recommendations/:id' });
					res.status(404).json({ data: null, error: true, message: 'Recommendation not exist!' });
				} else {
					res.status(200).json({ data: recommendation[0], error: null, message: 'Recommendation fetched successfully!' });
				}
			} else {
				log.warn({ message: validated.error.details[0].message, statusCode: 400, detail: validated.error.details[0], repo: 'rb-challenge-be', path: '/api/v1/recommendations/:id' });
				res.status(400).json({ data: null, error: true, message: validated.error.details[0].message });
			}
		} catch (err) {
			log.error({ message: 'Error in finding recommendation!', statusCode: 500, detail: err, repo: 'rb-challenge-be', path: '/api/v1/recommendations/:id' });
			res.status(500).json({ data: null, error: err, message: 'Error in finding recommendation!' });
		}
    });
    
    // PUT /api/v1/recommendations/:id
	router.put('/:id',  async (req: Request, res: Response, _next: NextFunction) => {
		try {
			const validated = JOI.validate({ params: req.params, body: req.body }, validationSchema.updateRecommendation);
			if (validated.error === null) {
				const recommendation = await recommendationsFacade.findRecommendationById(req.params.id);
				if (!recommendation.length) {
					log.warn({ message: 'Recommendation not exist!', statusCode: 404, detail: 'Recommendation not exist!', repo: 'rb-challenge-be', path: '/api/v1/recommendations/:id' });
					res.status(404).json({ data: null, error: true, message: 'Recommendation not exist!' });
				} else {
					req.body.tags = req.body.tags ? JSON.stringify(req.body.tags) : null
					const updatedRecommendation = await recommendationsFacade.updatedRecommendationById(req.params.id, req.body);
					res.status(200).json({ data: updatedRecommendation[0], error: null, message: 'Recommendation updated successfully!' });
				}
			} else {
				log.warn({ message: validated.error.details[0].message, statusCode: 400, detail: validated.error.details[0], repo: 'rb-challenge-be', path: '/api/v1/recommendations/:id' });
				res.status(400).json({ data: null, error: true, message: validated.error.details[0].message });
			}
		} catch (err) {
			log.error({ message: 'Error in updating recommendation!', statusCode: 500, detail: err, repo: 'rb-challenge-be', path: '/api/v1/recommendations/:id' });
			res.status(500).json({ data: null, error: err, message: 'Error in updating an recommendation!' });
		}
	});

    // DELETE /api/v1/recommendations/:id
	router.delete('/:id',  async (req: Request, res: Response, _next: NextFunction) => {
		try {
			const validated = JOI.validate({ params: req.params }, validationSchema.deleteRecommendations);
			if (validated.error === null) {
				await recommendationsFacade.deleteRecommendationsById(req.params.id);
				res.status(200).json({ data: true, error: null, message: 'Recommendations deleted successfully!' });
			} else {
				log.warn({ message: validated.error.details[0].message, statusCode: 400, detail: validated.error.details[0], repo: 'rb-challenge-be', path: '/api/v1/recommendations/:id' });
				res.status(400).json({ data: null, error: true, message: validated.error.details[0].message });
			}
		} catch (err) {
			log.error({ message: 'Error in deleting recommendation!', statusCode: 500, detail: err, repo: 'rb-challenge-be', path: '/api/v1/recommendations/:id' });
			res.status(500).json({ data: null, error: err, message: 'Error in deleting recommendation!' });
		}
    });

	// GET /api/v1/recommendations
	router.get('/', async (_req: Request, res: Response, _next: NextFunction) => {
		try {
			const recommendations = await recommendationsFacade.findAllRecommendations();
			res.status(200).json({ data: recommendations, error: null, message: 'All recommendations has been fetched successfully!' });
		} catch (err) {
			log.error({ message: 'Error in fetching recommendations!', statusCode: 500, detail: err, repo: 'rb-challenge-be', path: '/api/v1/recommendations' });
			res.status(500).json({ data: null, error: err, message: 'Error in fetching recommendations!' });
		}
	});

	// POST /api/v1/recommendations/:id/upvote
	router.post('/:id/upvote',  async (req: Request, res: Response, _next: NextFunction) => {
		try {
			const validated = JOI.validate({ params: req.params }, validationSchema.upvoteRecommendation);
			if (validated.error === null) {
				const recommendation = await recommendationsFacade.findRecommendationById(req.params.id);
				if (!recommendation.length) {
					log.warn({ message: 'Recommendation not exist!', statusCode: 404, detail: 'Recommendation not exist!', repo: 'rb-challenge-be', path: '/api/v1/recommendations/:id/upvote' });
					res.status(404).json({ data: null, error: true, message: 'Recommendation not exist!' });
				} else {
					// upvoting user must not the owner of the recommendation
					const isRecommendationOwner = await recommendationsFacade.findRecommendationOwnerByUserId(req.user.id, req.params.id)
					if (isRecommendationOwner.length) {
						log.warn({ message: 'You are the owner of this recommendation!', statusCode: 400, detail: 'You are the owner of this recommendation!', repo: 'rb-challenge-be', path: '/api/v1/recommendations/:id/upvote' });
						res.status(400).json({ data: null, error: true, message: 'You are the owner of this recommendation!' });
					} else {
						await recommendationsFacade.upvoteRecommendation(req.params.id);
						res.status(200).json({ data: true, error: null, message: 'Thank you for upvoting!' });						
					}
				}
			} else {
				log.warn({ message: validated.error.details[0].message, statusCode: 400, detail: validated.error.details[0], repo: 'rb-challenge-be', path: '/api/v1/recommendations/:id/upvote' });
				res.status(400).json({ data: null, error: true, message: validated.error.details[0].message });
			}
		} catch (err) {
			log.error({ message: 'Error in upvoting recommendation!', statusCode: 500, detail: err, repo: 'rb-challenge-be', path: '/api/v1/recommendations/:id/upvote' });
			res.status(500).json({ data: null, error: err, message: 'Error in upvoting recommendation!' });
		}
    });
    
	return router;
};