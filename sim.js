


function trial(sc, apy, numStrat, coHack) {
  let startingCapital = sc
  const dailyRate = getDailyRate(apy)
  const numberOfStrategies = numStrat
  const dailyChanceOfHack = coHack/365
  const strategies = []

  for(let i = 0; i < numberOfStrategies; i++) {
    strategies.push(startingCapital/numberOfStrategies)
  }
  
  for(let i = 0; i < 1095; i++) { // three years
    for(let j = 0; j < numberOfStrategies; j++) {

      if (Math.random() < dailyChanceOfHack) {

        // one strategy goes to zero
        strategies[j] = 0

        // optional rebalance all strategies 
        let stratBalance = 0
        for(let k = 0; k < numberOfStrategies; k++) {
          stratBalance = stratBalance + strategies[k]
        }
        for(let k = 0; k < numberOfStrategies; k++) {
          strategies[k] = stratBalance/numberOfStrategies
        }

        // console.log(`stratBalance: ${stratBalance}`)
        // console.log(`numberOfStrategies: ${numberOfStrategies}`)
      }

      strategies[j] = strategies[j] + strategies[j] * dailyRate
    }
  }

  let total = 0
  for(let j = 0; j < numberOfStrategies; j++) {
    total += strategies[j]
  }

  return total;
}

function simulate(trials, sc, apy, numStrat, coHack) {
  let total = 0
  let max = 0
  let lowCount = 0
  for (var i = 0; i < trials; i++) {
    let trialBalance = trial(sc, apy, numStrat, coHack)
    if (trialBalance > max) {
      max = trialBalance
    }
    if (trialBalance < 10000) {
      lowCount++
    }
    total = total + trialBalance
    
    // console.log(`Ending blalance: ${trialBalance}`)
  }

  const maxDollars = new Intl.NumberFormat(`en-US`, {
        currency: `USD`,
        style: 'currency',
    }).format(max);
  console.log(`Max blalance: ${maxDollars}`)

  const avg = new Intl.NumberFormat(`en-US`, {
        currency: `USD`,
        style: 'currency',
    }).format(total/trials);
  console.log(`Average blalance: ${avg}`)

  console.log(`% below $10,000: ${(lowCount/trials*100).toPrecision(2)}%`)
  
  console.log(`APR: ${Math.round(getDailyRate(apy)*365*100)}%`)
  console.log(`APY: ${apy*100}%`)
  
}

function getDailyRate(apy) {
  return (Math.pow(apy + 1, 1/365) - 1)
}

// trials, starting balance, interest rate, number of strategies, yearly chance of failure
simulate(10000, 1000, 0.99, 5, 0.05)