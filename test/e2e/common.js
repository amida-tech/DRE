function login(api, username, password, done) {
    api
        .post('/api/v1/login')
        .send({
            'username': username,
            'password': password,

            'middleName':'Bacon',
            'firstName':'Kevin',
            'lastName':'Schmidt',
            'dob':'10/10/1980',
            'gender':'Male',
            'email':'kevin@ba.com'
        })
        .end(function(err, res) {
            if (err) throw err;
            done();
        });
}

function register(api, username, password, done) {
    api
        .post('/api/v1/register')
        .send({
            'username': username,
            'password': password,

            'middleName':'Bacon',
            'firstName':'Kevin',
            'lastName':'Schmidt',
            'dob':'10/10/1980',
            'gender':'Male',
            'email':'kevin@ba.com'
        })
        .end(function(err, res) {
            if (err) {
                throw err;
            }
            done();
        });
}

module.exports = {
    'login': login,
    'register': register
};
