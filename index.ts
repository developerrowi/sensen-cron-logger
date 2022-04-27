import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import Main from './sensen/main';
import { PubSub } from '@google-cloud/pubsub';
import fs from 'fs'

require('dotenv').config()

let handlers = new Main()

// PubSub
// var creds: any = process.env.NODE_ENV === 'development' ?  fs.readFileSync(process.env.GOOGLE_APPLICATION_CREDENTIALS_ENCODED!) : process.env.GOOGLE_APPLICATION_CREDENTIALS_ENCODED!
// const pubsubCredentials = Buffer.from(creds, 'base64').toString('utf-8');
// export const pubsub = new PubSub({ credentials: JSON.parse(pubsubCredentials) });
export const pubsub = new PubSub();

const app = express()

app.use(helmet());

app.use(bodyParser.json());

app.use(cors());

app.use(morgan('combined'));

const secureMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // console.log(req.headers.authorization)
    if (!req.headers) return res.status(403).json({ error: 'Missing credentials' });
    let authorization: any = req.headers.authorization?.split(' ');
    const buff = Buffer.from(authorization[1], 'base64');
    let decodedAuth = buff.toString();

    if (decodedAuth === `${process.env.SENSEN_CONSUMER_USERNAME}:${process.env.SENSEN_CONSUMER_PASSWORD}`) {
        return next()
    }
    return res.status(403).json({ error: 'Unauthorized access' });
}

// health check
app.get('/', async (req, res) => {
    res.status(200).json({
        status: "OK",
    })
})

app.use(secureMiddleware)

app.post('/', async (req, res) => {
    try {
        const rabbitMQSend = await handlers.postToRabbitMQ(req.body)
        res.status(200).send(rabbitMQSend)
    } catch (error: any) {
        res.status(500).send({ error, step: "Error in publishing data to pubsub" });
    }
})

app.listen(3000, () => {
    console.log('The application is listening on port 3000!')
})