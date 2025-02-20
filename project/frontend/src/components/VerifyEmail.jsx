import React from "react";
import Swal from "sweetalert2";

const VerifyEmail = ({ match, history }) => {
  const [verified, setVerified] = React.useState(false);
  const [errors, setErrors] = React.useState({});

  const [email, setEmail] = React.useState();
  const [sent, setSent] = React.useState();

  React.useEffect(() => {
    (async () => {
      if (match.params.key) {
        const res = await fetch(
          import.meta.env.VITE_API_URL + "/v1/auth/registration/verify-email/",
          {
            method: "POST",
            credentials: "omit",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ key: match.params.key }),
          }
        );
        if (res.status === 200) {
          setVerified(true);
          await Swal.fire({
            title: "Success!",
            text: "Email Verified!",
            icon: "success",
            confirmButtonText: "OK",
          });
          history.push("/");
        } else if (res.status === 400) {
          setErrors(await res.json());
        } else if (res.status === 404) {
          setErrors({ key: "Could not find key." });
        }
      }
    })();
  }, [match, history]);

  const onSubmitResend = async (e) => {
    e.preventDefault();
    await fetch(
      import.meta.env.VITE_API_URL +
        "/v1/auth/registration/resend-verification/",
      {
        method: "POST",
        credentials: "omit",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );
    setSent(true);
  };

  return (
    <div className="container main-container">
      {!verified && !sent && (
        <>
          {errors.key && (
            <div className="alert alert-danger" role="alert">
              {errors.key}
            </div>
          )}
          <h3>Resend verification email</h3>
          <form onSubmit={onSubmitResend}>
            <div className={"form-group"}>
              <label htmlFor="email">
                <i className="fas fa-at"></i> Email
              </label>
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="email"
                className={"form-control"}
                id="email"
                name="email"
                placeholder="Email"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <i className="fas fa-paper-plane"></i> Re-send
            </button>
          </form>
        </>
      )}
      {sent && (
        <div className="alert alert-success" role="alert">
          Success! We sent you a new verification email!
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
