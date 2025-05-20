import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { IJwtPayload } from './auth_interface';

export const createToken = (
    jwtPayload: IJwtPayload,
    secret: string,
    expiresIn: string,
) => {
  const options: SignOptions = {
    expiresIn: expiresIn as unknown as number,
  };
  return jwt.sign(jwtPayload, secret, options);
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret) as JwtPayload;
};
