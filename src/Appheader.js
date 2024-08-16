import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Appheader = () => {
    const [displayusername, setDisplayUsername] = useState('');
    const [showmenu, setShowMenu] = useState(false);
    const [role, setRole] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const userId = localStorage.getItem("id");

    useEffect(() => {
        const jwttoken = localStorage.getItem('jwttoken');

        if (location.pathname === '/login' || location.pathname === '/' || location.pathname === '/register') {
            setShowMenu(false);
        } else {
            setShowMenu(true);

            if (!jwttoken) {
                navigate('/login'); // Redirect to login if token is not present
                return;
            } else {
                const name = localStorage.getItem('name');
                const role = localStorage.getItem('role');
                setDisplayUsername(name || '');
                setRole(role || '');
            }
        }
    }, [location.pathname, navigate]); // Only trigger useEffect on path change

    return (
        <div>
            {showmenu && (
                <div className="header">
                    {role === "admin" && (
                        <>
                            <Link to={`/admin/${userId}/adminhome`}>Admin Home</Link>
                            <Link to={`/admin/${userId}/userdetails`}>All User Details</Link>
                            <Link to={`/admin/${userId}/crud`}>CRUD</Link>
                        </>
                    )}

                    {role === 'customer' && (
                        <>
                            <Link to={`/customer/${userId}/customerhome`}>Customer Home</Link>
                            <Link to={`/customer/${userId}/crud`}>CRUD</Link>
                        </>
                    )}

                    <span style={{ marginLeft: '50%' }}>Welcome: <b>{displayusername}</b></span>
                    <Link
                        style={{ float: 'right' }}
                        to={'/login'}
                        onClick={() => {
                            localStorage.removeItem('jwttoken');
                            localStorage.removeItem('name');
                            localStorage.removeItem('role');
                            localStorage.removeItem('id');
                            navigate('/login');
                        }}
                    >
                        Logout
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Appheader;
