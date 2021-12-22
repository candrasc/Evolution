# Evolution
Evolution Simulator

## Base of Game

Units can have a chance to fight and reproduce which depends on their similarity to the unit they encounter. Winning a fight by a large enough margin yeilds food (this is how predator units will develop). 

#### Each unit will have survival stats:
- Health (can expand later if wanted to hunger, thirst, hp)

#### Also will have attribute stats:
These stats will sum up to 100, so units don't just evolve to have max everything
- Speed
- Offense
- Defense

#### Finally, we have reproductive stats
All units will be able to reproduce (there are no sexes) although it could be fun to add a sexiness stat and see how it propogates.

Upon collision with another unit of the same type, there is a chance to reproduce. If successful, there will be a higher liklihood that you receive attribute stats similar to the parents.
- Age (how many time steps until the unit dies)
- Chance of reproducing
- Liklihood to produce x offspring (use a normal distribution)

## Possible additions

#### Regions
Segment the screen into different regions. Each region has different properties. Forest spawns more food, dessert is open with less food and water, mountains are veyr hard to move in without movement attributes

Units bounce within the region they spawned in, with a small chance to escape into a different region.
