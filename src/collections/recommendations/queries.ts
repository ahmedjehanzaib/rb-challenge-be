const recommendationsQueries = {
	createRecommendation: (recommendation: any) => {
		return {
			text: `INSERT INTO recommendations(id, name, description, tags, recommendated_by) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
			values: [recommendation.id, recommendation.name, recommendation.description, recommendation.tags, recommendation.recommendated_by]
		};
    },
    findRecommendationById: (recommendationId: string) => {
		return {
			text: `SELECT recommendations.*, row_to_json(users.*) as recommendated_by_obj
			FROM recommendations
			INNER JOIN users ON users.id = recommendations.recommendated_by
			WHERE recommendations.id = $1
			GROUP BY users.id, recommendations.id`,
			values: [recommendationId]
		};
	},
	updatedRecommendationById: (recommendationId: string, recommendationData: any) => {
		let setQueryPart = ``
		Object.keys(recommendationData).forEach((key, index) => {
			setQueryPart += ` ${key}=$${index + 1}`
			if (Object.keys(recommendationData).length !== (index + 1)) {
				setQueryPart += `,`
			}
		});
		return {
			text: `UPDATE recommendations SET ${setQueryPart} WHERE id = '${recommendationId}' RETURNING *`,
			values: Object.keys(recommendationData).map((key) => recommendationData[key])
		};
	},
	deleteRecommendationsById: (recommendationId: string) => {
		return {
			text: `DELETE FROM recommendations WHERE id = $1 RETURNING *`,
			values: [recommendationId]
		};
    },
	findAllRecommendations: () => {
		return {
			text: `SELECT recommendations.*, row_to_json(users.*) as recommendated_by_obj
			FROM recommendations
			INNER JOIN users ON users.id = recommendations.recommendated_by
			GROUP BY users.id, recommendations.id`,
			values: []
		};
	},
	findRecommendationOwnerByUserId: (userId: string, recommendationId: string) => {
		return {
			text: `SELECT * FROM recommendations WHERE recommendated_by = $1 AND id = $2`,
			values: [userId, recommendationId]
		};
	},
	upvoteRecommendation: (recommendationId: string, votes: number) => {
		return {
			text: `UPDATE recommendations set votes = $2 WHERE id = $1 RETURNING *`,
			values: [recommendationId, votes]
		};
    },
}
export { recommendationsQueries };