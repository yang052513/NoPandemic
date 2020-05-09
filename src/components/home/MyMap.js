import React, { useState, useRef } from "react"
import firebase from "firebase"
import GoogleMapReact from "google-map-react"
import trees from "../../data/street-treesgeo.json"
// import trees from "../../data/testing-centres-geo.json"
import useSupercluster from "use-supercluster"
import { usePosition } from "use-position"
import "../../style/MyMap.css"
import Loading from "../Loading"
{
  /* Please create a .env file in root folder
  copy the code below and replace your api key
  REACT_APP_GOOGLE_API_KEY='key'
*/
}
export default function MyMap() {
  const Marker = ({ children }) => children
  const mapRef = useRef()
  const [bounds, setBounds] = useState(null)
  const [zoom, setZoom] = useState(14)
  const userLocation = usePosition()
  const [profileUrl, setProfileUrl] = useState("/images/user.jpg")

  const style = {
    height: "80vh",
    width: "80%",
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
  const test = {
    lat: 49.278752,
    lng: -123.100365,
  }

  const db = firebase.firestore()
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

  if (userLocation.longitude)
    return (
      <div className="home-container" style={style}>
        <GoogleMapReact
          bootstrapURLKeys={{
            key: "AIzaSyBcAUk21V9tUi3ZyziIG6TRirD3Uw_ECGM",
          }}
          defaultCenter={{
            lat: userLocation.latitude,
            lng: userLocation.longitude,
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

          <Marker lat={49.215793299999994} lng={-122.9903403}>
            <img
              className="user-locate"
              src={profileUrl}
              alt="current location"
              width="50px"
              height="auto"
            />
          </Marker>
          <Marker lat={test.lat} lng={test.lng}>
            <button className="crime-marker">
              <img src="/images/house.svg" alt="home" />
            </button>
          </Marker>
        </GoogleMapReact>
      </div>
    )
  else return <Loading />
}
