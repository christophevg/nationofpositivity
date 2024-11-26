# Nation of Positivity

> a positive webshop

## Backlog

### Products

- [ ] more collections
  - [ ] collection: ... (duo tone tiles with pictures)
  - [ ] collection: "Resin in the Woods" (custom coasters/cutting boards with resin in wood)
- [ ] retake packaging pictures of garlands including wire
- [ ] horizontal design greeting cards
- [ ] 3D design greeting cards
- [ ] more letter-art designs: ball

### Ops

- [ ] send out mailing?
- [ ] start mailing list?
- [ ] Chokotoff
- [ ] thank you letter for HaC

### Frontend

- [ ] collection section
- [ ] separate collections from tags

- [ ] clean up stores
  - [ ] look into 2 remaining store subscriptions (fonts, contact)
  - [ ] consistent structure, naming, api
  - [ ] load products into local store, access from there
    - [ ] set timeout to refresh?
- [ ] improve+add loading pages
- [ ] improve placeholder while loading (look into lazy prop)

- [ ] create visual lookup for designs (cfr fonts)
- [ ] consider: compile javascript into single minimised file?
- [ ] more shipping options?
  - [ ] delivery to ParcelShop (https://gls-group.com/BE/en/depot-parcelshop/)
- [ ] more payment options?
  - [ ] Visa, Mastercard (% payment cost)
  
### Admin

### Backend

## Done

### 20241126 ✅

- [x] removed phone contact information
- [x] watching contact property changes on ContactCard
- [x] added summary of contact information to order summary
- [x] admin: selected order must be highlighted
- [x] add status field as a column: dynamic based on *_at fields
- [x] admin: add link to customer facing order page
- [x] add confirmation of actions (delete)
- [x] add banners when using local db / fake payments
- [x] reset tracker url entry field when changing order
- [x] improved faq
- [x] log db access
- [x] validate entire order at server side (db/Order)
- [x] improved progress information on order page
- [x] summary contact card isn't updated in order summary
- [x] on mobile: progress stepper "looses" labels
,
### 20241125 ✅

- [x] create a more enriched frontpage (welcome text, highlights)
- [x] change pointer over left/right handles in fullscreen viewer
- [x] make tags on product page link to shop with search
- [x] products: sorting
- [x] bugfix: shop scrolls to top
- [x] simplified introduction on shop page

### 20241122

- [x] figure out GLS shipping 😇
- [x] print label (1/3 A4)
- [x] thank you letter for RatC

### 20241119 ✅

- [x] more full-screen-like welcome page
- [x] replaced image dialog viewer with magnific popup
- [x] remove X
- [x] products: filtering (tags)
- [x] shop navigation allows for hash-based tags filtering /shop#tag1,tag2

### 20241118 ✅

- [x] bugfix: improved display/height of product header images
- [x] improved shipping configuration

### 20241117 ✅

- [x] collection: Rock around the Clock (vinyl record clock custom design)
- [x] add "_available" flag to news
  - [x] by default only show available news

### 20241113 ✅

- [x] upgrade to baseweb 0.4.0

### 20241108 ✅

- [x] provide smaller images for card headers
- [x] redirect /products route to /shop
- [x] improve error pages (e.g. Whoops product 404)
- [x] unified API and simplified pages setup
- [x] improved frontpage a bit on desktop

### 20241106 ✅

- [x] sorted fonts in selection dialog
- [x] made news/updated managed with collection
- [x] changed image inspection icon + added to carousel
- [x] improved image inspection dialog: turned into carousel
- [x] store favorite font in local storage

### 20241105 ✅

- [x] NL versie "This is required!" <- FormGenerator Options
- [x] Bug fix Options Form (required fields)
- [x] Added HomemadeByCVG references
- [x] product cards same height

### 20241104 ✅

- [x] fix footer icons vs text in xs
- [x] faq: order-procedure (e.g. ontwerp per email ter bevestiging)
- [x] local database setup for development with sync
- [x] font selector
- [x] add faq about wood/burn
- [x] ball design variations (sneeuwvlok, ster, boom, rendier)
- [x] garland/puzzle
- [x] sort products on price

### 20241030 ✅
- [x] improve mail templates/content
- [x] add bancontact references (generalize methods)
- [x] social image (bw)
- [x] linkedin social links
  - [x] website
  - [x] SendGrid template
- [x] add credit for boy-arcade movie/still

## Won't Do

- [-] algemene opmerkingen bij order?
  => email als conversatie, order is zo eenvoudig mogelijke start
- [ ] extend order overview page
   - [ ] add "chat" function
     - [ ] with images e.g. for design example sharing + confirmation
  => email als conversatie, order is zo eenvoudig mogelijke start
- [ ] coupon support?
  => pricing is minimal
- [ ] download payment history on state update and store locally?
  => use mollie app if needed
- [ ] send more emails (100/day free) - on every state change?
  => reply manually == more personal

## MVP ✅

- [x] create CDN (repo + pages setup)
- [x] clean up repo
- [x] basic baseweb setup
- [x] apply styling
- [x] add informational structure
  - [x] welcome
  - [x] FAQ
  - [x] contact
- [x] setup MongoDB
- [x] create local CDN store
- [x] admin: products
- [x] shop: products page
- [x] shop: product page
- [x] shop: clean up product card
- [x] shop: basket page
- [x] shop: order page
- [x] admin: orders
- [x] integrate SendGrid
- [x] payment: overschrijving of online
- [x] shipping herwerken
- [x] shop: order page: stages opkuisen
- [x] admin: order stages vervolledigen
- [x] mail: generate KBC/ING banking QR codes for bank transfer
- [x] add products
- [x] deploy to production in test mode
- [x] integrate Mollie
- [x] different way to include QR code in mail (GMail doesn't show inline)
- [x] dynamic sizing of shipping format
- [x] reduce logging
- [x] Mollie Live
- [x] bcc order confirmation mails to contact@
- [x] launch 🚀
  - [x] homemade website
  - [x] personal website
  - [x] socials
    - [x] instagram
    - [x] facebook
    - [x] X
    - [x] LinkedIn