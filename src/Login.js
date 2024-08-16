// Login.js
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
        localStorage.clear();
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
                if (!response.ok || response.status === 401) {
                    // throw new Error('Failed to fetch user data');
                    toast.warning("Invalid Credentials");
                }else{
                const data =  await response.json();
                toast.success('Success');
                // localStorage.setItem('email', email);
                localStorage.setItem('jwttoken', data.access_token);
                localStorage.setItem('refreshToken', data.refresh_token);
                console.log("Data is:", data);
        
                // Fetch user profile data
                const profileResponse = await fetch("https://api.escuelajs.co/api/v1/auth/profile", {
                    headers: {
                        'Authorization': 'bearer ' + data.access_token
                    }
                });

                if (!profileResponse.ok) {
                    throw new Error('Failed to fetch profile data');
                    // toast.warning("Failed to fetch profile data");
                }
                
                const profileData = await profileResponse.json();

                if (!profileData.role) {
                    toast.error('Role not found in the response.');
                }
                localStorage.setItem('id', profileData.id);
                localStorage.setItem('name', profileData.name);
                console.log("LoggedIn User Role is:", profileData.role)
                localStorage.setItem('role', profileData.role);
                console.log("Profile Data is:", profileData);
                
                // Navigate to the user's profile page with their ID or email
                if(profileData.role === 'admin'){
                    usenavigate(`/admin/${profileData.id}/adminhome`);
                }else{
                    usenavigate(`/customer/${profileData.id}/customerhome`);
                }
            }
            }catch(error){
                console.log("Error is: ",error.message);
            }
        }
    }

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
