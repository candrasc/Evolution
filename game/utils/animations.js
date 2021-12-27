import { setCustomProperty } from "./updateCustomProperty.js"

let worldElem = document.querySelector("[data-world]")

export function spawnFight(left, bottom) {
  const fight = document.createElement("img")

  fight.dataset.fight = true
  fight.classList.add("fight")
  fight.src = `game/imgs/death.png`

  setCustomProperty(fight, "--left", left)
  setCustomProperty(fight, "--bottom", bottom)
  worldElem.append(fight)
}

export function spawnLove(left, bottom) {
  const love = document.createElement("img")

  love.dataset.fight = true
  love.classList.add("love")
  love.src = `game/imgs/heart.png`

  setCustomProperty(love, "--left", left)
  setCustomProperty(love, "--bottom", bottom)
  worldElem.append(love)
}

export function cleanUpFights() {
  let fights = document.querySelectorAll("[data-fight]")
  fights.forEach((fight) => {
    fight.remove()
  })
}

export function cleanUpLoves() {
  let loves = document.querySelectorAll("[data-love]")
  loves.forEach((love) => {
    love.remove()
  })
}
