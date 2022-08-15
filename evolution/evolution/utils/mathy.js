export function cosineSim(A, B) {
  let dotproduct = 0
  let mA = 0
  let mB = 0
  for (let i = 0; i < A.length; i++) {
    dotproduct += A[i] * B[i]
    mA += A[i] * A[i]
    mB += B[i] * B[i]
  }
  mA = Math.sqrt(mA)
  mB = Math.sqrt(mB)
  var similarity = dotproduct / (mA * mB) // here you needed extra brackets
  return similarity
}

export function dotProduct(A, B) {
  let dotProd = 0

  for (let i = 0; i < A.length; i++) {
    dotProd += A[i] * B[i]
  }
  return dotProd
}

export function normalize(arr) {
  let sumArr = 0

  arr.forEach((val) => {
    sumArr += val
  })
  // scale array so min value is 1
  for (let i = 0; i < arr.length; i++) {
    arr[i] = arr[i] / sumArr
  }

  return arr
}

export function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
