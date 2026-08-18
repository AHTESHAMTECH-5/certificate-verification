# Ahtesham Tech Certificate Verification Portal

A public, static certificate-verification website for GitHub Pages.

## What the public can do

- Enter a Certificate ID and verify it.
- Scan a QR code that is already printed on a certificate.
- View the certificate's public verification details.
- Open your Ahtesham Tech social profiles.

## What YOU control

There is **no public QR generator** and no public certificate-creation form.

You manually create certificate IDs and manually add the corresponding certificate records to `certificates.js`.

Example:

```js
"AT-AAMP-2026-002": {
  id: "AT-AAMP-2026-002",
  name: "Student Name",
  programme: "AI & Digital Learning Programme",
  programmeContext: "Anna Akka Mentorship Programme",
  status: "Valid",
  issuedOn: "16 August 2026",
  issuedBy: "Syed Ahtesham Ullah Quadri",
  issuerRole: "Founder & Technology Creator, Ahtesham Tech",
  mentorRole: "Student Mentor – Anna Akka Mentorship Programme",
  description: "In recognition of your active participation...",
  note: "This certificate is personally presented by Ahtesham Tech...",
  certificateUrl: ""
}
```

## Certificate ID workflow

You decide the numbering yourself. For example:

- `AT-AAMP-2026-001`
- `AT-AAMP-2026-002`
- `AT-AAMP-2026-003`

Put the same ID on the student's physical/digital certificate.

If you put a QR code on the certificate, it should point to:

`https://YOUR-USERNAME.github.io/certificate-verification/?id=AT-AAMP-2026-001`

The public website only uses that QR code for verification; it does not allow visitors to create certificates or add records.

## Important security point

Because GitHub Pages is a static public website, **do not put an admin password, private API key, or secret credentials in this repository**. Anyone who can view the public repository can potentially read `certificates.js`.

For your current use case, the safest simple workflow is:
1. You create the certificate manually.
2. You choose the certificate ID.
3. You add that certificate's record to `certificates.js`.
4. You commit/push the change to GitHub.
5. The public can only verify existing records.

If you want a genuinely private admin panel where only you can create/edit/revoke certificates without exposing the database, use a backend/database with authentication rather than GitHub Pages alone.

## GitHub Pages setup

1. Create a repository such as `certificate-verification`.
2. Upload:
   - `index.html`
   - `style.css`
   - `app.js`
   - `certificates.js`
   - `.nojekyll`
3. Open **Settings → Pages**.
4. Choose **Deploy from a branch**.
5. Select your `main` branch and `/root`.
6. Save.

## Social profiles

YouTube:
https://www.youtube.com/@Ahtesham_Tech

Instagram:
https://www.instagram.com/ahtesham.tech/
