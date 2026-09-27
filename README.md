# Festus Okeke — operator retainer

Landing page for a one-person digital retainer aimed at small businesses abroad, billed in USD.

The offer is fixed and public:

- **$2,400 / month**
- **$1,500** operator work
- **$900** Meta and TikTok media spend, inside the same payment
- Graphic design (8 pieces) and website design/build are in the same scope
- One accountable person instead of three freelancers

Portfolio frames are placeholders on purpose. Client ads, brands, and numbers are not published without permission.

## Preview

```bash
python3 -m http.server 8080
```

Open `http://localhost:8080`.

## Change the offer

Search `index.html` for `$2,400`, `$1,500`, and `$900` and keep the three numbers in agreement. The same figures appear in the hero ticket, the month steps, the retainer, the FAQ, and the mobile bar.

Contact details live in the page copy and on the form:

- `data-email`
- `data-whatsapp`

The brief tries a direct send via [FormSubmit](https://formsubmit.co). The first time, FormSubmit emails `Okekefestus0@gmail.com` to activate the address. Until that confirmation is clicked, the form falls back to a copy the visitor can email or WhatsApp.

## Fonts

Fraunces, Outfit, and IBM Plex Mono are self-hosted in `fonts/` under the SIL Open Font License. License texts are beside the files.
