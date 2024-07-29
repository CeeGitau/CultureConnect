import React from "react";
import "../assests/css/about.css";
import Navbar from "../components/Navbar";

function About() {
  return (
    <>
      <Navbar />
      <div className="about-container">
        <p>
          This web application was made possible by the efforts of Celestine
          Gitau, Charity Nyamamba, and Isaac Njenga. We hope it satisfies your
          visit.
        </p>
        <br />
        <p>
          Discover the heart and soul of diverse cultures from around the world
          right here on CultureConnect. Our platform is a vibrant space where
          people from all walks of life come together to share their unique
          cultural stories, traditions, and practices. Whether it's the rich
          culinary traditions of your community, the intricate designs of
          traditional attire, or the timeless customs and arts passed down
          through generations, CultureConnect is your stage to celebrate and
          preserve what makes your heritage special. At CultureConnect, we
          believe in the power of storytelling to bridge gaps and foster
          understanding. 
          <br/><br/>Our mission is to create an inclusive and engaging
          environment where you can document and discuss your cultural
          experiences. By connecting with others, you can explore a world of
          traditions and practices that shape our global tapestry. Join us in
          our quest to safeguard the rich cultural and natural heritage of our
          communities. Share your stories, engage in lively discussions, and
          participate in events that highlight the beauty of our diverse world.
          Together, let's celebrate the legacy of our ancestors and ensure that
          these priceless cultural treasures are passed on to future
          generations. Welcome to CultureConnect – where every story matters and
          every tradition is cherished. Start your journey today and be a part
          of a global movement to preserve and celebrate our world's cultural
          heritage, one story at a time.
        </p>
      </div>
    </>
  );
}

export default About;
