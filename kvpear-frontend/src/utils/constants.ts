

export const PricingTiers = [
  {
    min: 0,
    max: 500,
    price: 0
  }, 
  {
    min: 501,
    max: 1000,
    price: 0.0082  
  },
  {
    min: 1001,
    max: 100000,
    price: 0.0031
  }, {
    min: 100001,
    max: Math.pow(10, 10),
    price: 0.001
  }
]