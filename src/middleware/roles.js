module.exports = {
    user: ['/api/user', '/api/user/account', '/api/user/delete'],
    admin: [
        '/api/admin',
        '/api/user',
        '/api/user/account',
        '/api/user/delete',
        '/api/admin/users/*',
        '/api/quotes',
        '/api/upload',
        '/api/listing',
        '/api/category',
    ],
}
