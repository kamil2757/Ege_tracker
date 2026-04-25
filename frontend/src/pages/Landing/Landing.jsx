import Hero from "./sections/Hero/Hero";
import ForWhat from "./sections/ForWhat/ForWhat";
import Ideas from "./sections/Ideas/Ideas";
import ForWho from "./sections/ForWho/ForWho";
import CallToAction from "./sections/CallToAction/CallToAction";

export default function Landing() {
  return (
    <>
      {" "}
      <div className="container">
        <Hero></Hero>
      </div>
      <ForWhat></ForWhat>
      <Ideas></Ideas>
      <div className="container">
        <ForWho></ForWho>
      </div>
      <CallToAction></CallToAction>
    </>
  );
}
