import * as JOI from 'joi';

const validationSchema = {
	// POST /api/v1/authentication/register
	registerAUser: {
		headers: {
			// token
		},
		body: {
			name: JOI.string().required().error(new Error('Name is not allowed to be empty!')),
			email: JOI.string().email().required(),
			password: JOI.string().regex(/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/).required().error(new Error('Password must be 8 characters long which includes uppercase, lowercase, numbers and symbols.')),
			repeat_password: JOI.string().regex(/^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/).valid(JOI.ref('password')).required().error(new Error('Confirm password must match with password field.')),
			company: JOI.string().required().error(new Error('Company is not allowed to be empty!')),
			city: JOI.string().required().error(new Error('City is not allowed to be empty!')),
			country: JOI.string().required().error(new Error('Country is not allowed to be empty!')),
			skills: JOI.array().required().error(new Error('Skills is not allowed to be empty!')),
			interests: JOI.array().required().error(new Error('Interests is not allowed to be empty!')),
		}
	},

	// POST /api/v1/authentication/login
	signingInAUser: {
		headers: {
			// token
		},
		body: {
			email: JOI.string().email().required(),
			password: JOI.string().required(),
		}
	},

	// GET /api/v1/users/:id
	getAUser: {
		headers: {
			// token
		},
		params: {
			id: JOI.string().guid().required(),
		}
	},

	// PUT /api/v1/users/
	updateAUser: {
		headers: {
			// token
		},
		params: {
		},
		body: {
			name: JOI.string().allow('', null).optional(),
			company: JOI.string().allow('', null).optional(),
			designation: JOI.string().allow('', null).optional(),
			industry: JOI.string().allow('', null).optional(),
			phone_number: JOI.string().allow('', null).optional(),
			country: JOI.string().allow('', null).optional(),
			city: JOI.string().allow('', null).optional(),
			address: JOI.string().allow('', null).optional(),
			gender: JOI.string().allow('', null).optional(),
			date_of_birth: JOI.string().allow('', null).optional(),
			linkedin_profile: JOI.string().allow('', null).optional(),
			github_profile: JOI.string().allow('', null).optional(),
			interests: JOI.array().allow('', null).optional(),
			skills: JOI.array().allow('', null).optional(),
			picture_url: JOI.string().allow('', null).optional(),
			meta_data: JOI.object().allow('', null).optional(),
		}
	},

	// POST /api/v1/activities/
	createActivity: {
		headers: {
			// token
		},
		body: {
			name: JOI.string().trim().required(),
			description: JOI.string().trim().allow('', null).optional(),
			type: JOI.string().trim().required(),
			tags: JOI.array().allow('', null).optional(),
			location: JOI.string().trim().allow('', null).optional(),
			start_time: JOI.string().trim().required(),
			end_time: JOI.string().trim().required(),
			allowed_participants: JOI.number().required(),
		}
	},

	// GET /api/v1/activites/:id
	findAnActivity: {
		headers: {
			// token
		},
		params: {
			id: JOI.string().guid().required()
		}
	},

	// PUT /api/v1/activites/:id
	updateAnActivity: {
		headers: {
			// token
		},
		params: {
			id: JOI.string().guid().required()
		},
		body: {
			name: JOI.string().trim().required(),
			description: JOI.string().trim().allow('', null).optional(),
			type: JOI.string().trim().required(),
			tags: JOI.array().allow('', null).optional(),
			location: JOI.string().trim().allow('', null).optional(),
			start_time: JOI.string().trim().required(),
			end_time: JOI.string().trim().required(),
			allowed_participants: JOI.number().required(),
		}
	},

	// DELETE /api/v1/activites/:id
	deleteAnActivity: {
		headers: {
			// token
		},
		params: {
			id: JOI.string().guid().required()
		}
	},

	// POST /api/v1/activities/:id/approve
	approveActivityRequest: {
		headers: {
			// token
		},
		params: {
			id: JOI.string().guid().required()
		},
		body: {
			userId: JOI.string().guid().required()
		}
	},

	// POST /api/v1/recommendations/
	createRecommendation: {
		headers: {
			// token
		},
		body: {
			name: JOI.string().trim().required(),
			description: JOI.string().trim().allow('', null).optional(),
			tags: JOI.array().allow('', null).optional(),
		}
	},
	// GET /api/v1/recommendations/:id
	findRecommendation: {
		headers: {
			// token
		},
		params: {
			id: JOI.string().guid().required()
		}
	},
	// PUT /api/v1/recommendations/:id
	updateRecommendation: {
		headers: {
			// token
		},
		params: {
			id: JOI.string().guid().required()
		},
		body: {
			name: JOI.string().trim().required(),
			description: JOI.string().trim().allow('', null).optional(),
			tags: JOI.array().allow('', null).optional(),
		}
	},
	// DELETE /api/v1/recommendations/:id
	deleteRecommendations: {
		headers: {
			// token
		},
		params: {
			id: JOI.string().guid().required()
		}
	},
	// POST /api/v1/recommendations/:id/upvote
	upvoteRecommendation: {
		headers: {
			// token
		},
		params: {
			id: JOI.string().guid().required()
		},
		body: {
		}
	},

}

export { validationSchema };