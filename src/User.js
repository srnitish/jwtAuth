import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from './auth/AuthContext'; // Import useAuth
import {jwtDecode} from 'jwt-decode';


const User = () => {
    const { id } = useParams(); // Get the user ID from the URL
    const navigate = useNavigate();
    const { isAuthenticated, handleTokenRefresh } = useAuth(); // Get authentication status from context
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login'); // Redirect to login if not authenticated
            return;
        }

        const fetchProfileData = async () => {
            let jwttoken = localStorage.getItem('jwttoken');

            if (!jwttoken) {
                navigate('/login'); // Redirect if no token
                return;
            }

            try {
                //Decode JWT to check its expiration (require a library like jwt decode)
                const {exp} = jwtDecode(jwttoken); // Decode JWT payload
                if (exp * 1000 < Date.now()){
                    await handleTokenRefresh(localStorage.getItem('refreshToken'));
                   jwttoken =  localStorage.getItem('jwttoken');
                }
    
                const response = await fetch(`https://api.escuelajs.co/api/v1/users/${id}`, {
                    headers: {
                        'Authorization': 'bearer ' + jwttoken
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch profile data');
                }

                const data = await response.json();
                setUserData(data);
                console.log("UserData:", data);
            } catch (err) {
                console.error(err.message);
                navigate('/login'); // Redirect if an error occurs
            }
        };

        fetchProfileData();
    }, [id, isAuthenticated, handleTokenRefresh, navigate]);

    return (
        <div>
            <h1 className="text-center">User Dashboard</h1>
            {userData && (
                <div>
                    <p>Name: {userData.name}</p>
                    <p>Email: {userData.email}</p>
                    {/* Display other user data as needed */}
                </div>
            )}
        </div>
    );
}

export default User;
