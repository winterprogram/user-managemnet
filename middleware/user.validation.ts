import { NextFunction, Request, Response } from "express";
import { boolean, object, string } from "@hapi/joi";
import { UserType } from "../types/enums";



export const userValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const schema = object().keys({
        name: string().required(),
        age: string().required(),
        mobile: string().required(),
        email: string().required(),
        password: string().required(),
        userType: string().required().valid(UserType.ADMIN, UserType.USER).default(UserType.USER),
        isActive: boolean().default(true)
    });
    try {
        req.body = await schema.validateAsync(req.body);
        next();
    } catch (error: any) {
        console.log(error);
        res.status(400).send(error);
    }
};
