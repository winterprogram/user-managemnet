import { Request, Response } from 'express';
import { AdminService } from '../service/admin.service';
import { ResponseUtils, ResponsewithDataUtils } from '../utils/response.utils';




export class AdminController {

    /**
     * Admin to fetch user list in pagination
     * @param req 
     * @param res 
     */
    public getUserList = async (req: Request, res: Response) => {
        try {
            const { limit, skip } = req.params,
                userData = await AdminService.paginationData(+skip, +limit);
            res.status(200).send(new ResponsewithDataUtils(true, 'User Data', userData));
        } catch (err) {
            console.error(err)
            res.status(500).send(new ResponseUtils(false, 'Internal Server Error!'));
        }
    }

    /**
     * Admin to filter user Data by name, email and mobile
     * @param req 
     * @param res 
     */
    public userFilter = async (req: Request, res: Response) => {
        try {
            const { name, email, mobile } = req.query,
                userData = await AdminService.filterUserData(name?.toString(), email?.toString(), mobile?.toString());
            res.status(200).send(new ResponsewithDataUtils(true, 'User Data', userData));
        } catch (err) {
            console.error(err)
            res.status(500).send(new ResponseUtils(false, 'Internal Server Error!'));
        }
    }




}