function login(api, username, password, done) {
    api
        .post('/api/v1/login')
        .send({
            'username': username,
            'password': password
        })
        .end(function(err, res) {
            if (err) throw err;
            done();
        });
}


module.exports = {'login': login};