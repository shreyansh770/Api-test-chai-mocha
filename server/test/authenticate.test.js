const chai  = require('chai')
const chaiHttp = require('chai-http')
const expect = chai.expect


const server = require('../app')


chai.use(chaiHttp)

describe('Authenticate api',()=>{

    it('authenticate user',(done)=>{
        chai.request(server)
        .post('/api/authenticate')
        .send({
            'email':"test@gmail.com",
            'password':"123456"
        })
        .end((err,response)=>{
            response.body.should.have.property('token');
            const {token} = response.body
            
            chai.request(server)
            .get('/api/all_posts')
            .set('cookie'+token)
            .end((err,response)=>{
                response.body.have.status(200)
            })
        })
        done()
    })
})
