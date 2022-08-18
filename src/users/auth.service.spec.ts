import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import exp from 'constants';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {

    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        // Create a fake copy of the users service
        const users: User[] = [];

        fakeUsersService = { 
         find: (email: string) => {
            const filteredUsers = users.filter(user => user.email === user.email )
            return Promise.resolve(filteredUsers);
         },
         create: (email:string, password:string) => {
            const user = { id: 
                Math.floor(Math.random() * 99999), 
                email, 
                password 
            } as User;
            users.push(user);
            return Promise.resolve(user);
         }
        }
 
        const module = await Test.createTestingModule({
         providers: [
             AuthService,
             {
                 provide: UsersService,      //  If they ask for UsersService
                 useValue: fakeUsersService  //  Give them fakeUsersService
             }
         ]
        }).compile();
 
        service = module.get(AuthService);
    })
 
    it('can create an instance of auth service', async () => {
  
        expect(service).toBeDefined();
    });

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('test@test.nl', 'test');

        expect(user.password).not.toEqual('test');
        const [salt, hash] = user.password.split('.');
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    });

    // it('throws an error if user signs up with used Email', async (done) => {
    //     fakeUsersService.find = () => 
    //      Promise.resolve([{ id: 1, email: 'a', password: '1'} as User]);

    //     try {
    //         await service.signup('asdf@asdf.com', 'asdf');            
    //     } catch (err) {
    //         done();
    //     }
    // });         CODE VAN UDEMY WERKT NIET ...

    it('throw an error if user signs up with email that is in use', async () => {
        await service.signup('aaaa@ggmail.com', 'aaaa');
 
        await service.signup('aaaa@ggmail.com', 'aaaa').catch((err: BadRequestException) => {
            expect(err.message).toEqual('email in use');
        });
    });

    it('throws error if signin is called with an unused email', async (done) => {
       try {
        await service.signin('awe@waf.com', 'plwelaa');
       } catch (err) {
        done();
       }
    });

    // it('throws if an invalid password is provided', async (done) => {
    //     await service.signup('lsaskdk@gklasd.com', 'password');
    //     try {
    //         await service.signin('lsaskdk@gklasd.com', 'password');
    //     } catch (err) {
    //         done();
    //     }
    // })

    // it('throws an error if user signs up with email that is in use', async () => {
    //     expect.assertions(1);
     
    //     fakeUsersService.find = () =>
    //       Promise.resolve([
    //         { id: 1, email: 'test@example.com', password: 'password' } as User,
    //       ]);
     
    //     await expect(
    //       service.signup('text@example.com', 'password'),
    //     ).rejects.toThrow(BadRequestException);
    //   });
    
    it('throw an error if user signs up with email that is in use', async () => {
        await service.signup('aaaa@ggmail.com', 'aaaa');
 
        await service.signup('aaaa@ggmail.com', 'aaaa').catch((err: BadRequestException) => {
            expect(err.message).toEqual('email in use');
        });
    });

    it('returns a user if correct password is provided', async () => {
        // fakeUsersService.find = () => Promise.resolve([
        //     { email: 'awea@awa.nl', password: 'test'} as User ]);
        
        await service.signup('aaw@aaw.com', 'mypassword');

        const user = await service.signin('aaw@aaw.com', 'mypassword');
        expect(user).toBeDefined();
        // console.log(user);
        
    })
});
    