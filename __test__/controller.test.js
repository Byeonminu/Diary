jest.mock('../models')
const { Home_redirecting, Createpage, Create_process, 
        Document_update, Update_process, Document_delete,
        User_content_page, Contents_list_page } = require('../controllers/controller');
const { Writing, User } = require('../models');

const req = {
    user: [{
        nickname: 'aaa',
        identifier: 'aaa'
    }],
    body: { title: 'aaa', description: 'aaa' },
    params: { doc_identifier: 'aaa', user_identifier : 'aaa', identifier : 'aaa' },
    session: {
        isLogined : jest.fn(() => true),
        passport: {user: 'aaa'}
    }
}


describe('Home_redirecting_test', () => {

    const res = {
        redirect: jest.fn()
    }
    const next = jest.fn();
    test('1. Home_redirecting_test', () => {
        Home_redirecting(req,res,next);
        expect(res.redirect).toBeCalledTimes(1);
        expect(res.redirect).toBeCalledWith('/list/' + req.user[0].identifier);
    })
})

describe('Create_test',() => {

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
            Promise.resolve(true)
        );
        await Create_process(req,res,next);
        expect(res.redirect).toBeCalledTimes(1);
        expect(res.redirect).toBeCalledWith('/list/' + req.user[0].identifier);
    });

    test('2.2 Create_process_test - create failed', async () => {
        Writing.create.mockReturnValue(null);
        await Create_process(req, res, next);
        expect(res.redirect).toBeCalledTimes(0);
        expect(res.status).toBeCalledTimes(1);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledTimes(1);
        expect(res.send).toBeCalledWith('cannot create page');
    })

    test('2.3 Create_process_test - error', async() => {
        const error = 'err';
        Writing.create.mockReturnValue(Promise.reject(error));
        await Create_process(req,res,next);
        expect(res.redirect).toBeCalledTimes(0);
        expect(next).toBeCalledTimes(1);
        expect(next).toBeCalledWith(error);
    })
})

describe('Update_test', () =>{
    
    const res = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn(() => res),
        send: jest.fn()
    }
    let next = jest.fn();

    beforeEach(()=> {
        res.render = jest.fn()
        res.redirect = jest.fn()
        res.status = jest.fn(() => res)
        res.send = jest.fn()
        next = jest.fn()
    })
    test('3.1 Document_update_test - success', async() =>{
        const result = User.findAll.mockReturnValue(Promise.resolve(true));
        await Document_update(req, res, next);
        expect(res.render).toBeCalledTimes(1);
        expect(res.render).toBeCalledWith('update', { writing: result[0] });
    })

    test('3.2 Document_update_test - db failed', async () => {
        User.findAll.mockReturnValue(null);
        await Document_update(req, res, next);
        expect(res.render).toBeCalledTimes(0);
        expect(res.status).toBeCalledTimes(1);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledTimes(1);
        expect(res.send).toBeCalledWith('cannot fetch update page');
    })

    test('3.3 Document_update_test - error', async () => {
        const error = 'err';
        User.findAll.mockReturnValue(Promise.reject(error));
        await Document_update(req, res, next);
        expect(res.render).toBeCalledTimes(0);
        expect(next).toBeCalledTimes(1);
        expect(next).toBeCalledWith(error);
    })

    test('4.1 Update_process_test - success' , async()=> {
        Writing.update.mockReturnValue(Promise.resolve(true));
        await Update_process(req, res, next);
        expect(res.redirect).toBeCalledTimes(1);
        expect(res.redirect).toBeCalledWith('/list/' + req.user[0].identifier + '/' + req.body.doc_identifier);
    })

    test('4.2 Update_process_test - db failed', async () => {
        Writing.update.mockReturnValue(null);
        await Update_process(req, res, next);
        expect(res.redirect).toBeCalledTimes(0);
        expect(res.status).toBeCalledTimes(1);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledTimes(1);
        expect(res.send).toBeCalledWith('cannot update page');
    })

    test('4.3 Update_process_test - error', async () => {
        const error = 'err';
        Writing.update.mockReturnValue(Promise.reject(error));
        await Update_process(req, res, next);
        expect(res.redirect).toBeCalledTimes(0);
        expect(next).toBeCalledTimes(1);
        expect(next).toBeCalledWith(error);
    })
})


describe('Delete_test', () =>{
    const res = {
        redirect: jest.fn(),
        status: jest.fn(() => res),
        send: jest.fn()
    }
    const next = jest.fn();

    beforeEach(() => {
        res.redirect = jest.fn()
        res.status = jest.fn(() => res)
        res.send = jest.fn()
    })

    test('5.1 Document_delete_test - success', async() =>{
        Writing.destroy.mockReturnValue(Promise.resolve(true));
        await Document_delete(req,res,next);
        expect(res.redirect).toBeCalledTimes(1);
        expect(res.redirect).toBeCalledWith('/list');
    })

    test('5.2 Document_delete_test - db failed', async () => {
        Writing.destroy.mockReturnValue(null);
        await Document_delete(req, res, next);
        expect(res.redirect).toBeCalledTimes(0);
        expect(res.status).toBeCalledTimes(1);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledTimes(1);
        expect(res.send).toBeCalledWith('cannot delete page');
    })

    test('5.3 Document_delete_test - error', async () => {
        const error = 'err';
        Writing.destroy.mockReturnValue(Promise.reject(error));
        await Document_delete(req, res, next);
        expect(res.redirect).toBeCalledTimes(0);
        expect(next).toBeCalledTimes(1);
        expect(next).toBeCalledWith(error);
    })

})



describe('User_content_page_test', () => {
    const res = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn(() => res),
        send: jest.fn()
    }
    const next = jest.fn();

    beforeEach(() => {
        res.render = jest.fn()
        res.redirect = jest.fn()
        res.status = jest.fn(() => res)
        res.send = jest.fn()
    })

    test('6.1 User_content_page_test - success', async () => {
        Writing.findAll.mockReturnValue(Promise.resolve(true));
        const result = User.findAll.mockReturnValue(Promise.resolve(true));
        await User_content_page(req, res, next);
        expect(res.render).toBeCalledTimes(1);
        expect(res.status).toBeCalledTimes(0);
        expect(res.send).toBeCalledTimes(0);
    })

    test('6.2 User_content_page_test - db failed 1', async () => {
        Writing.findAll.mockReturnValue(Promise.resolve(true));
        User.findAll.mockReturnValue(null);
        await User_content_page(req, res, next);
        expect(res.render).toBeCalledTimes(0);
        expect(res.redirect).toBeCalledTimes(1);
        expect(res.redirect).toBeCalledWith('/home');

    })

    test('6.3 User_content_page_test - db failed 2', async () => {
        Writing.findAll.mockReturnValue(null);
        User.findAll.mockReturnValue(Promise.resolve(null));
        await User_content_page(req, res, next);
        expect(res.render).toBeCalledTimes(0);
        expect(res.redirect).toBeCalledTimes(1);
        expect(res.redirect).toBeCalledWith('/home');

    })

    test('6.4 User_content_page_test - error 1', async () => {
        const error = 'err';
        Writing.findAll.mockReturnValue(Promise.reject(error));
        await User_content_page(req, res, next);
        expect(next).toBeCalledTimes(1);
        expect(next).toBeCalledWith(error);

    })
    test('6.5 User_content_page_test - error 2', async () => {
        const error = 'err';
        User.findAll.mockReturnValue(Promise.resolve(error));

        await User_content_page(req, res, next);
        expect(next).toBeCalledTimes(1);
        expect(next).toBeCalledWith(error);

    })


})


describe('Contents_list_page_test', () => {
    const res = {
        render: jest.fn(),
        redirect: jest.fn(),
        status: jest.fn(() => res),
        send: jest.fn()
    }
    const next = jest.fn();

    beforeEach(() => {
        res.render = jest.fn()
        res.redirect = jest.fn()
        res.status = jest.fn(() => res)
        res.send = jest.fn()
    })

    test('7.1 Contents_list_page_test - success', async () => {
        Writing.findAll.mockReturnValue(Promise.resolve(true));
        await Contents_list_page(req, res, next);
        expect(res.render).toBeCalledTimes(1);
        expect(res.status).toBeCalledTimes(0);
        expect(res.send).toBeCalledTimes(0);
    })

    test('7.2 Contents_list_page_test - db failed', async () => {
        Writing.findAll.mockReturnValue(null);
        await Contents_list_page(req, res, next);
        expect(res.render).toBeCalledTimes(0);
        expect(res.status).toBeCalledTimes(1);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledTimes(1);
        expect(res.send).toBeCalledWith('cannot fetch contents list page');
    })

    test('7.3 Contents_list_page_test - error', async () => {
        const error = 'err';
        Writing.findAll.mockReturnValue(Promise.reject(error));
        await Contents_list_page(req, res, next);
        expect(res.render).toBeCalledTimes(0);
        expect(next).toBeCalledTimes(1);
        expect(next).toBeCalledWith(error);
    })

})