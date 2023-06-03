let chai =require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect
chai.use(chaiHttp);

describe("user Api testing",() =>{
    it("should return 200 for the users",(done) =>{
        chai.request('http://127.0.0.1:7710')
        .get('/users') 
        .then((res) =>{
            expect(res).to.have.status(200);
            done()
        })
        .catch((err) =>{
            throw err
        })
    })
    it("should return 404 for the user",(done) =>{
        chai.request('http://127.0.0.1:7710')
        .get('/user') 
        .then((res) =>{
            expect(res).to.have.status(404);
            done()
        })
        .catch((err) =>{
            throw err
        })
    })
    it("should return 200 for the add User",(done) =>{
        chai.request('http://127.0.0.1:7710')
        .post('/addUser')
        .send({"name":"Test User","isActive":false}) 
        .then((res) =>{
            expect(res).to.have.status(200);
            done()
        })
        .catch((err) =>{
            throw err
        })
    })
})