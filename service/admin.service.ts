


import { IUserObj } from "../types/interface";
import { MongoService } from "./mongoPool.service";



export class AdminService {

    /**
     * Get Users list by pagination
     * @param skip 
     * @param limit 
     * @returns 
     */
    public static paginationData = async (skip: number, limit: number) => {
        return (await MongoService.connectToDb()).collection('users').find().skip(skip).limit(limit).toArray()
    }


    /**
     * Filter query
     * @param email 
     * @param name 
     * @param mobile 
     * @returns 
     */

    public static filterUserData = async (email?: string, name?: string, mobile?: string) => {
        return (await MongoService.connectToDb()).collection('users').find({ $or: [{ email }, { name }, { mobile }] }).toArray()
    }

}