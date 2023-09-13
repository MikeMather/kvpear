import { ccn } from "@/styles/styleUtils";
import styles from './Pricing.module.scss';
import { useState } from "react";
import { PricingTiers } from "@/utils/constants";

export default function Pricing() {

  const [costValue, setCostValue] = useState('0.00');
  const [pricingCalculatorValue, setPricingCalculatorValue] = useState(0);

  const onSliderChange = (val: any) => {
    setPricingCalculatorValue(val);
    const perRequestPrice = PricingTiers.find(tier => (
      pricingCalculatorValue >= tier.min && pricingCalculatorValue <= tier.max
    ))
    if (!perRequestPrice) {
      setCostValue('0.00');
      return;
    }
    const cost = (pricingCalculatorValue * perRequestPrice?.price || 0).toFixed(2);
    setCostValue(cost);
  }

  return (
    <div className={ccn("container", styles.pricing)}>
      <h2>Only Pay for What You Use</h2>
      <p>Pay-as-you-grow pricing that scales as you do. No upfront costs, no hidden fees.</p>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th></th>
            <th className="text-center">Requests per month</th>
            <th className="text-center">Cost per request</th>
          </tr>
        </thead>
        <tbody className="text-center">
          <tr>
            <td><span className="label label-secondary label-rounded">Starter</span></td>
            <td>0 - 500</td>
            <td>Free</td>
          </tr>
          <tr>
            <td><span className="label label-secondary label-rounded">MVP</span></td>
            <td>501 - 1,000</td>
            <td>$0.0082</td>
          </tr>
          <tr>
            <td><span className="label label-primary label-rounded">Growth</span></td>
            <td>1,000 - 100,000</td>
            <td>$0.0031</td>
          </tr>
          <tr>
            <td><span className="label label-primary label-rounded">Enterprise</span></td>
            <td>100,001 - ∞</td>
            <td>$0.001</td>
          </tr>
        </tbody>  
      </table>
      <div className={styles.pricing_calculator}>
        <h3>Estimate Your Monthly Cost</h3>
        <div className={styles.pricing_calculator_form}>
          <input className="slider tooltip" type="range" min="0" max="100000" step="100"
            data-tooltip={Number(pricingCalculatorValue).toLocaleString()}
            value={pricingCalculatorValue}
            onChange={e => onSliderChange(Number(e.target.value))}
          />
        </div>
        <div className={ccn(styles.cost_summary, 'alert')}>
          <p>Your monthly cost for {pricingCalculatorValue} requests</p>
          <span>${costValue}</span>
        </div>
      </div>
    </div>
  )
}