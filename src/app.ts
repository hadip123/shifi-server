import bodyParser from 'body-parser';
import fStore from 'express-file-store';
import express from 'express';
import session from 'express-session';
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import * as uuid from 'uuid'
import cookieParser from 'cookie-parser';
import * as bcrypt from 'bcrypt';
import 'reflect-metadata';
import cors from 'cors'
import { userSchema } from './schemas/user.schema';
import { isAuthenticated, logOut } from './methods';
import documentRouter from './document.router';
import fileUpload from 'express-fileupload';
import { Token } from './entity/Token';
const app = express();
const port = 3000;
const host = '0.0.0.0';

AppDataSource.initialize().then(async () => {

}).catch(error => console.log(`Data Source `, error))

app.use(fileUpload())
app.use(bodyParser.json())
app.use(cors({
    credentials: true,
    origin: function (origin, callback) {
        // if (whitelist.indexOf(origin) !== -1 || !origin) {
        //   callback(null, true);
        // } else {
        //   callback(new Error('Not allowed by CORS'));
        // }
        console.log('ORIGIN: ', origin);

        callback(null, true);
    },
}))

app.post('/auth/signup', async (req, res) => {
    const data = userSchema.validate(req.body);

    if (data.error) return res.status(400).send(data.error)
    if (await AppDataSource.getRepository(User).findOneBy({ username: data.value.natcode })) return res.status(409).send({
        message: 'user founded'
    })
    const user = AppDataSource.getRepository(User).create({
        id: uuid.v4(),
        first_name: data.value.first_name,
        education_level: data.value.education_level,
        job: data.value.job,
        last_name: data.value.last_name,
        natcode: data.value.natcode,
        passcode: await bcrypt.hash(data.value.password, 10),
        phone_number: data.value.phone_number,
        username: data.value.natcode,
        address: data.value.address,
        created_at: new Date()
    });

    AppDataSource.getRepository(User).save(user).then((result) => {
        return res.status(201).send(result)
    });
})
app.use('/', documentRouter)

app.post('/auth/signin', async (req, res, next) => {
    const userRepo = AppDataSource.getRepository(User);
    const tokenRepo = AppDataSource.getRepository(Token)

    const user = await userRepo.findOneBy({username: req.body.username})

    if (!user) return res.status(401).send({
        message: 'کاربر پیدا نشد'
    })

    console.log('REQUREST ', req.body);
    

    if (!(await bcrypt.compare(req.body.password, user.passcode))) return res.status(402).send({
        message: 'رمز عبور اشتباه است'
    })

    const token = tokenRepo.create({
        id: uuid.v4(),
        user: user,
        created_at: new Date()
    })

    await tokenRepo.save(token)

    return res.status(200).send({
        token: token.id
    })
})

app.post('/auth/test', async (req, res) => {
    if (!(await isAuthenticated(req))) return res.status(403).header("Access-Controll-Allow-Origin: *").send({
        message: "Not authenticated"
    })

    return res.status(200).send({
        message: 'Authenticated'
    })
})

app.post('/auth/logout', async (req, res) => {
    if (!(await isAuthenticated(req))) return res.status(403).header("Access-Controll-Allow-Origin: *").send({
        message: "Not authenticated"
    })

    res.status(200).send(await logOut(req))
})

app.listen(port, host, () => {
    console.log(`http://${host}:${port}/`);
})