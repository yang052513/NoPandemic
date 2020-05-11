import React, { useState, useRef, useEffect } from "react"
import firebase from "firebase"
import GoogleMapReact from "google-map-react"
import trees from "../../data/street-treesgeo.json"
import useSupercluster from "use-supercluster"
import { usePosition } from "use-position"
import "../../style/MyMap.css"
import Loading from "../Loading"
import HomeSwitchItem from "./HomeSwitchItem"

function MyMap(props) {
  const Marker = ({ children }) => children
  const mapRef = useRef()
  const [bounds, setBounds] = useState(null)
  const [zoom, setZoom] = useState(14)
  const userLocation = usePosition()

  const db = firebase.firestore()
  const [profileUrl, setProfileUrl] = useState("/images/user.jpg")
  const [modal, setModal] = useState(false)
  const [center, setCenter] = useState({
    lat: props.lat,
    lng: props.ln,
  })
  const [defaultCenter, setDefaultCenter] = useState({
    lat: props.lat,
    lng: props.lng,
  })

  const [currLocation, setCurrLocation] = useState({ road: "", city: "" })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const [edit, setEdit] = useState({
    address: "",
    city: "",
    postalcode: "",
    lat: "",
    lng: "",
    formatAddress: "",
  })

  // 用户切换家，工作和学校的地址
  const [homeLocation, setHomeLocation] = useState({
    lat: 49.278752,
    lng: -123.100365,
  })

  useEffect(() => {
    // firebase.auth().onAuthStateChanged((user) => {
    //   db.collection("user")
    //     .doc(user.uid)
    //     .collection("Doc")
    //     .doc("Location")
    //     .get()
    //     .then((doc) => {
    //       setCenter({ lat: doc.data().Lat, lng: doc.data().Lng })
    //       setDefaultCenter({ lat: doc.data().Lat, lng: doc.data().Lng })
    //       setCurrLocation({
    //         road: doc.data().Location.road,
    //         city: doc.data().Location.city,
    //       })
    //     })
    // })

    setCenter({ lat: props.lat, lng: props.lng })
    setDefaultCenter({ lat: props.lat, lng: props.lng })
    setCurrLocation({
      road: props.road,
      city: props.city,
    })
    setLoading(false)
  }, [props])

  const style = {
    height: "100vh",
    width: "100%",
  }
  const treesdata = trees.features.filter((tree) => tree.geometry !== null)
  const points = treesdata.map((tree) => ({
    type: "Feature",
    properties: {
      cluster: false,
      treeId: tree.properties.tree_id,
      category: tree.properties.genus_name,
    },
    geometry: {
      type: "Point",
      coordinates: [
        parseFloat(tree.geometry.coordinates[0]),
        parseFloat(tree.geometry.coordinates[1]),
      ],
    },
  }))
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 },
  })

  const workLocation = {
    lat: 49.105897,
    lng: -122.827956,
  }

  const schoolLocation = {
    lat: 49.278094,
    lng: -122.919883,
  }

  firebase.auth().onAuthStateChanged((user) => {
    db.collection("user")
      .doc(user.uid)
      .get()
      .then((snap) => {
        if (snap.data().Profile === undefined) {
          setProfileUrl("/images/user.jpg")
        } else {
          setProfileUrl(snap.data().Profile)
        }
      })
  })

  function handleSearch(event) {
    const { value } = event.target
    setSearch(value)
  }

  function showModal() {
    setModal(true)
  }

  function offModal() {
    setModal(false)
    firebase.auth().onAuthStateChanged((user) => {
      db.collection("user")
        .doc(user.uid)
        .collection("Doc")
        .doc("Preference")
        .set(
          {
            Home: {
              Address: edit.address,
              City: edit.city,
              PostalCode: edit.postalcode,
              FormatAddress: edit.formatAddress,
              Lat: edit.lat,
              Lng: edit.lng,
            },
          },
          {
            merge: true,
          }
        )
    })
    setHomeLocation({
      lat: edit.lat,
      lng: edit.lng,
    })
    console.log(edit)
  }

  function handleEdit(event) {
    const { name, value } = event.target
    setEdit((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  function handleSubmit() {
    let address = edit.address
    let city = edit.city
    let postalcode = edit.postalcode
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}+${city}+${postalcode},+CA&key=AIzaSyBcAUk21V9tUi3ZyziIG6TRirD3Uw_ECGM`
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setEdit((prevState) => ({
          ...prevState,
          lat: data.results[0].geometry.location.lat,
          lng: data.results[0].geometry.location.lng,
          formatAddress: data.results[0].formatted_address,
        }))
      })
  }

  function currCenter() {
    setCenter({ lat: defaultCenter.lat, lng: defaultCenter.lng })
  }

  function homeCenter() {
    setCenter({ lat: homeLocation.lat, lng: homeLocation.lng })
  }

  function workCenter() {
    setCenter({ lat: workLocation.lat, lng: workLocation.lng })
  }

  function schoolCenter() {
    setCenter({ lat: schoolLocation.lat, lng: schoolLocation.lng })
  }

  if (userLocation.longitude && loading === false && currLocation)
    return (
      <div className="home-container" style={style}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "AIzaSyBcAUk21V9tUi3ZyziIG6TRirD3Uw_ECGM",
          }}
          center={{
            lat: center.lat,
            lng: center.lng,
          }}
          defaultZoom={14}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map }) => {
            mapRef.current = map
          }}
          onChange={({ zoom, bounds }) => {
            setZoom(zoom)
            setBounds([
              bounds.nw.lng,
              bounds.se.lat,
              bounds.se.lng,
              bounds.nw.lat,
            ])
          }}
        >
          {clusters.map((cluster) => {
            const [longitude, latitude] = cluster.geometry.coordinates
            const {
              cluster: isCluster,
              point_count: pointCount,
            } = cluster.properties

            if (isCluster) {
              return (
                <Marker
                  key={`cluster-${cluster.id}`}
                  lat={latitude}
                  lng={longitude}
                >
                  <div
                    className="cluster-marker"
                    style={{
                      width: `${10 + (pointCount / points.length) * 20}px`,
                      height: `${10 + (pointCount / points.length) * 20}px`,
                    }}
                    onClick={() => {
                      const expansionZoom = Math.min(
                        supercluster.getClusterExpansionZoom(cluster.id),
                        20
                      )
                      mapRef.current.setZoom(expansionZoom)
                      mapRef.current.panTo({
                        lat: latitude,
                        lng: longitude,
                      })
                    }}
                  >
                    {pointCount}
                  </div>
                </Marker>
              )
            }
          })}

          <Marker lat={userLocation.latitude} lng={userLocation.longitude}>
            <img
              className="user-locate"
              src={profileUrl}
              alt="current location"
              width="50px"
              height="auto"
            />
          </Marker>

          <Marker lat={homeLocation.lat} lng={homeLocation.lng}>
            <button className="crime-marker">
              <img
                src="/images/home.png"
                alt="home"
                width="50px"
                height="auto"
              />
            </button>
          </Marker>

          <Marker lat={workLocation.lat} lng={workLocation.lng}>
            <button className="crime-marker">
              <img
                src="/images/work.png"
                alt="home"
                width="50px"
                height="auto"
              />
            </button>
          </Marker>

          <Marker lat={schoolLocation.lat} lng={schoolLocation.lng}>
            <button className="crime-marker">
              <img
                src="/images/school.png"
                alt="home"
                width="50px"
                height="auto"
              />
            </button>
          </Marker>
        </GoogleMapReact>

        <div className="home-switch-content">
          <div className="home-switch-item-container">
            <div className="current-location" onClick={currCenter}>
              <HomeSwitchItem
                icon="fas fa-map-marker-alt"
                text={`${currLocation.road}, ${currLocation.city}`}
              />
            </div>
            <div className="switch-location" onClick={homeCenter}>
              <HomeSwitchItem icon="fas fa-home" text="Home" />
            </div>
            <div className="switch-location" onClick={schoolCenter}>
              <HomeSwitchItem icon="fas fa-school" text="School" />
            </div>
            <div className="switch-location" onClick={workCenter}>
              <HomeSwitchItem icon="fas fa-building" text="Work" />
            </div>
            <div className="search-location">
              <input
                onChange={handleSearch}
                type="text"
                placeholder="search places..."
              />
            </div>
            <div onClick={showModal} className="setting-location">
              <i className="fas fa-pen"></i>
            </div>
          </div>
        </div>

        {modal === true ? (
          <div className="edit-location-container">
            <h3>Edit your location switch</h3>
            <p>Home</p>
            <input
              onChange={handleEdit}
              name="address"
              type="text"
              placeholder="Address"
            />
            <input
              onChange={handleEdit}
              name="city"
              type="text"
              placeholder="City"
            />
            <input
              onChange={handleEdit}
              name="postalcode"
              type="text"
              placeholder="Postal Code"
            />
            <button onClick={handleSubmit}>Submit</button>
            <p>{edit.address}</p>
            <p>{edit.city}</p>
            <p>{edit.postalcode}</p>
            <button onClick={offModal}>Save</button>
          </div>
        ) : null}
      </div>
    )
  else return <Loading />
}

export default MyMap
