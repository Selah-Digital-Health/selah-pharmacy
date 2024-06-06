import { useRef, useState, useEffect } from "react";
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from '../api/axios';
import { Link } from "react-router-dom";

// const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/register';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RX_REGEX = /^([C,N.-])(?=.*[0-9]).{6,8}$/;


const Register = () => {
    // const userRef = useRef();
    const errRef = useRef();
    const firstNameRef = useRef();
    const emailRef = useRef();
    const lastNameRef = useRef();
    const rxNumberRef = useRef();
    const birthDateRef = useRef();
    const mobileRef = useRef();

    // const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    // const [userFocus, setUserFocus] = useState(false);

    const [firstName, setFirstName] = useState('');
    const [firstNameFocus, setFirstNameFocus] = useState(false);

    const [lastName, setLastName] = useState('');
    const [lastNameFocus, setLastNameFocus] = useState(false);

    const [mobile, setMobile] = useState('');
    const [validMobile, setValidMobile] = useState(false);
    const [mobileFocus, setMobileFocus] = useState(false);

    const [birthDate, setBirthDate] = useState('');
    const [validDate, setValidDate] = useState(false);
    const [birthDateFocus, setBirthDateFocus] = useState(false);

    const [rx, setRx] = useState('');
    const [validRx, setValidRx] = useState(false);
    const [rxFocus, setRxFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        emailRef.current.focus();
    }, [])

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setValidRx(RX_REGEX.test(rx));
    }, [rx]);

    useEffect(() => {
        setErrMsg('');
    }, [email, pwd, matchPwd])

    const formatPhoneNumber = (value) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, '');
        const phoneNumberLength = phoneNumber.length;
    
        if (phoneNumberLength < 4) return phoneNumber;
        if (phoneNumberLength < 7) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
        }
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    };

    const handlePhoneNumberChange = (e) => {
        const formattedPhoneNumber = formatPhoneNumber(e.target.value);
        setMobile(formattedPhoneNumber);
        setValidMobile(formattedPhoneNumber.length === 12); // Checks if the phone number is fully formatted
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if button enabled with JS hack
        const v1 = EMAIL_REGEX.test(email);   //changed from user  const v1 = USER_REGEX.test(user);
        const v2 = PWD_REGEX.test(pwd);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }
        try {
            const response = await axios.post(REGISTER_URL,
                JSON.stringify({ email, pwd }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            // TODO: remove console.logs before deployment
            console.log(JSON.stringify(response?.data));
            //console.log(JSON.stringify(response))
            setSuccess(true);
            //clear state and controlled inputs
            // setUser('');    removed for email > username implementation
            setPwd('');
            setMatchPwd('');
            setEmail('');
        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setErrMsg('Username Taken');
            } else {
                setErrMsg('Registration Failed')
            }
            errRef.current.focus();
        }
    }

    return (
        <>
            {success ? (
                <section>
                    <h1>Success!</h1>
                    <p>
                        <a href="#">Sign In</a>
                    </p>
                </section>
            ) : (
                <roundedSectionScroll>
                    <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                    <h1>Sign-Up</h1>
                    <form onSubmit={handleSubmit}>
                        
                        <label>
                            First Name:
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            placeholder="Jill"
                            ref={firstNameRef}
                            autoComplete="off"
                            onChange={(e) => setFirstName(e.target.value)}
                            value={firstName}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="firstNameNote"
                            onFocus={() => setFirstNameFocus(true)}
                            onBlur={() => setFirstNameFocus(false)}
                        />

                        <label>
                            Last Name:
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            placeholder="Doe"
                            ref={lastNameRef}
                            autoComplete="off"
                            onChange={(e) => setLastName(e.target.value)}
                            value={lastName}
                            required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="lastNameNote"
                            onFocus={() => setLastNameFocus(true)}
                            onBlur={() => setLastNameFocus(false)}
                        />

                        <label htmlFor="email">
                            Email:
                            <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="example@email.com"
                            ref={emailRef}
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                            aria-invalid={validEmail ? "false" : "true"}
                            aria-describedby="emailnote"
                            onFocus={() => setEmailFocus(true)}
                            onBlur={() => setEmailFocus(false)}
                        />
                        <p id="emailnote" className={emailFocus && email && !validEmail ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Please enter a valid email address.
                        </p>

                        <label htmlFor="password">
                            Password:
                            <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="password"
                            onChange={(e) => setPwd(e.target.value)}
                            value={pwd}
                            required
                            aria-invalid={validPwd ? "false" : "true"}
                            aria-describedby="pwdnote"
                            onFocus={() => setPwdFocus(true)}
                            onBlur={() => setPwdFocus(false)}
                        />
                        <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            8 to 24 characters.<br />
                            Must include uppercase and lowercase letters, a number and a special character.<br />
                            Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                        </p>

                        <label htmlFor="confirm_pwd">
                            Confirm Password:
                            <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="password"
                            id="confirm_pwd"
                            onChange={(e) => setMatchPwd(e.target.value)}
                            value={matchPwd}
                            required
                            aria-invalid={validMatch ? "false" : "true"}
                            aria-describedby="confirmnote"
                            onFocus={() => setMatchFocus(true)}
                            onBlur={() => setMatchFocus(false)}
                        />
                        <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Must match the first password input field.
                        </p>

                        <label>
                            Mobile Phone Number:
                        </label>
                        <input
                            type="text"
                            id="mobile"
                            name="mobile"
                            maxlength="10"
                            // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required
                            placeholder="123-456-7890"
                            ref={mobileRef}
                            autoComplete="off"
                            onChange={handlePhoneNumberChange}
                            value={mobile} required
                            aria-invalid={validName ? "false" : "true"}
                            aria-describedby="mobileNote"
                            onFocus={() => setMobileFocus(true)}
                            onBlur={() => setMobileFocus(false)}
                        />
                        <p id="mobile" className={mobileFocus && !validMobile ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            <br />
                            Ensure your phone number follows the following format: ###-###-####
                        </p>
                        
                        <label>
                            Birthdate:
                        </label>
                        <input
                            type="date"
                            id="birthDate"
                            ref={birthDateRef}
                            autoComplete="off"
                            onChange={(e) => setBirthDate(e.target.value)}
                            value={birthDate}
                            required
                            aria-invalid={validDate ? "false" : "true"}
                            aria-describedby="birthDateNote"
                            onFocus={() => setBirthDateFocus(true)}
                            onBlur={() => setBirthDateFocus(false)}
                        />

                        <label htmlFor="rxNumber">
                            Rx Number:
                            <FontAwesomeIcon icon={faCheck} className={validRx ? "valid" : "hide"} />
                            <FontAwesomeIcon icon={faTimes} className={validRx || !rx ? "hide" : "invalid"} />
                        </label>
                        <input
                            type="text"
                            id="rxNumber"
                            ref={rxNumberRef}
                            autoComplete="off"
                            onChange={(e) => setRx(e.target.value)}
                            value={rx}
                            required
                            aria-invalid={validRx ? "false" : "true"}
                            aria-describedby="rxNote"
                            onFocus={() => setRxFocus(true)}
                            onBlur={() => setRxFocus(false)}
                        />
                        <p id="rxNumber" className={rxFocus && !validRx ? "instructions" : "offscreen"}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            <br />
                            Your Rx number is located on your prescription bottle. It may be preceded by the following: <br />
                            Rx: <br />
                            Rx # <br />
                            No: <br />
                            *It may include a dash or the letter "C" or "N"
                        </p>

                        <button disabled={!validName || !validPwd || !validMatch || !validEmail || !validMobile || !validRx ? true : false}>Sign Up</button>
                    </form>
                    <font size="3"> 
                        <p>
                            Already registered?<br />
                            <span className="line">
                                <Link to="/login">Sign In Here</Link>
                            </span>
                        </p>
                    </font>
                </roundedSectionScroll>
            )}
        </>
    )
}

export default Register