const {Home_redirecting} = require('../controllers/controller');

describe('Home_redirecting_test', () => {
    const req = {
        user: [ {identifier: 'aaa'} ]
    }
    const res = {
        redirect: jest.fn()
    }
    const next = jest.fn();
    test('1. home_redirect_test', () => {
        Home_redirecting(req,res,next);
        expect(res.redirect).toBeCalledTimes(1);
        expect(res.redirect).toBeCalledWith('/list/' + req.user[0].identifier);
    })
})