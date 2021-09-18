// import * as jwt from 'jsonwebtoken'
// import { NextFunction, Request, Response } from 'express';
// import { log } from '../log'
// import {userFacade} from '../collections/users/facade'



// export const validateUser: any = (req: Request, res: Response, next: NextFunction): void | Response => {
// 	if (req.isAuthenticated()) {
// 		return next()
// 	}
// 	const token: any = req.headers.token
// 	if (!token) {
// 		log.error({ message: 'User not logged in', statusCode: 401, repo: 'simplus-auth' })
// 		return res.status(401).send({ message: 'User not logged in' })
// 		//  return next()
// 	}

// 	jwt.verify(token, 'simplus', async function (err: Error, tokenInfo: any) {
// 		if (err) {
// 			log.error({ message: 'Invalid token', statusCode: 401, repo: 'simplus-auth' })
// 			return res.status(401).send({ message: err })
// 		}
// 		const user = await userFacade.findUserById(tokenInfo.id);
// 		if (!user.length) {
// 			log.error({ message: 'Invalid token', statusCode: 401, repo: 'simplus-auth' })
// 			return res.status(401).send({ message: 'User doesnot exist' })
// 		}
// 		req.user = {};
// 		req.user.id = user[0].id;
// 		req.user.name = user[0].name,
// 		req.user.organization_id = user[0].org_id
// 		req.user.organization = user[0].org_name || null;
// 		req.user.role = user[0].role_name || null;
// 		req.user.role_id = user[0].role_id || null;
// 		return next();
// 	})

// }