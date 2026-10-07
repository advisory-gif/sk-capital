const team = [
  { name: "Snesh Kakkar", initials: "SK" },
  { name: "Megha Dalmia", initials: "MD" },
];
export default function Team() {
  return (
    <section id="team" className="team-section section">
      <div className="wrap">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The people behind the work</p>
            <h2>
              Founder-led.
              <br />
              <em>Close to the business.</em>
            </h2>
          </div>
          <p>
            SK Capital is led by Snesh and Megha. The approach is practical:
            understand the question, review the evidence and help the business
            decide what to do next.
          </p>
        </div>
        <div className="audience-grid">
          {team.map((person) => (
            <article className="founder" key={person.name}>
              <div className="founder-top">
                <span className="monogram" aria-hidden="true">
                  {person.initials}
                </span>
                <div>
                  <h3>{person.name}</h3>
                  <p>Co-founder, SK Capital</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="founder-working-note">
          A defined engagement, clear responsibilities and recommendations your
          team can act on.
        </p>
      </div>
    </section>
  );
}
