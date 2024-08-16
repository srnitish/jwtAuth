//Customer.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Crud = () => {
    const [custlist, custupdate] = useState([]);
    const [haveedit, editchange] = useState(false);
    const [haveview, viewchange] = useState(false);
    const [haveadd, addchange] = useState(false);
    const [haveremove, removechange] = useState(false);

    const navigate=useNavigate();

    
    useEffect(() => {
        const role = localStorage.getItem('role');
        if(!role || role ===''){
            toast.warning('you are not authrorized to access this page');
            navigate('/');
            return;
        }     
        GetUserAccess();
        loadcustomer();
       
    }, [navigate]);

    const loadcustomer = async () => {
        const response = await fetch("http://localhost:5000/customer");
            if (!response.ok) {
                throw new Error("Failed to get the the customer data.");
                return false;
            }
            const data = await response.json();
            custupdate(data);
            console.log("Customer Data", data);
    }

    const GetUserAccess = async () => {
        const role = localStorage.getItem('role') != null ? localStorage.getItem('role').toString() : '';
        const response = await fetch("http://localhost:5000/roleaccess?role=" + role + "&menu=customer");
            if (!response.ok) {
                navigate('/');
                toast.warning('You are not authorized to access');
                return false;
            }
            const data = await response.json();
            console.log("data", data);

            if (data.length > 0) {
                viewchange(true);
                let userobj = data[0];
                editchange(userobj.haveedit);
                addchange(userobj.haveadd);
                removechange(userobj.havedelete);
            }
            // else{
            //     navigate('/');
            // toast.warning('You are not authorized to access');
            // }
    }

    const handleadd = () => {
        if(haveadd){
        toast.success('added')
        }else{
            toast.warning('You are not having access for add');
        }
    }
    const handleedit = () => {
        if(haveedit){
        toast.success('edited')
        }
        else{
            toast.warning('You are not having access for Edit');
        }
    }

    const handleremove = () => {
        if(haveremove){
        toast.success('removed')
        }else{
            toast.warning('You are not having access for remove');
        }
    }


    return (
        <div className="container">
            <div className="card">
                <div className="card-header">
                    <h3>Customer Listing</h3>
                </div>
                <div className="card-body">
                    <button onClick={handleadd} className="btn btn-success">Add (+)</button>
                    <br></br>
                    <table className="table table-bordered">
                        <thead className="bg-dark text-white">
                            <tr>
                                <th>Code</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {custlist &&
                                custlist.map(item => (
                                    <tr key={item.code}>
                                        <td>{item.code}</td>
                                        <td>{item.name}</td>
                                        <td>{item.email}</td>
                                        <td>
                                            <button onClick={handleedit} className="btn btn-primary" disabled={!haveedit}>Edit</button> |
                                            <button onClick={handleremove} className="btn btn-danger" disabled={!haveremove}>Remove</button>
                                        </td>

                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Crud;