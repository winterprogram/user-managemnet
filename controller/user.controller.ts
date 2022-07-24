import { Request, Response } from 'express';
import randomatic from 'randomatic';
import { UserService } from '../service/user.service';
import PassUtils from '../utils/password.utils';
import { ResponseUtils, ResponsewithDataUtils } from '../utils/response.utils';
import { sign } from 'jsonwebtoken'
import { getS3Url } from '../service/s3.service';


export class UserController {
    /**
     * Register user
     * @param req 
     * @param res 
     */
    public register = async (req: Request, res: Response) => {
        try {
            const user_id = randomatic('0a', 5),
                { password } = req.body,
                hashPassword = await PassUtils.encryptPassword(password);
            Object.assign(req.body, { user_id, createdAt: Date.now(), password: hashPassword });
            await UserService.insertOne(req.body);
            res.status(200).send(new ResponseUtils(true, 'User Register'))
        } catch (err) {
            console.error(err)
            res.status(500).send(new ResponseUtils(false, 'Internal Server Error!'));
        }
    }

    /**
     * Login user function
     * @param req 
     * @param res 
     */

    public login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body,
                userData = await UserService.findOnebyEmail(email);
            if (userData) {
                const { password: pass, user_id } = userData,
                    comparePassword = await PassUtils.comparePassword(password, pass);
                if (comparePassword) {
                    const jwtToken = sign({ user_id }, process.env.JWT_KEY!, { expiresIn: '1h' });
                    res.status(200).send(new ResponsewithDataUtils(true, 'login success', { jwtToken }));
                } else {
                    res.status(401).send(new ResponseUtils(false, 'Unauthorized'))
                }
            } else {
                res.status(200).send(new ResponseUtils(true, 'user not found'))
            }
        } catch (err) {
            console.error(err)
            res.status(500).send(new ResponseUtils(false, 'Internal Server Error!'));
        }
    }

    /**
     * Presigned Url for s3 upload
     * A presigned URL is a URL that you can provide to your users to grant temporary access to a specific S3 
     * object. Using the URL, a user can either READ the object or WRITE an Object (or update an existing object). 
     * The URL contains specific parameters which are set by your application. A pre-signed URL uses three parameters to limit the access to the user;
     * 
     * @param req 
     * @param res 
     */
    public uploadImage = async (req: Request, res: Response) => {
        try {
            const { user_id, ext } = req.body,
                userData = await UserService.findOnebyId(user_id);
            if (userData) {
                const presignedS3Url = await getS3Url(ext, user_id);
                if (presignedS3Url !== '') {
                    res.status(201).send(new ResponsewithDataUtils(true, 'S3 Upload Url', { presignedS3Url }))
                } else {
                    res.status(400).send(new ResponseUtils(true, 'Invalid mime type'));
                }
            } else {
                res.status(200).send(new ResponseUtils(true, 'user not found'))
            }
        } catch (err) {
            console.error(err)
            res.status(500).send(new ResponseUtils(false, 'Internal Server Error!'));
        }
    }

}