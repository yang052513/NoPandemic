import React from "react"
import Header from "./components/landing/Header"
import Product from "./components/landing/Product"
import Feature from "./components/landing/Feature"
import Flow from "./components/landing/Flow"
import HomeFeature from "./components/landing/HomeFeature"
import Team from "./components/landing/Team"
import Sponsor from "./components/landing/Sponsor"
import Footer from "./components/landing/Footer"
import FormFeature from "./components/landing/FormFeature"
import GameFeature from "./components/landing/GameFeature"
import AidFeature from "./components/landing/AidFeature"
import Explain from "./components/landing/Explain"
import DarkFeature from "./components/landing/DarkFeature"
import Youtube from './components/landing/Youtube'
import AOS from "aos"

// AOS setup
AOS.init({
  offset: 200,
  duration: 1000,
  easing: "ease",
  delay: 100,
})

function Landing() {
  return (
    <div>
      <Header />
      <Youtube />
      <Flow />
      <Product />
      <Feature />
      <HomeFeature />
      <FormFeature />
      <GameFeature />
      <AidFeature />
      <DarkFeature />
      <Explain />
      <Team />
      <Sponsor />
      <Footer />
    </div>
  )
}

export default Landing
