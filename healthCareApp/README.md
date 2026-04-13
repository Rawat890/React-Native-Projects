Project: Healthcare React Native App
Key features added -
1. InputWithLabel Component
Floating legend-style label that sits on the top border (like HTML <fieldset>)
Label is absolutely positioned with top: -scale(11) to straddle the border line
Background color behind label text "cuts through" the border visually
Optional icon prop renders to the left of the input
Show/Hide toggle for password fields

2. WaveLoader Component
Circular wave animation loader using React Native Reanimated
progress % 1 modulo maps ever-growing progress value to translateX: 0 → -tileWidth
numBumps = 6 (must be even) so alternating tall/short bump pattern tiles cleanly
Water fill level breathes up and down using withSequence + withRepeat(-1)
FadeIn / FadeOut on mount/unmount
Props: size, color, secondaryColor, ringColor, backgroundColor, speed


3. HomeScreen
Header: hamburger icon + logo image + circular mic button with border
Upload prescription banner: horizontal layout — text left, ORDER NOW button right
Promo card (green): "Get the Best Medical Service" with doctor image, FadeInRight animation
Offer card (lavender): "UPTO 80% off" with vertical UPTO box, medicine image, SHOP NOW button
Both cards have zIndex: 1 to render above the decorative strip


4. NearbyPharmacyTab
Header: back arrow (goBack) + location pin icon + city name
Pharmacy grid: 2-column layout, image fills card top, name/distance/star rating below
Upload section: centered title + subtitle, single bordered box with two side-by-side options
Upload File: opens document picker immediately on press (types.images, types.pdf)
Upload Link: shows TextInput with autoFocus when selected
uploadMode starts as null — Continue button disabled until an option is selected
Active option highlights with COLORS.primaryLight background + primary tint on icon
Continue button fixed at bottom (position: absolute)
goBack fixed (was { goBack } object reference instead of function call)


5. cloudinaryService.ts
uploadFile: uses /auto/upload endpoint (not /upload) — supports images
No manual Content-Type header on FormData — lets React Native auto-generate the multipart/form-data; boundary=... header
uploadByUrl: sends Content-Type: application/json with URL as file field — FormData does not work for URL uploads on Cloudinary
upload_preset field added — required for unsigned uploads (root cause of empty Firestore fields)
Uses UPLOAD_PRESET = 'healthcare' (unsigned preset in Cloudinary dashboard)
Endpoint: /auto/upload for both functions


6. prescriptionService.ts
Saves prescription metadata to Firestore prescriptions collection
Fields: id, uid, url, format, fileName, type (file | link), uploadedAt, email
subscribe(uid, cb) — real-time Firestore listener ordered by uploadedAt desc
Fetches records filtered by uid from authService.currentUser()?.uid

7. ReminderTab

8. Firebase Auth handles persistence automatically. Once a user logs in, Firebase stores the auth token in the device's local storage. On every app restart, Firebase restores the session without requiring login again.

Key Dependencies Used -
<react-hook-form>
<Yup>
<react-native-reanimated>
<react-native-size-matters>
<@react-native-documents/picker>
<firebase/firestore>
<Cloudinary Setup Required>
<react-native-size-matters> - for responsive design
