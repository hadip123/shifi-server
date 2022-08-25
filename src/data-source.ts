import "reflect-metadata"
import { DataSource } from "typeorm"
import Document from "./entity/Document"
import { Token } from "./entity/Token"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "192.168.10.80",
    port: 4334,
    username: "hadizhp",
    password: "chap.3d@sarvina",
    database: "shifi",
    synchronize: true,
    logging: false,
    entities: [User, Document, Token],
    migrations: [],
    subscribers: [],
})
