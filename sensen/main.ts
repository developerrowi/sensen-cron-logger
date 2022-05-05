import { pubsub } from "..";
import pkg from "../package.json"

export default class Main {

    constructor() { }

    async postToPubSub(data: any) {
        // 'Post to rabbitMQ here'
        try {

            let finalData: any = { jsonRequest: data }


            const publishId = await pubsub.topic(process.env.SENSEN_TOPIC!).publishMessage({ data: Buffer.from(JSON.stringify(finalData)) });
            return { data }
        } catch (error: any) {
            throw error
        }
    }

    async mapperSensenToRabbitMQ(data: any) {}
}