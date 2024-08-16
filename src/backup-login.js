import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import config from "./config/config";

const Login = () => {
    const [email, emailupdate] = useState('');
    // const [username, usernameupdate] = useState('');
    const [password, passwordupdate] = useState('');

    const usenavigate = useNavigate();

    useEffect(() => {
        sessionStorage.clear();
    }, []);

    const ProceedLoginusingAPI = async (e) => {
        e.preventDefault();
        if (validate()) {
            ///implentation
            // console.log('proceed');
            try {
            let inputobj={"email": email,
            "password": password};
            const response = await fetch("https://api.escuelajs.co/api/v1/auth/login",{
                method:'POST',
                headers:{'content-type':'application/json'},
                body:JSON.stringify(inputobj)
            });

            //Check if the response is okay
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }

            const data =  await response.json();
            console.log("Data is:", data);
            
                if (Object.keys(data).length === 0) {
                    toast.error('Login failed, invalid credentials');
                }else{
                     toast.success('Success');
                     localStorage.setItem('email',email);
                     localStorage.setItem('role', data.role);
                     localStorage.setItem('jwttoken',data.access_token);
                        usenavigate('/user')
                }
            }catch(error){
                console.log("Error is: ",error.message);
            }
        }
    }

    // const ProceedLogin = async (e) => {
    //     e.preventDefault();
        
    //     if (validate()) {
    //         try {
    //             // Fetch user data from the API
    //             const response = await fetch (`${config.API_URL}/user/` + username);
                
    //             // Check if the response is okay
    //             if (!response.ok) {
    //                 throw new Error('Failed to fetch user data');
    //             }
    
    //             const data = await response.json();
    
    //             // Handle the case where no user data is found
    //             if (Object.keys(data).length === 0) {
    //                 toast.error('Login failed, invalid credentials');
    //             } else {
    //                 // Validate the password
    //                 if (data.password === password) {
    //                     toast.success('Success');
    //                     sessionStorage.setItem('username', username);
    //                     sessionStorage.setItem('userrole', data.role);
    
    //                     // Navigate based on the user's role
    //                     if (data.role === 'admin') {
    //                         usenavigate('/adminhome');
    //                     } else {
    //                         usenavigate('/user');
    //                     }
    //                 } else {
    //                     toast.error('Please enter valid credentials');
    //                 }
    //             }
    //         } catch (err) {
    //             toast.error('Login failed due to: ' + err.message);
    //         }
    //     }
    // };
    

    const validate = () => {
        let result = true;
        // if (username === '' || username === null) {
            if (email === '' || email === null) {
            result = false;
            toast.warning('Please enter username');
        }
        if (password === '' || password === null) {
            result = false;
            toast.warning('Please enter password');
        }
        return result;
    };

    return (
        <div className="row">
            <div className="offset-lg-3 col-lg-6" style={{ marginTop: '100px' }}>
                <form onSubmit={ProceedLoginusingAPI} className="container">
                    <div className="card">
                        <div className="card-header">
                            <h2>User Login</h2>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <label>Email <span className="errmsg">*</span></label>
                                {/* <label>User Name <span className="errmsg">*</span></label> */}
                                {/* <input value={username} onChange={e => usernameupdate(e.target.value)} className="form-control" /> */}
                                <input value={email} onChange={e => emailupdate(e.target.value)} className="form-control" />

                            </div>
                            <div className="form-group">
                                <label>Password <span className="errmsg">*</span></label>
                                <input type="password" value={password} onChange={e => passwordupdate(e.target.value)} className="form-control" />
                            </div>
                        </div>
                        <div className="card-footer">
                            <button type="submit" className="btn btn-primary">Login</button> |
                            <Link className="btn btn-success" to={'/register'}>New User</Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;
