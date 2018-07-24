## SSBU Calculator
Web based Smash Ultimate knockback calculator (using Sm4sh Calculator code with SSBU mechanics and data)

Currently the calculator has a few changes compared to the Sm4sh Calculator based on E3 build changes (since we still don't have the game finished nor the game files) but you can use this calculator to check how in theory a move would work on SSBU

This project will be updated when SSBU releases, I'm just leaving this so people can test visualizations of the launch speed changes and compare KB changes with the new damage multipliers

### Changes from Sm4sh Calculator

#### Changes based on confirmed stuff
* 1v1 flag is an option on Character selection to enable the 1.2x damage multiplier
* Short hop aerial multiplier is an option displayed when selecting an aerial, this will apply the 0.85x damage multiplier

#### Changes based on approximation
* Launch speed multiplier increased (using 0.045 for now)
* Hitstun scaling being slowed down after tumble is considered on this calculator (applies additional operation if there is tumble hitstun -= (hitstun - tumble threshold) * hitstun scaling)
* Launch speed decay is not a constant in this calculator, it uses (launch speed / hitstun)
* Uses Drafix's hitlag formula (https://twitter.com/drafix570/status/1009458115559895040)
* Some staleness queue positions reduction factors that have been calculated are added (https://docs.google.com/spreadsheets/d/1ykZzWhPsEhxsMrc7M1B6lSit1m3Q2nv4XCZ8Zj39xuw/edit#gid=1417286638), the rest are still using Smash 4 values

#### Other changes
* Training mode data display has been removed since we don't know anything about it
* Smash 4 launches can still be visualized for comparison, these use the vanilla launch speed multiplier and constant decay. It also ignores the 1v1 and short hop aerials damage multipliers on the KB calculation.

### Notes
* Don't expect it to be 100% accurate with the SSBU E3 build, changes were based on observation of recorded gameplay and it's most likely not accurate
* Rage calculation is using Smash 4 values, which should be also used on SSBU
* LSI might not be on the game, you can remove it by setting on Parameters the LSI multipliers to 1
* Knockback formula and hitstun scaling should be the same as Smash 4 based on some gameplay research when considering hitboxes using Smash 4 BKB/KBG values
* Still using Smash 4 character attributes, characters from SSBU that aren't on Smash 4 are still missing these files. Also these characters don't have move data
* Characters from SSBU that aren't on Smash 4, Inkling and Ridley are just there on the character select so you can see their icons lol
* Everything not mentioned here still uses Smash 4 data and formulas so expect those to be added when research is done on those or after the game releases

### How to use it
Just input your data, the calculator will update the results when you change something

A lot of hitbox data has been ported from Smash 4 so still using KH API to load them for now, however keep in mind that some hitboxes have new base damages and might have BKB/KBG/WBKB changed, you can input move data manually as well

## Credits
* [@KuroganeHammer](https://twitter.com/KuroganeHammer) [frame data repository](http://kuroganehammer.com/Smash4)
* [FrannHammer (KuroganeHammer API)](https://github.com/Frannsoft/FrannHammer)