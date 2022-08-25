import { Router } from "express";
import { AppDataSource } from "./data-source";
import Document from "./entity/Document";
import { getUserByToken, isAuthenticated } from "./methods";
import { addPermissionSchema, documentSchema } from "./schemas/document.schema";
import * as uuid from 'uuid'
import { User } from "./entity/User";
import { writeFile } from "fs";
const documentRouter = Router()

documentRouter.post('/document/upload', async (req, res) => {
    if (!(await isAuthenticated(req))) return res.status(403).send({ message: 'شما وارد نیستید' })
    const data = documentSchema.validate(JSON.parse(req.body.data));
    console.log(req.body);

    if (data.error || !req.files) return res.status(400).send(data.error);
    const file: any = req.files.file;
    const fileNameArray = file.name.split('.');
    const dir = __dirname.substring(0, __dirname.length - 4)
    const fileId = uuid.v4();
    const path = dir + '/files/' + `${fileId}.${fileNameArray[fileNameArray.length - 1]}`
    const documentRepo = AppDataSource.getRepository(Document);
    const userRepo = AppDataSource.getRepository(User);

    const savedFile = file.mv(path, (err) => {
        if (err) return res.status(500).send(err);
    })


    const doc = documentRepo.create({
        id: fileId,
        access: JSON.stringify(data.value.access),
        description: data.value.description,
        document_number: data.value.document_number,
        file_name: `${fileId}.${fileNameArray[fileNameArray.length - 1]}`,
        name: data.value.name,
        author: await getUserByToken(req),
        created_at: new Date(),
    })

    return res.send({
        message: 'success',
        path,
        data: await documentRepo.save(doc)
    })
})

documentRouter.post('/document/addp', async (req, res) => {
    if (!(await isAuthenticated(req))) return res.status(403).send({ message: 'شما وارد نیستید' })

    const data = addPermissionSchema.validate(req.body)

    if (data.error) return res.status(400).send(data.error);

    const docRepo = AppDataSource.getRepository(Document);
    const findedDoc = await docRepo.findOneBy({ id: data.value.id })
    const accessArray: string[] = JSON.parse(findedDoc.access)
    accessArray.push(data.value.user_natcode);

    findedDoc.access = JSON.stringify(accessArray);

    return res.status(200).send(await docRepo.save(findedDoc))
})

documentRouter.post('/document/get', async (req, res) => {
    if (!(await isAuthenticated(req))) return res.status(403).send({ message: 'شما وارد نیستید' })
    const user = await getUserByToken(req);

    const docRepo = AppDataSource.getRepository(Document);

    const userDocs = await docRepo.query('SELECT * FROM document WHERE authorId=?', [user.id])
    const allDocs: Document[] = await docRepo.query('SELECT * FROM document')
    const accessedDocs: Document[] = [];
    allDocs.map((doc) => {
        const accessArray: string[] = JSON.parse(doc.access);
        if (accessArray.findIndex((code) => code === user.natcode) !== -1) {
            accessedDocs.push(doc);
        }
    })
    const docs = [...accessedDocs, ...userDocs]
    return res.status(200).send(docs.filter((item,
        index) => docs.indexOf(item) === index));
})

export default documentRouter;