import { pubsub } from "..";
import pkg from "../package.json"

export default class Main {

    constructor() { }

    async postToPubSub(data: any) {
        // 'Post to rabbitMQ here'
        try {
            let mainData = Buffer.from(JSON.stringify(data))


            let finalData: any = {
                context: {
                    data: {
                        message: mainData
                    }
                }
            }

            const publishId = await pubsub.topic(process.env.SENSEN_TOPIC!).publishMessage({ data: finalData });
            console.log(data)
            return { data }
        } catch (error: any) {
            throw error
        }
    }

    async mapperSensenToRabbitMQ(data: any) {}
}