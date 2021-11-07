/* eslint-disable max-len */
import React from 'react';
import {Container} from 'react-bootstrap';

const LandingPage = () => {
  return (
    <Container
      className="d-flex flex-column align-items-center justify-content-center text-center"
      style={{
        height: 'var(--bs-content-height)',
        minHeight: 'var(--bs-content-height)',
        maxHeight: 'var(--bs-content-height)',
        padding: '0',
        margin: '0 auto',
        overflow: 'hidden',
        scale: '1',
        transform: 'scale(1)',
        transformOrigin: 'center',
        transition: 'transform 0.5s ease-in-out',
      }}
    >
      <h2 className="text-center" style={{fontSize: '1.7em'}}>
        What is <span style={{color: 'var(--primary-color)'}}>Timber</span>
      </h2>
      <p
        className="text-center"
        style={{
          fontSize: '1.2em',
          lineHeight: '1.5em',
          marginBottom: '2em',
          marginTop: '1em',
        }}
      >
        Timber is a social networking platform which aims to connect students
        and professionals with each other. Users on the platform can then see
        active projects that others are doing and join in. They can also see
        your portfolio and see your skills and projects that you’ve worked on.
        Users can also leave feedback and comments on the projects that they’re
        working on; giving valuable knowledge to other users.
      </p>
      <h2 className="text-center" style={{fontSize: '1.7em'}}>
        Why use <span style={{color: 'var(--primary-color)'}}>Timber</span>
      </h2>
      <p
        className="text-center"
        style={{
          fontSize: '1.2em',
          lineHeight: '1.5em',
          marginBottom: '2em',
          marginTop: '1em',
        }}
      >
        This is a massively growing market, with many competitors in this space
        already. This market is also threatened by the increasing use of
        freelancing sites. These sites offer similar services to timber but lack
        the social aspect that timber will have. Freelancing sites are also
        aimed at professionals, so timber is able to provide a niche service.
        This also means that the target audience is not as large, but that it is
        easier to service (they are more readily available). We will be able to
        create a much easier and more social platform for these professionals
        and for students to reach out and connect with each other.
      </p>
      <h2 className="text-center" style={{fontSize: '1.7em'}}>
        What&apos;s so different about{' '}
        <span style={{color: 'var(--primary-color)'}}>Timber</span>
      </h2>
      <p
        className="text-center"
        style={{
          fontSize: '1.2em',
          lineHeight: '1.5em',
          marginBottom: '2em',
          marginTop: '1em',
        }}
      >
        Timber is a very different platform to other freelancing sites. It’s
        main difference is the social part of it. Unlike other freelancing
        sites, timber is a platform that connects students and professionals
        together to collaborate on projects. This makes it a much easier process
        for both parties; students can reach out to professionals and vice
        versa. There are many other freelancing sites but they are aimed at
        professionals only; making it hard for professionals to find students
        with the knowledge they need (and vice versa). Another difference
        between timber is the ease of access. Timber removes the barrier of CVs,
        cover letters, application forms etc. We aim to make this platform very
        easy for anyone to jump into; allowing you to filter projects based on
        your own criteria (like your skill set or your team). As mentioned
        above, there are many competitors in this space but almost none like
        timber; making us able to provide a unique service that others cannot
        offer.
      </p>
    </Container>
  );
};

export default LandingPage;
