# toys

a repo where i keep:

-   a collection of weird little toys
-   a bunch of creative coding tools / libs etc. that are helpful to me when making weird little
    toys

you can look at the toys here: https://alex.dytry.ch/toys

before i had this repo, i'd make a new one for each new weird little toy and waste a bunch of time
on build setup and reimplementing all my standard tools / libs from scratch. this way is quicker. i
think some of the tools here are more generally useful, but i probably won't publish them cus i'd
rather focus my limited free time on actually making things with the tools.

## wip notes & todos

-   splatapus
    -   [x] fix state splitting
    -   [x] localstorage state
    -   [x] reset document
    -   [x] go to undo/redo location first
    -   [x] pan/zoom
        -   [x] basic pan
        -   [x] reset pan/zoom
        -   [x] basic zoom
        -   [x] zoom at cursor location
        -   [ ] fix zoom gesture zooming browser
        -   [x] mobile pan/zoom support
    -   [x] multi-dimensional
        -   [x] keypoint tool
            -   [x] tool boilerplate
            -   [x] tap vs drag gesture detection
            -   [x] select key points
            -   [x] move key points
            -   [x] add key points
        -   [x] md-interpolation
            -   [x] preview mode?
            -   [x] quick preview tool
            -   [x] TPS interpolation
            -   [x] handle 1- and 2-point situations
    -   [ ] (P0) introduce new "draw" -> "rig" -> "play" modes
    -   [ ] (P0) fix up new drawing for unplaced point - extrapolation produces bad onion skins
            currently
    -   [ ] a r t
        -   [x] more shapes
            -   [x] proper more shapes ui
        -   [ ] (P1) colors
        -   [ ] (P1) fills
    -   [ ] fun
        -   [ ] spring-interpolation
        -   [ ] paint spring params on lines
    -   [ ] animation
        -   [ ] (P2) try density based point allocation instead of distance based
        -   [ ] (P2) "pin" points on the line for animation consistency
        -   [ ] turn around?
    -   [ ] design overhaul
    -   [ ] login/share????
-   blob factory
    -   [x] blur mode
    -   [ ] fix color hue blending
    -   [ ] eased color blending
    -   [x] experiment with noise?
    -   [ ] save as image
    -   [ ] import/export
    -   [ ] light/dark mode
-   octopus
    -   [x] disable signals inspector in prod
    -   [x] get tentacle retract motion feeling good
    -   [x] make sure layout doesn't care about screen size
    -   [x] render keyboard
    -   [ ] clickable keyboard plays notes
    -   [ ] get it working on ios
    -   [ ] make touch controls work
    -   [ ] click-and-drag keyboard plays notes
    -   [x] keyboard-controlled keyboard plays notes
    -   [ ] midi-controlled keyboard plays notes
    -   [x] tentacles hit keyboard keys
    -   [x] octopus tentacle rendering
    -   [ ] octopus facial expressions basics
    -   [ ] octopus singing mouth
    -   [ ] octopus singing text trails
    -   [ ] what happens when you touch somewhere other than the keyboard
    -   [ ] hats?????
    -   [ ] figure out other flavour / cool stuff to do with octopus face / tentacles etc
-   signals
    -   [ ] make signal midi bindings work when inspector isn't rendered
    -   [x] ADSR-style signal envelopes
    -   [ ] virtualized signal inspector list????
