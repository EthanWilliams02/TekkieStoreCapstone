# Product Image Optimization (Cloudinary React SDK)

## What we used
We installed Cloudinary's official React SDK (`@cloudinary/url-gen` + `@cloudinary/react`) and use it inside a shared `ProductImage.tsx` component (`frontend/src/components/shared/ProductImage.tsx`) to render every product photo across the app - Catalogue, Home/Trending, and Product Details all use this one component.

## Why we used it
Our shoe photos are uploaded to Cloudinary at full resolution (several megabytes each). Rendering them as-is with a plain `<img src="...">` meant downloading the entire original file just to display a small product card - very slow to load, especially on the Catalogue page where dozens of images load at once.

Cloudinary's SDK builds an optimized delivery URL instead of a raw one:
- `.format('auto')` - serves WebP/AVIF to browsers that support it, falling back to JPEG otherwise.
- `.quality('auto')` - lets Cloudinary pick the best quality/size tradeoff automatically.
- `.resize(limitFit(800, 800))` - caps the delivered image to fit within an 800x800 box without cropping or upscaling, so we never download more pixels than we'll display.

In testing, this took our images from several megabytes down to ~40-60KB each with no visible quality loss.

## How it works
`ProductImage.tsx` takes the full Cloudinary URL exactly as stored in the database (`shoe.imageUrls`), extracts the cloud name and public ID out of it with a regex, then builds the `AdvancedImage` component from those two pieces. This means the database still just stores plain URLs (no extra fields needed), and the component works even if the Cloudinary account/cloud name ever changes again.

If an image fails to load (bad URL, deleted asset), we catch it with `onError` and show a plain "Image unavailable" placeholder instead of a broken image icon or a substitute photo.

## References
- [Cloudinary React SDK - Quickstart](https://cloudinary.com/documentation/react_integration) - the official guide we started from (this is the exact `AdvancedImage` + `Cloudinary` pattern shown in Cloudinary's own dashboard quickstart for our account).
- [Cloudinary Image Transformations Reference](https://cloudinary.com/documentation/image_transformations) - documents `f_auto`/`q_auto` (format and quality), which `.format('auto')`/`.quality('auto')` generate under the hood.
- [Cloudinary Resize & Crop actions - `limitFit`](https://cloudinary.com/documentation/resizing_and_cropping) - explains the different resize modes; `limitFit` scales down to fit a bounding box only if the original is larger, and never crops or distorts the image.
