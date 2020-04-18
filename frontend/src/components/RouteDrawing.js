import React, { useEffect, useState } from 'react'
import { drawRoute, drawOriginalMap, getCorners } from '../utils/drawHelpers'
import { saveAs } from 'file-saver';
import useGlobalState from '../utils/useGlobalState'

const RouteDrawing = (props) => {
  const [includeHeader, setIncludeHeader] = useState(true);
  const [includeRoute, setIncludeRoute] = useState(true);
  const [name, setName] = useState();
  const [togglingRoute, setTogglingRoute] = useState();
  const [togglingHeader, setTogglingHeader] = useState();
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false);
  const [imgData, setImgData] = useState()
  const [imgHR, setImgHR] = useState()
  const [imghR, setImghR] = useState()
  const [imgHr, setImgHr] = useState()
  const [imghr, setImghr] = useState()
  const [imgDataOut, setImgDataOut] = useState(null)
  const [zoom, setZoom] = useState(100)
  let finalImage = React.createRef();


  const globalState = useGlobalState()
  const { username, api_token } = globalState.user

  React.useEffect(() => {
    if (!imgData) {
      return
    }
    const endToggling = () => {
      if (togglingHeader) {
        setTogglingHeader(false)
      }
      if (togglingRoute) {
        setTogglingRoute(false)
      }
    }
    if (includeHeader && includeRoute && imgHR) {
      setImgDataOut(imgHR)
      endToggling()
      return
    } else if (includeHeader && !includeRoute && imgHr) {
      setImgDataOut(imgHr)
      endToggling()
      return
    } else if (!includeHeader && includeRoute && imghR) {
      setImgDataOut(imghR)
      endToggling()
      return
    } else if (!includeHeader && !includeRoute && imghr) {
      setImgDataOut(imghr)
      endToggling()
      return
    }
    const canvas = drawRoute(
      imgData,
      props.mapCornersCoords,
      props.route,
      includeHeader,
      includeRoute
    );
    const url = canvas.toDataURL()
    setImgDataOut(url);
    if (includeHeader && includeRoute) {
      setImgHR(url)
    } else if (includeHeader && !includeRoute) {
      setImgHr(url)
    } else if (!includeHeader && includeRoute) {
      setImghR(url)
    } else if (!includeHeader && !includeRoute) {
      setImghr(url)
    }
  }, [imgData, imgHR, imghR, imgHr, imghr, includeHeader, includeRoute, props.mapCornersCoords, props.route, togglingHeader, togglingRoute])

  useEffect(() => {
    setName(props.name); 
  }, [props.name])

  useEffect(() => {   
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function(){
        setImgData(this);
    };
    img.src = props.mapDataURL
  }, [props.mapDataURL])

  const round5 = v => {
    return Math.round(v*1e5)/1e5;
  }

  const formatMapBounds = (b) => {
    return JSON.stringify({
      top_left: [b.top_left.lat, b.top_left.lon],
      top_right: [b.top_right.lat, b.top_right.lon],
      bottom_right: [b.bottom_right.lat, b.bottom_right.lon],
      bottom_left: [b.bottom_left.lat, b.bottom_left.lon],
    })
  }
  const formatRoute = (r) => {
    return JSON.stringify(r.map(p=>{return {time: (+p.time)/1e3, latlon: p.latLon}}))
  }

  const printCornersCoords = (corners_coords, separator) => {
    return '' + round5(corners_coords.top_left.lat) + separator + round5(corners_coords.top_left.lon) +
      separator + round5(corners_coords.top_right.lat) + separator + round5(corners_coords.top_right.lon) +
      separator + round5(corners_coords.bottom_right.lat) + separator + round5(corners_coords.bottom_right.lon) +
      separator + round5(corners_coords.bottom_left.lat) + separator + round5(corners_coords.bottom_left.lon);
  }
  const onExport = async (e) => {
    if(saving || !username) {
      return
    }
    const tkn = api_token
    setSaving(true)
    const canvas = drawOriginalMap(
      imgData,
      false
    )
    canvas.toBlob(async (blob) => {
      var fd = new FormData();
      fd.append('map_image', blob, name + '.jpg') 
      fd.append('map_bounds', formatMapBounds(props.mapCornersCoords));
      fd.append('route_data', formatRoute(props.route));
      fd.append('name', name);
      try {
        const response = await fetch(process.env.REACT_APP_API_URL+'/v1/routes/new', {
          method: 'POST',
          headers: {
            'Authorization': 'Token ' + tkn
          },
          body: fd
        });
        setSaving(false)
        if (response.status===200 || response.status===201) {
          const res = await response.json(); // parses JSON response into native JavaScript objects
          setSaved(res.id)
          window.location = '/routes/'+res.id
        } else {
          throw new Error('not ok status')
        }
      } catch (e) {
        setSaving(false)
        window.alert('Something went wrong')
      }
    }, 'image/jpeg', 0.4)
  }

  const downloadMapWithRoute = (e) => {
    const newCorners = getCorners(imgData, props.mapCornersCoords, props.route, includeHeader, includeRoute);
    const canvas = drawRoute(
      imgData,
      props.mapCornersCoords,
      props.route,
      includeHeader,
      includeRoute,
    )
    canvas.toBlob(function(blob) {
      saveAs(blob, name + '_' + (includeRoute ? '' : 'blank_') + printCornersCoords(newCorners, '_')+ '_.jpg');
    }, 'image/jpeg', 0.4)
  }

  const toggleHeader = (ev) => {
    if (togglingHeader) {
      return
    }
    setImgDataOut(null)
    setIncludeHeader(!includeHeader);
    setTogglingHeader(true)
  }

  const toggleRoute = (ev) => {
    if (togglingRoute) {
      return
    }
    setImgDataOut(null)
    setIncludeRoute(!includeRoute);
    setTogglingRoute(true)
  }

  const zoomOut = () => {
    setZoom(zoom - 10)
  }

  const zoomIn = () => {
    setZoom(zoom + 10)
  }

  return (
    <div>
      <h2 ><input type="text" data-testid="nameInput" maxLength={52} defaultValue={name} onChange={(e)=>setName(e.target.value)}/></h2>
      <div>
        <button style={{marginBottom: '5px'}} className="btn btn-sm btn-success" onClick={downloadMapWithRoute}><i className="fas fa-download"></i> Download Map</button>
      </div>
      <button className="btn btn-sm btn-default" onClick={zoomIn}><i className={"fa fa-plus"}></i></button>&nbsp;
      <button className="btn btn-sm btn-default" onClick={zoomOut}><i className={"fa fa-minus"}></i></button>&nbsp;
      <button className="btn btn-sm btn-default" onClick={toggleHeader}><i className={togglingHeader ? "fa fa-spinner fa-spin" : ("fa fa-toggle-"+(includeHeader ? 'on': 'off'))}></i> Header</button>&nbsp;
      <button className="btn btn-sm btn-default" onClick={toggleRoute}><i className={togglingRoute ? "fa fa-spinner fa-spin":("fa fa-toggle-"+(includeRoute ? 'on': 'off'))}></i> Route</button>&nbsp;

      {!saved && username && <><button data-testid="saveBtn" style={{float:'right'}} className="btn btn-sm btn-primary" onClick={onExport}><i className={saving ? "fa fa-spinner fa-spin" : "fas fa-save"}></i> Save</button>&nbsp;</>}
      <div>
        {imgDataOut && <img ref={finalImage} className="final-image" src={imgDataOut} alt="route" onClick={toggleRoute} style={{marginTop:'5px', width: zoom + '%'}}/>}
        {!imgDataOut && <h3><i className="fa fa-spin fa-spinner"></i> Loading</h3>}
      </div>
    </div>
  )
}

export default RouteDrawing;
