jest.mock('../models')
const { Home_redirecting, Createpage, Create_process} = require('../controllers/controller');
const { Writing } = require('../models');

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

describe('Create_test',() => {
    const req = {
        user : [{
            nickname: 'aaa',
            identifier:'aaa'  
        }],
        body: { title: 'aaa' , description: 'aaa'},
        
    }
    const res ={
        render:jest.fn(),
        redirect:jest.fn(),
        status: jest.fn(() => res),
        send: jest.fn()
    }
    const next = jest.fn();

    beforeEach(() =>{
        res.redirect =  jest.fn()
    })
    test('1. Createpage_test', () =>{
        Createpage(req, res, next);
        expect(res.render).toBeCalledTimes(1);
        expect(res.render).toBeCalledWith('create', { nickname: req.user[0].nickname });
    });

    test('2.1 Create_process_test - create success', async() =>{
        Writing.create.mockReturnValue(
            Promise.resolve({
                user_identifier: 'aaa',
                title: 'aaa',
                description: 'aaa',
                doc_identifier: 'aaa',
                Create_process(value){
                    Promise.resolve(true);
                }
            })
        );
        await Create_process(req,res,next);
        expect(res.redirect).toBeCalledTimes(1);
        
    });

    test('2.2 Create_process_test - create failed', async () => {
        Writing.create.mockReturnValue(null);
        await Create_process(req, res, next);
        expect(res.redirect).toBeCalledTimes(0);
        expect(res.status).toBeCalledTimes(1);
        expect(res.send).toBeCalledTimes(1);
        expect(res.send).toBeCalledWith('cannot create page');
    })

    test('2.3 Create_process_test - error', async() => {
        const error = 'err';
        Writing.create.mockReturnValue(Promise.reject(error));
        await Create_process(req,res,next);
        expect(next).toBeCalledTimes(1);
        expect(next).toBeCalledWith(error);
    })
})