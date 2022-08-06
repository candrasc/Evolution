import { setCustomProperty } from "./updateCustomProperty.js"

let worldElem = document.querySelector("[data-world-container]")

export function spawnKillAnimation(left, bottom) {
  const fight = document.createElement("img")
  fight.dataset.fight = true
  fight.classList.add("fight")
  fight.src = `game/imgs/death.png`
  setCustomProperty(fight, "--left", left + "%")
  setCustomProperty(fight, "--bottom", 100 - bottom + "%")
  worldElem.append(fight)
}

export function spawnLoveAnimation(left, bottom) {
  const love = document.createElement("img")
  love.dataset.love = true
  love.classList.add("love")
  love.src = `game/imgs/heart.png`
  setCustomProperty(love, "--left", left + "%")
  setCustomProperty(love, "--bottom", 100 - bottom + "%")

  worldElem.append(love)
}

export function cleanUpFightAnimations() {
  let fights = document.querySelectorAll("[data-fight]")
  fights.forEach((fight) => {
    fight.remove()
  })
}

export function cleanUpLoveAnimations() {
  let loves = document.querySelectorAll("[data-love]")
  loves.forEach((love) => {
    love.remove()
  })
}
