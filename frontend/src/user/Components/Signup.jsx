import '../Components/signup.css'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import jwt_decode from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { setUserDetails } from '../../redux/userSlice'

function Signup() {
    const [user, setUser] = useState({ username: '', email: '', password: '' })
    const dispatch = useDispatch()
    const navigate = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem('user')
        if (token) {
            navigate('/')
        }
    }, [])
    const handleSubmit = async (e) => {
        e.preventDefault()
        const { username, email, password } = user
        if (!username) {
            toast.error('username required')
        } else if (!email) {
            toast.error('email required !')
        } else if (!password) {
            toast.error('password required !')
        } else {
            try {
                const response = await axios.post(process.env.REACT_APP_URL + '/signup', { user })
                const data = response.data
                console.log(response, 456, data);
                console.log(response.status);
                if (response.status === 200) {
                    localStorage.setItem('user', response.data.token)
                    navigate('/')
                }
            } catch ({ response }) {
                if (response.status == 401) {
                    toast.error(response.data.message)
                }
            }

        }
    }
    async function googleSuccess(response) {

        const decoded = jwt_decode(response.credential)

        const user = {
            username: decoded.name,
            email: decoded.email,
            password: decoded.sub,
            image: decoded.picture
        }
        try {
            const respo = await axios.post(process.env.REACT_APP_URL + '/signup', { user })

            const { data } = respo
            dispatch(
                setUserDetails({
                    id: data.user._id,
                    username: data.user.username,
                    email: data.user.email,
                    phone: data.user?.phone,
                    image: data.user?.image,
                    dob: data.user?.dob,
                    license: {
                        front: data.user.license?.front,
                        back: data.user.license?.back,
                    }
                })
            )
            localStorage.setItem('user', respo.data.token)
            navigate('/')
        } catch (error) {

            if (error.response.status == 401) {
                return toast.error(error.response.data.message)
            }
        }

    }
    function googleError(response) {
        console.log('error', response);
    }
    return (

        <div className="formContainer">
            <div className="formWrapper">
                <span className="logo">chat app</span>
                <span className="title">Register</span>
                <form onSubmit={handleSubmit} >
                    <input type="text" name='username' onChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })} placeholder='name' />
                    <input type="email" name='email' onChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })} placeholder='email' />
                    <input type="password" name='password' onChange={(e) => setUser({ ...user, [e.target.name]: e.target.value })} placeholder='password' />

                    <button>Sign up</button>
                </form>
                <GoogleLogin onSuccess={googleSuccess} onError={googleError} />
                <p>You do have an account? <span onClick={() => navigate('/login')}>Login</span></p>
            </div>
            <ToastContainer />
        </div>

    )
}

export default Signup