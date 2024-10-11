import React from 'react';

import Nav from './Nav';

function About() {
  return (
    <div className="container mt-5">
      <Nav />
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h3 className="text-center">
            We are educators and history buffs obsessed in learning and using technology fot the better.
            Creating AI Immersive Experience Modules with interactive scenarios based on historical figures involves designing engaging,
            interactive content where users can explore different scenarios, make decisions, and learn from the experiences of these figures
          </h3>
        </div>
      </div>
    </div>
  );
}

export default About;
