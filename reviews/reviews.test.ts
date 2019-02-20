import 'jest'
import * as request from 'supertest'

let address: string = (<any>global).address
let auth: string = (<any>global).auth

test('get /reviews', ()=>{
    return request(address)
    .get('/reviews')
    .set('Authorization', auth)
    .then(response=>{
        expect(response.status).toBe(200)
        expect(response.body.items).toBeInstanceOf(Array)
    }).catch(fail)
})

test('post /reviews', ()=>{
    return request(address)
    .post('/reviews') 
    .set('Authorization', auth)
    .send({
        date: '2018-08-20T23:20:10',
        rating: 4,
        comments: 'Awesome!',
        user: '5c33efe01f4aab45b8540bc1',
        restaurant: '5c3b67d9d9a6f02ea411a3a3'
    })
    .then(response=>{
        expect(response.status).toBe(200)
        expect(response.body._id).toBeDefined()
        expect(response.body.date).toBe('2018-08-21T02:20:10.000Z')
        expect(response.body.rating).toBe(4)
        expect(response.body.comments).toBe('Awesome!')
        expect(response.body.user).toBe('5c33efe01f4aab45b8540bc1')
        expect(response.body.restaurant).toBe('5c3b67d9d9a6f02ea411a3a3')
    }).catch(fail)
})

test('get /reviews/abc - not found', ()=>{
    return request(address)
    .get('/reviews/abc')
    .set('Authorization', auth)
    .then(response=>{
        expect(response.status).toBe(404)
    }).catch(fail)
})