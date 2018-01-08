// We set the redis test DB instance to '1' so as to seperate between test and dev dbs
const redisdb = process.env.REDIS_DB = 1;

const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app');
const should = chai.should();
import redis from 'redis';
chai.use(chaiHttp);

// Set up redis with our preferred options
var client = redis.createClient({
  host : 'localhost' || process.env.REDIS_HOST,
  port : 6379 || process.env.REDIS_PORT
});


describe('API route Tests', () => {
  before((done) => { 
    // Before each test we clear the db
    client.select(redisdb, () => {
      client.flushdb();
    });
    done();
  });

  describe('/POST users', () => {
    it('should CREATE a new user', (done) => {
      let user = {
        first_name: "Irene",
        last_name: "Craig",
        email: "irene@test.com"
      };
      chai.request(app)
        .post('/api/users')
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.be.eql('User saved successfully!');
          done();
        });
    });
  });

  describe('/GET users', () => {
    it('should GET all the users', (done) => {
      chai.request(app)
        .get('/api/users')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(1);
          done();
        });
    });

    it('should GET the specified user', (done) => {
      chai.request(app)
        .get('/api/users/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.id.should.be.eql("1");
          res.body.first_name.should.be.eql("Irene");
          done();
        });
    });
  });

  describe('/PUT users', () => {
    it('should edit the specified user', (done) => {
      let editedUserFields = {
        first_name: "Edited",
        email: "edited_email@test.com"
      };
      chai.request(app)
        .put('/api/users/1')
        .send(editedUserFields)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.be.eql('User updated successfully!');
          chai.request(app)
            .get('/api/users/1')
            .end((err, res) => {
              res.should.have.status(200);
              res.body.should.be.a('object');
              res.body.id.should.be.eql("1");
              res.body.first_name.should.be.eql("Edited");
              res.body.email.should.be.eql("edited_email@test.com");
              done();
            });
        });
    });
  });

  describe('/DELETE users', () => {
    it('should DELETE the specified user', (done) => {
      chai.request(app)
        .delete('/api/users/1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.message.should.be.eql('User deleted successfully!');
          done();
        });
    });
  });

});

