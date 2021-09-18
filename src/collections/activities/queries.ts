const activitiesQueries = {
	createActivity: (activity: any) => {
		return {
			text: `INSERT INTO activities(id, name, description, type, tags, location, start_time, end_time, allowed_participants, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
			values: [activity.id, activity.name, activity.description, activity.type, activity.tags, activity.location, activity.start_time, activity.end_time, activity.allowed_participants, activity.created_by]
		};
    },
    findActivityById: (activityId: string) => {
		return {
			text: `SELECT activities.*, row_to_json(users.*) as created_by_obj
			FROM activities
			INNER JOIN users ON users.id = activities.created_by
			WHERE activities.id = $1
			GROUP BY users.id, activities.id`,
			values: [activityId]
		};
	},
	updateActivityById: (activityId: string, activityData: any) => {
		let setQueryPart = ``
		Object.keys(activityData).forEach((key, index) => {
			setQueryPart += ` ${key}=$${index + 1}`
			if (Object.keys(activityData).length !== (index + 1)) {
				setQueryPart += `,`
			}
		});
		return {
			text: `UPDATE activities SET ${setQueryPart} WHERE id = '${activityId}' RETURNING *`,
			values: Object.keys(activityData).map((key) => activityData[key])
		};
	},
	deleteActivityById: (activityId: string) => {
		return {
			text: `DELETE FROM activities WHERE id = $1 RETURNING *`,
			values: [activityId]
		};
    },
	findAllActivities: () => {
		return {
			text: `SELECT activities.*, row_to_json(users.*) as created_by_obj
			FROM activities
			INNER JOIN users ON users.id = activities.created_by
			GROUP BY users.id, activities.id`,
			values: []
		};
	},
	findActivityOwnerByUserId: (userId: string, activityId: string) => {
		return {
			text: `SELECT * FROM activities WHERE created_by = $1 AND id = $2`,
			values: [userId, activityId]
		};
	},
	findActivityUserRequest: (userId: string, activityId: string) => {
		return {
			text: `SELECT * FROM activity_participants WHERE activity_id = $1 AND participant_id = $2`,
			values: [activityId, userId]
		};
	},
	addActivityRequest: (activityId: string, userId: string) => {
		return {
			text: `INSERT INTO activity_participants(activity_id, participant_id, status) VALUES ($1, $2, $3) RETURNING *`,
			values: [activityId, userId, 'pending']
		};
    },
	approveActivityRequest: (activityId: string, participantId: string) => {
		return {
			text: `UPDATE activity_participants set status = 'approved' WHERE activity_id = $1 AND participant_id = $2 RETURNING *`,
			values: [activityId, participantId]
		};
    },
	findActivityParticipants: (activityId: string) => {
		return {
			text: `SELECT Count(*) as count FROM activity_participants WHERE activity_id = $1 AND status = 'approved'`,
			values: [activityId]
		};
	},
}
export { activitiesQueries };