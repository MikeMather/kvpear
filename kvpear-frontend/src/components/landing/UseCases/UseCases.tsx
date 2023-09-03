import styles from './UseCases.module.scss';

export default function UseCases() {

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2>Discover how KV Pear can benefit you</h2>
        <p>KV Pear simplifies data access and management for a variety of use-cases.</p>
      </div>
      <div className="columns">
        <div className="column col-6">
          <div className="">
            <h4>Rapid prototyping, zero setup</h4>
            <p>Easily bring your ideas to life with lightning-fast prototyping. Say goodbye to the 
              complexity of setting up backends and databases. Our service offers a hassle-free, 
              cost-effective solution, perfect for rapid development without the financial burden.</p>
          </div>
        </div>
        <div className="column col-6">
          <div className="">
            <h4>Remote configuration</h4>
            <p>Empower your team to manage configuration objects seamlessly through our 
              intuitive user interface. No coding changes needed; simply modify configurations 
              on-the-fly. Keep your application adaptable and responsive without the development overhead.
              Take advantage of our JSON validation tools to ensure validity of parameters.</p>
          </div>
        </div>
        <div className="column col-6">
          <div className="">
            <h4>Single table data management</h4>
            <p>Efficiently centralize and manage your data with a single-table design. 
              Simplify your data architecture while maintaining scalability. Our service provides 
              a flexible, easy-to-use data-store solution, streamlining your data operations.</p>
          </div>
        </div>
        <div className="column col-6">
          <div className="">
            <h4>Feature flags made easy</h4>
            <p>Implement feature flags effortlessly with our service. Control feature toggles dynamically 
              and fine-tune your application's behavior without extensive code modifications. 
              Ensure smooth feature rollouts and A/B testing with confidence.</p>
          </div>
        </div>
      </div>
    </div>
  )
}