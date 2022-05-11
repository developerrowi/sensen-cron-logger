import express from 'express';
import cors from 'cors'
import morgan from 'morgan'
import fs from 'fs'
import winston from 'winston';
import  cron  from 'node-cron'
import moment from "moment"
var sys = require('util')
var exec = require('child_process').exec;


require('dotenv').config()


// logger 
let loggerOptions = {
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
};
export const logger = winston.createLogger(loggerOptions);




var cronJob =  (async () => {

    try {
       cron.schedule('0 0 */1 * * *', async () => {
        
  
        //   logger.info({message: "Iloveyou"})
          let manualTag: any = []

          const currentDate = new Date()  
          let logName = moment(currentDate).format('YYYY-MM-DDTHH:mm:ss')
          var ping = exec(`kubetail sensen-consumer -s 1h -n microservice | tee ${logName}-logs.txt`);
          ping.stdout.on('data', (data: any) => {
            console.log('' + data);
          });


 
      });
    }
    catch(e) {
        console.log(e)
    }

  })

cronJob()