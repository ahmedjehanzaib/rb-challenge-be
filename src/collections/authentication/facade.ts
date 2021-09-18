// import axios from 'axios';
// import * as uuidv4 from 'uuid/v4';

import { authQueries } from './queries';
import { PG_CLIENT } from '../../databases';
import { log } from '../../log';

const authFacade = {
	findUserByEmail: async (email: string) => {
		try {
			const { rows } = await PG_CLIENT.query(authQueries.findUserByEmail(email));

			return rows.length ? rows[0] : {};
		} catch (err) {
			log.error('Error in finding user by email:', err);
			throw err;
		}
	},
	registerAUser: async (userData: any) => {
		try {
			const { rows } = await PG_CLIENT.query(authQueries.createUser(userData));

			return rows.length ? rows[0] : {};
		} catch (err) {
			log.error('Error in creating a new user:', err);
			throw err;
		}
	},
};

export { authFacade };