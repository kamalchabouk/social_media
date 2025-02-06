import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GOOGLE_ACCESS_TOKEN } from "../../api/token";

function RedirectGoogleAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log("RedirectHandler mounted successfully");
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get("access_token");
    console.log("QueryParams:", window.location.search);
    if (accessToken) {
      console.log("AccessToken found:", accessToken);
      localStorage.setItem(GOOGLE_ACCESS_TOKEN, accessToken);

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      axios
        .get("http:127.0.0.1:8000/api/auth/user/")
        .then((response) => {
          console.log("User details:", response.data);
          navigate("/");
        })
        .catch((error) => {
          console.error(
            "Error verifying Token:",
            error.response ? error.response.data : error.message
          );
          navigate("/login");
        });
      window.location.reload();
    } else {
      console.log("No Token found in the URL ");
      navigate("/login");
    }
  }, [navigate]);

  return <div> Logging In........</div>;
}

export default RedirectGoogleAuth;
