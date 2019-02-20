import * as fs from 'fs'
import * as restify from 'restify'
import * as mongoose from 'mongoose'
import { Router } from './../common/router';
import { handleError } from './error.handler';
import { environment } from './../common/environment';
import { mergePatchBodyParser } from './merge-patch.parser';
import { tokenParser } from '../security/token.parser';
import { logger } from '../common/logger';

export class Server {

    application: restify.Server

    initializeDb(){
        (<any>mongoose).Promise = global.Promise
        return mongoose.connect(environment.db.url, {
            useNewUrlParser: true
        })
    }

    initRoutes(routers: Router[]): Promise<any>{
        return new Promise((resolve, reject)=>{
            try{
                const options: restify.ServerOptions = {
                    name: 'meat-api',
                    version: '1.0.0',
                    log: logger
                }

                if (environment.security.enableHTTPS){
                    options.certificate = fs.readFileSync(environment.security.certificate)
                    options.key = fs.readFileSync(environment.security.key)
                }

                this.application = restify.createServer(options)

                //Logs
                this.application.pre(restify.plugins.requestLogger({
                    log: logger
                }))

                this.application.use(restify.plugins.queryParser())
                this.application.use(restify.plugins.bodyParser())
                this.application.use(mergePatchBodyParser)
                this.application.use(tokenParser)

                //routes
                for (let router of routers){ 
                    router.applyRoutes(this.application)
                }

                this.application.listen(environment.server.port, ()=>{
                    resolve(this.application)
                })

                this.application.on('restifyError', handleError)
                this.application.on('after', restify.plugins.auditLogger({
                    log: logger,
                    event: 'after',
                    server: this.application
                }))

            }catch(error){
                reject(error)
            }
        })
    }

    bootstrap(routers: Router[] = []): Promise<Server>{
        return this.initializeDb().then( () => 
               this.initRoutes(routers).then( ()=>this ) )
    }

    shutdown(){
        return mongoose.disconnect()
                       .then(()=>{
                           this.application.close()
                       })
    }
}