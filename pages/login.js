import { useRef, useContext, useEffect } from 'react';
import { UserContext } from '../context/UserContext';
import { useRouter } from 'next/router';
import axios from 'axios';
import bcrypt from 'bcryptjs';

export default function Login() {
    const { setUser } = useContext(UserContext);

    const usernameRef = useRef();
    const passwordRef = useRef();
    const keepLoggedInRef = useRef();

    const router = useRouter();
    
    function createUser(credentials) {
        return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/user/create`, credentials)
            .then( res => {
                console.log(res);
                return res.data.id;
            });
    }

    const handleLogin = ev => {
        ev.preventDefault();
        
        const password = passwordRef.current.value;
        const hashedPW = bcrypt.hashSync(password, 10);

        const credentials = {
            username: usernameRef.current.value,
            password: hashedPW,
        }

        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/login/${credentials.username}`)
            .then( async res => {
                if ( res.data.length === 0 ){
                    credentials['id'] = await createUser(credentials)
                } else {
                    [...res.data].forEach( async user => {
                        if ( bcrypt.compareSync(password, user.password)) {
                            credentials['id'] = user.id;
                            credentials['accounts'] = user.metadata;
                        } else {
                            credentials['id'] = await createUser(credentials);
                        }
                    })
                }

                if (credentials.id) {
                    setUser({...credentials, password});
                    if (keepLoggedInRef.current.checked)
                        localStorage.setItem('peeweeman-user', JSON.stringify({ id: credentials.id, username: credentials.username, password}));

                    router.push('/home');
                }
            });
    }

    return (
        <div className='container-xl d-flex flex-column justify-content-center align-items-center' style={{minHeight: '100vh'}}>
            <h1>Password Manager</h1>
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input type="username" className="form-control" id="username" aria-describedby="usernameHelp" ref={usernameRef} />
                    <div id="usernameHelp" className="form-text">No registration needed.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" ref={passwordRef} />
                </div>
                <div className="mb-3 form-check">
                    <input type="checkbox" className="form-check-input" id="keepLoggedIn" ref={keepLoggedInRef} />
                    <label className="form-check-label" htmlFor="keepLoggedIn">Keep me logged in</label>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}
