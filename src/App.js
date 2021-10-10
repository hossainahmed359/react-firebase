import './App.css';
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signInWithEmailAndPassword, sendPasswordResetEmail, FacebookAuthProvider, signOut } from "firebase/auth";
import initializeAuthentication from './Firebase/firebase.init';
import { useState } from 'react';

//firebase initialize
initializeAuthentication()
//google provider
const googleProvider = new GoogleAuthProvider();
//Facebook Provider
const facebookProvider = new FacebookAuthProvider();

/* ********************************* APP ********************************* */
function App() {
  /* AUTH */
  const auth = getAuth();
  //--------------------

  //USE-STATE
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(false);
  const [error, setError] = useState('');
  // console.log(name, email, password)

  //Name Function
  const handleName = e => {
    setName(e.target.value)
  }

  //Email Function
  const handleEmail = e => {
    setEmail(e.target.value)
  }

  //Password Function
  const handlePassword = e => {
    setPassword(e.target.value)
  }

  //Check Login
  const toggleLogin = e => {
    setIsLogin(e.target.checked)
  }

  // Set User Name
  const setUserName = () => {
    updateProfile(auth.currentUser, { displayName: name })
      .then((result) => {
        // Profile updated!
        // ...
      }).catch((error) => {
        // An error occurred
        setError(error)
        // ...
      });
  }

  //Verify Email
  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
      .then((result) => {
        // Email verification sent!
        console.log('sent')
      })
      .catch(error => console.log(error))
  }

  /* ****************** Create Account ****************** */

  const handleRegistration = e => {
    //Prevent Default Reloading behavior
    e.preventDefault();
    // console.log(1)
    if (password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }
    if (!/(?=.*[A-Z].*[A-Z])/.test(password)) {
      setError('Password must contain two uppercase');
      return;
    }
    isLogin ? handleLogin() : createNewAccount()
    setError('')

  }
  /* Handle Registration */
  const createNewAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((result) => {
        // Signed in 
        const user = result.user;
        setUserName()
        verifyEmail();
        console.log('success')
        // ...
      })
      .catch((error) => {
        setError(error.message);

      });
  }

  /* Handle Login */
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((result) => {
        // Signed in 
        console.log(result.user);
        setError('')
        // ...
      })
      .catch((error) => {
        setError(error.message);
      });
  }

  // Reset Password
  const resetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        setError(error.message)
      });
  }


  /* Google Sign In */
  const handleGoogleSignIn = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        console.log(user)
        setError('')
      }).catch((error) => {
        // Handle Errors here.
        setError(error.message)
      });
  }
  /* Facebook Sign in */
  const handleFacebookSignIn = () => {
    signInWithPopup(auth, facebookProvider)
      .then((result) => {
        // The signed-in user info.
        console.log(result.user);

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;

        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        setError(error.message)
      });
  }
  /* Sign out */
  const handleSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      console.log('Signed Out')
    }).catch((error) => {
      // An error happened.
    });
  }
  //
  return (
    <div className="">
      {/* form */}
      <div className="container">
        <div className="col-6 mx-auto my-5 p-5 border border-primary shadow rounded">
          <h2 className="text-center mb-5 text-primary">{isLogin ? 'Login' : 'Register'}</h2>
          {/* FORM Start */}
          {/* ***** Be careful***** onSubmit !onClick */}
          <form onSubmit={handleRegistration} className="row g-3">
            {!isLogin &&
              <div className="col-12">
                <label htmlFor="inputName" className="form-label">Name</label>
                <input onBlur={handleName} type="text" className="form-control" id="inputName" placeholder="Your Name Here" required />
              </div>}
            <div className="col-md-6">
              <label htmlFor="inputEmail4" className="form-label">Email</label>
              <input onBlur={handleEmail} type="email" className="form-control" id="inputEmail4" placeholder="@gmail.com" required />
            </div>
            <div className="col-md-6">
              <label htmlFor="inputPassword4" className="form-label">Password</label>
              <input onBlur={handlePassword} type="password" className="form-control" id="inputPassword4" placeholder="Your Password" required />
            </div>
            <p className="text-danger">{error}</p>
            <div className="col-12">
              <div className="form-check">
                <input onChange={toggleLogin} className="form-check-input" type="checkbox" id="gridCheck" />
                <label className="form-check-label" htmlFor="gridCheck">
                  Already Registered?
                </label>
              </div>
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary mb-2">Submit</button>
              <button onClick={resetPassword} className="btn btn-warning mx-5 mb-2">Reset Password</button>
              <button onClick={handleSignOut} className="btn btn-danger mx-5 mb-2">Sign Out</button>
              <p className=" text-muted">Or</p>
              {/* GOOGlE Sign In */}
              <button onClick={handleGoogleSignIn} className="btn btn-outline-success">Continue with Google</button>
              <button onClick={handleFacebookSignIn} className="mx-2 btn btn-outline-primary">Continue with Facebook</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
