import { recommendationsQueries } from './queries';
import { PG_CLIENT } from '../../databases';
import { log } from '../../log';



const recommendationsFacade = {
	createRecommendation: async(recommendationData: any) => {
		try {
			const { rows } = await PG_CLIENT.query(recommendationsQueries.createRecommendation(recommendationData));
			return rows;
		} catch (err) {
			log.error('Error in creating recommendation:', err);
			throw err;
		}
    },
	findRecommendationById: async(recommendationId: string) => {
		try {
			const { rows } = await PG_CLIENT.query(recommendationsQueries.findRecommendationById(recommendationId));
			return rows;
		} catch (err) {
			log.error('Error in finding recommendation:', err);
			throw err;
		}
	},
	updatedRecommendationById: async (recommendationId: string, recommendationData: any) => {
		try {
			const { rows } = await PG_CLIENT.query(recommendationsQueries.updatedRecommendationById(recommendationId, recommendationData));
			return rows;
		} catch (err) {
			log.error('Error in updating recommendation:', err);
			throw err;
		}
    },
	deleteRecommendationsById: async(recommendationId: string) => {
		try {
			await PG_CLIENT.query('BEGIN');
			const { rows } = await PG_CLIENT.query(recommendationsQueries.deleteRecommendationsById(recommendationId));
			await PG_CLIENT.query('COMMIT');
			return rows;
		} catch (err) {
			log.error('Error in deleting recommendation:', err);
			await PG_CLIENT.query('ROLLBACK');
			throw err;
		}
    },
	findAllRecommendations: async() => {
		try {
			const { rows } = await PG_CLIENT.query(recommendationsQueries.findAllRecommendations());
			return rows;
		} catch (err) {
			log.error('Error in finding recommendations:', err);
			throw err;
		}
	},
	findRecommendationOwnerByUserId: async(userId: string, recommendationId: string) => {
		try {
			const { rows } = await PG_CLIENT.query(recommendationsQueries.findRecommendationOwnerByUserId(userId, recommendationId));
			return rows;
		} catch (err) {
			log.error('Error in finding recommendation owner:', err);
			throw err;
		}
	},
	upvoteRecommendation: async(recommendationId: string) => {
		try {
			const { rows } = await PG_CLIENT.query(recommendationsQueries.findRecommendationById(recommendationId));
			
			const recommendation = await PG_CLIENT.query(recommendationsQueries.upvoteRecommendation(recommendationId, rows[0].votes + 1));
			return recommendation.rows;
		} catch (err) {
			log.error('Error in upvoting:', err);
			throw err;
		}
	},
}

export { recommendationsFacade };