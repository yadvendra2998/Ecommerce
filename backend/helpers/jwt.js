import expressjwt from 'express-jwt'

function authjwt() {
    const secret = process.env.secret
    return expressjwt({
        secret,
        algorithms:['HS256'],
        isRevoked: isRevoked
    }).unless({
        path:[
            {url:'/\/public\/uploads(.*)/',methods:['GET', 'OPTIONS']},
            {url:'/\/api\/v1\/products(.*)/',methods:['GET', 'OPTIONS']},
            {url:'/\/api\/v1\/categories(.*)/',methods:['GET', 'OPTIONS']},
            '/api/v1/users/login',
            '/api/v1/users/register'
        ]
    })
}

async function isRevoked( req, payload, done ) {
    if(!payload.isAdmin){
        done(null,true)
    }

    done()
}

export default authjwt