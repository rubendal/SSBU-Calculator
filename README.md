## SSBU Calculator
Web based Smash Ultimate knockback calculator

### How to use it
Just input your data, the calculator will update the results when you change something

A lot of hitbox data has been ported from Smash 4 so still using KH API to load them for now, however keep in mind that some hitboxes have new base damages and might have BKB/KBG/FKB changed, you can input move data manually as well

#### Launch Visualizer
*Note: Stage layout collision detection might give weird results and bounced trajectories are not accurate, character models/ECBs/animations not included so KO percents are not accurate* 

Visualize launch trajectory, position per hitstun frame and distance launched in a graph and display stage layout with collision detection

* Each marker represents each frame in hitstun
* Line color represents vertical momentum
* Cyan markers represents frames that hitstun can be cancelled by using an airdodge
* Magenta markers represents frames that hitstun can be cancelled by using an aerial
* Move angle can be inverted horizontally to visualize hitting opponents from the right side
* Add stage layout with platforms and blast zones with physics (Collision, traction along surfaces, bounce off a surface angle calculation)

## Tools

### KO calculator
https://rubendal.github.io/SSBU-Calculator/kocalc.html

Calculates opponent's KO percentages on inputted position on a stage, it can also calculate best DI angle the opponent can use to survive on that position or generate a vector field to get best di possible on various positions however this calculation is a heavy process so it could freeze the page for a moment or even get a popup that the page isn't responding

Reminder: character models/ECBs/animations not included so KO percents are not accurate by a small margin

### Percentage Calculator
https://rubendal.github.io/SSBU-Calculator/percentcalc.html

Get target percent required to obtain certain knockback, on FKB moves calculate the minimum rage to reach specified knockback

## Credits
* [@KuroganeHammer](https://twitter.com/KuroganeHammer) [frame data repository](http://kuroganehammer.com/Smash4)
* [FrannHammer (KuroganeHammer API)](https://github.com/Frannsoft/FrannHammer)