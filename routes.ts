import { Router } from 'express';
import { AdminController } from './controller/admin.controller';
import { initiliazeServer } from './controller/main.controller';
import { UserController } from './controller/user.controller';
import { loginValidation } from './middleware/login.validation';
import { verifyToken } from './middleware/user-auth';
import { userValidation } from './middleware/user.validation';


export const router: Router = Router(),
    { register, login, uploadImage } = new UserController(),
    { getUserList, userFilter } = new AdminController();



//Health Check
router.get('/start', initiliazeServer);

//Register API
router.post('/auth/register', userValidation, register);

//Login API
router.post('/auth/login', loginValidation, login);

//For auth validation
router.use(verifyToken);

// Upload Image by users
router.post('/profile-image', uploadImage);

// Admin to query users
router.get('/users', userFilter);

// Admin to get list of users
router.get('/users/:limit/:skip', getUserList);






