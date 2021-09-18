import { activitiesQueries } from './queries';
import { PG_CLIENT } from '../../databases';
import { log } from '../../log';



const activitiesFacade = {
	createActivity: async(activityData: any) => {
		try {
			const { rows } = await PG_CLIENT.query(activitiesQueries.createActivity(activityData));
			return rows;
		} catch (err) {
			log.error('Error in creating an activity:', err);
			throw err;
		}
    },
	findActivityById: async(activityId: string) => {
		try {
			const { rows } = await PG_CLIENT.query(activitiesQueries.findActivityById(activityId));
			return rows;
		} catch (err) {
			log.error('Error in finding an activity:', err);
			throw err;
		}
	},
	updateActivityById: async (activityId: string, activityData: any) => {
		try {
			const { rows } = await PG_CLIENT.query(activitiesQueries.updateActivityById(activityId, activityData));
			return rows;
		} catch (err) {
			log.error('Error in updating roles:', err);
			throw err;
		}
    },
	deleteActivityById: async(activityId: string) => {
		try {
			await PG_CLIENT.query('BEGIN');
			const { rows } = await PG_CLIENT.query(activitiesQueries.deleteActivityById(activityId));
			await PG_CLIENT.query('COMMIT');
			return rows;
		} catch (err) {
			log.error('Error in deleting an activity:', err);
			await PG_CLIENT.query('ROLLBACK');
			throw err;
		}
    },
	findAllActivities: async() => {
		try {
			const { rows } = await PG_CLIENT.query(activitiesQueries.findAllActivities());
			return rows;
		} catch (err) {
			log.error('Error in finding activities:', err);
			throw err;
		}
	},
	findActivityOwnerByUserId: async(userId: string, activityId: string) => {
		try {
			const { rows } = await PG_CLIENT.query(activitiesQueries.findActivityOwnerByUserId(userId, activityId));
			return rows;
		} catch (err) {
			log.error('Error in finding activity owner:', err);
			throw err;
		}
	},
	findActivityUserRequest: async(userId: string, activityId: string) => {
		try {
			const { rows } = await PG_CLIENT.query(activitiesQueries.findActivityUserRequest(userId, activityId));
			return rows;
		} catch (err) {
			log.error('Error in finding activity user request:', err);
			throw err;
		}
	},
	findActivityParticipants: async(activityId: string) => {
		try {
			const { rows } = await PG_CLIENT.query(activitiesQueries.findActivityParticipants(activityId));
			return rows;
		} catch (err) {
			log.error('Error in finding activity participants:', err);
			throw err;
		}
	},
	addActivityRequest: async(userId: string, activityId: string) => {
		try {
			const { rows } = await PG_CLIENT.query(activitiesQueries.addActivityRequest(activityId, userId));
			return rows;
		} catch (err) {
			log.error('Error in adding activity user request:', err);
			throw err;
		}
	},
	approveActivityRequest: async(userId: string, activityId: string) => {
		try {
			const { rows } = await PG_CLIENT.query(activitiesQueries.approveActivityRequest(activityId, userId));
			return rows;
		} catch (err) {
			log.error('Error in approving activity user request:', err);
			throw err;
		}
	},
}

export { activitiesFacade };