const activitiesQueries = {
	createActivity: (activity: any) => {
		return {
			text: `INSERT INTO activities(id, name, description, type, tags, location, start_time, end_time, allowed_participants, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
			values: [activity.id, activity.name, activity.description, activity.type, activity.tags, activity.location, activity.start_time, activity.end_time, activity.allowed_participants, activity.created_by]
		};
    },
    findActivityById: (activityId: string) => {
		return {
			text: `SELECT * FROM activities WHERE id = $1`,
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
			text: `SELECT * FROM activities`,
			values: []
		};
	},
}
export { activitiesQueries };