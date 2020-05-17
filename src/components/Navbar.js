import React, { useState, useEffect } from "react"
import firebase from "firebase"
import { BrowserRouter as Router } from "react-router-dom"
import { Link, Switch, Route } from "react-router-dom"
import Home from "./home/Home"
import Profile from "./profile/Profile"
import Symptom from "./symptom/Symptom"
import Aid from "./aid/Aid"
import Status from "./status/Status"
import Game from "./game/Game"
import Hero from "./hero/Hero"
import About from "./About"
import $ from "jquery"

function Navbar() {
  const db = firebase.firestore()
  const [signin, setSignIn] = useState(false)
  const darkSurface = {
    backgroundColor: "#333",
    boxShadow: "none",
  }

  const darkText = {
    color: "white",
  }
  const darkSecondaryText = {
    color: "rgba(255, 255, 255, 0.5)",
  }

  function resetComponent() {
    setSignIn(false)
  }

  console.log(`
  Hello, Developers!
  Hope You Have Fun With This App!
  く__,.ヘヽ.        /  ,ー､ 〉
           ＼ ', !-─‐-i  /  /´
           ／｀ｰ'       L/／｀ヽ､
         /   ／,   /|   ,   ,       ',
       ｲ   / /-‐/  ｉ  L_ ﾊ ヽ!   i
        ﾚ ﾍ 7ｲ｀ﾄ   ﾚ'ｧ-ﾄ､!ハ|   |
          !,/7 '0'     ´0iソ|    |
          |.从"    _     ,,,, / |./    |
          ﾚ'| i＞.､,,__  _,.イ /   .i   |
            ﾚ'| | / k_７_/ﾚ'ヽ,  ﾊ.  |
              | |/i 〈|/   i  ,.ﾍ |  i  |
             .|/ /  ｉ：    ﾍ!    ＼  |
              kヽ>､ﾊ    _,.ﾍ､    /､!
              !'〈//｀Ｔ´', ＼ ｀'7'ｰr'
              ﾚ'ヽL__|___i,___,ンﾚ|ノ
                  ﾄ-,/  |___./
                  'ｰ'    !_,.:
你好开发者！
`)

  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      db.collection("user")
        .doc(user.uid)
        .onSnapshot((doc) => {
          setDarkMode(doc.data().DarkMode)
        })
    })
  })

  return (
    <Router>
      <div>
        {signin === true ? <Home /> : null}
        <div style={darkMode === true ? darkSurface : null} className="navbar">
          <div>
            <Link to="/signin/home" onClick={resetComponent}>
              <i
                style={darkMode === true ? darkText : null}
                className="fas fa-home"
              ></i>
            </Link>
            <p style={darkMode === true ? darkSecondaryText : null}>Home</p>
          </div>

          <div>
            <Link to="/signin/symptom" onClick={resetComponent}>
              <i
                style={darkMode === true ? darkText : null}
                className="fas fa-user-md"
              ></i>
            </Link>
            <p style={darkMode === true ? darkSecondaryText : null}>Symptom</p>
          </div>

          <div>
            <Link to="/signin/aid" onClick={resetComponent}>
              <i
                style={darkMode === true ? darkText : null}
                className="fas fa-first-aid"
              ></i>
            </Link>
            <p style={darkMode === true ? darkSecondaryText : null}>Aid</p>
          </div>

          <div>
            <Link to="/signin/status" onClick={resetComponent}>
              <i
                style={darkMode === true ? darkText : null}
                className="fas fa-chart-line"
              ></i>
            </Link>
            <p style={darkMode === true ? darkSecondaryText : null}>Status</p>
          </div>

          <div>
            <Link to="/signin/game" onClick={resetComponent}>
              <i
                style={darkMode === true ? darkText : null}
                className="fas fa-gamepad"
              ></i>
            </Link>
            <p style={darkMode === true ? darkSecondaryText : null}>Game</p>
          </div>

          <div>
            <Link to="/signin/hero" onClick={resetComponent}>
              <i
                style={darkMode === true ? darkText : null}
                className="fas fa-hand-holding-heart"
              ></i>
            </Link>
            <p style={darkMode === true ? darkSecondaryText : null}>Hero</p>
          </div>

          <div>
            <Link to="/signin/info" onClick={resetComponent}>
              <i
                style={darkMode === true ? darkText : null}
                className="fas fa-info-circle"
              ></i>
            </Link>
            <p style={darkMode === true ? darkSecondaryText : null}>About</p>
          </div>
        </div>

        <div
          style={darkMode === true ? darkSurface : null}
          className="mob-navbar"
          onClick={resetComponent}
        >
          <div>
            <Link to="/signin/home">
              <i
                style={darkMode === true ? darkText : null}
                className="fas fa-home"
              ></i>
            </Link>
            <p style={darkMode === true ? darkSecondaryText : null}>Home</p>
          </div>

          <div>
            <Link to="/signin/symptom" onClick={resetComponent}>
              <i
                style={darkMode === true ? darkText : null}
                className="fas fa-user-md"
              ></i>
            </Link>
            <p style={darkMode === true ? darkSecondaryText : null}>Symptom</p>
          </div>

          <div>
            <Link to="/signin/aid" onClick={resetComponent}>
              <i
                style={darkMode === true ? darkText : null}
                className="fas fa-first-aid"
              ></i>
            </Link>
            <p style={darkMode === true ? darkSecondaryText : null}>Aid</p>
          </div>

          <div>
            <Link to="/signin/profile" onClick={resetComponent}>
              <i
                style={darkMode === true ? darkText : null}
                className="fas fa-user-circle"
              ></i>
            </Link>
            <p style={darkMode === true ? darkSecondaryText : null}>Profile</p>
          </div>
        </div>

        {/* Switch page */}
        <Switch>
          <Route path="/signin/home">
            <Home />
          </Route>
          <Route path="/signin/symptom">
            <Symptom />
          </Route>
          <Route path="/signin/aid">
            <Aid />
          </Route>
          <Route path="/signin/profile">
            <Profile />
          </Route>
          <Route path="/signin/status">
            <Status />
          </Route>
          <Route path="/signin/game">
            <Game />
          </Route>
          <Route path="/signin/hero">
            <Hero />
          </Route>
          <Route path="/signin/info">
            <About />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default Navbar
