import Link from "next/link";
import Image from "next/image";
import { getAppConfig } from "@/lib/config-server";
import { PackageCard } from "@/components/public/package-card";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles, faCamera, faHeart, faStar } from "@fortawesome/free-solid-svg-icons";
import { getLocalized } from "@/lib/i18n-utils";
import { Gallery } from "@/components/public/gallery";
import { ShareButton } from "@/components/public/share-button";

import { Metadata } from "next";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const config = await getAppConfig();

  // Use SEO config or fallbacks
  const title = getLocalized(config.seo?.metaTitle, lang) || getLocalized(config.header?.title, lang) || "Garfagnanafoto Wedding";
  const desc = getLocalized(config.seo?.metaDescription, lang) || getLocalized(config.packages[0]?.description, lang) || "Servizi di alta qualità per il tuo giorno speciale.";

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      images: config.seo?.featuredImage ? [config.seo.featuredImage] : undefined
    }
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const config = await getAppConfig();
  const { packages, vatRate, images } = config;

  const heroImage = images?.hero || "/images/garfagnana-foto-wedding-11.jpg";
  const gallery = images?.gallery || [];

  // Branding Logic: Check for Dots
  const titleString = getLocalized(config.header?.title, lang) || "Garfagnanafoto.it";
  const titleParts = titleString.split(".");

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation Space */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <Image
                src={config.header?.logo?.src || "/images/logo.png"}
                alt={getLocalized(config.header?.logo?.alt, lang) || "Logo"}
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#4c4c4c]">
              {titleParts.map((part, i) => (
                <span key={i}>
                  {part}
                  {i < titleParts.length - 1 && <span className="text-[#719436]">.</span>}
                </span>
              ))}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#gallery" className="hover:text-primary transition-colors">Galleria</Link>
            <Link href="#packages" className="hover:text-primary transition-colors">Pacchetti</Link>
            <Link href="/custom" className="px-4 py-2 bg-[#719436] text-white rounded-full hover:bg-[#719436]/90 transition-colors">Preventivo Custom</Link>
          </div>
        </div>
      </nav>


      {/* Airbnb-style Gallery Section */}
      <section id="gallery" className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">{getLocalized(config.copy?.heroTitle, lang) || "Reportage di Matrimonio in Toscana"}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
              <span className="flex items-center gap-1 font-medium"><FontAwesomeIcon icon={faStar} className="text-xs" /> {config.copy?.reviews?.ratingValue ?? 5.0}</span>

              {config.copy?.reviews?.reviewsUrl && config.copy.reviews.reviewsUrl !== "#" ? (
                <a href={config.copy?.reviews?.reviewsUrl} target="_blank" rel="noopener noreferrer" className="underline font-medium cursor-pointer hover:text-black">
                  {getLocalized(config.copy?.reviews?.ratingLabel, lang) ?? "124 recensioni"}
                </a>
              ) : (
                <span className="font-medium">
                  {getLocalized(config.copy?.reviews?.ratingLabel, lang) ?? "124 recensioni"}
                </span>
              )}

              <span className="font-medium text-gray-400">•</span>

              <span className="font-medium">{getLocalized(config.copy?.reviews?.location, lang) ?? "Castiglione di Garfagnana, Italia"}</span>
            </div>
          </div>
          <div className="flex gap-4">
            <ShareButton />
          </div>
        </div>

        <Gallery
          heroImage={heroImage}
          images={gallery}
          showAllLabel={lang === 'en' ? "Show all photos" : "Mostra tutte le foto"}
          lang={lang}
        />
      </section>

      {/* Booking / Packages Section */}
      <section id="packages" className="max-w-5xl mx-auto px-4 mt-16 pb-20">
        <div className="border-b pb-8 mb-12">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-semibold">Fotografia e Video di Matrimonio professionale</h2>
              <p className="text-gray-500 mt-1">Stile Reportage • 2 Professionisti • Attrezzatura Top</p>
            </div>
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
              <FontAwesomeIcon icon={faHeart} className="text-xl" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              pkg={pkg}
              vatRate={vatRate}
              href={`/quote?packageId=${pkg.id}`}
              isPopular={pkg.id === "pkg_photo_video"}
              lang={lang}
            />
          ))}
          <div className="bg-gray-50 rounded-2xl p-6 border border-dashed border-gray-300 flex flex-col h-full">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-black mb-4">
                <FontAwesomeIcon icon={faWandMagicSparkles} />
              </div>
              <h3 className="text-lg font-semibold">Su Misura</h3>
              <p className="text-sm text-gray-600 mt-2">Crea il tuo pacchetto personalizzato. Scegli solo i servizi che ti interessano.</p>
            </div>
            <div className="mt-auto pt-6">
              <Button asChild className="rounded-2xl px-8 w-full h-12">
                <Link href="/custom">Personalizza</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-50 border-t py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            {getLocalized(config.advancedSettings?.footerText, lang) || `© ${new Date().getFullYear()} Garfagnanafoto`}
          </div>
          <div className="flex items-center gap-6 font-semibold text-black">
            {/* Footer links removed for v2 branding */}
          </div>
        </div>
      </footer>
    </main>

  );
}

