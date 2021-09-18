import { userQueries } from './queries';
import { PG_CLIENT } from '../../databases';
import { log } from '../../log';


const userFacade = {
	findMembers: async () => {
		try {
			const { rows } = await PG_CLIENT.query(userQueries.findUsers());
			return rows;
		} catch (err) {
			log.error('Error in finding members', err);
			throw err;
		}
	},
	findUserById: async (id: string) => {
		try {
			const { rows } = await PG_CLIENT.query(userQueries.findUserById(id));
			return rows;
		} catch (err) {
			log.error('Error in finding user by id:', err);
			throw err;
		}
	},
	findUserByEmail: async (email: string) => {
		try {
			const { rows } = await PG_CLIENT.query(userQueries.findUserByEmail(email));
			return rows;
		} catch (err) {
			log.error('Error in finding user by email:', err);
			throw err;
		}
	},
	updateAUser: async (id: string, userData: any) => {
		try {
			const { rows } = await PG_CLIENT.query(userQueries.updateUser(id, userData));
			return rows;
		} catch (err) {
			log.error('Error in updating a user:', err);
			throw err;
		}
	},
};

export { userFacade };