const express = require('express')
const router = express.Router() 
const THREE = require('three')
const orbitControls = require("three-orbitcontrols")
// const detector = require('detector-webgl')
const stats = require('stats')
const astar = require('astar')

const Colors = require('../assets/colors.json')

//dependent functions
const initScene = () => {
    // create the scene 
    scene = new THREE.Scene() 
    // add FOV fog effecct
    scene.fog = new THREE.Fog(Colors.fog, 100, 950)
}









router.get('/', (req,res) => {
    res.render('index')
})

module.exports = router

