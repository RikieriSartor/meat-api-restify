import 'jest'
import * as request from 'supertest'

let address: string = (<any>global).address
let auth: string = (<any>global).auth

test('get /restaurants', ()=>{
    return request(address)
    .get('/restaurants') 
    .set('Authorization', auth)
    .then(response=>{
        expect(response.status).toBe(200)
        expect(response.body.items).toBeInstanceOf(Array)
    }).catch(fail)
})

test('post /restaurants', ()=>{
    return request(address)
    .post('/restaurants')
    .set('Authorization', auth)
    .send({
        name: 'Fogo de Chão - USA'
    })
    .then(response=>{
        expect(response.status).toBe(200)
        expect(response.body._id).toBeDefined()
        expect(response.body.name).toBe('Fogo de Chão - USA')
    }).catch(fail)
})

test('get /restaurants/abc - not found', ()=>{
    return request(address)
    .get('/restaurants/abc')
    .set('Authorization', auth)
    .then(response=>{
        expect(response.status).toBe(404)
    }).catch(fail)
})