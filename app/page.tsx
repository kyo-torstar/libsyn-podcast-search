import Search from '../components/Search'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col pl-24 pr-24 pt-10">
      <h1 className="text-2xl pb-10">Libsyn Podcast Search for Blox Article Custom Properties</h1>
      <div className="w-full items-center justify-between">
        <Search />
      </div>
    </main>
  );
}
