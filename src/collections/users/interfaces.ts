export interface IUser {
	user_id: string,
	name: string,
	email: string,
	password: string,
	created_by: string,
	organization_id: string
};


export interface IUserDetail {
	name?: string,
	email?: string,
	password?: string,
	email_verified?: boolean,
	picture_url?: string,
	meta_data?: string,
	blocked?: boolean,
	blocked_for?: string,
	authorized_application?: string
};

export interface IInvitationData {
	organization_id: string,
	application_id: string,
	invitor_id: string,
	invitee_id: string,
	status: string
};