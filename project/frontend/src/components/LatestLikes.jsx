import React from "react";
import { Link } from "react-router-dom";
import useGlobalState from "../utils/useGlobalState";

const LatestLikes = (props) => {
    const [likes, setLikes] = React.useState([]);
    const [opened, setOpened] = React.useState(false);

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

    const onOpen = async (e) => {
        e.preventDefault();
        if (opened)return;
        setOpened(true);
        await fetch(
            import.meta.env.VITE_API_URL + "/v1/latest-likes/",
            {
                method: "post",
                headers: { Authorization: "Token " + api_token }
            }
        );
    };

    return <>{ likes.length > 0 ? (<div>
    <button
        className="btn btn-dark"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        onClick={onOpen}
        type="button"
    >{likes.length} new <i className="fa fa-hands-clapping" /></button>
    <div className="dropdown-menu">
    { likes.map((l) => (
        <Link
           className="dropdown-item"
           to={"/routes/" + l.route.uid }
           key={JSON.stringify(l)}
        >{l.user.username} clapped for {l.route.name}</Link>)
      )
    }
    </div></div>) : (<></>) }</>
}

export default LatestLikes;
