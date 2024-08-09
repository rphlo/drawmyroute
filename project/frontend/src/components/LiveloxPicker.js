import React from "react";
import logo from "../livelox-logo-black.png";
import logo2 from "../gpsseuranta.png";

function LiveloxPicker(props) {
    const [urlOK, setUrlOK] = React.useState(true);
    const [submitting, setSubmitting] = React.useState(false);

    const onChangeURL = (e) => {
        const url = e.target.value;
        setUrlOK(/^https:\/\/www\.livelox\.com\/Viewer\/[^/]+\/[^/]+\?([^&]+&)?classId=(\d+)(&.+)?$/.test(url) || /^https:\/\/([^.]+\.)?tulospalvelu.fi\/(gps\/)?[^/]+\/$/.test(url))
    }

    const onSubmit = (e) => {
        setSubmitting(true)
        e.preventDefault();
        const formData = new FormData(e.target);
        const url = formData.get("url");
        formData.append('type', 'kmz');
        const target = /^https:\/\/www\.livelox\.com\/Viewer\/[^/]+\/[^/]+\?([^&]+&)?classId=(\d+)(&.+)?$/.test(url) ? "https://map-download.routechoices.com/api/get-livelox-map" : "https://map-download.routechoices.com/api/get-gpsseuranta-map";
        fetch(target, {
            method: "POST",
            body: formData,
        }).then(async (r) => {
            const blob = await r.blob();
            const myFile = new File([blob], "tmp.kmz", {type: "application/kmz"})
            props.onSubmit([myFile])
            setSubmitting(false)
        }).catch(() => {
            setUrlOK(false)
            setSubmitting(false)
        })
    }
    return <>
        <div>
            <form onSubmit={onSubmit}>
            <div className="mb-3">
                <label className="form-label"><a href="https://livelox.com" target="_blank" rel="noopener noreferrer"><img alt="livelox" src={logo} width="100"/></a><a className="ml-3" href="https://gps.tulospalvelu.fi" target="_blank" rel="noopener noreferrer"><img alt="gpsseuranta" src={logo2} width="100"/></a></label>
                <input className={"form-control" + (urlOK ? "" : " is-invalid")} placeholder="Livelox or GPSSeuranta URL" onChange={onChangeURL} name="url" required={true}></input>
                { !urlOK && (<div className="invalid-feedback">
                    Invalid livelox or gpsseuranta event URL!
                </div>)}
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? <><i className="fa fa-spinner fa-spin"></i>{" "}</> :  ""}Fetch</button>
            </form>
        </div>
    </>
}

export default LiveloxPicker
