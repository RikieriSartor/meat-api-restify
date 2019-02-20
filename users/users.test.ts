import 'jest'
import * as request from 'supertest'

let address: string = (<any>global).address
let auth: string = (<any>global).auth

test('get /users', ()=>{
    return request(address)
    .get('/users')
    .set('Authorization', auth)
    .then(response=>{
        expect(response.status).toBe(200)
        expect(response.body.items).toBeInstanceOf(Array)
    }).catch(fail)
})

test('post /users', ()=>{
    return request(address)
    .post('/users')
    .set('Authorization', auth)
    .send({
        name: 'Usuario de Teste',
        email: 'email@usuario.com',
        password: '12345678',
        cpf: '064.984.279-06'
    })
    .then(response=>{
        expect(response.status).toBe(200)
        expect(response.body._id).toBeDefined()
        expect(response.body.name).toBe('Usuario de Teste')
        expect(response.body.email).toBe('email@usuario.com')
        expect(response.body.cpf).toBe('064.984.279-06')
        expect(response.body.password).toBeUndefined()
    }).catch(fail)
})

test('get /users/aaa - not found', ()=>{
    return request(address)
    .get('/users/aaa')
    .set('Authorization', auth)
    .then(response=>{
        expect(response.status).toBe(404)
    }).catch(fail)
})

test('patch /users/:id', ()=>{
    return request(address)
    .post('/users')
    .set('Authorization', auth)
    .send({
        name: 'Usuario Dois',
        email: 'email@usuario2.com',
        password: '12345678'
    })
    .then(response=> request(address)
                     .patch(`/users/${response.body._id}`)
                     .set('Authorization', auth)
                     .send({name: 'Usuario de Teste Numero Dois'}))
    .then(response=>{
        expect(response.status).toBe(200)
        expect(response.body._id).toBeDefined()
        expect(response.body.name).toBe('Usuario de Teste Numero Dois')
        expect(response.body.email).toBe('email@usuario2.com')
        expect(response.body.password).toBeUndefined()
    })
    .catch(fail)
})