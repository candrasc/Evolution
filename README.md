# Evolution
Evolution Simulator

## Base of Game
Units have a set of core stats that sum to 100 in total. Currently we have Health, Attak, Defense, Food Effeciency, Life Span.

##Interaction

Units can either fight, reproduce, or do nothing upon contact.

The decision to fight or breed is based on the Cosine Similarity of the corestats of the two units. The more similar the more likely to reproduce, and the more different, the more likely they fight.


### Fighting:
- Damage is caclulated by the max of one units offense less the other units defense or 0; whichever is greater

- If unitA can kill unitB, but unitB cannot kill unitA, then unit A will kill unit B and the health it took from unitB to its own health - And vice versa

- If neither unit can kill each other or they can both kill each other, they both do damage to each other.

### Reproducing

If the units choose to reproduce, they can only do so if they both have sufficient health and hunger. If this condition is not met they will not do anything


## Possible additions

#### Regions
Segment the screen into different regions. Each region has different properties. Forest spawns more food, dessert is open with less food and water, mountains are veyr hard to move in without movement attributes

Units bounce within the region they spawned in, with a small chance to escape into a different region.
