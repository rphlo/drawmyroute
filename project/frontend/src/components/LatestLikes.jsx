import React from "react";
import useGlobalState from "../utils/useGlobalState";

const LatestLikes = (props) => {
    const [likes, setLikes] = React.useState([]);
    
    const globalState = useGlobalState();
    const { api_token } = globalState.user;
    
    React.useEffect(() => {
      if (api_token){
        (async () => {
          const r = await fetch(
            import.meta.env.VITE_API_URL + "/v1/latest-likes/",
            {
                headers: { Authorization: "Token " + api_token }
            });
          setLikes(await r.json());
        })();
      }
    }, [api_token]);
    
    const dropdown = React.useRef();
 
    React.useEffect(() => {
        function onOpen() {
            (async () => await fetch(import.meta.env.VITE_API_URL + "/v1/latest-likes/",
            {
                method: "post",
                headers: { Authorization: "Token " + api_token }
            }))();
            alert("444")
        }

        if (dropdown && dropdown.current) {
            dropdown.current.addEventListener("show.bs.dropdown", onOpen, false);
            return function cleanup() {
                 dropdown.current.removeEventListener("show.bs.dropdown", onOpen, false);
            };
        }
    }, [dropdown.current]);

    
    return <>{ likes.length > 0 ? (<div>
    <button 
        className="btn btn-dark"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
    >New 🏅</button>
    <div className="dropdown-menu dropdown-menu-right" ref={dropdown}>
    { likes.map((l) => (
        <a className="dropdown-item"
           href="/#"
           onClick={(e)=>openEvent(l.route.uid)}
           key={JSON.stringify(l)}
        >{l.route.name}</a>)
      )
    }
    </div></div>) : (<></>) }</>
}

export default LatestLikes;