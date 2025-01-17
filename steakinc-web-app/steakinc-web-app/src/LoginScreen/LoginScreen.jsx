import './LoginScreen.css';

function LoginScreen() {
    return (
        <div className="container">
            <div className="login-container">
                <div className="login-title-wrapper">
                    <img src="\src/assets/highsteaks.png" alt="High Steaks Logo" className="logo" />
                    <h1 className="login-title-text">High Steaks</h1>
                </div>
                <form className="login-form">
                    <input type="text" placeholder="Username" className="input-field" />
                    <input type="password" placeholder="Password" className="input-field" />
                </form>
                <div className="login-button-wrapper">
                    <button type="submit" className="login-submit-button">Login</button>
                    <button className="forgot-password-button">Forgot Password?</button>
                    <button className="join-us-button">Haven't joined us yet?</button>
                </div>
            </div>
        </div>
    )
}

export default LoginScreen;