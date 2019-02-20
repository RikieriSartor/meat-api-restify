import * as restify from 'restify'
import { ForbiddenError } from 'restify-errors';

export const authorize: (...profiles: string[]) => restify.RequestHandler = (...profiles) => {
    return(req, res, next) => {
        if (req.authenticated !== undefined && req.authenticated.hasAny(...profiles)){
            //Loga usuário autenticado com sucesso
            req.log.debug(
                'User %s is authorized with profiles %j on route %s. Required profiles %j.',
                req.authenticated._id, 
                req.authenticated.profiles,
                req.path(),
                profiles
            )
            next()
        }else{
            if(req.authenticated){
                //Loga permissão negada exibindo os perfis do user naquele momento + 
                req.log.debug(
                    'Permision denied for %s. User profiles: %j. Required profiles: %j.',
                    req.authenticated._id, 
                    req.authenticated.profiles,
                    profiles
                )
            }
            next(new ForbiddenError('Permision denied'))
        }
    }
}