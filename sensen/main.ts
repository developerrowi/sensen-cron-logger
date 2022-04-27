import { pubsub } from "..";
import pkg from "../package.json"

export default class Main {

    constructor() { }

    async postToRabbitMQ(data: any) {
        // 'Post to rabbitMQ here'
        try {
            const publishId = await pubsub.topic(process.env.SENSEN_TOPIC!).publishMessage({ data: Buffer.from(JSON.stringify(data)) });
            console.log(data)
            return { data }
        } catch (error: any) {
            throw error
        }
    }

    async mapperSensenToRabbitMQ(data: any) {}
}