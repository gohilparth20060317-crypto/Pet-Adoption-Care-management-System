export default function About() {
  return (
    <div className="mx-auto max-w-3xl animate-fade-in space-y-8">
      <div>
        <span className="stamp text-forest-600">Est. this year</span>
        <h1 className="mt-4 font-display text-3xl font-semibold text-ink">About PetHaven</h1>
        <p className="mt-3 text-ink/70">
          PetHaven is a pet management and adoption platform built to make finding, adopting, and
          caring for a new companion feel a little less like paperwork and a little more like
          meeting a friend. We connect shelters and individual pet owners with people ready to open
          their homes.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {[
          ["Transparent status", "Track every adoption request from submission through approval."],
          ["Secure checkout", "Adoption fees are processed through a secure payment gateway."],
          ["Real records", "Download a receipt for every completed adoption, ready to keep or share."],
        ].map(([title, body]) => (
          <div key={title} className="rounded-stamp border border-forest-100 bg-surface p-5 shadow-card">
            <h3 className="font-display text-lg font-semibold text-forest-600">{title}</h3>
            <p className="mt-1 text-sm text-ink/60">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
