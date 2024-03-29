# Evolution

Evolution Simulator hosted on AWS Elasticbeanstalk: http://evolution-env.eba-uqppjpfu.us-east-1.elasticbeanstalk.com/. Watch dominant traits emerge, represented by unit color. Make sure you manage the environment parameters to stop the population from getting out of control or collapsing!

Github Actions auto deploys newest version on merge to main. 

## Game Explained

### Overview

Units have a set of core stats that sum to 100 in total. Currently we have Health, Attack, Defense, Food Effeciency, Life Span. These core stats determine the color of the unit. Just attack, defense, and health are active for now as I balance these existing stats so nothing is dominant under all environment permutations.

Units also have other stats like the probability to mutate and hunger which are not part of the core stats. Hunger decays over time and can be replenished by killing or eating.

### Using the Game

You can press space to pause or unpause a simulation. On the lefthand side you have a control panel that will change evironment conditions in realtime. The most noticeable are speed and mutation rate, but the rest can be very useful. For example, if your simulation is starting to ramp up to fast and too many units are spawning, you can increase hunger decay or food spawn rate to bring the population back under control.

## Key Mechanics

Units can either fight, reproduce, or do nothing upon contact.

The decision to fight or breed is currently random, but in the future it can be based off of the Cosine Similarity of the corestats of the two units. The more similar the more likely to reproduce, and the more different, the more likely they fight.

### Fighting

- Damage is caclulated by the max of one units offense less the other units defense or 0; whichever is greater

- If unitA can kill unitB, but unitB cannot kill unitA, then unit A will kill unit B and the health it took from unitB to its own health - And vice versa. The killing unit also replenishes its hunger by the amount of hunger the unit it killed had.

- If neither unit can kill each other they both deal damage to eath other

- If both units can kill each other the unit that does the most damage (taking defense into account) will kill and gain health.

### Reproducing

If the units choose to reproduce, they can only do so if they both have sufficient health and hunger. If this condition is not met they will not do anything. 

Each time units reproduce their offspring has the average of their stats, with each stat having a chance to randomly mutate.

Units spawn with too much hunger to reproduce (this prevents them the population from growing to infinity)

