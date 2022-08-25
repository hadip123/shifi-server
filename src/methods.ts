import { Request } from "express";
import { AppDataSource } from "./data-source";
import { Token } from "./entity/Token";
import { User } from "./entity/User";

export const isAuthenticated = async (req: Request) => {
    const tokenRepo = AppDataSource.getRepository(Token);
    const userRepo = AppDataSource.getRepository(User);
    let isAuthenticated = false;
    const givenToken: any = req.headers['token']
    if (!givenToken) return false;
    const findedToken = await tokenRepo.query('SELECT * FROM token WHERE id=?', [givenToken])
    console.log('GIVEN TOKEN',givenToken);
    console.log('FINDED TOKEN',findedToken);
    if (findedToken.length === 0) return false;
    console.log('USER TOKEN', await userRepo.findOneBy({
        id: findedToken[0].userId
    }));
    if (findedToken.length !== 0) isAuthenticated = true;
    
    
    return isAuthenticated;
}

export const getUserByToken = async (req: Request) => {
    const tokenRepo = AppDataSource.getRepository(Token);
    const userRepo = AppDataSource.getRepository(User);
    const givenToken: any = req.headers['token']
    const findedToken = await tokenRepo.query('SELECT * FROM token WHERE id=?', [givenToken])
    console.log('GUB: GIVEN TOKEN',givenToken);
    console.log('GUB: FINDED TOKEN',findedToken);
    const findedUser =  await userRepo.findOneBy({
        id: findedToken[0].userId
    })
    
    return findedUser;
}

export const logOut = async (req: Request) => {
    const tokenRepo = AppDataSource.getRepository(Token)
    if (!req.headers['token']) return {}
    const res = await tokenRepo.delete({
        id: `${req.headers['token']}`
    })

    return res;
}