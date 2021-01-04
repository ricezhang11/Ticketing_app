import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

import { Password } from '../services/password';
import { User } from '../models/user';
import { validateRequest, BadRequestError } from '@azmytickets/common';

const router = express.Router();

// express error handling
// https://expressjs.com/en/guide/error-handling.html
// https://www.robinwieruch.de/node-express-error-handling
// "in express, errors have to be explicitly send via the next function to the middleware"
// "starting with Express 5, route handlers and middleware that return a Promise will call next"
// "automatically when they reject or throw an error" -- this is why we make the .post async by adding 
// -async(req, res). in the .post function, we only need to throw the errors 
router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  // here we need to add a custom error handlers. see link https://expressjs.com/en/guide/error-handling.html
  // this is not returning a Promise, therefore, in the custom error handler, we need to explicitly call next
  validateRequest,
  async (req: Request, res: Response) => {
    // JavaScript unpacking 
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    // if we can't find this user
    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await Password.compare(
      existingUser.password,
      password
    );
    // if password doesn't match
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid Credentials');
    }

    // Generate JWT
    const userJwt = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signinRouter };
