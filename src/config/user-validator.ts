import * as jwt from 'jsonwebtoken'
import { NextFunction, Request, Response } from 'express';
import { log } from '../log'
import { userFacade } from '../collections/users/facade'



export const validateUser: any = (req: Request, res: Response, next: NextFunction): void | Response => {
	const token: any = req.headers.authorization && (req.headers.authorization as string).split('Bearer ')[1];
	if (!token) {
		log.error({ message: 'User not logged in', statusCode: 401, repo: 'rb-challenge-be' })
		return res.status(401).send({ message: 'User not logged in' })
	}

	jwt.verify(token, 'RB-CHALLENGE-BE', async function (err: Error, tokenInfo: any) {
		if (err) {
			log.error({ message: 'Invalid token', statusCode: 401, repo: 'rb-challenge-be' })
			return res.status(401).send({ message: err })
		}
		const user = await userFacade.findUserById(tokenInfo.id);
		if (!user.length) {
			log.error({ message: 'Invalid token', statusCode: 401, repo: 'rb-challenge-be' })
			return res.status(401).send({ message: 'User doesnot exist' })
		}
		req.user = {};
		req.user.id = user[0].id;
		req.user.name = user[0].name;
        req.user.email = user[0].email;
		req.user.company = user[0].company || null;
		req.user.skills = user[0].skills || null;
		req.user.interests = user[0].interests || null;
		return next();
	})

}