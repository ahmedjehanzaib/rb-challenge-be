const userQueries = {
	findUsers: () => {
		return {
			text: `SELECT name, email, email_verified, picture_url, company,
			designation, industry, phone_number, country, city, address, gender,
			date_of_birth, linkedin_profile, github_profile, interests, skills, meta_data
			from users;`,
			values: []
		};
	},
	findUserById: (id: string) => {
		return {
			text: `SELECT users.*
			FROM users
			WHERE users.id = $1`,
			values: [id]
		};
	},
	findUserByEmail: (email: string) => {
		return {
			text: `SELECT * FROM users WHERE email = $1`,
			values: [email]
		};
	},
	updateUser: (id: string, userData: any) => {
		let setQueryPart = ``
		Object.keys(userData).forEach((key, index) => {
			setQueryPart += ` ${key}=$${index + 1}`
			if (Object.keys(userData).length !== (index + 1)) {
				setQueryPart += `,`
			}
		});
		return {
			text: `UPDATE users SET ${setQueryPart} WHERE id = '${id}' RETURNING *`,
			values: Object.keys(userData).map((key) => userData[key])
		};
	},
}

export { userQueries }