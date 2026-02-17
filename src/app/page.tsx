import Link from "next/link";
import Image from "next/image";
import { getAppConfig } from "@/lib/config-server";
import { PackageCard } from "@/components/public/package-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWandMagicSparkles, faCamera, faVideo, faHeart, faStar } from "@fortawesome/free-solid-svg-icons";

export const revalidate = 0;

export default async function Home() {
  const config = await getAppConfig();
  const { packages, vatRate, images } = config;

  const heroImage = images?.hero || "/images/garfagnana-foto-wedding-11.jpg";
  const gallery = images?.gallery || [];

  return (
    <main className="min-h-screen bg-white">
      {/* Navigation Space */}
      <nav className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white">
              <FontAwesomeIcon icon={faCamera} />
            </div>
            <span className="text-xl font-bold tracking-tight">Garfagnanafoto</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="#gallery" className="hover:text-black text-gray-500 transition-colors">Galleria</Link>
            <Link href="#packages" className="hover:text-black text-gray-500 transition-colors">Pacchetti</Link>
            <Link href="/custom" className="px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">Preventivo Custom</Link>
          </div>
        </div>
      </nav>

      {/* Airbnb-style Gallery Section */}
      <section id="gallery" className="max-w-7xl mx-auto px-4 mt-8">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">Reportage di Matrimonio in Toscana</h1>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1 font-medium"><FontAwesomeIcon icon={faStar} className="text-xs" /> 5.0</span>
              <span className="underline font-medium cursor-pointer">124 recensioni</span>
              <span className="underline font-medium cursor-pointer">Castiglione di Garfagnana, Italia</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="underline font-semibold h-auto p-0 hover:bg-transparent">Condividi</Button>
            <Button variant="ghost" className="underline font-semibold h-auto p-0 hover:bg-transparent">Salva</Button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[450px] md:h-[550px] rounded-2xl overflow-hidden relative">
          <div className="col-span-2 row-span-2 relative">
            <Image
              src={heroImage}
              alt="Sposi in un momento intimo e naturale durante un matrimonio in Toscana"
              fill
              className="object-cover hover:brightness-90 transition-all duration-300 cursor-pointer"
              priority
            />
          </div>
          {gallery.slice(0, 4).map((img, idx) => (
            <div key={idx} className="relative">
              <Image
                src={img}
                alt={`Dettaglio matrimonio ${idx + 1} - Fotografia di reportage professionale`}
                fill
                className="object-cover hover:brightness-90 transition-all duration-300 cursor-pointer"
              />
            </div>
          ))}
          <Button variant="outline" className="absolute bottom-6 right-6 bg-white border-black text-xs font-semibold px-4 py-2 hover:bg-gray-100 rounded-lg shadow-sm">
            Mostra tutte le foto
          </Button>
        </div>
      </section>

      {/* Booking / Packages Section */}
      <section id="packages" className="max-w-7xl mx-auto px-4 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12 pb-20">
        <div className="lg:col-span-2 space-y-12">
          <div className="border-b pb-8">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {packages.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                vatRate={vatRate}
                href={`/quote?packageId=${pkg.id}`}
                isPopular={pkg.id === "pkg_photo_video"}
              />
            ))}
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 border border-dashed border-gray-300">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-black shrink-0">
                <FontAwesomeIcon icon={faWandMagicSparkles} />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Non trovi quello che cerchi?</h3>
                <p className="text-gray-600 mt-2 mb-6">Crea il tuo pacchetto personalizzato scegliendo solo i servizi che ti interessano davvero. Riceverai un preventivo immediato e trasparente.</p>
                <Button asChild size="lg" className="rounded-xl px-10">
                  <Link href="/custom">Personalizza ora</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-28 border rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex justify-between items-end">
              <div className="text-2xl font-bold">€900 <span className="text-sm font-normal text-gray-500">DA</span></div>
              <div className="text-sm underline cursor-pointer">Pacchetto Gold</div>
            </div>

            <div className="border rounded-xl divide-y">
              <div className="p-3">
                <div className="text-[10px] font-bold uppercase">TIPOLOGIA</div>
                <div className="text-sm">Matrimonio Intero</div>
              </div>
              <div className="grid grid-cols-2 divide-x">
                <div className="p-3">
                  <div className="text-[10px] font-bold uppercase">FOTO</div>
                  <div className="text-sm">Incluso</div>
                </div>
                <div className="p-3">
                  <div className="text-[10px] font-bold uppercase">VIDEO</div>
                  <div className="text-sm">Opzionale</div>
                </div>
              </div>
            </div>

            <Button asChild className="w-full py-6 text-base font-semibold rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700">
              <Link href="/custom">Calcola Prezzo Esatto</Link>
            </Button>

            <p className="text-center text-xs text-gray-500">Non ti verrà addebitato alcun costo in questa fase</p>

            <div className="pt-4 space-y-3">
              <div className="flex justify-between text-sm text-gray-600 underline cursor-pointer">
                <span>Reportage giornata intera</span>
                <span>€900</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 underline cursor-pointer">
                <span>Editing e Selezione</span>
                <span>€200</span>
              </div>
              <div className="pt-3 border-t flex justify-between font-bold text-lg">
                <span>Totale Netto</span>
                <span>€1.100</span>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <footer className="bg-gray-50 border-t py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            © {new Date().getFullYear()} Garfagnanafoto • <span className="hover:underline cursor-pointer">Privacy</span> • <span className="hover:underline cursor-pointer">Termini</span> • <span className="hover:underline cursor-pointer">Sitemap</span>
          </div>
          <div className="flex items-center gap-6 font-semibold text-black">
            <span className="flex items-center gap-2 cursor-pointer"><FontAwesomeIcon icon={faCamera} className="w-4" /> Italiano (IT)</span>
            <span className="cursor-pointer">€ EUR</span>
            <Link href="/admin" className="hover:underline">Accesso Admin</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
