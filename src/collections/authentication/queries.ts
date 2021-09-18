// import * as format from 'pg-format';

const authQueries = {
	findUserByEmail: (email: string) => {
		return {
			text: `SELECT * FROM users WHERE email = $1`,
			values: [email]
		};
	},
	createUser: (userData: any) => {
		return {
			text: `INSERT INTO users(id, name, email, password, company, city, country, skills, interests) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
			values: [userData.id, userData.name, userData.email, userData.password, userData.company, userData.city, userData.country, userData.skills, userData.interests]
		};
	},
}

export { authQueries }